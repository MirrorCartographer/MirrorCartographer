import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerificationSummary, evaluateVerificationSummary, sha256Json } from './verification-summary.mjs';

const digest = 'a'.repeat(64);
const policyDigest = 'b'.repeat(64);
const base = {
  subjectName: 'operations/evidence/example.json',
  subjectSha256: digest,
  verifierId: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/verify.yml',
  resourceUri: 'https://github.com/MirrorCartographer/MirrorCartographer/blob/main/operations/evidence/example.json',
  policyUri: 'https://github.com/MirrorCartographer/MirrorCartographer/blob/main/operations/policies/evidence.json',
  policySha256: policyDigest,
  verificationResult: 'PASSED',
  timeVerified: '2026-07-12T14:49:00.000Z'
};

test('creates a standards-linked VSA with exact policy and input digests', () => {
  const statement = createVerificationSummary({ ...base, inputAttestations: [{ uri: 'https://example.test/a.intoto.json', sha256: 'c'.repeat(64) }] });
  assert.equal(statement.predicateType, 'https://slsa.dev/verification_summary/v1');
  assert.equal(statement.predicate.policy.digest.sha256, policyDigest);
  assert.equal(statement.predicate.inputAttestations[0].digest.sha256, 'c'.repeat(64));
});

test('accepts only the expected artifact, verifier, resource, policy and level', () => {
  const statement = createVerificationSummary(base);
  assert.deepEqual(evaluateVerificationSummary(statement, { ...base, requiredLevel: 'MC_EVIDENCE_POLICY_V1' }), { accepted: true, reasons: [] });
});

test('rejects a policy digest substitution', () => {
  const statement = createVerificationSummary(base);
  const result = evaluateVerificationSummary(statement, { ...base, policySha256: 'd'.repeat(64), requiredLevel: 'MC_EVIDENCE_POLICY_V1' });
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('policy.digest.sha256'));
});

test('rejects FAILED summaries disguised with a passing level', () => {
  assert.throws(() => createVerificationSummary({ ...base, verificationResult: 'FAILED' }), /failed-result-requires-FAILED-level/);
});

test('canonical JSON digest changes when a verification decision changes', () => {
  const passed = createVerificationSummary(base);
  const failed = createVerificationSummary({ ...base, verificationResult: 'FAILED', verifiedLevels: ['FAILED'] });
  assert.notEqual(sha256Json(passed), sha256Json(failed));
});
