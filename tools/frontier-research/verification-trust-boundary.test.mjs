import assert from 'node:assert/strict';
import { evaluateVerificationOutput } from './verification-trust-boundary.mjs';

const digest = 'a'.repeat(64);
const expected = {
  subjectSha256: digest,
  predicateType: 'https://slsa.dev/provenance/v1',
  sourceRepository: 'MirrorCartographer/MirrorCartographer',
  signerWorkflow: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/frontier.yml@refs/heads/main',
  oidcIssuer: 'https://token.actions.githubusercontent.com'
};

function validEntry() {
  return {
    verificationResult: {
      signature: { certificate: {
        extensions: {
          SourceRepository: expected.sourceRepository,
          SubjectAlternativeName: expected.signerWorkflow,
          Issuer: expected.oidcIssuer
        }
      } },
      verifiedTimestamps: [{ source: 'rekor', time: '2026-07-12T00:00:00Z' }],
      statement: {
        subject: [{ name: 'evidence.json', digest: { sha256: digest } }],
        predicateType: expected.predicateType,
        predicate: { sourceRepository: 'attacker-controlled/lookalike', claim: 'not trusted merely because signed' }
      }
    }
  };
}

{
  const result = evaluateVerificationOutput([validEntry()], expected);
  assert.equal(result.accepted, true);
  assert.equal(result.trustZones.verifierAuthenticated.certificate.sourceRepository, expected.sourceRepository);
  assert.equal(result.trustZones.signedButWorkflowControlled.predicatePresent, true);
}

{
  const entry = validEntry();
  entry.verificationResult.statement.predicate.sourceRepository = expected.sourceRepository;
  entry.verificationResult.signature.certificate.extensions.SourceRepository = 'attacker/lookalike';
  const result = evaluateVerificationOutput([entry], expected);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['certificate-source-repository-mismatch']);
}

{
  const entry = validEntry();
  entry.verificationResult.verifiedTimestamps = [];
  const result = evaluateVerificationOutput([entry], expected);
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('verified-timestamp-required'));
}

{
  const result = evaluateVerificationOutput([validEntry(), validEntry()], expected);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['exactly-one-verified-attestation-required']);
}

console.log('verification trust boundary: 4 tests passed');
