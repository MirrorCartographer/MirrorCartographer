import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { githubOidcConstants } from './github-oidc-jwt-verifier.mjs';
import { createGitHubOidcRunBindingPolicy } from './github-oidc-run-binding.mjs';
import { verifyAndAuthorizeGitHubOidcRun } from './github-oidc-verification-chain.mjs';

const now = 1_800_000_000;
const sha = 'a'.repeat(40);
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'key-1', alg: 'RS256', use: 'sig', key_ops: ['verify'] };
const discovery = { issuer: githubOidcConstants.issuer, jwks_uri: githubOidcConstants.jwks_uri, id_token_signing_alg_values_supported: ['RS256'] };
const policy = createGitHubOidcRunBindingPolicy({
  audience: 'deploy', repositoryId: '123', ownerId: '456',
  workflowRef: 'MirrorCartographer/MirrorCartographer/.github/workflows/deploy.yml@refs/heads/main',
  jobWorkflowRef: 'MirrorCartographer/MirrorCartographer/.github/workflows/deploy.yml@refs/heads/main',
  workflowSha: sha
});
const claims = { iss: githubOidcConstants.issuer, aud: 'deploy', repository_id: '123', repository_owner_id: '456', workflow_ref: policy.workflowRef, job_workflow_ref: policy.jobWorkflowRef, workflow_sha: sha, iat: now - 30, exp: now + 270 };

function tokenFor(payload = claims, key = privateKey) {
  const h = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'key-1' })).toString('base64url');
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const s = sign('RSA-SHA256', Buffer.from(`${h}.${p}`), key).toString('base64url');
  return `${h}.${p}.${s}`;
}

test('accepts only after signature and claim policy both pass', () => {
  const result = verifyAndAuthorizeGitHubOidcRun({ token: tokenFor(), discovery, jwks: { keys: [jwk] }, policy, nowSeconds: now });
  assert.equal(result.accepted, true);
  assert.equal(result.stage, 'accepted');
});

test('never evaluates attacker claims as authorized when signature fails', () => {
  const parts = tokenFor().split('.');
  parts[1] = Buffer.from(JSON.stringify({ ...claims, repository_id: '999' })).toString('base64url');
  const result = verifyAndAuthorizeGitHubOidcRun({ token: parts.join('.'), discovery, jwks: { keys: [jwk] }, policy, nowSeconds: now });
  assert.equal(result.stage, 'signature');
  assert.equal(result.authorization, null);
  assert.equal(result.claims, null);
});

test('rejects correctly signed token from wrong workflow at authorization stage', () => {
  const result = verifyAndAuthorizeGitHubOidcRun({ token: tokenFor({ ...claims, workflow_sha: 'b'.repeat(40) }), discovery, jwks: { keys: [jwk] }, policy, nowSeconds: now });
  assert.equal(result.stage, 'authorization');
  assert.ok(result.reasons.includes('workflow_sha'));
  assert.equal(result.claims, null);
});
