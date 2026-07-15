const REQUIRED_CLAIM_FIELDS = [
  'claim_id','epistemic_class','statement','source_locator','source_identity','scope','privacy_class','falsification_route'
];
const REQUIRED_TRANSITION_FIELDS = [
  'transition_id','from_claim_id','to_claim_id','transition_type','rationale','evidence','authority_class','created_at','falsification_route'
];
const EPISTEMIC_CLASSES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const TRANSITION_TYPES = new Set(['accepted','challenged','narrowed','superseded','resolved']);

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be an object`);
}
function requireFields(value, fields, label) {
  for (const field of fields) if (!(field in value)) throw new Error(`${label} missing ${field}`);
}
function rank(authority, order) {
  const index = order.indexOf(authority);
  if (index < 0) throw new Error(`unknown authority_class: ${authority}`);
  return index;
}
function normalizeScope(scope) {
  if (!Array.isArray(scope) || scope.some(x => typeof x !== 'string' || !x)) throw new Error('scope must be a non-empty string array');
  return new Set(scope);
}
function isSubset(a, b) { for (const value of a) if (!b.has(value)) return false; return true; }

export function validateClaimTransitionGraph(graph, options = {}) {
  assertObject(graph, 'graph');
  const claims = graph.claims;
  const transitions = graph.transitions;
  if (!Array.isArray(claims) || !Array.isArray(transitions)) throw new TypeError('claims and transitions must be arrays');
  const authorityOrder = options.authorityOrder ?? ['inference','repository_record','decision_log','user_directive','governance'];
  const claimById = new Map();
  for (const claim of claims) {
    assertObject(claim, 'claim'); requireFields(claim, REQUIRED_CLAIM_FIELDS, `claim ${claim.claim_id ?? '<unknown>'}`);
    if (claimById.has(claim.claim_id)) throw new Error(`duplicate claim_id: ${claim.claim_id}`);
    if (!EPISTEMIC_CLASSES.has(claim.epistemic_class)) throw new Error(`invalid epistemic_class: ${claim.epistemic_class}`);
    normalizeScope(claim.scope);
    claimById.set(claim.claim_id, Object.freeze(structuredClone(claim)));
  }
  const transitionById = new Map();
  const adjacency = new Map([...claimById.keys()].map(id => [id, []]));
  for (const transition of transitions) {
    assertObject(transition, 'transition'); requireFields(transition, REQUIRED_TRANSITION_FIELDS, `transition ${transition.transition_id ?? '<unknown>'}`);
    if (transitionById.has(transition.transition_id)) throw new Error(`duplicate transition_id: ${transition.transition_id}`);
    if (!TRANSITION_TYPES.has(transition.transition_type)) throw new Error(`invalid transition_type: ${transition.transition_type}`);
    const from = claimById.get(transition.from_claim_id); const to = claimById.get(transition.to_claim_id);
    if (!from || !to) throw new Error(`dangling transition: ${transition.transition_id}`);
    if (from.claim_id === to.claim_id) throw new Error(`self transition: ${transition.transition_id}`);
    const fromScope = normalizeScope(from.scope); const toScope = normalizeScope(to.scope);
    const expands = !isSubset(toScope, fromScope);
    if (expands) {
      if (!transition.evidence || transition.evidence.exhaustive_coverage !== true) throw new Error(`scope expansion lacks exhaustive evidence: ${transition.transition_id}`);
      if (rank(transition.authority_class, authorityOrder) < rank(from.source_identity.authority_class, authorityOrder)) throw new Error(`scope expansion lacks authority: ${transition.transition_id}`);
    }
    if (transition.transition_type === 'narrowed' && !isSubset(toScope, fromScope)) throw new Error(`narrowed transition expands scope: ${transition.transition_id}`);
    if (transition.transition_type === 'superseded' && !to.statement.trim()) throw new Error(`supersession missing replacement claim: ${transition.transition_id}`);
    transitionById.set(transition.transition_id, Object.freeze(structuredClone(transition)));
    adjacency.get(from.claim_id).push(to.claim_id);
  }
  const visiting = new Set(); const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`cycle detected at claim: ${id}`);
    if (visited.has(id)) return;
    visiting.add(id); for (const next of adjacency.get(id)) visit(next); visiting.delete(id); visited.add(id);
  }
  for (const id of claimById.keys()) visit(id);
  return Object.freeze({ valid: true, claim_count: claimById.size, transition_count: transitionById.size, retained_claim_ids: Object.freeze([...claimById.keys()]) });
}
