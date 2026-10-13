# Mirror Cartographer — GitHub Music Player

A small Chrome/Chromium extension with a floating control dock on GitHub. Start a track once, then navigate between repositories, issues, pull requests, and files without the music player being tied to a single page.

## Install (Chrome / Chromium desktop)

1. Download this repository as a ZIP and extract it, or clone the repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this `github-music-player` folder.
5. Open GitHub and select the extension icon.
6. Paste a **direct audio-file URL** (for example, an MP3 URL you have permission to use), then click **Play**. Playback requires this user gesture.

The player uses an extension offscreen document for audio so closing the popup or navigating between GitHub pages does not stop playback. The small floating dock provides play/resume and pause controls. The extension stores the selected URL and volume locally in your browser.

## Limits

- This is a browser extension, not a feature GitHub can execute from a profile README. The README links here, while the extension supplies the persistent player.
- This version targets desktop Chrome/Chromium. It is not installed automatically and does not run inside the GitHub mobile app or iOS Safari.
- Use a direct, reachable audio file URL. A normal YouTube/Spotify webpage URL is not an audio-file URL; copyrighted streaming sources may also restrict playback.
- Audio playback must be started by the user. Browser autoplay restrictions are intentional.
- No analytics or backend are included.

## Files

- `manifest.json` — extension permissions and GitHub content script
- `background.js` — persistent player messaging and offscreen lifecycle
- `offscreen.html`, `offscreen.js` — audio engine
- `popup.html`, `popup.css`, `popup.js` — URL, play/pause/stop, volume
- `content.js`, `dock.css` — floating controls on GitHub pages
