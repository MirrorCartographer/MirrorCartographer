import test from 'node:test'
import assert from 'node:assert/strict'
import { authorizeGitHubOidcClaims } from './authorize-github-oidc-claims.mjs'

const now = 2_000_000_000
const receipt = {
  accepted: true,
  invocation: {
    repository:'MirrorCartographer/MirrorCartographer', repository_id:'1014575224', repository_owner_id:'216780403',
    workflow_ref:'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
    workflow_sha:'a'.repeat(40), ref:'refs/heads/main', event_name:'workflow_dispatch', environment:'cloudflare-research',
    run_id:'1234', run_attempt:1, actor_id:'99', source_sha:'b'.repeat(40)
  }
}
function claims(overrides={}) { return {
  iss:'https://token.actions.githubusercontent.com', aud:'mirror-cartographer-cloudflare-research',
  sub:'repo:MirrorCartographer/MirrorCartographer:environment:cloudflare-research', exp:now+300, nbf:now-5, iat:now-5,
  repository:receipt.invocation.repository, repository_id:receipt.invocation.repository_id, repository_owner_id:receipt.invocation.repository_owner_id,
  workflow_ref:receipt.invocation.workflow_ref, workflow_sha:receipt.invocation.workflow_sha, ref:receipt.invocation.ref,
  event_name:receipt.invocation.event_name, environment:receipt.invocation.environment, run_id:receipt.invocation.run_id,
  run_attempt:'1', actor_id:receipt.invocation.actor_id, sha:receipt.invocation.source_sha, ...overrides
} }

test('authorizes exact fresh claims after a receipt is accepted', () => {
  const result=authorizeGitHubOidcClaims({claims:claims(),receipt,expectedAudience:'mirror-cartographer-cloudflare-research',nowEpochSeconds:now})
  assert.equal(result.accepted,true)
})
test('rejects an audience mismatch', () => {
  const result=authorizeGitHubOidcClaims({claims:claims({aud:'other'}),receipt,expectedAudience:'mirror-cartographer-cloudflare-research',nowEpochSeconds:now})
  assert.equal(result.accepted,false); assert.equal(result.structural.audience,false)
})
test('rejects expired claims', () => {
  const result=authorizeGitHubOidcClaims({claims:claims({exp:now-31}),receipt,expectedAudience:'mirror-cartographer-cloudflare-research',nowEpochSeconds:now})
  assert.equal(result.accepted,false); assert.equal(result.temporal.exp_valid,false)
})
test('rejects a lookalike workflow identity', () => {
  const result=authorizeGitHubOidcClaims({claims:claims({workflow_ref:receipt.invocation.workflow_ref+'.bak'}),receipt,expectedAudience:'mirror-cartographer-cloudflare-research',nowEpochSeconds:now})
  assert.equal(result.accepted,false); assert.equal(result.structural.exact_identity,false)
})
test('rejects claims when the context receipt was not accepted', () => {
  const result=authorizeGitHubOidcClaims({claims:claims(),receipt:{...receipt,accepted:false},expectedAudience:'mirror-cartographer-cloudflare-research',nowEpochSeconds:now})
  assert.equal(result.accepted,false); assert.equal(result.structural.receipt_accepted,false)
})
