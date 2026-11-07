/**
 * Mirror Cartographer Investigation Engine.
 * Local-first, provenance-preserving workflow. This engine organizes evidence;
 * it does not decide truth, diagnose, prescribe, or infer causality automatically.
 */
export const SCHEMA = "mc-investigation";
export const SCHEMA_VERSION = 1;
export const MISSINGNESS = new Set(["observed","unknown","not_collected","redacted","not_applicable"]);
export const CLAIM_TYPES = new Set(["observation","source-reported-finding","source-reported-synthesis","methodological-synthesis","inference","hypothesis","design-proposal","value-judgment"]);
export const CLAIM_STATES = ["unreviewed","source-checked","qualified","tested","corroborated","contested","revised","retired"];
export const EVIDENCE_DIRECTIONS = new Set(["supports","contradicts","qualifies","does_not_address"]);
export const PRIVACY_STATES = new Set(["public_safe","private","sensitive","unreviewed"]);
const clone = value => JSON.parse(JSON.stringify(value));
const text = value => typeof value === "string" && value.trim().length > 0;
const list = value => Array.isArray(value);
const id = prefix => prefix + "-" + (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36));
const stamp = value => value || new Date().toISOString();

export function createInvestigation(input = {}) {
  const now = stamp(input.created_at);
  return {
    schema: SCHEMA,
    schema_version: SCHEMA_VERSION,
    id: input.id || id("inv"),
    title: input.title || "Untitled investigation",
    question: input.question || "",
    domain: input.domain || "general",
    status: "open",
    scope: { population_or_system: "", context: "", time_window: "", outcome: "", ...(input.scope || {}) },
    reflexivity: {
      territory: "", observer_standpoint: "", instrument: "", instrument_version: "",
      assumptions: [], selection_and_exclusions: "", transformations: [], blind_spots: [],
      observer_effect: "not_assessed", revision_trigger: "", ...(input.reflexivity || {})
    },
    sources: [],
    observations: [],
    claims: [],
    hypotheses: [],
    tests: [],
    decisions: [],
    unknowns: [],
    events: [{ id: id("evt"), at: now, action: "investigation_created", detail: "Investigation shell created; no factual conclusion implied." }],
    created_at: now,
    updated_at: now
  };
}

function assertInvestigation(inv) {
  if (!inv || inv.schema !== SCHEMA || inv.schema_version !== SCHEMA_VERSION) throw new TypeError("Unsupported investigation format.");
  for (const key of ["sources","observations","claims","hypotheses","tests","decisions","unknowns","events"]) {
    if (!list(inv[key])) throw new TypeError("Investigation " + key + " must be an array.");
  }
}
function recordEvent(inv, action, detail, now) {
  const next = clone(inv);
  const at = stamp(now);
  next.events.push({ id: id("evt"), at, action, detail: String(detail || action).slice(0, 1000) });
  next.updated_at = at;
  return next;
}
function uniqueId(items, value, label) {
  if (!text(value)) throw new TypeError(label + " needs a non-empty ID.");
  if (items.some(item => item.id === value)) throw new Error("Duplicate " + label + " ID: " + value);
}
function requireRef(items, value, label) {
  if (!items.some(item => item.id === value)) throw new Error("Unknown " + label + " reference: " + value);
}
function safeLocator(locator) {
  if (!locator || typeof locator !== "object") return false;
  const url = locator.url;
  const path = locator.path;
  let safeUrl = false;
  try {
    const parsed = new URL(url);
    safeUrl = ["http:","https:"].includes(parsed.protocol) && !parsed.username && !parsed.password;
  } catch {}
  const safePath = text(path) && !path.startsWith("/") && !/^[A-Za-z]:/.test(path) && !/(^|\/)\.\.(\/|$)/.test(path);
  return (safeUrl || safePath) && text(locator.exact_location);
}

export function addSource(inv, input, now) {
  assertInvestigation(inv);
  const source = {
    id: input.id || id("src"), title: input.title || "", publisher: input.publisher || "",
    source_type: input.source_type || "other", domain: input.domain || inv.domain,
    url: input.url || "", path: input.path || "", exact_location: input.exact_location || "",
    published_at: input.published_at || "", accessed_at: input.accessed_at || stamp(now),
    method: input.method || "", population_or_system: input.population_or_system || "",
    independence_group: input.independence_group || input.publisher || input.id || "",
    limitations: list(input.limitations) ? [...input.limitations] : [],
    privacy_status: input.privacy_status || "unreviewed",
    reuse_rights: input.reuse_rights || "not_assessed"
  };
  uniqueId(inv.sources, source.id, "source");
  if (!text(source.title)) throw new TypeError("Source title is required.");
  if (!safeLocator(source)) throw new TypeError("Source needs an HTTPS/HTTP URL or safe repository path, plus an exact location such as page, section, table, timestamp, or line range.");
  if (!PRIVACY_STATES.has(source.privacy_status)) throw new TypeError("Invalid source privacy status.");
  if (!text(source.independence_group)) throw new TypeError("Source independence group is required; repeated publications from one underlying study must be grouped.");
  const next = clone(inv); next.sources.push(source);
  return recordEvent(next, "source_added", source.id + " — " + source.title, now);
}

export function addObservation(inv, input, now) {
  assertInvestigation(inv);
  requireRef(inv.sources, input.source_id, "source");
  if (!text(input.description)) throw new TypeError("Observation description is required.");
  const missingness = input.missingness || "observed";
  if (!MISSINGNESS.has(missingness)) throw new TypeError("Invalid missingness state.");
  const variables = list(input.variables) ? input.variables.map(v => ({ name:v.name, value:v.value ?? null, unit:v.unit ?? null, missingness:v.missingness || missingness })) : [];
  for (const v of variables) {
    if (!text(v.name) || !MISSINGNESS.has(v.missingness)) throw new TypeError("Each variable needs a name and valid missingness state.");
    if (v.missingness === "observed" && (v.value === null || v.value === undefined || (typeof v.value === "string" && !v.value.trim()) || !text(String(v.unit || "")))) throw new TypeError("Observed variables need a value and unit.");
    if (v.missingness !== "observed" && v.value !== null) throw new TypeError("Non-observed values must remain null; do not turn missingness into absence.");
  }
  const observation = { id:input.id || id("obs"), description:input.description, source_id:input.source_id, collected_at:input.collected_at || stamp(now), method:input.method || "", context:input.context || "", variables };
  uniqueId(inv.observations, observation.id, "observation");
  const next=clone(inv); next.observations.push(observation);
  return recordEvent(next,"observation_added",observation.id + " linked to " + observation.source_id,now);
}

export function addClaim(inv, input, now) {
  assertInvestigation(inv);
  const claim = {
    id:input.id || id("cl"), proposition:input.proposition || "", claim_type:input.claim_type || "hypothesis",
    status:"unreviewed", source_ids:list(input.source_ids)?[...new Set(input.source_ids)]:[],
    evidence_links:[], confidence_rationale:input.confidence_rationale || "Not assessed.",
    not_established:list(input.not_established)&&input.not_established.length?[...input.not_established]:["Not established yet."],
    population_or_system:input.population_or_system || inv.scope.population_or_system,
    time_window:input.time_window || inv.scope.time_window,
    alternative_explanations:list(input.alternative_explanations)?[...input.alternative_explanations]:[],
    falsification_condition:input.falsification_condition || "",
    next_test:input.next_test || "",
    revision_log:[{date:stamp(now),change:"Claim created in unreviewed state.",reason:"Initial entry; no promotion implied."}]
  };
  uniqueId(inv.claims,claim.id,"claim");
  if(!text(claim.proposition)||claim.proposition.trim().length<12) throw new TypeError("Claim proposition must be at least 12 characters.");
  if(!CLAIM_TYPES.has(claim.claim_type)) throw new TypeError("Invalid claim type.");
  for(const sourceId of claim.source_ids) requireRef(inv.sources,sourceId,"source");
  if(!text(claim.confidence_rationale)) throw new TypeError("Confidence rationale must be explicit.");
  if(!claim.not_established.length||claim.not_established.some(x=>!text(x))) throw new TypeError("State at least one thing not established.");
  if(!text(claim.next_test)) throw new TypeError("Claim needs a next discriminating test or observation.");
  const next=clone(inv); next.claims.push(claim);
  return recordEvent(next,"claim_created",claim.id + " entered as unreviewed",now);
}

export function linkEvidence(inv, claimId, input, now) {
  assertInvestigation(inv);
  const claim=inv.claims.find(x=>x.id===claimId); if(!claim) throw new Error("Unknown claim: "+claimId);
  requireRef(inv.sources,input.source_id,"source");
  if(!EVIDENCE_DIRECTIONS.has(input.direction)) throw new TypeError("Invalid evidence direction.");
  if(!text(input.exact_location)) throw new TypeError("Evidence link needs an exact supporting location.");
  const next=clone(inv); const target=next.claims.find(x=>x.id===claimId);
  if(target.evidence_links.some(x=>x.source_id===input.source_id&&x.exact_location===input.exact_location&&x.direction===input.direction)) throw new Error("This evidence link already exists.");
  target.evidence_links.push({source_id:input.source_id,direction:input.direction,exact_location:input.exact_location,excerpt_note:input.excerpt_note||"",scope_fit:input.scope_fit||"not_assessed"});
  if(!target.source_ids.includes(input.source_id)) target.source_ids.push(input.source_id);
  target.revision_log.push({date:stamp(now),change:"Evidence link added: "+input.direction+" / "+input.source_id,reason:"Evidence direction and locator recorded separately from claim status."});
  return recordEvent(next,"evidence_linked",claimId+" "+input.direction+" "+input.source_id,now);
}

export function addHypothesis(inv,input,now) {
  assertInvestigation(inv);
  const hypothesis={id:input.id||id("hyp"),statement:input.statement||"",status:"candidate",claim_ids:list(input.claim_ids)?[...input.claim_ids]:[],predictions:list(input.predictions)?[...input.predictions]:[],alternative_explanations:list(input.alternative_explanations)?[...input.alternative_explanations]:[],falsification_condition:input.falsification_condition||"",known_assumptions:list(input.known_assumptions)?[...input.known_assumptions]:[],created_at:stamp(now)};
  uniqueId(inv.hypotheses,hypothesis.id,"hypothesis");
  if(!text(hypothesis.statement)||hypothesis.statement.length<12) throw new TypeError("Hypothesis must be a meaningful, bounded statement.");
  if(!hypothesis.predictions.length||hypothesis.predictions.some(x=>!text(x))) throw new TypeError("A hypothesis needs at least one testable prediction.");
  if(!hypothesis.falsification_condition.trim()) throw new TypeError("A hypothesis needs an explicit falsification condition.");
  for(const claimId of hypothesis.claim_ids) requireRef(inv.claims,claimId,"claim");
  const next=clone(inv);next.hypotheses.push(hypothesis);
  return recordEvent(next,"hypothesis_added",hypothesis.id,now);
}

export function addTest(inv,input,now) {
  assertInvestigation(inv); requireRef(inv.hypotheses,input.hypothesis_id,"hypothesis");
  const test={id:input.id||id("test"),hypothesis_id:input.hypothesis_id,title:input.title||"",protocol:input.protocol||"",measurements:list(input.measurements)?[...input.measurements]:[],comparison:input.comparison||"",time_window:input.time_window||"",predeclared_support:input.predeclared_support||"",predeclared_disconfirmation:input.predeclared_disconfirmation||"",status:"planned",result:null,created_at:stamp(now)};
  uniqueId(inv.tests,test.id,"test");
  if(!text(test.title)||!text(test.protocol)||!test.measurements.length||test.measurements.some(x=>!text(x))||!text(test.comparison)||!text(test.predeclared_disconfirmation)) throw new TypeError("Test needs a title, protocol, measurable outcomes, comparison, and a predeclared disconfirmation condition.");
  const next=clone(inv);next.tests.push(test);
  return recordEvent(next,"test_planned",test.id+" for "+test.hypothesis_id,now);
}

export function recordTestResult(inv,testId,input,now) {
  assertInvestigation(inv); const test=inv.tests.find(x=>x.id===testId);if(!test)throw new Error("Unknown test: "+testId);
  if(test.status==="completed") throw new Error("Completed tests are immutable; create a follow-up test to preserve the prior result.");
  if(!text(input.outcome)||!text(input.interpretation)||!text(input.limitations)) throw new TypeError("Result needs an outcome, interpretation, and limitations.");
  const next=clone(inv);const target=next.tests.find(x=>x.id===testId);
  target.status="completed";target.result={recorded_at:stamp(now),outcome:input.outcome,interpretation:input.interpretation,limitations:input.limitations,source_ids:list(input.source_ids)?[...input.source_ids]:[]};
  for(const sourceId of target.result.source_ids)requireRef(next.sources,sourceId,"source");
  return recordEvent(next,"test_result_recorded",testId+" completed; result remains a recorded interpretation, not automatic claim promotion.",now);
}

export function addUnknown(inv,input,now) {
  assertInvestigation(inv);
  const item={id:input.id||id("unk"),question:input.question||"",missingness:input.missingness||"unknown",why_it_matters:input.why_it_matters||"",resolution_route:input.resolution_route||"",status:"open"};
  uniqueId(inv.unknowns,item.id,"unknown");
  if(!text(item.question)||!MISSINGNESS.has(item.missingness)||!text(item.why_it_matters))throw new TypeError("Unknown needs a question, valid missingness state, and explanation of why it matters.");
  const next=clone(inv);next.unknowns.push(item);
  return recordEvent(next,"unknown_recorded",item.id+" / "+item.missingness,now);
}

export function addDecision(inv,input,now) {
  assertInvestigation(inv);
  const decision={id:input.id||id("dec"),choice:input.choice||"",rationale:input.rationale||"",evidence_refs:list(input.evidence_refs)?[...input.evidence_refs]:[],uncertainty:input.uncertainty||"",review_trigger:input.review_trigger||"",reversible:input.reversible===true,status:"recorded",created_at:stamp(now)};
  uniqueId(inv.decisions,decision.id,"decision");
  if(!text(decision.choice)||!text(decision.rationale)||!text(decision.uncertainty)||!text(decision.review_trigger))throw new TypeError("Decision needs a choice, rationale, uncertainty, and review trigger.");
  for(const ref of decision.evidence_refs) if(!inv.sources.some(x=>x.id===ref)&&!inv.claims.some(x=>x.id===ref)&&!inv.tests.some(x=>x.id===ref)) throw new Error("Decision evidence reference not found: "+ref);
  const next=clone(inv);next.decisions.push(decision);
  return recordEvent(next,"decision_recorded",decision.id+" — "+decision.choice,now);
}

export function transitionClaim(inv,claimId,nextStatus,reason,now) {
  assertInvestigation(inv);const claim=inv.claims.find(x=>x.id===claimId);if(!claim)throw new Error("Unknown claim: "+claimId);
  if(!CLAIM_STATES.includes(nextStatus)||!text(reason))throw new TypeError("A valid next status and revision reason are required.");
  const allowedTransitions = {
    unreviewed: ["source-checked","revised","retired"],
    "source-checked": ["qualified","contested","revised","retired"],
    qualified: ["tested","corroborated","contested","revised","retired"],
    tested: ["corroborated","contested","revised","retired"],
    corroborated: ["contested","revised","retired"],
    contested: ["revised","retired"],
    revised: ["source-checked","qualified","tested","corroborated","contested","retired"],
    retired: []
  };
  if(!allowedTransitions[claim.status]?.includes(nextStatus))throw new Error("Invalid claim transition: "+claim.status+" → "+nextStatus+".");
  if(nextStatus==="source-checked"&&claim.source_ids.length===0)throw new Error("Source-check requires at least one linked source.");
  if(nextStatus==="qualified"&&claim.evidence_links.length===0)throw new Error("Qualification requires exact evidence links.");
  if(nextStatus==="tested"&&!inv.tests.some(t=>t.status==="completed"&&claim.source_ids.some(s=>t.result?.source_ids?.includes(s)))) throw new Error("Tested status requires a completed test with linked result sources; record the test first.");
  if(nextStatus==="corroborated"){
    const supporting=claim.evidence_links.filter(x=>x.direction==="supports");
    const groups=new Set(supporting.map(x=>inv.sources.find(s=>s.id===x.source_id)?.independence_group).filter(Boolean));
    if(groups.size<2)throw new Error("Corroborated requires supporting evidence from at least two independent source groups.");
  }
  if(nextStatus==="contested"&&!claim.evidence_links.some(x=>x.direction==="contradicts"))throw new Error("Contested requires at least one explicit contradictory evidence link.");
  const next=clone(inv);const target=next.claims.find(x=>x.id===claimId);
  target.status=nextStatus;target.revision_log.push({date:stamp(now),change:"Status changed from "+claim.status+" to "+nextStatus,reason});
  return recordEvent(next,"claim_status_changed",claimId+" "+claim.status+" → "+nextStatus+" / "+reason,now);
}

export function auditInvestigation(inv) {
  const errors=[],warnings=[],checks=[];
  try{assertInvestigation(inv)}catch(e){return {valid:false,errors:[e.message],warnings:[],checks:[]};}
  const ids=new Set();
  for(const group of ["sources","observations","claims","hypotheses","tests","decisions","unknowns","events"]){
    for(const item of inv[group]){if(!text(item.id))errors.push(group+": record has no ID");else if(ids.has(item.id))errors.push("duplicate record ID across investigation: "+item.id);else ids.add(item.id);}
  }
  for(const source of inv.sources){
    if(!text(source.title)||!safeLocator(source))errors.push("source "+source.id+": missing title or exact source locator");
    if(!text(source.independence_group))errors.push("source "+source.id+": missing independence group");
    if(!PRIVACY_STATES.has(source.privacy_status))errors.push("source "+source.id+": invalid privacy status");
    if(source.privacy_status!=="public_safe")warnings.push("source "+source.id+": privacy/reuse review is "+source.privacy_status);
  }
  for(const observation of inv.observations){
    if(!inv.sources.some(s=>s.id===observation.source_id))errors.push("observation "+observation.id+": dangling source");
    for(const v of observation.variables||[]){
      if(!MISSINGNESS.has(v.missingness))errors.push("observation "+observation.id+": invalid missingness");
      if(v.missingness==="observed"&&(v.value===null||v.value===undefined||(typeof v.value==="string"&&!v.value.trim())||!text(String(v.unit||""))))errors.push("observation "+observation.id+": observed variable missing value or unit");
      if(v.missingness!=="observed"&&v.value!==null)errors.push("observation "+observation.id+": missingness incorrectly encoded as a value");
    }
  }
  for(const claim of inv.claims){
    if(!CLAIM_TYPES.has(claim.claim_type))errors.push("claim "+claim.id+": invalid type");
    if(!CLAIM_STATES.includes(claim.status))errors.push("claim "+claim.id+": invalid review state");
    if(!text(claim.proposition)||!text(claim.confidence_rationale)||!text(claim.next_test)||!list(claim.not_established)||claim.not_established.length===0)errors.push("claim "+claim.id+": incomplete proposition, rationale, limits, or next test");
    for(const sourceId of claim.source_ids||[])if(!inv.sources.some(s=>s.id===sourceId))errors.push("claim "+claim.id+": dangling source "+sourceId);
    for(const link of claim.evidence_links||[]){
      if(!inv.sources.some(s=>s.id===link.source_id))errors.push("claim "+claim.id+": dangling evidence source "+link.source_id);
      if(!EVIDENCE_DIRECTIONS.has(link.direction)||!text(link.exact_location))errors.push("claim "+claim.id+": malformed evidence link");
    }
    if(claim.status!=="unreviewed"&&claim.evidence_links.length===0)warnings.push("claim "+claim.id+": promoted without explicit evidence links");
    if(claim.status==="corroborated"){
      const groups=new Set(claim.evidence_links.filter(x=>x.direction==="supports").map(x=>inv.sources.find(s=>s.id===x.source_id)?.independence_group).filter(Boolean));
      if(groups.size<2)errors.push("claim "+claim.id+": corroboration lacks two independent source groups");
    }
  }
  for(const hypothesis of inv.hypotheses){
    for(const claimId of hypothesis.claim_ids||[])if(!inv.claims.some(c=>c.id===claimId))errors.push("hypothesis "+hypothesis.id+": dangling claim "+claimId);
    if(!text(hypothesis.falsification_condition)||!hypothesis.predictions?.length)errors.push("hypothesis "+hypothesis.id+": missing prediction or falsification condition");
  }
  for(const test of inv.tests){
    if(!inv.hypotheses.some(h=>h.id===test.hypothesis_id))errors.push("test "+test.id+": dangling hypothesis");
    if(!["planned","completed"].includes(test.status))errors.push("test "+test.id+": invalid status");
    if(!text(test.title)||!text(test.protocol)||!list(test.measurements)||!test.measurements.length||!text(test.comparison)||!text(test.predeclared_disconfirmation))errors.push("test "+test.id+": incomplete preregistration");
    if(test.status==="completed"&&!test.result)errors.push("test "+test.id+": completed without result");
    if(test.result){if(!text(test.result.outcome)||!text(test.result.interpretation)||!text(test.result.limitations))errors.push("test "+test.id+": incomplete result record");for(const sourceId of test.result.source_ids||[])if(!inv.sources.some(s=>s.id===sourceId))errors.push("test "+test.id+": dangling result source "+sourceId);}
  }
  for(const decision of inv.decisions){
    if(!text(decision.choice)||!text(decision.rationale)||!text(decision.uncertainty)||!text(decision.review_trigger))errors.push("decision "+decision.id+": incomplete rationale, uncertainty, or review trigger");
    for(const ref of decision.evidence_refs||[])if(!inv.sources.some(s=>s.id===ref)&&!inv.claims.some(c=>c.id===ref)&&!inv.tests.some(t=>t.id===ref))errors.push("decision "+decision.id+": dangling evidence "+ref);
  }
  for(const unknown of inv.unknowns){if(!text(unknown.question)||!MISSINGNESS.has(unknown.missingness)||!text(unknown.why_it_matters))errors.push("unknown "+unknown.id+": incomplete question or missingness record");}
  const groups=new Map();
  for(const source of inv.sources){const group=source.independence_group||source.publisher||source.id;groups.set(group,(groups.get(group)||0)+1);}
  for(const [group,count] of groups)if(count>1)warnings.push("source group "+group+" has "+count+" records; do not count repeated outputs as independent corroboration");
  const linked=inv.claims.filter(c=>c.evidence_links.length>0).length;
  const falsifiable=inv.hypotheses.filter(h=>text(h.falsification_condition)&&h.predictions.length>0).length;
  const resultTests=inv.tests.filter(t=>t.status==="completed").length;
  checks.push({id:"source_provenance",status:inv.sources.length?"present":"missing",detail:inv.sources.length+" source records"});
  checks.push({id:"claim_evidence_links",status:inv.claims.length&&linked===inv.claims.length?"pass":inv.claims.length?"partial":"not_started",detail:linked+"/"+inv.claims.length+" claims have exact evidence links"});
  checks.push({id:"falsifiability",status:inv.hypotheses.length&&falsifiable===inv.hypotheses.length?"pass":inv.hypotheses.length?"partial":"not_started",detail:falsifiable+"/"+inv.hypotheses.length+" hypotheses have predictions and falsifiers"});
  checks.push({id:"test_results",status:resultTests?"present":"not_started",detail:resultTests+" completed tests"});
  checks.push({id:"reflexivity",status:text(inv.reflexivity?.instrument)&&text(inv.reflexivity?.blind_spots?.join(" "))?"present":"partial",detail:"Observer, instrument, assumptions and blind spots must be reviewed"});
  checks.push({id:"privacy",status:inv.sources.every(s=>s.privacy_status==="public_safe")?"pass":"review",detail:inv.sources.filter(s=>s.privacy_status!=="public_safe").length+" sources require privacy review"});
  return {valid:errors.length===0,errors,warnings,checks,summary:{sources:inv.sources.length,observations:inv.observations.length,claims:inv.claims.length,hypotheses:inv.hypotheses.length,tests:inv.tests.length,completed_tests:resultTests,decisions:inv.decisions.length,unknowns:inv.unknowns.length,events:inv.events.length}};
}

export function createSyntheticExample() {
  const caseUrl = "https://github.com/MirrorCartographer/MirrorCartographer/blob/main/site/cases/001-the-person-who-was-never-sick-enough/index.html";
  let inv = createInvestigation({
    id: "MC-CASE-001-SYNTHETIC",
    title: "Case 001 — The Person Who Was Never Sick Enough",
    question: "How did six narrow records become an administrative conclusion, and what evidence is still missing?",
    domain: "veteran-access",
    created_at: "2026-11-07T12:00:00.000Z",
    scope: {
      population_or_system: "Entirely fictional administrative case involving Mara Vale",
      context: "Six fictional records across primary care, urgent care, a lab portal, specialty care, and an administrative packet",
      time_window: "Six weeks",
      outcome: "Whether the administrative summary accurately represents the submitted record set"
    },
    reflexivity: {
      territory: "The fictional six-record administrative case and its packet assembly process",
      observer_standpoint: "A reviewer reading only the six supplied synthetic records",
      instrument: "Source-linked investigation desk and packet reconstruction",
      instrument_version: "MC Investigation Engine v1",
      assumptions: ["The six records are the complete synthetic case file for this exercise."],
      selection_and_exclusions: "No original submission manifest, receipt log, full lab value, or governing evidence rule is included.",
      transformations: ["Narrative record excerpts are entered as source-linked summaries."],
      blind_spots: ["The synthetic case cannot establish real-world prevalence, causality, or institutional intent."],
      observer_effect: "plausible",
      revision_trigger: "Revisit if the original manifest, receipt log, actual lab result, or governing rule becomes available."
    }
  });
  const records = [
    ["SRC-CASE-001-R01","R-01 — Initial report","Primary care","04 March · initial report"],
    ["SRC-CASE-001-R02","R-02 — Acute evaluation","Urgent care","09 March · acute evaluation"],
    ["SRC-CASE-001-R03","R-03 — Screening results","Lab portal","12 March · screening result"],
    ["SRC-CASE-001-R04","R-04 — Consultation summary","Specialist","20 March · consultation summary"],
    ["SRC-CASE-001-R05","R-05 — Functional impact follow-up","Primary care","02 April · follow-up note"],
    ["SRC-CASE-001-R06","R-06 — Administrative closure extract","Administrative summary","10 April · closure extract"]
  ];
  for (const [sourceId,title,publisher,locator] of records) {
    inv = addSource(inv,{
      id:sourceId,title,publisher,source_type:"synthetic case record",url:caseUrl,
      exact_location:locator,independence_group:"CASE-001-SYNTHETIC-RECORD-SET",
      privacy_status:"public_safe",
      limitations:["Entirely fictional demonstration record; not a real patient, institution, medical record, or empirical finding."]
    });
  }
  const observations = [
    {id:"OBS-CASE-001-R01",source_id:"SRC-CASE-001-R01",description:"The fictional initial report describes fatigue, intermittent dizziness, diffuse aches, and approximately five weeks of symptoms.",variables:[{name:"reported_symptom_duration",value:5,unit:"weeks",missingness:"observed"}]},
    {id:"OBS-CASE-001-R02",source_id:"SRC-CASE-001-R02",description:"The urgent-care record documents no acute distress and a grossly nonfocal screening examination at one encounter.",variables:[{name:"acute_distress_at_encounter",value:"not_documented",unit:"recorded finding",missingness:"observed"}]},
    {id:"OBS-CASE-001-R03",source_id:"SRC-CASE-001-R03",description:"The portal reports one result outside its reference range, but the actual value and interpretation are not included in the supplied record.",variables:[{name:"out_of_range_flag",value:"present",unit:"portal flag",missingness:"observed"},{name:"actual_result_value",value:null,unit:null,missingness:"not_collected"}]},
    {id:"OBS-CASE-001-R04",source_id:"SRC-CASE-001-R04",description:"The specialist documents no focal deficit on the examination performed that day.",variables:[{name:"focal_deficit_at_exam",value:"not_found",unit:"examination finding",missingness:"observed"}]},
    {id:"OBS-CASE-001-R05",source_id:"SRC-CASE-001-R05",description:"The follow-up note records reduced work hours and assistance with routine tasks on worse days.",variables:[{name:"functional_impact_recorded",value:"yes",unit:"documented report",missingness:"observed"}]},
    {id:"OBS-CASE-001-R06",source_id:"SRC-CASE-001-R06",description:"The closure extract states that the R-05 functional-impact note is absent from the packet index.",variables:[{name:"R05_listed_in_packet_index",value:"no",unit:"index status",missingness:"observed"}]}
  ];
  for (const observation of observations) inv = addObservation(inv,observation);
  inv = addClaim(inv,{
    id:"CL-CASE-001-ACUTE",
    proposition:"The fictional urgent-care record reports no acute distress at the single encounter on 09 March.",
    claim_type:"source-reported-finding",
    source_ids:["SRC-CASE-001-R02"],
    confidence_rationale:"Directly stated in one synthetic encounter record; scope is limited to that visit.",
    not_established:["The person's overall health status","The absence of symptoms outside that visit","A diagnosis or eligibility determination"],
    population_or_system:"Fictional case subject at one urgent-care encounter",
    time_window:"09 March",
    alternative_explanations:["Symptoms may fluctuate between encounters."],
    next_test:"Compare the point-in-time record with the longitudinal symptom and functional history."
  });
  inv = linkEvidence(inv,"CL-CASE-001-ACUTE",{source_id:"SRC-CASE-001-R02",direction:"supports",exact_location:"R-02 · acute evaluation"});
  inv = addClaim(inv,{
    id:"CL-CASE-001-OMISSION",
    proposition:"The fictional administrative closure extract's packet index does not list the functional-impact follow-up note R-05.",
    claim_type:"inference",
    source_ids:["SRC-CASE-001-R05","SRC-CASE-001-R06"],
    confidence_rationale:"The supplied R-05 record documents functional impact and R-06 explicitly says that record is absent from the packet index; the original submission manifest is unavailable.",
    not_established:["Whether R-05 was submitted","Whether R-05 was received but not indexed","Why the record is absent","Whether the omission affected the decision"],
    population_or_system:"Fictional six-record administrative case",
    time_window:"02–10 April",
    alternative_explanations:["R-05 may have been submitted separately.","The closure extract may summarize a partial packet.","An indexing or transfer error may have occurred."],
    falsification_condition:"An original manifest and receipt log show that R-05 was included in the indexed and reviewed packet.",
    next_test:"Compare the original submission manifest, receipt log, packet index, and governing evidence rule."
  });
  inv = linkEvidence(inv,"CL-CASE-001-OMISSION",{source_id:"SRC-CASE-001-R05",direction:"supports",exact_location:"R-05 · functional impact paragraph"});
  inv = linkEvidence(inv,"CL-CASE-001-OMISSION",{source_id:"SRC-CASE-001-R06",direction:"supports",exact_location:"R-06 · packet index omission statement"});
  inv = addHypothesis(inv,{
    id:"HYP-CASE-001-PACKET",
    statement:"The functional-impact note R-05 was omitted from the packet index before the fictional administrative closure.",
    claim_ids:["CL-CASE-001-OMISSION"],
    predictions:["The original packet index will contain no R-05 entry.","The receipt log will either lack R-05 or show a separate attachment path."],
    alternative_explanations:["R-05 was received but the summary used a partial index.","R-05 was stored as a separate attachment.","The closure summary was generated before the follow-up note arrived."],
    falsification_condition:"The original receipt log confirms R-05 was received, indexed, and reviewed before closure.",
    known_assumptions:["The displayed six records are the complete synthetic file supplied for this exercise."]
  });
  inv = addTest(inv,{
    id:"TST-CASE-001-MANIFEST",
    hypothesis_id:"HYP-CASE-001-PACKET",
    title:"Reconstruct the submission manifest and receipt sequence",
    protocol:"Compare the original submitted-record manifest, receipt log, packet index, and closure timestamp. Preserve document identifiers and timestamps; do not infer intent from absence alone.",
    measurements:["R-05 document identifier presence","Receipt timestamp","Packet-index inclusion","Review disposition"],
    comparison:"Submitted records versus received records versus indexed and reviewed records",
    time_window:"02–10 April",
    predeclared_support:"R-05 is absent from the original packet index and no receipt record shows that it was separately received and reviewed.",
    predeclared_disconfirmation:"The receipt log confirms R-05 was received, indexed, and reviewed before closure."
  });
  inv = addUnknown(inv,{id:"UNK-CASE-001-LAB",question:"What was the actual value and clinical interpretation of the out-of-range screening result?",missingness:"not_collected",why_it_matters:"A portal flag alone does not establish clinical relevance or whether the administrative rule treated it as qualifying evidence.",resolution_route:"Retrieve the original laboratory report and clinician interpretation."});
  inv = addUnknown(inv,{id:"UNK-CASE-001-MANIFEST",question:"Was R-05 submitted and received before the administrative closure?",missingness:"unknown",why_it_matters:"Without the manifest and receipt log, the reason for the packet-index omission cannot be established.",resolution_route:"Obtain the original submission manifest, receipt log, and packet index."});
  inv = addUnknown(inv,{id:"UNK-CASE-001-RULE",question:"What exact evidence rule governed the fictional administrative decision?",missingness:"not_collected",why_it_matters:"The phrase qualifying objective abnormality cannot be evaluated without the rule's wording and scope.",resolution_route:"Retrieve the governing fictional program rule and version date."});
  inv = addDecision(inv,{
    id:"DEC-CASE-001-OPEN",
    choice:"Keep the cause of the packet-index omission unresolved and request the manifest, receipt log, original lab report, and governing rule before attributing responsibility.",
    rationale:"The supplied records support a traceable omission in the closure index but do not establish submission, receipt, review, intent, or the effect on the outcome.",
    evidence_refs:["CL-CASE-001-OMISSION","TST-CASE-001-MANIFEST"],
    uncertainty:"The case is synthetic and the original manifest, receipt log, lab value, and governing rule are not supplied.",
    review_trigger:"Revisit when any original manifest, receipt, laboratory, or rule record is added.",
    reversible:true
  });
  return inv;
}

function resolveGateSpec(gate, registry) {
  let spec = registry?.gates?.[gate];
  const seen = new Set([gate]);
  while (spec && spec.$ref) {
    if (seen.has(spec.$ref)) return null;
    seen.add(spec.$ref);
    spec = registry.gates[spec.$ref];
  }
  return spec || null;
}
function validateIntegratedPacket(packet, spec) {
  const errors = [];
  for (const field of spec.required_packet_fields || []) if (!(field in packet)) errors.push("missing required field " + field);
  for (const label of spec.required_labels || []) if (!packet[label]) errors.push("empty label " + label);
  if (!(spec.allowed_decisions || []).includes(packet.decision)) errors.push("invalid decision " + packet.decision);
  const blocked = (packet.boundary_flags || []).filter(flag => (spec.blocked_boundary_flags || []).includes(flag));
  if (blocked.length && packet.decision === "pass") errors.push("blocked flags passed: " + blocked.join(", "));
  if (!Array.isArray(packet.observations) || !packet.observations.length) errors.push("observations required");
  let observedCount = 0;
  for (let index = 0; index < (packet.observations || []).length; index += 1) {
    const observation = packet.observations[index];
    if (!MISSINGNESS.has(observation.missingness)) errors.push("observation " + index + " has invalid missingness");
    if (observation.missingness === "observed") {
      observedCount += 1;
      for (const key of ["variable","value","unit"]) if (!(key in observation)) errors.push("observed observation " + index + " missing " + key);
    } else if ([0,false,"absent","none"].includes(observation.value)) {
      errors.push("missingness collapsed into absence at observation " + index);
    }
  }
  if (packet.decision === "pass" && observedCount === 0) errors.push("pass requires at least one observed variable");
  if (packet.decision === "pass" && !(packet.measurable_variables || []).length) errors.push("pass requires measurable variables");
  return errors;
}

/**
 * Runs the browser-safe integration registry. These are structural routing checks,
 * not the specialized domain validators in tools/* and not scientific appraisal.
 */
export function runIntegratedGateChecks(inv, registry) {
  const audit = auditInvestigation(inv);
  const gates = Object.keys(registry?.gates || {});
  if (!gates.length) throw new TypeError("Investigation gate registry is missing or empty.");
  const flatVariables = (inv.observations || []).flatMap(observation =>
    (observation.variables || []).map(variable => ({ ...variable, observation_id: observation.id }))
  );
  const observed = flatVariables.filter(variable => variable.missingness === "observed");
  const contradictionCount = (inv.claims || []).reduce((sum, claim) => sum + (claim.evidence_links || []).filter(link => link.direction === "contradicts").length, 0);
  const allSourcesPublic = inv.sources.length > 0 && inv.sources.every(source => source.privacy_status === "public_safe");
  const claimsLinked = inv.claims.length > 0 && inv.claims.every(claim => claim.evidence_links?.length > 0);
  const hasFalsifiableHypothesis = inv.hypotheses.some(hypothesis => hypothesis.predictions?.length > 0 && text(hypothesis.falsification_condition));
  const hasTestPlan = inv.tests.length > 0;
  const nextAction = inv.unknowns.find(item => item.status === "open")?.resolution_route ||
    (!inv.sources.length ? "Add a source with a recoverable locator." :
    !observed.length ? "Add a source-linked observation with explicit missingness and units." :
    !claimsLinked ? "Attach exact evidence locations to every claim." :
    !hasFalsifiableHypothesis ? "Add competing hypotheses with distinct predictions and falsification conditions." :
    !hasTestPlan ? "Pre-register a test with measures, comparison, and disconfirmation." :
    "Review the domain-specific gates and record the next result.");
  const observations = flatVariables.length ? flatVariables.map(variable => ({
    variable: variable.name, value: variable.missingness === "observed" ? variable.value : null,
    unit: variable.missingness === "observed" ? variable.unit : null,
    missingness: variable.missingness
  })) : [{ variable: "unrecorded_observation", value: null, unit: null, missingness: "not_collected" }];
  const decision = !audit.valid ? "reject" :
    contradictionCount ? "route_to_contradiction_ledger" :
    (!allSourcesPublic || !observed.length || !claimsLinked || !hasFalsifiableHypothesis || !hasTestPlan) ? "needs_more_evidence" :
    "pass";
  const packet = {
    route: "investigation_review",
    source_status: inv.sources.length ? "source-linked" : "no-source-records",
    claim_status: inv.claims.length ? [...new Set(inv.claims.map(claim => claim.status))].join(",") : "no-claims",
    privacy_status: allSourcesPublic ? "public_safe" : "review_required_or_no_sources",
    missingness: "states present: " + [...new Set(observations.map(observation => observation.missingness))].join(", ") + "; missing is not absence",
    revision_reason: inv.events.at(-1)?.detail || "No revision recorded yet.",
    implementation_status: "local-first investigation engine v1",
    testability: "browser structural audit against the canonical integration registry",
    falsification_route: "contradictory evidence links, pre-registered disconfirmation criteria, or source/claim revision",
    measurable_variables: [...new Set(observed.map(variable => variable.name))],
    next_executable_action: nextAction,
    observations,
    boundary_flags: [],
    decision
  };
  const results = gates.map(gate => {
    const spec = resolveGateSpec(gate, registry);
    const errors = spec ? validateIntegratedPacket({ ...packet, gate, packet_id: "mc." + gate + "." + inv.id }, spec) : ["unknown or invalid gate specification"];
    if (!audit.valid) errors.push(...audit.errors.map(error => "investigation structural audit: " + error));
    return { gate, decision, valid: errors.length === 0, errors };
  });
  const invalid = results.filter(result => !result.valid);
  return {
    registry_id: registry.suite_id || "unnamed_registry",
    registry_source_status: registry.source_status || "not_declared",
    total: results.length,
    valid_count: results.length - invalid.length,
    invalid_count: invalid.length,
    decision,
    structural_audit: audit,
    results
  };
}

export function exportInvestigation(inv,{publicSafeOnly=false,privacyReviewed=false}={}) {
  const audit=auditInvestigation(inv);if(!audit.valid)throw new Error("Cannot export an invalid investigation: "+audit.errors.join("; "));
  if(publicSafeOnly&&!privacyReviewed)throw new Error("Public-safe export requires explicit review of every free-text field for private, identifying, or sensitive information.");
  if(publicSafeOnly&&inv.sources.some(s=>s.privacy_status!=="public_safe"))throw new Error("Public-safe export blocked: every source must be explicitly marked public_safe.");
  return JSON.stringify({schema:SCHEMA,schema_version:SCHEMA_VERSION,exported_at:new Date().toISOString(),investigation:inv,audit},null,2);
}
export function importInvestigation(payload) {
  const parsed=typeof payload==="string"?JSON.parse(payload):clone(payload);
  if(parsed?.schema!==SCHEMA||parsed?.schema_version!==SCHEMA_VERSION||!parsed.investigation)throw new TypeError("Unsupported investigation export.");
  const audit=auditInvestigation(parsed.investigation);if(!audit.valid)throw new TypeError("Imported investigation failed validation: "+audit.errors.join("; "));
  return clone(parsed.investigation);
}
