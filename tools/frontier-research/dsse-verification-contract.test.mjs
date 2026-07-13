import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dssePreAuthenticationEncoding,
  classifyDsseVerification
} from './dsse-verification-contract.mjs';

const payloadType = 'application/vnd.in-toto+json';
const payloadSha256 = 'a'.repeat(64);
const baseResult = {
  verified: true,
  pae_verified: true,
  payload_type: payloadType,
  payload_sha256: payloadSha256,
  trusted_identity: true,
  issuer: 'https://token.actions.githubusercontent.com',
  identity: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main',
  transparency_log_verified: true
};

test('constructs the DSSE v1 PAE test vector exactly', () => {
  const bytes = dssePreAuthenticationEncoding(
    'http://example.com/HelloWorld',
    new TextEncoder().encode('hello world')
  );
  assert.equal(
    new TextDecoder().decode(bytes),
    'DSSEv1 29 http://example.com/HelloWorld 11 hello world'
  );
});

test('accepts one trusted verifier result bound to exact payload bytes and type', () => {
  const result = classifyDsseVerification({
    payloadType,
    payloadSha256,
    supportedPayloadTypes: [payloadType],
    verifierResults: [baseResult]
  });
  assert.equal(result.accepted, true);
  assert.equal(result.trusted_unique_signers, 1);
});

test('rejects a signature result for a different payload digest', () => {
  const result = classifyDsseVerification({
    payloadType,
    payloadSha256,
    supportedPayloadTypes: [payloadType],
    verifierResults: [{ ...baseResult, payload_sha256: 'b'.repeat(64) }]
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'trusted_signature_threshold_not_met');
});

test('does not count duplicate signer identity toward a threshold', () => {
  const result = classifyDsseVerification({
    payloadType,
    payloadSha256,
    supportedPayloadTypes: [payloadType],
    threshold: 2,
    verifierResults: [baseResult, { ...baseResult }]
  });
  assert.equal(result.accepted, false);
  assert.equal(result.details.trusted_unique_signers, 1);
});

test('rejects untrusted identity and missing PAE verification', () => {
  for (const verifierResult of [
    { ...baseResult, trusted_identity: false },
    { ...baseResult, pae_verified: false }
  ]) {
    const result = classifyDsseVerification({
      payloadType,
      payloadSha256,
      supportedPayloadTypes: [payloadType],
      verifierResults: [verifierResult]
    });
    assert.equal(result.accepted, false);
  }
});

test('rejects unsupported payload type before considering signatures', () => {
  const result = classifyDsseVerification({
    payloadType,
    payloadSha256,
    supportedPayloadTypes: ['application/json'],
    verifierResults: [baseResult]
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'unsupported_payload_type');
});
