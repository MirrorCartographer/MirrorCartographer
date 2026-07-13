import { createHash } from 'node:crypto';

const SHA40 = /^[0-9a-f]{40}$/;
const SHA64 = /^[0-9a-f]{64}$/;

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

export function verifyPostApplication({ priorQueue, resultingQueue, proposal, reviewerBinding, applicationEvidence, policy }) {
  const errors = [];
  for (const [name, value] of Object.entries({ priorQueue, resultingQueue, proposal, reviewerBinding, applicationEvidence, policy })) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) errors.push(`${name}_required`);
  }
  if (errors.length) return { verified: false, adopted: false, errors };

  if (applicationEvidence.schema_version !== '1.0.0') errors.push('application_schema_invalid');
  if (applicationEvidence.kind !== 'manual_canonical_application') errors.push('application_kind_invalid');
  if (!SHA40.test(applicationEvidence.commit_sha ?? '')) errors.push('commit_sha_invalid');
  if (!SHA40.test(applicationEvidence.parent_commit_sha ?? '')) errors.push('parent_commit_sha_invalid');
  if (!SHA40.test(applicationEvidence.prior_queue_blob_sha ?? '')) errors.push('prior_queue_blob_sha_invalid');
  if (!SHA40.test(applicationEvidence.resulting_queue_blob_sha ?? '')) errors.push('resulting_queue_blob_sha_invalid');
  if (!SHA64.test(applicationEvidence.proposal_sha256 ?? '')) errors.push('proposal_sha256_invalid');
  if (!SHA64.test(applicationEvidence.reviewer_binding_sha256 ?? '')) errors.push('reviewer_binding_sha256_invalid');
  if (applicationEvidence.application_mode !== 'manual_human_commit') errors.push('manual_application_required');
  if (applicationEvidence.path !== 'operations/ACTIVE_QUEUE.json') errors.push('canonical_queue_path_invalid');

  if (proposal.human_application_required !== true || proposal.automatic_application_permitted !== false) errors.push('proposal_application_boundary_invalid');
  if (applicationEvidence.proposal_sha256 !== sha256Json(proposal)) errors.push('proposal_digest_mismatch');
  if (applicationEvidence.reviewer_binding_sha256 !== sha256Json(reviewerBinding)) errors.push('reviewer_binding_digest_mismatch');
  if (reviewerBinding.proposal_sha256 !== sha256Json(proposal)) errors.push('reviewer_binding_proposal_mismatch');
  if (reviewerBinding.canonical_queue_blob_sha !== applicationEvidence.prior_queue_blob_sha) errors.push('reviewer_binding_prior_blob_mismatch');
  if (proposal.canonical_queue_blob_sha !== applicationEvidence.prior_queue_blob_sha) errors.push('proposal_prior_blob_mismatch');

  if (sha256Json(priorQueue) !== applicationEvidence.prior_queue_sha256) errors.push('prior_queue_digest_mismatch');
  if (sha256Json(resultingQueue) !== applicationEvidence.resulting_queue_sha256) errors.push('resulting_queue_digest_mismatch');
  if (sha256Json(resultingQueue) !== proposal.proposed_queue_sha256) errors.push('result_not_authorized_by_proposal');
  if (applicationEvidence.parent_commit_sha === applicationEvidence.commit_sha) errors.push('commit_parent_cycle');
  if (priorQueue.schema_version !== resultingQueue.schema_version) errors.push('queue_schema_changed');

  const allowedCommitters = new Set(policy.allowed_committer_subjects ?? []);
  const allowedVerifierArtifacts = new Set(policy.allowed_verifier_artifact_sha256 ?? []);
  if (policy.enabled !== true || policy.default !== 'deny') errors.push('deny_by_default_policy_required');
  if (!allowedCommitters.has(applicationEvidence.committer_subject)) errors.push('committer_not_allowed');
  if (!allowedVerifierArtifacts.has(applicationEvidence.verifier_artifact_sha256)) errors.push('verifier_artifact_not_allowed');
  if (applicationEvidence.signature_verification !== 'verified') errors.push('commit_signature_verification_required');

  if (errors.length) return { verified: false, adopted: false, errors };

  const verificationRecord = {
    schema_version: '1.0.0',
    kind: 'canonical_post_application_verification',
    proposal_sha256: applicationEvidence.proposal_sha256,
    reviewer_binding_sha256: applicationEvidence.reviewer_binding_sha256,
    prior_queue_blob_sha: applicationEvidence.prior_queue_blob_sha,
    resulting_queue_blob_sha: applicationEvidence.resulting_queue_blob_sha,
    application_commit_sha: applicationEvidence.commit_sha,
    verifier_artifact_sha256: applicationEvidence.verifier_artifact_sha256,
    result: 'adopted_exactly_as_authorized'
  };

  return { verified: true, adopted: true, errors: [], verification_record: verificationRecord, verification_record_sha256: sha256Json(verificationRecord) };
}
