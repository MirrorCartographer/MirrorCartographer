function freeze(value) {
  return Object.freeze({ ...value, reasons: Object.freeze(value.reasons ?? []) });
}

export function evaluateGitHubOidcRunBinding(claims, policy, nowSeconds = Math.floor(Date.now() / 1000)) {
  const reasons = [];
  if (!claims || typeof claims !== 'object' || Array.isArray(claims)) reasons.push('claims-object-required');
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) reasons.push('policy-object-required');
  if (reasons.length) return freeze({ accepted: false, reasons });

  const requiredStrings = ['iss', 'aud', 'repository_id', 'repository_owner_id', 'workflow_ref', 'workflow_sha', 'job_workflow_ref'];
  for (const name of requiredStrings) {
    if (typeof claims[name] !== 'string' || claims[name].length === 0) reasons.push(`claim.${name}`);
  }
  if (!Number.isInteger(claims.iat)) reasons.push('claim.iat');
  if (!Number.isInteger(claims.exp)) reasons.push('claim.exp');

  if (claims.iss !== 'https://token.actions.githubusercontent.com') reasons.push('iss');
  if (claims.aud !== policy.audience) reasons.push('aud');
  if (claims.repository_id !== policy.repositoryId) reasons.push('repository_id');
  if (claims.repository_owner_id !== policy.ownerId) reasons.push('repository_owner_id');
  if (claims.workflow_ref !== policy.workflowRef) reasons.push('workflow_ref');
  if (claims.job_workflow_ref !== policy.jobWorkflowRef) reasons.push('job_workflow_ref');
  if (!/^[0-9a-f]{40}$/.test(claims.workflow_sha ?? '')) reasons.push('workflow_sha-format');
  if (policy.workflowSha && claims.workflow_sha !== policy.workflowSha) reasons.push('workflow_sha');

  const skew = Number.isInteger(policy.clockSkewSeconds) ? policy.clockSkewSeconds : 60;
  const maxAge = Number.isInteger(policy.maxTokenAgeSeconds) ? policy.maxTokenAgeSeconds : 600;
  if (Number.isInteger(claims.iat) && claims.iat > nowSeconds + skew) reasons.push('iat-future');
  if (Number.isInteger(claims.exp) && claims.exp < nowSeconds - skew) reasons.push('token-expired');
  if (Number.isInteger(claims.iat) && nowSeconds - claims.iat > maxAge + skew) reasons.push('token-too-old');
  if (Number.isInteger(claims.iat) && Number.isInteger(claims.exp) && claims.exp <= claims.iat) reasons.push('exp-not-after-iat');

  return freeze({ accepted: reasons.length === 0, reasons });
}

export function createGitHubOidcRunBindingPolicy(input) {
  const required = ['audience', 'repositoryId', 'ownerId', 'workflowRef', 'jobWorkflowRef'];
  for (const key of required) {
    if (typeof input?.[key] !== 'string' || input[key].length === 0) throw new TypeError(`${key}-nonempty-string-required`);
  }
  if (input.workflowSha != null && !/^[0-9a-f]{40}$/.test(input.workflowSha)) throw new TypeError('workflowSha-full-lowercase-sha-required');
  return Object.freeze({
    schemaVersion: '1.0.0', mode: 'deny-by-default',
    audience: input.audience, repositoryId: input.repositoryId, ownerId: input.ownerId,
    workflowRef: input.workflowRef, jobWorkflowRef: input.jobWorkflowRef,
    workflowSha: input.workflowSha ?? null,
    clockSkewSeconds: input.clockSkewSeconds ?? 60,
    maxTokenAgeSeconds: input.maxTokenAgeSeconds ?? 600
  });
}
