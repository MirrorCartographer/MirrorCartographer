import { createHash, timingSafeEqual } from 'node:crypto';

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} must be a non-empty string`);
  return value.trim();
}

function fullSha(value, field) {
  const normalized = requiredString(value, field).toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(normalized)) throw new TypeError(`${field} must be a full 40-character git SHA`);
  return normalized;
}

function digest(value, field) {
  const normalized = requiredString(value, field).toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalized)) throw new TypeError(`${field} must be a SHA-256 digest`);
  return normalized;
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sameDigest(a, b) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createMaterializationRequest({
  sourceCommit,
  sourceDigest,
  candidateDigest,
  canonicalPath = 'operations/ACTIVE_QUEUE.json',
  actor,
  workflow,
  expiresAt,
  operation = 'replace_canonical_queue'
}) {
  const request = {
    schema_version: '1.0.0',
    operation: requiredString(operation, 'operation'),
    canonical_path: requiredString(canonicalPath, 'canonicalPath'),
    source_commit: fullSha(sourceCommit, 'sourceCommit'),
    source_digest: digest(sourceDigest, 'sourceDigest'),
    candidate_digest: digest(candidateDigest, 'candidateDigest'),
    actor: requiredString(actor, 'actor'),
    workflow: requiredString(workflow, 'workflow'),
    expires_at: requiredString(expiresAt, 'expiresAt')
  };
  return { ...request, request_digest: sha256(stableJson(request)) };
}

export function evaluateMaterializationAuthority({ request, candidate, policy, now = new Date() }) {
  const reasons = [];
  if (!request || !candidate || !policy) throw new TypeError('request, candidate, and policy are required');

  const allowedActors = new Set(policy.allowed_actors || []);
  const allowedWorkflows = new Set(policy.allowed_workflows || []);
  const allowedPaths = new Set(policy.allowed_canonical_paths || ['operations/ACTIVE_QUEUE.json']);

  if (policy.enabled !== true) reasons.push('policy_disabled');
  if (request.operation !== 'replace_canonical_queue') reasons.push('operation_not_allowed');
  if (!allowedPaths.has(request.canonical_path)) reasons.push('canonical_path_not_allowed');
  if (!allowedActors.has(request.actor)) reasons.push('actor_not_allowed');
  if (!allowedWorkflows.has(request.workflow)) reasons.push('workflow_not_allowed');
  if (candidate.mutation_performed !== false) reasons.push('candidate_already_mutated_state');
  if (candidate.snapshot_native !== true) reasons.push('candidate_not_snapshot_native');
  if (candidate.materialization_allowed !== false) reasons.push('candidate_claims_own_authority');
  if ((candidate.rejected_files || []).length > 0) reasons.push('candidate_has_rejected_files');
  if ((candidate.orphan_projections || []).length > 0) reasons.push('candidate_has_orphan_projections');
  if ((candidate.items || []).some((item) => item.materialization_allowed !== true)) reasons.push('candidate_contains_blocked_item');

  try {
    if (fullSha(request.source_commit, 'request.source_commit') !== fullSha(candidate.source_commit, 'candidate.source_commit')) reasons.push('source_commit_mismatch');
    if (!sameDigest(digest(request.source_digest, 'request.source_digest'), digest(candidate.source_digest, 'candidate.source_digest'))) reasons.push('source_digest_mismatch');
    if (!sameDigest(digest(request.candidate_digest, 'request.candidate_digest'), digest(candidate.candidate_digest, 'candidate.candidate_digest'))) reasons.push('candidate_digest_mismatch');
  } catch (error) {
    reasons.push(`invalid_binding:${error.message}`);
  }

  const expiry = Date.parse(request.expires_at);
  if (!Number.isFinite(expiry)) reasons.push('invalid_expiry');
  else if (expiry <= now.getTime()) reasons.push('request_expired');

  const requestCore = { ...request };
  delete requestCore.request_digest;
  const expectedRequestDigest = sha256(stableJson(requestCore));
  if (typeof request.request_digest !== 'string' || !sameDigest(expectedRequestDigest, request.request_digest.toLowerCase())) reasons.push('request_digest_mismatch');

  return {
    schema_version: '1.0.0',
    decision: reasons.length === 0 ? 'authorized' : 'denied',
    authorized: reasons.length === 0,
    reasons,
    mutation_performed: false,
    bound_source_commit: request.source_commit,
    bound_source_digest: request.source_digest,
    bound_candidate_digest: request.candidate_digest,
    review_route: reasons.length === 0
      ? 'A separate mutation executor may replace only the bound canonical path with the exact authorized candidate bytes, then record the resulting commit and evidence.'
      : 'Resolve every denial reason and issue a new expiring request. This evaluator never mutates canonical state.'
  };
}
