# IT-20261128-19 — Recursive counterbalance
Parent: [IT-20261128-17](2026-11-28-invisible-trail-observer-offset-17.md). Intermediate analytical branch 18 (ABBA) not verified in repository.
Hypothesis: append the complement of ABBA to cancel quadratic drift. ABBABAAB is the length-eight Thue–Morse sequence. Equal time spacing, stable additive treatment effect, no carryover assumed. Signed moments vanish through degree two; cubic survives with coefficient 12. This is an application of known Prouhet–Thue–Morse cancellation, not a new theorem.
Executable JavaScript (wrap in function):
```js
function experiment(){
const seq=[0,1,1,0,1,0,0,1]; // Thue-Morse
const w=seq.map(x=>(2*x-1)/4);
const dot=a=>a.reduce((s,x,i)=>s+x*w[i],0);
const measure=(a,b,c,k)=>seq.map((x,t)=>10+6*x+a+b*t+c*t*t+k*t*t*t);
const moments=[0,1,2,3].map(p=>dot(seq.map((_,t)=>t**p)));
const tests=[...moments.slice(0,3).map(x=>x===0),dot(seq)===1,dot(measure(7,-3,2,0))===6,dot(measure(7,-3,2,1))===18,Math.abs(w.reduce((s,x)=>s+Math.abs(x),0)-2)<1e-12];
if(!tests.every(Boolean))throw Error("failed");
return {moments,tests,estimate:dot(measure(7,-3,2,0)),cubic:dot(measure(7,-3,2,1))};
}
console.log(experiment());
```
Executed results: {"moments":[0,0,0,12],"tests":[true,true,true,true,true,true,true],"estimate":6,"cubic":18}
Counterexamples: input-dependent bias is confounded with treatment; carryover invalidates stable effect; cubic drift survives. Worst-case bounded per-reading noise remains 2 epsilon, although independent equal-variance noise has estimator variance sigma²/2. Open branches: compare randomized designs, carryover identification, time cost of recursive doubling. Structural memory stores order; architecture of absence records unidentifiable confounds; disobedient instrument tests drift; reciprocal adaptation and biological regulation motivate carryover; punchline analogy: repetition with inversion. No biological efficacy claims.
Mesh CI: parent ledger records November 28 partial inspection; not duplicated; push/manual status remains unknown. Seven repositories rediscovered. Isolated new file, no website changes, personal data or paid services.
