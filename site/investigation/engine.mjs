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
  const safeUrl = text(url) && /^https?:\/\//i.test(url);
  const safePath = text(path) && !/(^|\/)\.\.(\/|$)/.test(path);
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
    if (v.missingness === "observed" && (v.value === null || v.value === undefined || !text(String(v.unit || "")))) throw new TypeError("Observed variables need a value and unit.");
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
    if(!PRIVACY_STATES.has(source.privacy_status))errors.push("source "+source.id+": invalid privacy status");
    if(source.privacy_status!=="public_safe")warnings.push("source "+source.id+": privacy/reuse review is "+source.privacy_status);
  }
  for(const observation of inv.observations){
    if(!inv.sources.some(s=>s.id===observation.source_id))errors.push("observation "+observation.id+": dangling source");
    for(const v of observation.variables||[])if(!MISSINGNESS.has(v.missingness))errors.push("observation "+observation.id+": invalid missingness");
  }
  for(const claim of inv.claims){
    if(!CLAIM_TYPES.has(claim.claim_type))errors.push("claim "+claim.id+": invalid type");
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
    if(test.status==="completed"&&!test.result)errors.push("test "+test.id+": completed without result");
  }
  for(const decision of inv.decisions){
    for(const ref of decision.evidence_refs||[])if(!inv.sources.some(s=>s.id===ref)&&!inv.claims.some(c=>c.id===ref)&&!inv.tests.some(t=>t.id===ref))errors.push("decision "+decision.id+": dangling evidence "+ref);
  }
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

export function exportInvestigation(inv,{publicSafeOnly=false}={}) {
  const audit=auditInvestigation(inv);if(!audit.valid)throw new Error("Cannot export an invalid investigation: "+audit.errors.join("; "));
  if(publicSafeOnly&&inv.sources.some(s=>s.privacy_status!=="public_safe"))throw new Error("Public-safe export blocked: every source must be explicitly marked public_safe.");
  return JSON.stringify({schema:SCHEMA,schema_version:SCHEMA_VERSION,exported_at:new Date().toISOString(),investigation:inv,audit},null,2);
}
export function importInvestigation(payload) {
  const parsed=typeof payload==="string"?JSON.parse(payload):clone(payload);
  if(parsed?.schema!==SCHEMA||parsed?.schema_version!==SCHEMA_VERSION||!parsed.investigation)throw new TypeError("Unsupported investigation export.");
  const audit=auditInvestigation(parsed.investigation);if(!audit.valid)throw new TypeError("Imported investigation failed validation: "+audit.errors.join("; "));
  return clone(parsed.investigation);
}
