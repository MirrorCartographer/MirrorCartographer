import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateWorkflowIdentity } from './oidc-workflow-identity-policy.mjs'

const now = 1_800_000_000

const policy = {
  enabled: true,
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'mirrorcartographer-protected-mutation',
  repository: 'MirrorCartographer/MirrorCartographer',
  repository_id: '123456789',
  repository_owner_id: '987654321',
  workflow_ref:
    'MirrorCartographer/MirrorCartographer/.github/workflows/protected-materialization.yml@refs/heads/main',
  workflow_sha: 'a'.repeat(40),
  ref: 'refs/heads/main',
  event_name: 'workflow_dispatch',
  environment: 'protected-materialization',
  subject_prefix:
    'repo:MirrorCartographer/MirrorCartographer:environment:protected-materialization',
  maximum_lifetime_seconds: 600,
  allowed_run_attempts: [1]
}

const claims = {
  ...policy,
  sub: policy.subject_prefix,
  run_id: '44001',
  run_attempt: '1',
  jti: '8f594850-85c6-4a29-8766-c3a4c9b97809',
  iat: now - 20,
  nbf: now - 25,
  exp: now + 280
}

delete claims.enabled
delete claims.subject_prefix
delete claims.maximum_lifetime_seconds
delete claims.allowed_run_attempts

test('accepts an exact, current, first-attempt workflow identity', () => {
  const result = evaluateWorkflowIdentity({ claims, policy, nowEpochSeconds: now })

  assert.equal(result.accepted, true)
  assert.equal(result.reason, 'trusted_workflow_identity')
  assert.equal(
    result.replay_key,
    '123456789:44001:1:8f594850-85c6-4a29-8766-c3a4c9b97809'
  )
})

test('rejects a lookalike repository even when the subject prefix looks trusted', () => {
  const result = evaluateWorkflowIdentity({
    claims: { ...claims, repository: 'MirrorCartographer/MirrorCartographer-copy' },
    policy,
    nowEpochSeconds: now
  })

  assert.equal(result.accepted, false)
  assert.equal(
    result.exact_claims.find((entry) => entry.name === 'repository').accepted,
    false
  )
})

test('rejects workflow-file drift through workflow_sha', () => {
  const result = evaluateWorkflowIdentity({
    claims: { ...claims, workflow_sha: 'b'.repeat(40) },
    policy,
    nowEpochSeconds: now
  })

  assert.equal(result.accepted, false)
  assert.equal(
    result.exact_claims.find((entry) => entry.name === 'workflow_sha').accepted,
    false
  )
})

test('rejects expired or excessively long-lived tokens', () => {
  const expired = evaluateWorkflowIdentity({
    claims: { ...claims, iat: now - 700, nbf: now - 705, exp: now - 1 },
    policy,
    nowEpochSeconds: now
  })
  const longLived = evaluateWorkflowIdentity({
    claims: { ...claims, iat: now - 10, nbf: now - 15, exp: now + 1_000 },
    policy,
    nowEpochSeconds: now
  })

  assert.equal(expired.accepted, false)
  assert.equal(expired.temporal.current, false)
  assert.equal(longLived.accepted, false)
  assert.equal(longLived.temporal.bounded, false)
})

test('rejects reruns by default and exposes no replay key', () => {
  const result = evaluateWorkflowIdentity({
    claims: { ...claims, run_attempt: '2' },
    policy,
    nowEpochSeconds: now
  })

  assert.equal(result.accepted, false)
  assert.equal(result.run_attempt.accepted, false)
  assert.equal(result.replay_key, null)
})

test('requires reusable workflow identity when policy specifies it', () => {
  const reusablePolicy = {
    ...policy,
    job_workflow_ref:
      'MirrorCartographer/MirrorCartographer/.github/workflows/reusable-mutation.yml@refs/heads/main',
    job_workflow_sha: 'c'.repeat(40)
  }
  const reusableClaims = {
    ...claims,
    job_workflow_ref: reusablePolicy.job_workflow_ref,
    job_workflow_sha: reusablePolicy.job_workflow_sha
  }

  const accepted = evaluateWorkflowIdentity({
    claims: reusableClaims,
    policy: reusablePolicy,
    nowEpochSeconds: now
  })
  const drifted = evaluateWorkflowIdentity({
    claims: { ...reusableClaims, job_workflow_sha: 'd'.repeat(40) },
    policy: reusablePolicy,
    nowEpochSeconds: now
  })

  assert.equal(accepted.accepted, true)
  assert.equal(drifted.accepted, false)
})

test('fails closed when policy is disabled', () => {
  const result = evaluateWorkflowIdentity({
    claims,
    policy: { ...policy, enabled: false },
    nowEpochSeconds: now
  })

  assert.equal(result.accepted, false)
  assert.equal(result.reason, 'policy_disabled')
})
