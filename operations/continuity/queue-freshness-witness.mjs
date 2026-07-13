const SHA1 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;

function requireObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
}

function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${name} must be a non-empty string`);
  }
}

function requireSha(value, name, pattern) {
  requireString(value, name);
  if (!pattern.test(value)) throw new Error(`${name} has invalid digest format`);
}

function requireUtcTimestamp(value, name) {
  requireString(value, name);
  if (!value.endsWith("Z") || Number.isNaN(Date.parse(value))) {
    throw new Error(`${name} must be a parseable UTC ISO-8601 timestamp`);
  }
}

function validateStage(stage, name, prefix, { reviewer = false } = {}) {
  requireObject(stage, name);
  requireSha(stage[`${prefix}_head_commit`], `${name}.${prefix}_head_commit`, SHA1);
  requireSha(stage[`${prefix}_queue_update_tree_digest`], `${name}.${prefix}_queue_update_tree_digest`, SHA256);
  requireUtcTimestamp(stage[`${prefix === "proposal" ? "proposal_created" : prefix === "review" ? "reviewed" : "applied"}_at`], `${name} timestamp`);
  if (stage.tree_enumeration_complete !== true) {
    throw new Error(`${name}.tree_enumeration_complete must be true`);
  }
  if (Array.isArray(stage.traversal_errors) && stage.traversal_errors.length > 0) {
    throw new Error(`${name}.traversal_errors must be empty`);
  }
  if (reviewer) requireString(stage.reviewer_identity, `${name}.reviewer_identity`);
}

export function validateQueueFreshnessWitness(witness) {
  requireObject(witness, "witness");
  validateStage(witness.proposal, "proposal", "proposal");
  validateStage(witness.review, "review", "review", { reviewer: true });
  validateStage(witness.application, "application", "application");
  requireObject(witness.post_application, "post_application");
  requireSha(witness.post_application.post_application_head_commit, "post_application.post_application_head_commit", SHA1);
  requireSha(witness.post_application.canonical_queue_blob_sha, "post_application.canonical_queue_blob_sha", SHA1);
  requireUtcTimestamp(witness.post_application.verified_at, "post_application.verified_at");
  if (witness.post_application.verification_result !== "pass") {
    throw new Error("post_application.verification_result must be pass");
  }

  const proposalHead = witness.proposal.proposal_head_commit;
  const reviewHead = witness.review.review_head_commit;
  const applicationHead = witness.application.application_head_commit;
  if (proposalHead !== reviewHead || reviewHead !== applicationHead) {
    throw new Error("proposal, review, and application head commits must match");
  }

  const proposalDigest = witness.proposal.proposal_queue_update_tree_digest;
  const reviewDigest = witness.review.review_queue_update_tree_digest;
  const applicationDigest = witness.application.application_queue_update_tree_digest;
  if (proposalDigest !== reviewDigest || reviewDigest !== applicationDigest) {
    throw new Error("proposal, review, and application queue-update tree digests must match");
  }

  return Object.freeze({
    valid: true,
    reconciled_head_commit: applicationHead,
    reconciled_queue_update_tree_digest: applicationDigest,
    canonical_queue_blob_sha: witness.post_application.canonical_queue_blob_sha,
    post_application_head_commit: witness.post_application.post_application_head_commit,
    reviewer_identity: witness.review.reviewer_identity
  });
}
