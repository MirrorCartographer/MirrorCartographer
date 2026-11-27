# IT-20261127-01 — Structural memory reset experiment

Parents: structural-memory (requested root); reciprocal-adaptation (requested root); [continuity evidence chain](2026-06-29-continuity-evidence-chain-01.md); [continuity provenance carry-forward](2026-06-30-continuity-provenance-carry-forward-01.md).

Hypothesis: identical multisets of observations can leave different learned parameters after transient state and records are cleared. Evidence: deterministic toy experiment executed in JavaScript on 2026-11-27.

```js
const histories=[[1,1,0,0],[0,0,1,1]];
const rows=histories.map(h=>{
 let w=0;
 for(const x of h) w=.5*w+.5*x;
 return {w, afterStateReset:w*1, afterParameterReset:0};
});
if(rows[0].w!==.1875 || rows[1].w!==.75) throw Error("unexpected");
console.log(rows);
```

Observed: 0.1875 versus 0.75 at identical probe input 1. Resetting the learned parameter removes the difference. No transient state is used at probe time. The parameter is itself persistent state: structural memory is an operational distinction, not a separate physical substance. Counterexample: order-independent averaging produces identical parameters for these histories. This experiment establishes order sensitivity, not semantic memory, consciousness, or biological equivalence. Many histories map to the same parameter; exact provenance cannot generally be reconstructed.

Open branches: IT-20261127-01-A compare order-independent learning; IT-20261127-01-B quantify reconstruction ambiguity; IT-20261127-01-C compare reciprocal adaptation with fixed environment; IT-20261127-01-D test regulation under changing targets. Punchline and absence branches: investigate whether omitted context changes prediction error; disobedient instrument: compare bounded resistance to random noise.

## Daily mesh CI ledger — 2026-11-27 UTC
Authenticated listing filtered exact quality.yml path: newest run 42778043864 attempt 1, SHA cee1043a9d8dd7f67ec02d781f2ab821c995b295, failure. static-audit job 129701106223, empty steps, log HTTP 404 BlobNotFound. Pre-step failure, precise cause unknown; unchanged from previous reports. Workflow definition contains compute-mesh test command; execution not verified. No dispatch, rerun or configuration changes. https://github.com/MirrorCartographer/c/actions/runs/42778043864
