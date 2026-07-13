import test from 'node:test'
import assert from 'node:assert/strict'
import { validateStackDeploymentEvidence } from './validate-stack-deployment-evidence.mjs'

const commit = 'a'.repeat(40)
const valid = {
  source_commit: commit,
  worker: {
    url: 'https://worker.example.workers.dev',
    redeployed_url: 'https://worker.example.workers.dev',
    verification: { ok: true },
    concurrency_proof: { accepted: true, evaluation: { valid: true } },
    redeployment_persistence_proof: { accepted: true, evaluation: { valid: true } }
  },
  pages: { url: 'https://example.pages.dev', proof_recorded: true },
  ordering_invariant: 'worker-deployed-health-verified-live-atomicity-verified-reservation-created-worker-redeployed-persistence-verified-before-pages-deploy'
}

test('accepts a complete commit-bound Cloudflare stack proof', () => {
  assert.deepEqual(validateStackDeploymentEvidence(valid, { expectedCommit: commit }), { accepted: true, reasons: [], source_commit: commit })
})

test('rejects missing proof and commit substitution', () => {
  const candidate = structuredClone(valid)
  candidate.source_commit = 'b'.repeat(40)
  candidate.worker.redeployment_persistence_proof.accepted = false
  const result = validateStackDeploymentEvidence(candidate, { expectedCommit: commit })
  assert.equal(result.accepted, false)
  assert.deepEqual(result.reasons, ['source-commit-mismatch', 'worker-redeployment-proof-missing-or-failed'])
})

test('rejects Pages evidence recorded without a URL or proof file', () => {
  const candidate = structuredClone(valid)
  candidate.pages = { url: null, proof_recorded: false }
  const result = validateStackDeploymentEvidence(candidate, { expectedCommit: commit })
  assert.equal(result.accepted, false)
  assert.deepEqual(result.reasons, ['pages-url-invalid', 'pages-proof-not-recorded'])
})

test('rejects HTTPS lookalike hosts outside Cloudflare deployment domains', () => {
  const candidate = structuredClone(valid)
  candidate.worker.url = 'https://worker.example.com'
  candidate.worker.redeployed_url = 'https://worker.pages.dev'
  candidate.pages.url = 'https://example.pages.dev.attacker.invalid'
  const result = validateStackDeploymentEvidence(candidate, { expectedCommit: commit })
  assert.equal(result.accepted, false)
  assert.deepEqual(result.reasons, [
    'worker-hostname-not-cloudflare',
    'redeployed-worker-hostname-not-cloudflare',
    'pages-hostname-not-cloudflare'
  ])
})

test('rejects malformed and non-HTTPS deployment URLs', () => {
  const candidate = structuredClone(valid)
  candidate.worker.url = 'not-a-url'
  candidate.worker.redeployed_url = 'http://worker.example.workers.dev'
  candidate.pages.url = 'ftp://example.pages.dev'
  const result = validateStackDeploymentEvidence(candidate, { expectedCommit: commit })
  assert.equal(result.accepted, false)
  assert.deepEqual(result.reasons, ['worker-url-invalid', 'redeployed-worker-url-invalid', 'pages-url-invalid'])
})
