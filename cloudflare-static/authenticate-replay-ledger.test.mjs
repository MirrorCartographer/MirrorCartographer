import assert from 'node:assert/strict'
import test from 'node:test'
import { authenticateReplayLedger, digestReplayLedger } from './authenticate-replay-ledger.mjs'

const ledger = {
  schema_version: '1.0.0',
  entries: [{ replay_key: 'sha256:abc', expires_at: 2000000000 }]
}
const digest = digestReplayLedger(ledger)
const valid = {
  status: 'verified',
  subject_digest: digest,
  repository: 'MirrorCartographer/MirrorCartographer',
  workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  predicate_type: 'https://slsa.dev/provenance/v1'
}

test('accepts exact ledger bytes from trusted workflow', () => {
  assert.equal(authenticateReplayLedger({ ledger, verification: valid }).authenticated, true)
})

test('rejects altered ledger bytes', () => {
  const altered = { ...ledger, entries: [...ledger.entries, { replay_key: 'sha256:def', expires_at: 2000000001 }] }
  const result = authenticateReplayLedger({ ledger: altered, verification: valid })
  assert.equal(result.authenticated, false)
  assert.ok(result.reasons.includes('ledger_digest_mismatch'))
})

test('rejects unverified signatures', () => {
  const result = authenticateReplayLedger({ ledger, verification: { ...valid, status: 'unverified' } })
  assert.ok(result.reasons.includes('signature_not_verified'))
})

test('rejects repository or workflow substitution', () => {
  const result = authenticateReplayLedger({
    ledger,
    verification: { ...valid, repository: 'attacker/repo', workflow_ref: 'attacker/repo/.github/workflows/build.yml@refs/heads/main' }
  })
  assert.ok(result.reasons.includes('repository_not_trusted'))
  assert.ok(result.reasons.includes('workflow_not_trusted'))
})
