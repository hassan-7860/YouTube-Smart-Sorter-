document.addEventListener('DOMContentLoaded', () => {
  const numPicks = document.getElementById('numPicks');
  const videoType = document.getElementById('videoType');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('statusMsg');

  // Load
  chrome.storage.local.get(['numPicks', 'videoType'], (res) => {
    if (res.numPicks) numPicks.value = res.numPicks;
    if (res.videoType) videoType.value = res.videoType;
  });

  // Save
  saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({ 
      'numPicks': numPicks.value,
      'videoType': videoType.value
    }, () => {
      statusMsg.style.display = 'block';
      setTimeout(() => {
        statusMsg.style.display = 'none';
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.reload(tabs[0].id);
        });
      }, 1000);
    });
  });
});