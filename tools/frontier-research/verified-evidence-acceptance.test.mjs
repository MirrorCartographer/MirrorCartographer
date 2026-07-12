import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { createEvidenceEnvelope } from './run-evidence-envelope.mjs';
import { createEvidenceAttestation } from './evidence-attestation.mjs';
import { createTrustedBuilderPolicy } from './trusted-builder-policy.mjs';
import { dssePAE, DSSE_TYPES } from './dsse-signature-verifier.mjs';
import { evaluateVerifiedEvidenceAcceptance } from './verified-evidence-acceptance.mjs';

const artifactName = 'operations/evidence/example.json';
const artifactText = '{"result":"observed"}\n';
const sourceRepository = 'MirrorCartographer/MirrorCartographer';
const sourceCommit = '0123456789abcdef0123456789abcdef01234567';
const builderId = 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main';

function fixture() {
  const envelope = createEvidenceEnvelope({
    traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    created_at: '2026-07-12T03:00:00.000Z',
    team: 'frontier_research',
    queue_item: 'R-007',
    claim_state: 'observed',
    evidence_state: 'test-verified',
    summary: 'DSSE-bound acceptance',
    sources: ['https://github.com/secure-systems-lab/dsse/blob/master/protocol.md'],
    artifacts: [artifactName],
    falsification_routes: ['Change one signed payload byte and re-run.']
  });
  const attestation = createEvidenceAttestation({
    artifactName, artifactText, sourceRepository, sourceCommit, builderId,
    invocationId: 'run-2', startedOn: '2026-07-12T03:00:00.000Z', finishedOn: '2026-07-12T03:00:01.000Z'
  });
  const policy = createTrustedBuilderPolicy({
    allowedBuilderIds: [builderId],
    allowedSourceRepositories: [sourceRepository],
    allowedBuildTypes: ['https://mirrorcartographer.org/build-types/evidence-envelope/v1']
  });
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const payload = Buffer.from(JSON.stringify(attestation));
  const signature = sign(null, dssePAE(DSSE_TYPES.inTotoStatement, payload), privateKey);
  const dsseEnvelope = {
    payloadType: DSSE_TYPES.inTotoStatement,
    payload: payload.toString('base64'),
    signatures: [{ keyid: 'release-key', sig: signature.toString('base64') }]
  };
  return {
    artifactName, artifactText, envelope, dsseEnvelope,
    trustedKeys: { 'release-key': publicKey.export({ type: 'spki', format: 'pem' }) },
    policy,
    expected: { sourceRepository, sourceCommit, team: 'frontier_research', queueItem: 'R-007' }
  };
}

test('accepts only the attestation parsed from the verified DSSE payload', () => {
  const result = evaluateVerifiedEvidenceAcceptance(fixture());
  assert.equal(result.accepted, true);
  assert.deepEqual(result.acceptedKeyIds, ['release-key']);
  assert.match(result.attestationPayloadDigest, /^[0-9a-f]{64}$/);
});

test('rejects a payload changed after signing', () => {
  const value = fixture();
  const changed = Buffer.from(value.dsseEnvelope.payload, 'base64');
  changed[changed.length - 1] ^= 1;
  value.dsseEnvelope = { ...value.dsseEnvelope, payload: changed.toString('base64') };
  const result = evaluateVerifiedEvidenceAcceptance(value);
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('signature.signature.threshold'));
});

test('rejects a valid signature from a key outside the trusted set', () => {
  const value = fixture();
  const { publicKey } = generateKeyPairSync('ed25519');
  value.trustedKeys = { 'release-key': publicKey.export({ type: 'spki', format: 'pem' }) };
  const result = evaluateVerifiedEvidenceAcceptance(value);
  assert.equal(result.accepted, false);
});
