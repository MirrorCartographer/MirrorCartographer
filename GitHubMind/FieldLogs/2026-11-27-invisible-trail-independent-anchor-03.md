# IT-20261127-03 — Independence is not calibration
Parent: [IT-20261127-02, branch C](2026-11-27-invisible-trail-reciprocal-adaptation-02.md). Cross-links: disobedient instrument, biological regulation, architecture of absence.
Hypothesis: an independent evidence anchor protects against corrupted operator feedback, but persistent sensor bias can reverse its advantage. Synthetic scalar truth=1; operator reports 3 during t=10..39, otherwise 1. Sensor reports truth+bias throughout. Gain .25. Compare obedience, literal opposition (negative feedback gain toward operator, intentionally unstable), and sensor-only anchor. No claim that these exhaust adaptive strategies.
Executed JavaScript:
```js
const rows=[];
for(const bias of [0,.5,1,2]) for(const mode of ["obey","oppose","anchor"]){
 let x=0,err=0;
 for(let t=0;t<60;t++){
  const truth=1,operator=t>=10&&t<40?3:1,sensor=truth+bias;
  const target=mode==="obey"?operator:mode==="oppose"?2*x-operator:sensor;
  x+=.25*(target-x);
  if(t>=10&&t<40)err+=(x-truth)**2;
 }
 rows.push({bias,mode,mse:err/30,final:x});
}
if(!(rows[2].mse<rows[0].mse&&rows[11].mse>rows[9].mse))throw Error("assertion");
console.log(rows);
```
Both assertions passed. During corruption, obedience MSE 3.358840; opposition 7726941.399825; anchor MSE by bias 0,.5,1,2: .000136,.241860,.978022,3.933659. At bias 2 final anchor ~3 while obedience recovers to 1.006341. Counterexample: independent but biased sensor is worse than temporarily corrupted operator. Opposition is a deliberately extreme comparator, not evidence against all dissent. Sensor-only anchor is not reciprocal adaptation. Truth is available only to evaluator, not agents.
Open branches: A calibrated fusion with uncertainty; B indistinguishability when both channels disagree and neither is independently verifiable; C bounded opposition and delayed feedback; D biological analogy only, no physiological or therapeutic claims. In particular, identical reports (operator=3,sensor=1) are compatible with truth=1 or truth=3; no deterministic choice can guarantee correctness in both worlds without additional assumptions.
Daily mesh CI: parent ledger records 2026-11-27 check already completed; no duplicate query or mutation. New isolated field log, no website or shared-file edits.