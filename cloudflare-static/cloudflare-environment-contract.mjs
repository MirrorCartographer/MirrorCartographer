export const cloudflareEnvironmentContract = Object.freeze({
  schema_version: '1.0.0',
  github_environment: 'cloudflare-research',
  project_name: 'mirror-cartographer-research',
  deployment_workflow: '.github/workflows/cloudflare-pages-research.yml',
  required_secrets: [
    { name: 'CLOUDFLARE_ACCOUNT_ID', purpose: 'Select the Cloudflare account that owns the Pages project', value_must_never_be_recorded: true },
    { name: 'CLOUDFLARE_API_TOKEN', purpose: 'Authorize Cloudflare Pages deployment for the named project', value_must_never_be_recorded: true }
  ],
  expected_permissions: {
    repository: ['contents:read', 'deployments:write', 'id-token:write', 'attestations:write'],
    cloudflare_token: ['Cloudflare Pages:Edit', 'Account Settings:Read']
  },
  acceptance: {
    readiness_file: 'cloudflare-deployment-readiness.json',
    ready_field: 'ready',
    required_value: true,
    proof_file: 'cloudflare-deployment-proof.json',
    acceptance_file: 'cloudflare-deployment-acceptance.json'
  },
  privacy: {
    allowed_to_record: ['secret name', 'configured boolean', 'reason code', 'environment name', 'project name'],
    forbidden_to_record: ['secret value', 'token prefix', 'account identifier value', 'request authorization header']
  }
});

export function validateCloudflareEnvironmentContract(contract = cloudflareEnvironmentContract) {
  const errors = [];
  if (contract?.schema_version !== '1.0.0') errors.push('unsupported_schema_version');
  if (contract?.github_environment !== 'cloudflare-research') errors.push('wrong_github_environment');
  if (contract?.project_name !== 'mirror-cartographer-research') errors.push('wrong_project_name');
  const names = Array.isArray(contract?.required_secrets) ? contract.required_secrets.map((item) => item?.name) : [];
  for (const required of ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']) {
    if (!names.includes(required)) errors.push(`missing_required_secret:${required}`);
  }
  if (new Set(names).size !== names.length) errors.push('duplicate_secret_name');
  for (const item of contract?.required_secrets || []) {
    if (item?.value_must_never_be_recorded !== true) errors.push(`unsafe_secret_recording_policy:${item?.name || 'unknown'}`);
  }
  if (contract?.acceptance?.required_value !== true) errors.push('acceptance_must_require_ready_true');
  const forbidden = new Set(contract?.privacy?.forbidden_to_record || []);
  for (const key of ['secret value', 'token prefix', 'account identifier value', 'request authorization header']) {
    if (!forbidden.has(key)) errors.push(`missing_privacy_prohibition:${key}`);
  }
  return { ok: errors.length === 0, errors };
}
