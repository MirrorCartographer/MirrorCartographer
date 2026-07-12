import assert from 'node:assert/strict';
import test from 'node:test';
import {
  adaptGhAttestationVerificationOutput,
  evaluateGhAttestationVerificationOutput
} from './gh-attestation-output-adapter.mjs';

function validEntry() {
  return {
    attestation: { mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json' },
    verificationResult: {
      signature: { certificate: { SourceRepository: 'MirrorCartographer/MirrorCartographer' } },
      verifiedTimestamps: [{ type: 'rekor' }],
      statement: {
        subject: [{ name: 'artifact', digest: { sha256: 'a'.repeat(64) } }],
        predicateType: 'https://slsa.dev/provenance/v1',
        predicate: { buildDefinition: { externalParameters: {} } }
      }
    }
  };
}

test('accepts the documented one-entry gh JSON shape', () => {
  const result = adaptGhAttestationVerificationOutput([validEntry()]);
  assert.equal(result.accepted, true);
  assert.equal(result.entries.length, 1);
  assert.equal(result.metadata.cardinality, 1);
});

test('rejects zero or multiple verified attestations', () => {
  assert.deepEqual(adaptGhAttestationVerificationOutput([]).reasons, ['exactly-one-verified-attestation-required']);
  assert.deepEqual(adaptGhAttestationVerificationOutput([validEntry(), validEntry()]).reasons, ['exactly-one-verified-attestation-required']);
});

test('rejects output missing verifier-authenticated certificate or timestamps', () => {
  const entry = validEntry();
  delete entry.verificationResult.signature.certificate;
  entry.verificationResult.verifiedTimestamps = [];
  const result = adaptGhAttestationVerificationOutput([entry]);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['verified-certificate-required', 'verified-timestamp-required']);
});

test('passes only validated normalized entries to the policy evaluator', () => {
  let called = false;
  const result = evaluateGhAttestationVerificationOutput([validEntry()], { repo: 'expected' }, (entries, expected) => {
    called = true;
    assert.equal(entries.length, 1);
    assert.equal(expected.repo, 'expected');
    return Object.freeze({ accepted: true, reasons: Object.freeze([]) });
  });
  assert.equal(called, true);
  assert.equal(result.accepted, true);
});

test('fails closed when the downstream evaluator is absent', () => {
  const result = evaluateGhAttestationVerificationOutput([validEntry()], {}, null);
  assert.deepEqual(result.reasons, ['evaluator-function-required']);
});
