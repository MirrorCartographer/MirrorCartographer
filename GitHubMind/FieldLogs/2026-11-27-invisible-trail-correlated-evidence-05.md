# IT-20261127-05 — The echo chamber as a sensor
Parent: [IT-20261127-04](2026-11-27-invisible-trail-decision-value-04.md), branch B. Cross-links: structural memory, independent instrument, architecture of absence, biological regulation.
Hypothesis: provenance of evidence can reverse a decision even when all observed reports are identical.
Model: prior P(A)=.95; two symmetric sensors each accuracy .9. With probability r they copy one shared calibrated draw; otherwise they draw independently. This mixture is independent of the world. For two reports against A, likelihood under A is r*.1+(1-r)*.01; under B it is r*.9+(1-r)*.81. Posterior crosses .5 at r=31/81 (~.382716), solving 19*(.01+.09r)=.81+.09r. Thus identical reports support opposite decisions depending on shared-source probability. Marginal calibration alone cannot establish joint calibration.
Executed JS:
```js
const p=.95,q=.9;
const rows=[0,.1,.5,.9,1].map(r=>{const a=r*(1-q)+(1-r)*(1-q)**2,b=r*q+(1-r)*q*q;return {r,posterior:p*a/(p*a+(1-p)*b)}});
if(Math.abs(rows[0].posterior-.19)>1e-10||Math.abs(rows[4].posterior-19/28)>1e-10||!rows.every((x,i)=>!i||x.posterior>=rows[i-1].posterior))throw Error("assertion");
console.log(rows);
```
Three checks passed. Results: [{"r":0,"posterior":0.18999999999999978},{"r":0.1,"posterior":0.30593220338983024},{"r":0.5,"posterior":0.5499999999999997},{"r":0.9,"posterior":0.6599236641221371},{"r":1,"posterior":0.6785714285714283}].
Counterexamples: negative dependence, asymmetric error, world-dependent copying, adversarial sources, unknown prior. This is a toy probability model, not measured social or biological behavior. Provenance graphs may themselves be incomplete or misleading. Do not infer copying merely from agreement.
Open branches: A estimate dependence from labeled calibration trials; B provenance-aware evidence storage with source IDs and uncertainty intervals; C punchline as source-model revision rather than surprise alone; D common-mode failure in redundant sensors and regulatory pathways.
Repository discovery: seven accessible repositories; parent verified in existing GitHubMind. Isolated new field log avoids shared edits. Daily mesh CI: parent records November 27 check completed; no duplicate inspection or workflow edits. No paid services or personal data.
