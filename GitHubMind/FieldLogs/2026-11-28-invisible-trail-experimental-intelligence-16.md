# IT-20261128-16 — Experimental intelligence: separation under bounded noise
Parent: [IT-20261127-15](2026-11-27-invisible-trail-error-archaeology-15.md). Continues the unpublished perturbation branch.
Hypothesis: choose a probe maximizing the minimum pairwise separation of candidate error mechanisms. Under bounded additive observation error epsilon, nearest prediction identifies the true candidate if separation > 2 epsilon, conditional on candidate completeness.
Experiment (JavaScript, four assertions executed and passed):
```js
const d=19/28-.19;
const f=[c=>(.31+c)/d,c=>(.31+2*c)/d,c=>(.34+c)/d,c=>(.31+c)/(d*.34/.37)];
const gap=c=>{const a=f.slice(1).map(g=>g(c)).sort((a,b)=>a-b);return Math.min(a[1]-a[0],a[2]-a[1])};
const rows=Array.from({length:61},(_,i)=>({c:i/1000,gap:gap(i/1000)}));
const best=rows.reduce((a,b)=>a.gap>=b.gap?a:b);
const tests=[gap(.03)<1e-12,best.c===0||best.c===.06,best.gap>0,rows.every(r=>r.gap<=best.gap+1e-12)];
if(!tests.every(Boolean))throw Error("test");
```
Result: {"best":{"c":0,"gap":0.005417956656346923},"ends":[0.005417956656346923,0.00541795665634659],"predictions":[0.6345029239766081,0.6345029239766081,0.695906432748538,0.6904884760921911],"tests":[true,true,true,true]}.
Counterexamples: missing candidate, systematic measurement bias, nonlinear mechanisms outside tested range. Grid optimality only; not a universal experimental design result. Probe cost not modeled; open branch: cost-constrained adaptive probes and abstention when none separates candidates. Cross-links: disobedient instrument, structural memory, architecture of absence, reciprocal adaptation, biological regulation and punchline perturbation (analogies only).
Mesh CI dated check 2026-11-28: main quality.yml retrieved; recent commits cee1043, f97819a, d14967f queried, no PR-triggered runs returned. Connector filters to PR runs; push/manual run status unknown, no success claim. Do not duplicate this partial check today unless broader run access becomes available. Seven repositories discovered; isolated research file, no personal data, paid services or website changes.
