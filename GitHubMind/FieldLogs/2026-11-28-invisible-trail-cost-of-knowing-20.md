# IT-20261128-20 — The cost of knowing
Parent: [IT-20261128-19](2026-11-28-invisible-trail-recursive-counterbalance-19.md).
Hypothesis: weighted contrasts can shorten experiments without sacrificing polynomial drift cancellation. Exhaustively enumerate balanced equal-weight binary designs at even lengths 2–16, then compare four equally spaced ABAB observations with weights (-1,3,-3,1)/4. Odd lengths cannot balance equal weights. This is finite-difference mathematics, not a novel theorem. Stable additive treatment and no carryover assumed.
```js
function experiment(){
const results=[];
for(let n=2;n<=16;n+=2){
 let counts=[0,0,0,0];
 for(let mask=0;mask<2**n;mask++){
  let m=[0,0,0,0];
  for(let t=0;t<n;t++){let s=(mask>>t&1)?1:-1;for(let p=0;p<4;p++)m[p]+=s*t**p;}
  for(let p=0;p<4;p++){if(m[p]!==0)break;counts[p]++;}
 }
 results.push({n,counts});
}
const w=[-1,3,-3,1].map(x=>x/4);
const moments=[0,1,2,3].map(p=>w.reduce((s,v,t)=>s+v*t**p,0));
const variance=w.reduce((s,v)=>s+v*v,0);
const tests=[results.find(r=>r.counts[2]>0).n===8,results.find(r=>r.counts[3]>0).n===16,moments.slice(0,3).every(x=>x===0),w[1]+w[3]===1,variance===1.25,w.reduce((s,v)=>s+Math.abs(v),0)===2];
if(!tests.every(Boolean))throw Error(JSON.stringify(tests));
return {results,moments,variance,tests};
}
console.log(experiment());
```
Executed results: {"results":[{"n":2,"counts":[2,0,0,0]},{"n":4,"counts":[6,2,0,0]},{"n":6,"counts":[20,0,0,0]},{"n":8,"counts":[70,8,2,0]},{"n":10,"counts":[252,0,0,0]},{"n":12,"counts":[924,58,2,0]},{"n":14,"counts":[3432,0,0,0]},{"n":16,"counts":[12870,526,14,2]}],"moments":[0,0,0,1.5],"variance":1.25,"tests":[true,true,true,true,true,true]}
Evidence: quadratic cancellation needs at least eight equal-weight observations in the enumerated design class; cubic needs sixteen. Weighted ABAB cancels quadratic drift in four observations, with cubic residual 1.5 per unit coefficient versus 12 for eight-point Thue–Morse. Independent equal-variance noise variance is 1.25 sigma² versus 0.5 sigma², a 2.5-fold penalty; worst-case bounded noise remains 2 epsilon. Four-point duration is three intervals rather than seven. Counterexamples: treatment-dependent bias, carryover, unequal timing, correlated noise. Open branches: optimize duration/noise tradeoff and identify carryover; structural memory retains weights and order; architecture of absence tracks confounds; disobedient instrument uses signed contrasts; reciprocal adaptation and biological regulation motivate shorter probes; humor/art analogy: unequal emphasis can preserve structure with fewer beats. No clinical or consciousness claims.
Mesh CI: November 28 partial inspection recorded in verified parent; no duplicate check; push/manual statuses unknown. Seven repositories rediscovered. New isolated file only; no personal data, website changes or paid services.
