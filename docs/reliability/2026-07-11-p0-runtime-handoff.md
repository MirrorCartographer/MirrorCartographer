# P0 runtime reliability handoff — 2026-07-11

## Evidence consulted

- `docs/CONSTELLATION_COORDINATION.md`
- `docs/constellation-state.json`
- `MirrorCartographer/mirror-cartographer-ui/src/components/App.jsx`
- `MirrorCartographer/mirror-cartographer-ui/src/engine/skyMusic.js`
- user-provided iPhone Safari screenshots captured 2026-07-11 around 15:03–15:06 local time
- repository test scripts in `mirror-cartographer-ui/package.json`

## Runtime failures reproduced by device evidence

1. **Vercel living encounter:** page renders on iPhone Safari and Safari displays an active media indicator, but the user reports no audible output.
2. **Cloudflare research field:** `mirror-cartographer.pages.dev` fails before HTTP rendering with “server can’t be found,” consistent with an unresolved or incorrect Pages hostname/project binding.
3. **GitHub Pages worker constellation:** `mirrorcartographer.github.io` returns GitHub’s standard “There isn’t a GitHub Pages site here” 404, so source/workflow presence is not deployment proof.

## Audio root cause found in source

The first-gesture voice is routed correctly through `master -> limiter -> destination`, and `start()` resumes a suspended `AudioContext`. The dominant source-level defect is audibility, not missing graph ownership:

- initial direct tap voice peak: `0.022`
- master target: `0.31`
- approximate pre-limiter first-tap peak: `0.00682` (about -43 dBFS)
- delayed tap layer peak: `0.006`

That output is plausibly visible to Safari as active media while remaining effectively inaudible on a phone speaker in ambient conditions.

## Change initiated

Added `.github/workflows/audio-audibility-hotfix.yml` in `MirrorCartographer/mirror-cartographer-ui` at commit `6fb0f519e90c9b51bd767478dad0ea9c516dcb63`.

The one-shot workflow:

- raises direct first-tap peaks to bounded values (`0.075` initial, `0.045` answer)
- raises the delayed tap layer to `0.018`
- raises master target to `0.52` with a faster ramp
- asserts an effective first-tap peak of `0.039`, inside a defined `0.03–0.08` safety band
- preserves the existing `App`-owned pointer gesture, `AudioContext.resume()`, limiter, and destination graph
- runs the full local gate before committing the source repair

## Current proof status

- Vercel render on iPhone Safari: **present from user device**
- audible output after repair: **pending workflow completion and device retest**
- audio graph ownership: **present in source**
- Cloudflare hostname resolution: **failed on user device**
- GitHub Pages publication: **failed on user device**
- browser-level gesture-variable divergence: **still missing**
- reduced-motion and repeated hidden/visible loop proof: **still missing at browser level**

## Exact boundary

Repository source can repair the audio amplitude and tests, but repository commits alone cannot prove Cloudflare project/DNS binding or enable GitHub Pages repository settings. Those require deployment-control evidence from the hosting integrations or platform settings. Source/workflow presence must not be reported as a live site.

## Next executable action

1. Confirm the audio workflow produced the `skyMusic.js` repair commit and that Vercel deployed it.
2. Retest first tap on iPhone Safari with media volume above zero; record audible/not-audible and tested commit.
3. Inspect Cloudflare project name/domain binding and GitHub Pages deployment environment/status through available deployment integrations.
4. Only after all three URLs resolve, run the two-sequence CSS-variable probe plus reduced-motion and hidden/visible loop ownership checks.
