# IT-20261128-17 — Observer footprint: canceling constant bias
Parent: [IT-20261128-16](2026-11-28-invisible-trail-experimental-intelligence-16.md).
Hypothesis: paired interventions distinguish candidate slopes despite an unknown constant additive observer bias. With bounded independent or adversarial per-reading errors epsilon, difference error is at most 2 epsilon; nearest candidate is guaranteed only if gap > 4 epsilon. Constant bias cancels exactly; drifting bias does not. This is a synthetic identification experiment, not evidence of biological equivalence.
```js
const d=19/28-.19;
const f=[c=>(.31+2*c)/d,c=>(.34+c)/d,c=>(.31+c)/(d*.34/.37)];
// Unknown constant measurement offset cancels in paired differences.
const delta=f.map(g=>g(.06)-g(0));
const gap=Math.min(...delta.flatMap((a,i)=>delta.slice(i+1).map(b=>Math.abs(a-b))));
const tests=[gap>0,Math.abs(gap-0.0108359133126935)<1e-12,...f.map((g,i)=>Math.abs((g(.06)+.2)-(g(0)+.2)-delta[i])<1e-12),f.every(g=>Math.abs(g(.03)-f[0](.03))<1e-12)];
if(!tests.every(Boolean))throw Error("assertion");
```
Executed results: {"delta":[0.24561403508771928,0.12280701754385959,0.1336429308565531],"gap":0.010835913312693513,"tests":[true,true,true,true,true,true]}. Single observations with arbitrary bias cannot identify any candidate. Paired observations recover discrimination, but worst-case per-reading noise tolerance equals the previous unbiased single-probe tolerance. Counterexample: bias depending linearly on input is confounded with slope; adaptive mechanisms may change between readings. Open branches: randomized order, repeated baseline, drift bounds, cost of paired probes. Cross-links: structural memory stores paired observations and order; disobedient instrument challenges sensor; architecture of absence records unidentifiable bias; reciprocal adaptation and biological regulation motivate drift; punchline analogy: contrast rather than absolute meaning.
Mesh CI: parent ledger records dated 2026-11-28 partial inspection; no duplicate check; push/manual status remains unknown. Seven repositories rediscovered. New isolated file only; no personal data or paid services.
