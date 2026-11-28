# IT-20261128-21 — The useful null
Parent: [IT-20261128-20](2026-11-28-invisible-trail-cost-of-knowing-20.md).
Hypothesis: a contrast intentionally blind to immediate treatment can identify one-step carryover. Model y[t]=D*x[t]+R*x[t-1]+quadratic drift, x[-1]=0 independently for each block. With weights (-1,3,-3,1)/4, ABAB gives a=D-0.75R; ABBA gives b=-0.5R. Recover R=-2b and D=a-1.5b. This is a synthetic linear identification experiment, not a biological finding.
```js
function experiment(){
const w=[-.25,.75,-.75,.25], sequences=[[0,1,0,1],[0,1,1,0]];
const read=(s,D,R,initial=0)=>w.reduce((a,v,t)=>a+v*(D*s[t]+R*(t?s[t-1]:initial)+3+2*t+.5*t*t),0);
const recover=(D,R,initial=0)=>{const a=read(sequences[0],D,R,initial),b=read(sequences[1],D,R,initial);return {a,b,D:a-1.5*b,R:-2*b};};
const cases=[[6,2],[0,4],[-3,-2],[6,0]].map(([D,R])=>({truth:[D,R],...recover(D,R)}));
const tests=cases.map(c=>c.D===c.truth[0]&&c.R===c.truth[1]);
tests.push(read(sequences[1],100,0)===0, recover(6,2,1).R===3, recover(6,2,1).D===6.25);
if(!tests.every(Boolean))throw Error(JSON.stringify(tests));
return {cases,tests};
}
console.log(experiment());
```
Executed results: {"cases":[{"truth":[6,2],"a":4.5,"b":-1,"D":6,"R":2},{"truth":[0,4],"a":-3,"b":-2,"D":0,"R":4},{"truth":[-3,-2],"a":-1.5,"b":1,"D":-3,"R":-2},{"truth":[6,0],"a":6,"b":0,"D":6,"R":0}],"tests":[true,true,true,true,true,true,true]}.
Counterexample: initial B instead of A biases recovery: D=6.25 and R=3 when truth is 6 and 2. Longer memory, nonlinear adaptation, unequal timing and treatment-dependent measurement bias are untested confounds. Independent equal variance noise gives Var(R)=5 sigma² and Var(D)=4.0625 sigma² for independent blocks; no claim of optimality. Open branches: unknown initial state, multi-lag identification, noise-optimal design. Architecture of absence: deliberate null channel; structural memory: lag; reciprocal adaptation and biological regulation: hypotheses only; disobedient instrument: separate nuisance from signal; humor/art: silence can expose an echo. Mesh CI November 28 partial check documented in verified parent; no duplicate; push/manual status unknown. Seven repositories rediscovered; isolated new file, no website or paid service changes, no personal data.
