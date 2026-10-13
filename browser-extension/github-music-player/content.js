(() => {
  if (window.__mcMusicDockInstalled) return;
  window.__mcMusicDockInstalled = true;
  const dock = document.createElement("aside");
  dock.id = "mc-github-music-dock";
  dock.setAttribute("aria-label", "Mirror Cartographer music player");
  dock.innerHTML = '<span class="mc-label">MC · GITHUB RADIO</span><span class="mc-state" id="mc-music-state">Ready</span><button type="button" id="mc-music-play" aria-label="Resume music">▶</button><button type="button" id="mc-music-pause" aria-label="Pause music">Ⅱ</button>';
  (document.body || document.documentElement).appendChild(dock);
  const state = dock.querySelector("#mc-music-state");
  const play = dock.querySelector("#mc-music-play");
  const pause = dock.querySelector("#mc-music-pause");
  const send = (type) => chrome.runtime.sendMessage({ type }).then(r => {
    if (!r?.ok) state.textContent = r?.error || "Open player";
    else state.textContent = r.playing ? "Playing" : "Paused";
  }).catch(() => state.textContent = "Open player");
  play.addEventListener("click", () => send("RESUME"));
  pause.addEventListener("click", () => send("PAUSE"));
  chrome.runtime.sendMessage({type:"GET_STATUS"}).then(r => {
    if (r?.ok) state.textContent = r.playing ? "Playing" : "Paused";
  }).catch(() => {});
})();