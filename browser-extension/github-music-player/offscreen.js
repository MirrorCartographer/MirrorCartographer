const audio = document.getElementById("audio");
audio.loop = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target !== "offscreen") return;
  (async () => {
    try {
      switch (message.type) {
        case "PLAY":
          if (audio.src !== message.url) audio.src = message.url;
          if (Number.isFinite(message.volume)) audio.volume = Math.min(1, Math.max(0, message.volume));
          await audio.play();
          break;
        case "PAUSE": audio.pause(); break;
        case "RESUME": await audio.play(); break;
        case "STOP": audio.pause(); audio.currentTime = 0; break;
        case "SET_VOLUME": audio.volume = Math.min(1, Math.max(0, Number(message.volume) || 0)); break;
        case "GET_STATUS":
          sendResponse({ ok: true, playing: !audio.paused, currentTime: audio.currentTime, duration: Number.isFinite(audio.duration) ? audio.duration : null, url: audio.currentSrc || audio.src, volume: audio.volume });
          return;
      }
      sendResponse({ ok: true, playing: !audio.paused, currentTime: audio.currentTime, duration: Number.isFinite(audio.duration) ? audio.duration : null, url: audio.currentSrc || audio.src, volume: audio.volume });
    } catch (error) { sendResponse({ ok: false, error: error.message || "Playback failed. Check the audio URL and try again." }); }
  })();
  return true;
});