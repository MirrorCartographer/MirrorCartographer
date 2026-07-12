import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCryptographicBoundaryReceipt } from './cryptographic-boundary-receipt.mjs';

const digest = 'a'.repeat(64);
const base = {
  artifactSha256: digest,
  verifier: { tool: 'gh attestation verify', version: '2.x', commandPolicy: '--repo MirrorCartographer/MirrorCartographer --signer-workflow exact --format=json' },
  verificationOutput: [{ verificationResult: {
    signature: { certificate: { subjectAlternativeName: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/build.yml@refs/heads/main' } },
    verifiedTimestamps: [{ type: 'transparency-log', timestamp: '2026-07-12T00:00:00Z' }],
    statement: { subject: [{ name: 'evidence.json', digest: { sha256: digest } }], predicateType: 'https://slsa.dev/provenance/v1', predicate: { buildDefinition: { externalParameters: { userControlled: true } } } }
  }}]
};

test('separates cryptographic facts from workflow-controlled claims', () => {
  const receipt = buildCryptographicBoundaryReceipt(base);
  assert.equal(receipt.result, 'cryptographically_verified');
  assert.equal(receipt.cryptographicFacts.certificate.subjectAlternativeName.includes('build.yml'), true);
  assert.equal(receipt.workflowControlledClaims.predicate.buildDefinition.externalParameters.userControlled, true);
  assert.match(receipt.receiptSha256, /^[a-f0-9]{64}$/);
});

test('rejects ambiguous verification cardinality', () => assert.throws(() => buildCryptographicBoundaryReceipt({ ...base, verificationOutput: [] }), /exactly one/));

test('rejects missing verified timestamps', () => {
  const copy = structuredClone(base); copy.verificationOutput[0].verificationResult.verifiedTimestamps = [];
  assert.throws(() => buildCryptographicBoundaryReceipt(copy), /verifiedTimestamps/);
});

test('rejects subject digest mismatch', () => {
  const copy = structuredClone(base); copy.verificationOutput[0].verificationResult.statement.subject[0].digest.sha256 = 'b'.repeat(64);
  assert.throws(() => buildCryptographicBoundaryReceipt(copy), /does not match/);
});
