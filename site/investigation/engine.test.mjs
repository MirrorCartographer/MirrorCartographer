import test from "node:test";
import assert from "node:assert/strict";
import {
  createInvestigation,addSource,addObservation,addClaim,linkEvidence,addHypothesis,
  addTest,recordTestResult,addUnknown,addDecision,transitionClaim,auditInvestigation,
  exportInvestigation,importInvestigation
} from "./engine.mjs";

const base=()=>createInvestigation({id:"inv-test",title:"Synthetic signal inquiry",question:"What explains the change in the synthetic signal?",domain:"systems",created_at:"2026-11-07T12:00:00.000Z"});
const source=(id,group="study-a")=>({id,title:"Synthetic source "+id,publisher:group,source_type:"synthetic test",url:"https://example.org/"+id,exact_location:"section 2, paragraph 3",independence_group:group,privacy_status:"public_safe",limitations:["Synthetic fixture; not real-world evidence."]});
const claimInput={id:"cl-1",proposition:"A measured signal changed under the stated synthetic conditions.",claim_type:"source-reported-finding",confidence_rationale:"One synthetic fixture source; limited scope.",not_established:["Cause","Generalization"],next_test:"Repeat with an independent calibrated instrument."};

test("creates a bounded investigation with explicit reflexivity fields",()=>{
 const inv=base();assert.equal(inv.schema,"mc-investigation");assert.equal(inv.status,"open");assert.ok(inv.reflexivity.blind_spots);assert.equal(auditInvestigation(inv).valid,true);
});
test("requires exact source location and safe URL or path",()=>{
 const inv=base();assert.throws(()=>addSource(inv,{id:"s1",title:"Bad",url:"javascript:alert(1)",exact_location:"page 2"}),/exact source locator/);
 assert.throws(()=>addSource(inv,{id:"s1",title:"Bad",url:"https://example.org/x"}),/exact location/);
});
test("adds source records with explicit privacy and independence groups",()=>{
 const inv=addSource(base(),source("s1"));assert.equal(inv.sources.length,1);assert.equal(inv.sources[0].privacy_status,"public_safe");
});
test("rejects observed variables without units and missingness-as-absence",()=>{
 let inv=addSource(base(),source("s1"));
 assert.throws(()=>addObservation(inv,{source_id:"s1",description:"Observed",variables:[{name:"signal",value:0,unit:"",missingness:"observed"}]}),/value and unit/);
 assert.throws(()=>addObservation(inv,{source_id:"s1",description:"Not collected",variables:[{name:"baseline",value:"absent",unit:"unknown",missingness:"unknown"}]}),/must remain null/);
});
test("adds an observation linked to an exact source",()=>{
 let inv=addSource(base(),source("s1"));
 inv=addObservation(inv,{id:"obs-1",source_id:"s1",description:"A synthetic signal was recorded.",variables:[{name:"amplitude",value:2,unit:"mV",missingness:"observed"}]});
 assert.equal(inv.observations[0].source_id,"s1");
});
test("rejects claims without scope limits or source refs",()=>{
 const inv=base();assert.throws(()=>addClaim(inv,{...claimInput,proposition:"short"}),/at least 12/);
});
test("claim starts unreviewed and cannot skip review states",()=>{
 let inv=addSource(base(),source("s1"));inv=addClaim(inv,{...claimInput,source_ids:["s1"]});
 assert.equal(inv.claims[0].status,"unreviewed");
 assert.throws(()=>transitionClaim(inv,"cl-1","qualified","skip"),/one review state/);
});
test("claim needs exact evidence links before qualification",()=>{
 let inv=addSource(base(),source("s1"));inv=addClaim(inv,{...claimInput,source_ids:["s1"]});
 inv=transitionClaim(inv,"cl-1","source-checked","Source identity and scope checked.");
 assert.throws(()=>transitionClaim(inv,"cl-1","qualified","Qualified"),/exact evidence links/);
 inv=linkEvidence(inv,"cl-1",{source_id:"s1",direction:"supports",exact_location:"section 2, paragraph 3",scope_fit:"partial"});
 inv=transitionClaim(inv,"cl-1","qualified","Evidence link and scope limits reviewed.");
 assert.equal(inv.claims[0].status,"qualified");
});
test("corroboration requires two independent source groups",()=>{
 let inv=addSource(base(),source("s1","same-study"));inv=addSource(inv,source("s2","same-study"));
 inv=addClaim(inv,{...claimInput,source_ids:["s1","s2"]});
 inv=linkEvidence(inv,"cl-1",{source_id:"s1",direction:"supports",exact_location:"section 2"});
 inv=linkEvidence(inv,"cl-1",{source_id:"s2",direction:"supports",exact_location:"table 1"});
 assert.throws(()=>transitionClaim(inv,"cl-1","source-checked","Checked"),/one review state/);
 inv=transitionClaim(inv,"cl-1","source-checked","Checked");
 inv=transitionClaim(inv,"cl-1","qualified","Qualified");
 assert.throws(()=>transitionClaim(inv,"cl-1","tested","Tested"),/completed test/);
});
test("contested requires a contradictory evidence link",()=>{
 let inv=addSource(base(),source("s1"));inv=addClaim(inv,{...claimInput,source_ids:["s1"]});
 assert.throws(()=>transitionClaim(inv,"cl-1","contested","Contested"),/contradictory evidence/);
});
test("hypotheses require predictions and explicit falsification",()=>{
 const inv=base();assert.throws(()=>addHypothesis(inv,{statement:"A plausible explanation for the signal."}),/prediction/);
 const next=addHypothesis(inv,{id:"h1",statement:"Sensor drift explains the observed signal change.",predictions:["A calibrated reference will remain stable."],falsification_condition:"The calibrated reference changes in the same direction."});
 assert.equal(next.hypotheses[0].status,"candidate");
});
test("tests require predeclared measures, comparison, and disconfirmation",()=>{
 let inv=addHypothesis(base(),{id:"h1",statement:"Sensor drift explains the observed signal change.",predictions:["Reference remains stable."],falsification_condition:"Reference changes too."});
 assert.throws(()=>addTest(inv,{hypothesis_id:"h1",title:"Test",protocol:"Repeat"}),/measurable outcomes/);
 inv=addTest(inv,{id:"t1",hypothesis_id:"h1",title:"Reference comparison",protocol:"Repeat the measurement with a calibrated reference.",measurements:["Signal amplitude in mV"],comparison:"Original sensor versus calibrated reference",predeclared_disconfirmation:"Both sensors reproduce the same shift."});
 assert.equal(inv.tests[0].status,"planned");
});
test("completed test results are immutable and bounded",()=>{
 let inv=addHypothesis(base(),{id:"h1",statement:"Sensor drift explains the observed signal change.",predictions:["Reference remains stable."],falsification_condition:"Reference changes too."});
 inv=addTest(inv,{id:"t1",hypothesis_id:"h1",title:"Reference comparison",protocol:"Repeat with calibrated reference.",measurements:["Amplitude (mV)"],comparison:"Sensor A versus reference",predeclared_disconfirmation:"Both shift equally."});
 inv=recordTestResult(inv,"t1",{outcome:"Synthetic reference remained stable.",interpretation:"Consistent with drift but not conclusive.",limitations:"Single synthetic run."});
 assert.equal(inv.tests[0].status,"completed");
 assert.throws(()=>recordTestResult(inv,"t1",{outcome:"Changed",interpretation:"Changed",limitations:"Single run."}),/immutable/);
});
test("unknowns preserve missingness as a first-class record",()=>{
 const inv=addUnknown(base(),{id:"u1",question:"What was the baseline before the signal change?",missingness:"not_collected",why_it_matters:"Without a baseline, magnitude and direction of change are uncertain."});
 assert.equal(inv.unknowns[0].missingness,"not_collected");
});
test("decisions require uncertainty and a review trigger",()=>{
 assert.throws(()=>addDecision(base(),{choice:"Proceed"}),/uncertainty/);
 const inv=addDecision(base(),{choice:"Collect another measurement",rationale:"A repeat can separate sensor drift from a real change.",uncertainty:"One observation is insufficient.",review_trigger:"Revisit after the calibrated comparison.",reversible:true});
 assert.equal(inv.decisions[0].reversible,true);
});
test("audit detects dangling references and repeated source groups",()=>{
 let inv=addSource(base(),source("s1","same-study"));inv=addSource(inv,source("s2","same-study"));
 inv=addClaim(inv,{...claimInput,source_ids:["s1","s2"]});
 inv=linkEvidence(inv,"cl-1",{source_id:"s1",direction:"supports",exact_location:"section 2"});
 const audit=auditInvestigation(inv);assert.equal(audit.valid,true);assert.ok(audit.warnings.some(x=>x.includes("repeated outputs")));
});
test("export/import round trip preserves investigation and blocks private public export",()=>{
 let inv=addSource(base(),source("s1"));inv=addClaim(inv,{...claimInput,source_ids:["s1"]});
 const restored=importInvestigation(exportInvestigation(inv));assert.deepEqual(restored,inv);
 const privateInv=addSource(base(),{...source("s2"),privacy_status:"private"});
 assert.throws(()=>exportInvestigation(privateInv,{publicSafeOnly:true}),/privacy review/);
});
test("rejects malformed imports",()=>assert.throws(()=>importInvestigation({schema:"wrong",schema_version:1,investigation:{}}),/Unsupported/));
