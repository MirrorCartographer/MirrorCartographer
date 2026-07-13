function reject(reason, details = {}) {
  return {
    accepted: false,
    classification: 'signer_identity_not_authorized',
    reason,
    details,
    claim_boundary: [
      'does_not_verify_certificate_signatures_or_chains',
      'does_not_authenticate_oidc_tokens',
      'does_not_prove_the_underlying_evidence_claim'
    ]
  };
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function exactMatch(value, allowed) {
  return allowed.some((candidate) => candidate === value);
}

export function classifySignerIdentity({
  certificateVerified,
  certificateIdentity,
  certificateOidcIssuer,
  certificateSourceRepository,
  certificateWorkflowRef,
  policy
}) {
  if (certificateVerified !== true) {
    return reject('certificate_not_cryptographically_verified');
  }
  if (!policy || policy.enabled !== true) {
    return reject('identity_policy_not_enabled');
  }

  const required = {
    certificateIdentity,
    certificateOidcIssuer,
    certificateSourceRepository,
    certificateWorkflowRef
  };
  for (const [field, value] of Object.entries(required)) {
    if (!nonEmpty(value)) return reject(`missing_${field}`);
  }

  const allowedIdentities = Array.isArray(policy.allowedIdentities) ? policy.allowedIdentities : [];
  const allowedIssuers = Array.isArray(policy.allowedOidcIssuers) ? policy.allowedOidcIssuers : [];
  const allowedRepositories = Array.isArray(policy.allowedSourceRepositories) ? policy.allowedSourceRepositories : [];
  const allowedWorkflowRefs = Array.isArray(policy.allowedWorkflowRefs) ? policy.allowedWorkflowRefs : [];

  if (!exactMatch(certificateIdentity, allowedIdentities)) {
    return reject('certificate_identity_not_allowed', { certificateIdentity });
  }
  if (!exactMatch(certificateOidcIssuer, allowedIssuers)) {
    return reject('oidc_issuer_not_allowed', { certificateOidcIssuer });
  }
  if (!exactMatch(certificateSourceRepository, allowedRepositories)) {
    return reject('source_repository_not_allowed', { certificateSourceRepository });
  }
  if (!exactMatch(certificateWorkflowRef, allowedWorkflowRefs)) {
    return reject('workflow_ref_not_allowed', { certificateWorkflowRef });
  }

  return {
    accepted: true,
    classification: 'signer_identity_authorized',
    authorized_principal: {
      identity: certificateIdentity,
      oidc_issuer: certificateOidcIssuer,
      source_repository: certificateSourceRepository,
      workflow_ref: certificateWorkflowRef
    },
    match_semantics: 'exact_string_match_only',
    claim_boundary: [
      'consumes_identity_fields_only_after_external_certificate_verification',
      'authorizes_only_the_exact_configured_signing_principal',
      'does_not_prove_the_underlying_evidence_claim'
    ],
    falsification_route: 'Change any one of identity, OIDC issuer, source repository, or workflow reference to a lookalike or unauthorized value and observe fail-closed rejection.'
  };
}
