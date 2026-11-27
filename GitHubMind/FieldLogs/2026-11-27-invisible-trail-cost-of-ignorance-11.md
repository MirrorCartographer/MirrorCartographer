# IT-20261127-11 — The cost of ignorance
Parent: [IT-20261127-05](2026-11-27-invisible-trail-correlated-evidence-05.md), branch B. Cross-links: architecture of absence, disobedient instrument, biological regulation.
Hypothesis: uncertainty about provenance can change the optimal action even without changing observations.
Evidence: in the parent's symmetric sensor mixture, unknown r in [0,1] yields posterior interval [.19,19/28]. Under symmetric unit misclassification loss, worst-case losses of choosing A and B are .81 and 19/28 respectively. A fair random choice has loss .5 for every posterior. Deferral with fixed loss .25 beats all randomized binary decisions because the interval contains .5, at which every binary mixture has loss .5. This is a minimax result, not a universal prescription. Deferral cost must include delay and downstream consequences.
Executed JS (two endpoint assertions passed):
```js
const p=.95;
const posterior=r=>p*(.01+.09*r)/(p*(.01+.09*r)+(1-p)*(.81+.09*r));
if(Math.abs(posterior(0)-.19)>1e-9||Math.abs(posterior(1)-19/28)>1e-9)throw Error("endpoint");
console.log([1-posterior(0),posterior(1),.5,.25]);
```
Results: [.81,.6785714285714284,.5,.25]. Parent correction: threshold 31/81 is correct.
Counterexamples: urgent decisions, asymmetric losses, informative priors over dependence, deferral that supplies no new information. A calibrated Bayesian policy may outperform minimax on average. No biological or consciousness claims.
Open branches: price a provenance audit; model time-dependent deferral costs; compare robust and Bayesian policies; distinguish missing evidence from unidentifiable evidence.
Repository inventory: mirror-cartographer-ui, MirrorCartographer, J, c, S, B, r. Parent fetched from main. New isolated log avoids shared-file edits. Daily mesh CI: verified parent ledger records November 27 inspection already completed; no duplicate inspection. No personal data or paid services.
