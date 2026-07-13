import { createHash, timingSafeEqual } from 'node:crypto';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || !/^[0-9a-f]{64}$/i.test(left) || !/^[0-9a-f]{64}$/i.test(right)) return false;
  const a = Buffer.from(left, 'hex');
  const b = Buffer.from(right, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} must be a non-empty string`);
  return value.trim();
}

function canonicalQueueBytes(candidate) {
  if (!candidate || !Array.isArray(candidate.items)) throw new TypeError('candidate.items must be an array');
  const queue = {
    schema_version: requiredString(candidate.canonical_schema_version || '1.0.0', 'candidate.canonical_schema_version'),
    updated_at: requiredString(candidate.generated_at, 'candidate.generated_at'),
    items: candidate.items
  };
  return `${JSON.stringify(queue)}\n`;
}

export function buildMaterializationPlan({ authorityDecision, request, candidate, replayLedger = [] }) {
  const reasons = [];
  if (!authorityDecision || !request || !candidate) throw new TypeError('authorityDecision, request, and candidate are required');
  if (!Array.isArray(replayLedger)) throw new TypeError('replayLedger must be an array');

  if (authorityDecision.authorized !== true || authorityDecision.decision !== 'authorized') reasons.push('authority_not_granted');
  if (authorityDecision.mutation_performed !== false) reasons.push('authority_decision_already_mutated');
  if (request.canonical_path !== 'operations/ACTIVE_QUEUE.json') reasons.push('canonical_path_not_allowed');
  if (request.operation !== 'replace_canonical_queue') reasons.push('operation_not_allowed');
  if (candidate.mutation_performed !== false) reasons.push('candidate_already_mutated');

  const bindings = [
    ['source_commit', authorityDecision.bound_source_commit, request.source_commit, candidate.source_commit],
    ['source_digest', authorityDecision.bound_source_digest, request.source_digest, candidate.source_digest],
    ['candidate_digest', authorityDecision.bound_candidate_digest, request.candidate_digest, candidate.candidate_digest]
  ];
  for (const [name, decisionValue, requestValue, candidateValue] of bindings) {
    const equal = name === 'source_commit'
      ? decisionValue === requestValue && requestValue === candidateValue
      : safeEqualHex(decisionValue, requestValue) && safeEqualHex(requestValue, candidateValue);
    if (!equal) reasons.push(`${name}_binding_mismatch`);
  }

  const requestDigest = requiredString(request.request_digest, 'request.request_digest').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(requestDigest)) reasons.push('invalid_request_digest');
  if (replayLedger.some((entry) => entry?.request_digest === requestDigest && entry?.status === 'committed')) reasons.push('request_replayed');

  const bytes = canonicalQueueBytes(candidate);
  const bytesDigest = sha256(bytes);
  const planId = sha256(JSON.stringify({ request_digest: requestDigest, canonical_path: request.canonical_path, canonical_bytes_sha256: bytesDigest }));

  return {
    schema_version: '1.0.0',
    plan_id: planId,
    decision: reasons.length === 0 ? 'ready' : 'blocked',
    ready: reasons.length === 0,
    reasons,
    mutation_performed: false,
    request_digest: requestDigest,
    canonical_path: request.canonical_path,
    canonical_bytes: bytes,
    canonical_bytes_sha256: bytesDigest,
    expected_source_commit: request.source_commit,
    review_route: reasons.length === 0
      ? 'Execute with a protected writer that verifies the repository still equals expected_source_commit, writes canonical_bytes exactly once, and returns the resulting commit.'
      : 'Resolve every blocker and issue a new authorization request. Never bypass replay or binding checks.'
  };
}

export async function executeMaterializationPlan({ plan, currentCommit, replaceCanonical }) {
  if (!plan || typeof replaceCanonical !== 'function') throw new TypeError('plan and replaceCanonical are required');
  if (plan.ready !== true || plan.decision !== 'ready') throw new Error('materialization plan is not ready');
  if (currentCommit !== plan.expected_source_commit) throw new Error('repository_head_moved');
  if (!safeEqualHex(sha256(plan.canonical_bytes), plan.canonical_bytes_sha256)) throw new Error('canonical_bytes_digest_mismatch');

  const result = await replaceCanonical({
    path: plan.canonical_path,
    bytes: plan.canonical_bytes,
    expectedSourceCommit: plan.expected_source_commit,
    planId: plan.plan_id,
    requestDigest: plan.request_digest
  });
  if (!result || !/^[0-9a-f]{40}$/i.test(result.commit_sha || '')) throw new Error('writer_did_not_return_commit');

  return {
    schema_version: '1.0.0',
    plan_id: plan.plan_id,
    request_digest: plan.request_digest,
    canonical_path: plan.canonical_path,
    canonical_bytes_sha256: plan.canonical_bytes_sha256,
    source_commit: plan.expected_source_commit,
    resulting_commit: result.commit_sha.toLowerCase(),
    status: 'committed',
    mutation_performed: true
  };
}
