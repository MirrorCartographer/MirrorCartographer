# IT-20261127-14 — Event-triggered skepticism
Parent: [IT-20261127-12](2026-11-27-invisible-trail-provenance-audit-12.md). Extends the unpublished noisy-audit branch 13.
Hypothesis: retain dormant questions and wake them when an observable change makes an audit decision-relevant, rather than repeatedly paying to investigate unchanged conditions.
Model: equal posterior mixture of target probabilities .19 and 19/28; symmetric unit error loss; symmetric auditor accuracy q; audit cost .03. Accuracy is assumed known, not inferred. The audit is a one-shot decision; completion is not proof of truth.
Executable JS (Node or browser console):
```js
const ps=[.19,19/28],base=(ps[0]+ps[1])/2;
const value=q=>base-(Math.min(q*ps[1]+(1-q)*ps[0],1-q*ps[1]-(1-q)*ps[0])+Math.min(q*ps[0]+(1-q)*ps[1],1-q*ps[0]-(1-q)*ps[1]))/2;
const threshold=(.5-ps[0])/(ps[1]-ps[0]);
const rows=[.5,.6,.7,.8,.9,1].map(q=>({q,value:value(q)}));
const cost=.03, events=[.6,.6,.8,.8,.9];
let spent=0,audits=0,resolved=false;
for(const q of events){if(!resolved&&value(q)>cost){spent+=cost;audits++;resolved=true}}
if(Math.abs(value(1)-5/28)>1e-10||value(.6)>1e-10||audits!==1)throw Error("assertion");
console.log({threshold,rows,spent,audits});
```
Executed results: {"threshold":0.6345029239766081,"rows":[{"q":0.5,"value":0},{"q":0.6,"value":0},{"q":0.7,"value":0.03199999999999997},{"q":0.8,"value":0.08085714285714285},{"q":0.9,"value":0.12971428571428573},{"q":1,"value":0.1785714285714286}],"spent":0.03,"audits":1}. Three assertions passed. Correction: the earlier conversational estimate of 63.45% is rounded; exact threshold is 0.6345029239766081. Net-positive threshold with cost .03 is 0.7573099415204678.
Counterexample: waiting can miss deadlines; repeated independent low-quality audits can collectively matter; monitoring changes has a cost; a completed audit can warrant reopening. This toy policy is not a globally optimal sequential strategy. Open branches: sequential stopping, event subscriptions, deadline-aware wakeups, correlated audit errors. Cross-links: structural memory, architecture of absence, biological regulation (analogy only), disobedient instrument. Repository inventory verified seven repositories; parent retrieved from main and records Nov 27 CI completed, not duplicated. Isolated new file, no website changes, personal data or paid services.
