// --- CONFIGURATION ---
let numberOfPicks = 3;
let videoTypeFilter = 'all';
let isProcessing = false;
let sortTimer = null;

// --- PARSERS ---
function parseViews(v) {
  if (!v) return 0;
  const match = v.match(/([\d.]+)([KkMmBb]?)/);
  if (!match) return 0;
  let n = parseFloat(match[1]);
  const u = match[2].toLowerCase();
  return u === 'k' ? n * 1000 : u === 'm' ? n * 1000000 : u === 'b' ? n * 1000000000 : n;
}

function parseDate(d) {
  if (!d) return 365;
  const m = d.match(/(\d+)\s(year|month|week|day|hour|minute)/i);
  if (!m) return 365;
  const n = parseInt(m[1]);
  const u = m[2].toLowerCase();
  if (u.includes('hour') || u.includes('min')) return 0.1;
  return u.includes('day') ? n : u.includes('week') ? n * 7 : u.includes('month') ? n * 30 : n * 365;
}

// --- CHECKS ---
function getVideoType(card) {
  const thumb = card.querySelector('a#thumbnail')?.href || "";
  if (thumb.includes('/shorts/')) return 'shorts';
  const overlay = card.querySelector('ytd-thumbnail-overlay-time-status-renderer');
  if (overlay?.getAttribute('overlay-style') === 'SHORTS') return 'shorts';
  return 'long';
}

// Check if video is inside a "Shelf" (Suggestions/People also watched)
function isInsideShelf(card) {
  // Check for horizontal shelves or recommendation rows
  if (card.closest('ytd-shelf-renderer')) return true;
  if (card.closest('ytd-horizontal-card-list-renderer')) return true; 
  if (card.closest('ytd-reel-shelf-renderer')) return true; // Shorts shelf
  return false;
}

// --- MAIN LOGIC ---
function runSorter() {
  if (isProcessing) return;
  isProcessing = true;

  chrome.storage.local.get(['numPicks', 'videoType'], (res) => {
    numberOfPicks = parseInt(res.numPicks || 3);
    videoTypeFilter = res.videoType || 'all';

    // 1. Select ONLY video renderers
    const cards = Array.from(document.querySelectorAll('ytd-video-renderer'));
    let scored = [];

    cards.forEach(card => {
      // Cleanup previous runs
      card.classList.remove('smart-best-pick');
      const oldBadge = card.querySelector('.yt-smart-badge');
      if (oldBadge) oldBadge.remove();

      // FIX 1: Ignore Shelves/Suggestions
      if (isInsideShelf(card)) return;

      // FIX 2: Check Filters (Shorts/Long)
      const type = getVideoType(card);
      if (videoTypeFilter === 'long' && type === 'shorts') return;
      if (videoTypeFilter === 'shorts' && type === 'long') return;

      // Extract Data
      const meta = card.querySelector('#metadata-line')?.innerText.toLowerCase();
      const title = card.querySelector('#video-title')?.innerText;

      if (meta && title) {
        const parts = meta.split(/•|\n/);
        const v = parseViews(parts.find(p => p.includes('view')));
        const d = parseDate(parts.find(p => p.includes('ago')));
        
        // Calculate Smart Score
        const score = v / (d + 1);
        scored.push({ card, score, title });
      }
    });

    // Sort and Pick Top N
    const topPicks = scored.sort((a, b) => b.score - a.score).slice(0, numberOfPicks);

    // Apply UI
    topPicks.forEach((item, i) => {
      item.card.classList.add('smart-best-pick');
      
      const badge = document.createElement('div');
      badge.className = 'yt-smart-badge';
      badge.innerText = `Top Pick #${i + 1}`;
      
      // Append badge safely
      const thumb = item.card.querySelector('ytd-thumbnail');
      if (thumb) thumb.appendChild(badge);
    });

    // Update Sidebar
    updateSidebar(topPicks);
    isProcessing = false;
  });
}

// --- SIDEBAR ---
function updateSidebar(picks) {
  let side = document.getElementById('smart-sorter-sidebar') || document.createElement('div');
  if (!side.id) {
    side.id = 'smart-sorter-sidebar';
    document.body.appendChild(side);
  }
  
  // Only update header if it changed to avoid flicker
  if (!side.querySelector('.sidebar-header')) {
      side.innerHTML = `<div class="sidebar-header">🏆 Top Results</div><div id="sb-list"></div>`;
  }
  
  const list = side.querySelector('#sb-list');
  list.innerHTML = ''; // Rebuild list

  picks.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'sidebar-item';
    item.innerHTML = `<span class="s-rank">#${i+1}</span> <span class="s-title">${p.title}</span>`;
    item.onclick = (e) => {
        e.stopPropagation();
        p.card.scrollIntoView({behavior: "smooth", block: "center"});
    };
    list.appendChild(item);
  });
}

// --- STABILIZER (Important for "Jab pura page load ho") ---
// YouTube is infinite scroll, so page never "fully" loads.
// But we use a Longer Debounce (2 seconds) so it doesn't flicker while you scroll.

const handleScroll = () => {
  clearTimeout(sortTimer);
  // Wait 2 seconds after user stops scrolling before changing picks
  sortTimer = setTimeout(runSorter, 2000); 
};

// --- INITIALIZATION ---
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    document.getElementById('smart-sorter-sidebar')?.remove();
    // Wait for new page DOM to be ready
    setTimeout(runSorter, 3000); 
  }
}, 1000);

window.addEventListener('load', () => setTimeout(runSorter, 3000));
window.addEventListener('scroll', handleScroll, {passive: true});

// Listen for settings change
chrome.storage.onChanged.addListener(runSorter);