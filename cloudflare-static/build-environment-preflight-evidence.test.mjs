import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnvironmentPreflightEvidence, canonicalJson } from './build-environment-preflight-evidence.mjs';

const requirements = {
  environment: 'cloudflare-research',
  provider: 'Cloudflare Pages',
  project_name: 'mirror-cartographer-research',
  workflow: '.github/workflows/cloudflare-pages-research.yml',
  required_secrets: [
    { name: 'CLOUDFLARE_ACCOUNT_ID', required: true, allowed_in_logs: false },
    { name: 'CLOUDFLARE_API_TOKEN', required: true, allowed_in_logs: false }
  ]
};

const contract = {
  ok: true,
  environment: 'cloudflare-research',
  referencedSecrets: ['GITHUB_TOKEN', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'],
  errors: []
};

test('builds a bounded declaration-only preflight packet', () => {
  const result = buildEnvironmentPreflightEvidence({ requirements, workflowContract: contract, source: { repository: 'MirrorCartographer/MirrorCartographer', commit_sha: 'a'.repeat(40) } });
  assert.equal(result.ready_for_dispatch, true);
  assert.equal(result.claim_state, 'configuration_declared');
  assert.equal(result.evidence_strength, 'repository_declaration_only');
  assert.ok(result.does_not_prove.includes('required secrets are installed or correct'));
  assert.match(result.packet_sha256, /^[a-f0-9]{64}$/);
});

test('fails closed when a required secret reference is absent', () => {
  const result = buildEnvironmentPreflightEvidence({ requirements, workflowContract: { ...contract, referencedSecrets: ['CLOUDFLARE_ACCOUNT_ID'] } });
  assert.equal(result.ready_for_dispatch, false);
  assert.equal(result.claim_state, 'configuration_contract_failed');
});

test('rejects secret values instead of sanitizing them ambiguously', () => {
  assert.throws(() => buildEnvironmentPreflightEvidence({ requirements: { ...requirements, token: 'should-never-enter-evidence' }, workflowContract: contract }), /forbidden-secret-material/);
});

test('is deterministic across object key ordering', () => {
  const a = buildEnvironmentPreflightEvidence({ requirements, workflowContract: contract, source: { repository: 'r', commit_sha: 'c' } });
  const b = buildEnvironmentPreflightEvidence({ workflowContract: { errors: [], referencedSecrets: [...contract.referencedSecrets].reverse(), environment: contract.environment, ok: true }, requirements: { ...requirements, required_secrets: [...requirements.required_secrets].reverse() }, source: { commit_sha: 'c', repository: 'r' } });
  assert.equal(canonicalJson(a), canonicalJson(b));
});
