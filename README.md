# YouTube Smart Sorter Pro ⚡

![Version](https://img.shields.io/badge/version-9.0.0-blue.svg) ![Manifest](https://img.shields.io/badge/Manifest-V3-success.svg) ![Status](https://img.shields.io/badge/Status-Stable-green.svg)

**YouTube Smart Sorter Pro** is a productivity-focused Chrome Extension designed to fix YouTube's search algorithm for learners and students. 

Instead of relying on YouTube's default ranking (which often promotes clickbait), this tool calculates the **"Engagement Velocity"** (Views per Day) of every video in real-time. It highlights high-quality, trending content and filters out irrelevant suggestions, helping you find the best tutorials without wasting time.

---

## 🚀 Key Features

### 1. The Smart Score Algorithm 🧠
- Calculates a custom score: `Views / (Days Old + 1)`.
- Identifies "Fresh & Trending" content over "Old but High Views" videos.
- **Top Picks:** Automatically highlights the top 3-10 videos with a distinct **RGB Gradient Glow**.

### 2. Zero-Jitter UI (Performance Optimized) ⚡
- Uses `linear-gradient` overlays instead of physical borders.
- **Result:** No layout shifts, no shaking pages, and smooth 60fps scrolling.
- **Strict Stabilizer:** Prevents flickering results during infinite scrolling.

### 3. Advanced Filtering System 🛡️
- **Strict Video Type Detection:** Multi-layer check (URL + Attributes) to accurately separate **Shorts** from **Long Videos**.
- **Shelf Cleaner:** Automatically ignores "People also watched," "For You," and unrelated suggestion shelves from search results.
- **Relevance Check:** Filters out videos that don't match your search keywords strictly.

### 4. Floating Sidebar Navigation 📑
- A non-intrusive sidebar appears on the right.
- Lists all "Top Picks" for quick access.
- **Click-to-Scroll:** Instantly jumps to the selected video.

---

## 🛠️ Installation Guide

This extension is built on **Manifest V3** and runs locally on your browser.

1.  **Download** or Clone this repository.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Toggle **Developer Mode** (top right corner).
4.  Click **Load Unpacked**.
5.  Select the folder containing these files.
6.  Go to YouTube, search for a topic (e.g., "Physics Class 11"), and see the magic!

---

## ⚙️ How to Use

1.  **Click the Extension Icon** in your toolbar.
2.  **Configure Settings:**
    * **Top Picks:** Choose top 3, 5, or 10 results.
    * **Filter:** Select "Long Videos Only" (Recommended for students) or "Shorts Only".
3.  Click **Save & Apply**. The page will refresh with your custom filters active.

---

## 💻 Tech Stack

* **Core:** Vanilla JavaScript (ES6+)
* **Architecture:** Chrome Extension Manifest V3
* **Styling:** CSS3 (GPU Accelerated Animations)
* **Storage:** Chrome Storage API (for saving user preferences)

---

## 👨‍💻 Developer Info

**Developed by Mohammad Hassan** *Passionate about modernizing education through technology.*

* **Location:** Rajasthan, India 🇮🇳
* **Connect:** [Instagram](https://www.instagram.com/moh_hassan_07?igsh=a2d3aDN6ZWQ2ZHRp)

---

*Disclaimer: This project is for educational purposes and is not affiliated with YouTube or Google.*
