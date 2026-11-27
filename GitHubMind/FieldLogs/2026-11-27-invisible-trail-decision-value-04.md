# IT-20261127-04 — Information that cannot change a decision
Parent: [IT-20261127-03](2026-11-27-invisible-trail-independent-anchor-03.md), branches A/B. Cross-links: architecture of absence, disobedient instrument, punchline (open analogy).
Hypothesis: informative measurements need not improve immediate decisions. Binary world, prior P(A)=p>=.5, symmetric calibrated sensor accuracy q>=.5, equal misclassification losses. Baseline Bayes risk 1-p. After observing sensor, risk is sum of smaller joint probabilities for each observation. Algebra yields risk min(1-p,1-q), hence value max(0,q-p). A sensor can reduce entropy while having zero immediate decision value. With p=.95 and q=.9, even a contrary report leaves P(A|contrary)=.095/(.095+.045)=.67857. Two independent contrary reports instead give posterior .0095/(.0095+.0405)=.19.
Executed JS (12 assertions):
```js
for(const p of [.5,.8,.95])for(const q of [.5,.6,.9,1]){
 const base=1-p;
 const after=Math.min(p*q,(1-p)*(1-q))+Math.min(p*(1-q),(1-p)*q);
 if(Math.abs(base-after-Math.max(0,q-p))>1e-10)throw Error("identity");
 console.log({p,q,base,after,value:base-after});
}
```
All 12 cases passed. At p=.8, q=.6 value=0; q=.9 value=.1; at p=.95 q=.9 value=0. These are exact finite-model calculations, not empirical sensor performance or novel Bayesian theory.
Counterexamples/limitations: unequal losses change decision threshold; repeated independent observations may collectively have value; correlated observations cannot be multiplied as independent; miscalibrated priors or likelihoods invalidate guarantees. Information useful for future decisions may have zero immediate value. A positive acquisition cost can make even a decision-changing measurement uneconomic.
Open branches: A sequential experiment selection under budget; B correlated witnesses and false consensus; C surprise vs humor: surprising evidence may change belief without changing action, but no humor metric established; D biological analogy: thresholds and integration, no physiological claims.
Repository discovery: seven accessible repositories (mirror-cartographer-ui, MirrorCartographer, J, c, S, B, r); existing GitHubMind parent recovered. Isolated new field log avoids shared edits. Daily mesh CI: parent records 2026-11-27 inspection completed; no duplicate check or workflow mutation.
