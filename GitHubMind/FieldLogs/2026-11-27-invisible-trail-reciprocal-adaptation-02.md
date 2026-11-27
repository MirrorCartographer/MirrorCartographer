# IT-20261127-02 — Two mirrors can amplify disagreement

Parent: [IT-20261127-01, branch C](2026-11-27-invisible-trail-structural-memory-01.md). Cross-links: biological-regulation, disobedient-instrument (requested roots).

Hypothesis: increasing reciprocal responsiveness need not improve coordination. Model two scalar agents simultaneously updating toward each other with gain a. Their mean is conserved; signed difference evolves as d(t+1)=(1-2a)d(t). Thus convergence requires 0<a<1; a=1 swaps states forever; a>1 amplifies disagreement. This is elementary discrete feedback analysis, not a novel mathematical theorem.

Executed JavaScript experiment (20 iterations):
```js
const rows=[];
for(const a of [.25,.5,.75,1,1.25]){
 let x=0,y=1;
 for(let i=0;i<20;i++) [x,y]=[x+a*(y-x),y+a*(x-y)];
 rows.push({a,x,y,gap:Math.abs(x-y)});
}
console.log(rows);
if(rows[1].gap!==0||rows[3].gap!==1||rows[4].gap<3000) throw Error('assertion');
```
Observed gaps: 0.00000095367431640625, 0, 0.00000095367431640625, 1, 3325.256730079651. Assertions passed. At .75 disagreement changes sign each step but shrinks. At 1.25 unbounded scalar model leaves initial range; clipping would change the result. Counterexample to interpreting consensus as correctness: agents starting at 0 and 1 converge to .5 even when an external target is 1. No external evidence enters the system. Fixed environment comparison: updating x alone toward fixed y has multiplier 1-a, stable for 0<a<2. Reciprocal updating narrows the stability range in this model.

Open branches: IT-20261127-02-A asynchronous updates; B delayed observations and clipping; C independent evidence channel versus agreement; D biological analogy with feedback gain, not a physiological claim. Design implication to test: preserve independent observations and measure disagreement dynamics rather than rewarding agreement alone. No consciousness or clinical claims.

Daily mesh CI: already recorded for 2026-11-27 in parent ledger; no duplicate check or workflow mutation. Isolated new field log avoids edits to other studios' files.
