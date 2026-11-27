# IT-20261127-12 — Price of a provenance audit
Parent: [IT-20261127-11](2026-11-27-invisible-trail-cost-of-ignorance-11.md).
Hypothesis: learning about the origin of existing evidence can improve decisions without another measurement of the target.
Model: conditional on already observed reports, assign equal probability to the two endpoint dependence models from parent, with target posteriors .19 and 19/28. This is a posterior mixture assumption, not an equal prior before observing reports. Symmetric unit loss. Perfect audit reveals which model applies, not the target.
Executed JS:
```js
const ps=[.19,19/28];
const p=(ps[0]+ps[1])/2;
const no=Math.min(p,1-p);
const yes=ps.reduce((a,p)=>a+Math.min(p,1-p),0)/2;
if(Math.abs(no-yes-5/28)>1e-10)throw Error("audit value");
console.log([0,.1,.2].map(c=>({c,audit:yes+c,skip:no})));
```
Results: {"prior":0.4342857142857143,"no":0.4342857142857143,"yes":0.25571428571428567,"value":0.1785714285714286,"cases":[{"c":0,"audit":0.25571428571428567,"skip":0.4342857142857143},{"c":0.1,"audit":0.35571428571428565,"skip":0.4342857142857143},{"c":0.2,"audit":0.4557142857142857,"skip":0.4342857142857143}]}. One assertion passed. Audit worth at most 5/28 units under assumptions. Counterexamples: same optimal decision in both models implies zero immediate value; imperfect audit, unequal mixture, delay and asymmetric loss alter result. Audit can reveal provenance without resolving truth. Open branches: noisy audits, adversarial provenance, dynamic question scheduling. Cross-links: structural memory, architecture of absence, disobedient instrument, scientific reproducibility. No biological or consciousness claims.
Repository inventory verified: mirror-cartographer-ui, MirrorCartographer, J, c, S, B, r. Parent fetched from main and records November 27 CI already inspected; no duplicate check. Isolated new file; no shared-file edits, personal data or paid services.