const $ = (id) => document.getElementById(id);
const url = $("url"), volume = $("volume"), status = $("status");
function message(type, extra = {}) { return chrome.runtime.sendMessage({ type, ...extra }); }
function show(result) { status.textContent = result?.ok ? (result.playing ? "Playing across GitHub navigation." : "Paused / ready.") : (result?.error || "Could not reach the player."); }
async function init() {
  const settings = await message("GET_SETTINGS");
  if (settings?.trackUrl) url.value = settings.trackUrl;
  if (Number.isFinite(settings?.volume)) volume.value = settings.volume;
  $("volumeValue").textContent = Math.round(Number(volume.value) * 100) + "%";
  try { show(await message("GET_STATUS")); } catch { status.textContent = "Ready when you are."; }
}
$("play").addEventListener("click", async () => {
  const trackUrl = url.value.trim();
  if (!trackUrl) { status.textContent = "Paste a direct audio URL first."; return; }
  if (!/^https?:\/\//i.test(trackUrl)) { status.textContent = "Use a full http:// or https:// audio URL."; return; }
  status.textContent = "Starting…";
  show(await message("PLAY", { url: trackUrl, volume: Number(volume.value) }));
});
$("pause").addEventListener("click", async () => show(await message("PAUSE")));
$("stop").addEventListener("click", async () => show(await message("STOP")));
volume.addEventListener("input", () => { $("volumeValue").textContent = Math.round(Number(volume.value) * 100) + "%"; message("SET_VOLUME", { volume: Number(volume.value) }); });
init();