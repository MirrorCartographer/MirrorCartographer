import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateGitHubOidcEvidence } from './evaluate-github-oidc-evidence.mjs'

const now = 1_800_000_000
const invocation = {
  repository: 'MirrorCartographer/MirrorCartographer',
  repository_id: '1014575224',
  repository_owner_id: '216780403',
  workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  workflow_sha: 'a'.repeat(40),
  ref: 'refs/heads/main',
  event_name: 'workflow_dispatch',
  environment: 'cloudflare-research',
  run_id: '123456789',
  run_attempt: 1,
  actor_id: '1001',
  source_sha: 'b'.repeat(40)
}
const receipt = { accepted: true, invocation }
const claims = {
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'mirror-cartographer-cloudflare',
  sub: 'repo:MirrorCartographer/MirrorCartographer:environment:cloudflare-research',
  exp: now + 300,
  iat: now - 10,
  repository: invocation.repository,
  repository_id: invocation.repository_id,
  repository_owner_id: invocation.repository_owner_id,
  workflow_ref: invocation.workflow_ref,
  workflow_sha: invocation.workflow_sha,
  ref: invocation.ref,
  event_name: invocation.event_name,
  environment: invocation.environment,
  run_id: invocation.run_id,
  run_attempt: invocation.run_attempt,
  actor_id: invocation.actor_id,
  sha: invocation.source_sha
}
const verified = { accepted: true, reason: 'signature_verified', algorithm: 'RS256', kid: 'test-key', claims }

test('accepts only when signature verification and exact claims both pass', () => {
  const result = evaluateGitHubOidcEvidence({ verification: verified, receipt, expectedAudience: claims.aud, nowEpochSeconds: now })
  assert.equal(result.accepted, true)
  assert.equal(result.reason, 'oidc_signature_and_claims_authorized')
})

test('claim matching cannot upgrade a rejected signature', () => {
  const result = evaluateGitHubOidcEvidence({ verification: { ...verified, accepted: false, reason: 'signature_rejected' }, receipt, expectedAudience: claims.aud, nowEpochSeconds: now })
  assert.equal(result.accepted, false)
  assert.equal(result.reason, 'oidc_signature_not_verified')
  assert.equal(result.authorization, null)
})

test('verified signature cannot bypass exact workflow identity', () => {
  const result = evaluateGitHubOidcEvidence({ verification: { ...verified, claims: { ...claims, workflow_ref: claims.workflow_ref.replace('cloudflare-pages-research.yml', 'lookalike.yml') } }, receipt, expectedAudience: claims.aud, nowEpochSeconds: now })
  assert.equal(result.accepted, false)
  assert.equal(result.reason, 'oidc_claim_authorization_rejected')
})

test('verified signature cannot bypass freshness', () => {
  const result = evaluateGitHubOidcEvidence({ verification: { ...verified, claims: { ...claims, exp: now - 60 } }, receipt, expectedAudience: claims.aud, nowEpochSeconds: now })
  assert.equal(result.accepted, false)
  assert.equal(result.authorization.temporal.exp_valid, false)
})
