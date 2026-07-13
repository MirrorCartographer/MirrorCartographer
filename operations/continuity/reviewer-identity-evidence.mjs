import { createHash } from 'node:crypto';

const SHA40 = /^[0-9a-f]{40}$/;
const SHA64 = /^[0-9a-f]{64}$/;
const SUBJECT = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{2,199}$/;

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256Json(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

export function evaluateReviewerIdentityEvidence({ evidence, authorization, proposal, policy, now }) {
  const errors = [];
  if (!evidence || typeof evidence !== 'object') errors.push('evidence_required');
  if (!authorization || typeof authorization !== 'object') errors.push('authorization_required');
  if (!proposal || typeof proposal !== 'object') errors.push('proposal_required');
  if (!policy || typeof policy !== 'object') errors.push('policy_required');
  if (errors.length) return { valid: false, errors, adoption_permitted: false };

  if (evidence.schema_version !== '1.0.0') errors.push('evidence_schema_invalid');
  if (evidence.kind !== 'reviewer_identity_evidence') errors.push('evidence_kind_invalid');
  if (!SUBJECT.test(evidence.reviewer_subject ?? '')) errors.push('reviewer_subject_invalid');
  if (!SUBJECT.test(evidence.identity_provider ?? '')) errors.push('identity_provider_invalid');
  if (!SUBJECT.test(evidence.verifier_identity ?? '')) errors.push('verifier_identity_invalid');
  if (!SHA64.test(evidence.verifier_artifact_sha256 ?? '')) errors.push('verifier_artifact_sha256_invalid');
  if (!SHA64.test(evidence.authorization_sha256 ?? '')) errors.push('authorization_sha256_invalid');
  if (!SHA64.test(evidence.proposal_sha256 ?? '')) errors.push('proposal_sha256_invalid');
  if (!SHA40.test(evidence.canonical_queue_blob_sha ?? '')) errors.push('canonical_queue_blob_sha_invalid');
  if (evidence.signature_verification !== 'verified') errors.push('signature_verification_required');
  if (evidence.authentication_event !== 'interactive_human_review') errors.push('interactive_human_review_required');

  const issuedAt = Date.parse(evidence.issued_at ?? '');
  const expiresAt = Date.parse(evidence.expires_at ?? '');
  const nowMs = Date.parse(now ?? '');
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt) || !Number.isFinite(nowMs)) errors.push('time_invalid');
  if (Number.isFinite(issuedAt) && Number.isFinite(expiresAt) && issuedAt >= expiresAt) errors.push('evidence_time_order_invalid');
  if (Number.isFinite(nowMs) && Number.isFinite(issuedAt) && issuedAt > nowMs) errors.push('evidence_not_yet_valid');
  if (Number.isFinite(nowMs) && Number.isFinite(expiresAt) && nowMs >= expiresAt) errors.push('evidence_expired');

  if (evidence.authorization_sha256 !== sha256Json(authorization)) errors.push('authorization_digest_mismatch');
  if (evidence.proposal_sha256 !== sha256Json(proposal)) errors.push('proposal_digest_mismatch');
  if (evidence.canonical_queue_blob_sha !== proposal.canonical_queue_blob_sha) errors.push('canonical_queue_binding_mismatch');
  if (authorization.decision !== 'approve') errors.push('authorization_not_approved');
  if (proposal.human_application_required !== true || proposal.automatic_application_permitted !== false) errors.push('proposal_application_boundary_invalid');

  const allowedProviders = new Set(policy.allowed_identity_providers ?? []);
  const allowedReviewers = new Set(policy.allowed_reviewer_subjects ?? []);
  const allowedVerifiers = new Set(policy.allowed_verifier_identities ?? []);
  const allowedVerifierArtifacts = new Set(policy.allowed_verifier_artifact_sha256 ?? []);
  if (policy.enabled !== true || policy.default !== 'deny') errors.push('deny_by_default_policy_required');
  if (!allowedProviders.has(evidence.identity_provider)) errors.push('identity_provider_not_allowed');
  if (!allowedReviewers.has(evidence.reviewer_subject)) errors.push('reviewer_not_allowed');
  if (!allowedVerifiers.has(evidence.verifier_identity)) errors.push('verifier_not_allowed');
  if (!allowedVerifierArtifacts.has(evidence.verifier_artifact_sha256)) errors.push('verifier_artifact_not_allowed');

  if (errors.length) return { valid: false, errors, adoption_permitted: false };

  const binding = {
    schema_version: '1.0.0',
    kind: 'reviewer_identity_binding',
    reviewer_subject: evidence.reviewer_subject,
    identity_provider: evidence.identity_provider,
    authorization_sha256: evidence.authorization_sha256,
    proposal_sha256: evidence.proposal_sha256,
    canonical_queue_blob_sha: evidence.canonical_queue_blob_sha,
    verifier_identity: evidence.verifier_identity,
    verifier_artifact_sha256: evidence.verifier_artifact_sha256,
    verified_at: now
  };

  return {
    valid: true,
    errors: [],
    binding,
    binding_sha256: sha256Json(binding),
    adoption_permitted: false,
    next_required_action: 'manual_application_then_post_application_verification'
  };
}
