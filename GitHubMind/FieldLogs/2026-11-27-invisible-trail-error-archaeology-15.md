# IT-20261127-15 — Error archaeology
Parent: [IT-20261127-14](2026-11-27-invisible-trail-event-triggered-skepticism-14.md).
Hypothesis: reverse evaluation of disputed numerical claims can identify candidate error mechanisms without asserting historical causation.
Evidence: parent prose gives .7573099415204678 for cost .03, but its executable model implies .695906432748538. Explicit joint-probability enumeration independently verifies the latter. The former corresponds to cost .06; double-counting is a candidate, not established genealogy. At accuracy .72 gross value .04177142857142857, net .01177142857142857. Preserve parent unchanged; this entry supersedes its cost threshold only.
Experiment (JavaScript, executed four assertions, all passed):
```js
const p=[.19,19/28],d=p[1]-p[0],q=.34/d;
const loss=a=>[0,1].reduce((s,y)=>{let j=[0,0];for(let h=0;h<2;h++)for(let t=0;t<2;t++)j[t]+=.5*(t?p[h]:1-p[h])*(y===h?a:1-a);return s+Math.min(...j)},0);
const v=a=>(p[0]+p[1])/2-loss(a);
const tests=[Math.abs(v(q)-.03)<1e-12,Math.abs(v(.7573099415204678)-.06)<1e-12,v(.72)>.03,Math.abs(v(.5))<1e-12];
if(!tests.every(Boolean))throw Error("verification failed");
console.log({q,tests,actual:v(.72)});
```
Counterexample: different mistakes can produce identical numerical outputs; reverse inference is not unique. Open branches: mutation testing of cost accounting, independent provenance of acceptance criteria, delayed-relevance memory policies. Cross-links: structural memory, disobedient instrument, reciprocal adaptation; biological regulation and humor are analogies only. Seven repositories discovered; parent main retrieved. Parent records Nov 27 mesh CI completed, not duplicated. Isolated new file; no personal data, website changes or paid services.
