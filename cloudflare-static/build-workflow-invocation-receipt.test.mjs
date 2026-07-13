import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWorkflowInvocationReceipt } from './build-workflow-invocation-receipt.mjs'

const sha = 'a'.repeat(40)
const workflowSha = 'b'.repeat(40)

const context = {
  repository: 'MirrorCartographer/MirrorCartographer',
  repository_id: '1014575224',
  repository_owner_id: '216780403',
  workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  workflow_sha: workflowSha,
  ref: 'refs/heads/main',
  event_name: 'workflow_dispatch',
  environment: 'cloudflare-research',
  run_id: '9001',
  run_attempt: '1',
  run_number: '42',
  actor_id: '1234',
  triggering_actor: 'mirror-operator',
  source_sha: sha
}

const policy = {
  enabled: true,
  repository: context.repository,
  repository_id: context.repository_id,
  repository_owner_id: context.repository_owner_id,
  workflow_ref: context.workflow_ref,
  ref: context.ref,
  event_name: context.event_name,
  environment: context.environment
}

function build(overrides = {}, policyOverrides = {}) {
  return buildWorkflowInvocationReceipt({
    context: { ...context, ...overrides },
    policy: { ...policy, ...policyOverrides },
    generatedAt: '2026-07-13T04:00:00.000Z'
  })
}

test('accepts exact bounded workflow context and creates deterministic replay key', () => {
  const first = build()
  const second = build()
  assert.equal(first.accepted, true)
  assert.equal(first.reason, 'workflow_context_bound')
  assert.match(first.replay_key_sha256, /^[0-9a-f]{64}$/)
  assert.equal(first.replay_key_sha256, second.replay_key_sha256)
  assert.equal(first.source_status, 'github_actions_context_unverified_by_oidc')
})

test('rejects lookalike repository even when all other context matches', () => {
  const result = build({ repository: 'MirrorCartographer/MirrorCartographer-copy' })
  assert.equal(result.accepted, false)
  assert.equal(result.replay_key_sha256, null)
  assert.equal(result.exact_fields.find((entry) => entry.field === 'repository').accepted, false)
})

test('rejects workflow path or ref drift', () => {
  const result = build({ workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/other.yml@refs/heads/main' })
  assert.equal(result.accepted, false)
  assert.equal(result.exact_fields.find((entry) => entry.field === 'workflow_ref').accepted, false)
})

test('rejects malformed workflow or source commit sha', () => {
  assert.equal(build({ workflow_sha: 'main' }).accepted, false)
  assert.equal(build({ source_sha: 'latest' }).accepted, false)
})

test('rejects rerun identity mutation through changed replay key input', () => {
  const first = build()
  const rerun = build({ run_attempt: '2' })
  assert.equal(rerun.accepted, true)
  assert.notEqual(first.replay_key_sha256, rerun.replay_key_sha256)
})

test('rejects missing actor identity and disabled policy', () => {
  assert.equal(build({ actor_id: '' }).accepted, false)
  assert.equal(build({}, { enabled: false }).accepted, false)
})
