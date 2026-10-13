const OFFSCREEN_PATH = "offscreen.html";
let creatingOffscreen;

async function ensureOffscreen() {
  const contexts = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"], documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)] });
  if (contexts.length) return;
  if (creatingOffscreen) return creatingOffscreen;
  creatingOffscreen = chrome.offscreen.createDocument({
    url: OFFSCREEN_PATH,
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Keep the user's chosen music playing while they navigate between GitHub pages."
  });
  try { await creatingOffscreen; } finally { creatingOffscreen = undefined; }
}

async function sendToPlayer(message) {
  await ensureOffscreen();
  return chrome.runtime.sendMessage({ target: "offscreen", ...message });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target === "offscreen") return;
  (async () => {
    try {
      if (message.type === "PLAY") {
        const saved = await chrome.storage.local.get(["trackUrl", "volume"]);
        const url = message.url || saved.trackUrl;
        if (!url) throw new Error("Add a direct audio-file URL first.");
        if (message.url) await chrome.storage.local.set({ trackUrl: message.url });
        await sendToPlayer({ type: "PLAY", url, volume: message.volume ?? saved.volume ?? 0.7 });
        sendResponse({ ok: true, trackUrl: url });
      } else if (message.type === "PAUSE" || message.type === "RESUME" || message.type === "STOP" || message.type === "SET_VOLUME" || message.type === "GET_STATUS") {
        if (message.type === "SET_VOLUME") await chrome.storage.local.set({ volume: message.volume });
        await sendResponse(await sendToPlayer(message));
      } else if (message.type === "GET_SETTINGS") {
        sendResponse({ ok: true, ...(await chrome.storage.local.get(["trackUrl", "volume"])) });
      }
    } catch (error) { sendResponse({ ok: false, error: error.message || String(error) }); }
  })();
  return true;
});