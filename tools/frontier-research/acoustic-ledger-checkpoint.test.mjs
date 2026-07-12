import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { checkpointBytes, createSignedCheckpoint, verifySignedCheckpoint } from './acoustic-ledger-checkpoint.mjs';

const keys = generateKeyPairSync('ed25519');
const otherKeys = generateKeyPairSync('ed25519');
const publicPem = keys.publicKey.export({ type: 'spki', format: 'pem' });
const otherPublicPem = otherKeys.publicKey.export({ type: 'spki', format: 'pem' });

function checkpoint(overrides = {}) {
  return {
    schemaVersion: '1.0.0',
    ledgerId: 'iphone-audio-trial-2026-07-12',
    protocolHash: 'a'.repeat(64),
    headHash: 'b'.repeat(64),
    trialCount: 12,
    issuedAt: '2026-07-12T17:00:00.000Z',
    keyId: 'frontier-test-key-1',
    ...overrides
  };
}

function signed(value = checkpoint(), privateKey = keys.privateKey) {
  return createSignedCheckpoint({ checkpoint: value, privateKey });
}

test('accepts a trusted Ed25519 checkpoint bound to expected ledger state', () => {
  const result = verifySignedCheckpoint({
    signedCheckpoint: signed(),
    trustedKeys: { 'frontier-test-key-1': publicPem },
    expected: {
      ledgerId: 'iphone-audio-trial-2026-07-12',
      protocolHash: 'a'.repeat(64),
      headHash: 'b'.repeat(64),
      trialCount: 12
    }
  });
  assert.equal(result.accepted, true);
});

test('rejects mutation after signing', () => {
  const record = signed();
  record.checkpoint.trialCount = 13;
  const result = verifySignedCheckpoint({
    signedCheckpoint: record,
    trustedKeys: { 'frontier-test-key-1': publicPem }
  });
  assert.deepEqual(result, { accepted: false, reason: 'signature_verification_failed' });
});

test('rejects a structurally valid signature from an untrusted key', () => {
  const record = signed(checkpoint(), otherKeys.privateKey);
  const result = verifySignedCheckpoint({
    signedCheckpoint: record,
    trustedKeys: { 'frontier-test-key-1': publicPem }
  });
  assert.deepEqual(result, { accepted: false, reason: 'signature_verification_failed' });
});

test('rejects a complete rewritten ledger checkpoint under an untrusted key id', () => {
  const rewritten = signed(checkpoint({
    protocolHash: 'c'.repeat(64),
    headHash: 'd'.repeat(64),
    keyId: 'attacker-key'
  }), otherKeys.privateKey);
  const result = verifySignedCheckpoint({
    signedCheckpoint: rewritten,
    trustedKeys: { 'frontier-test-key-1': publicPem, 'other-known-key': otherPublicPem }
  });
  assert.deepEqual(result, { accepted: false, reason: 'untrusted_key_id' });
});

test('rejects a valid trusted signature that does not match the expected retained head', () => {
  const result = verifySignedCheckpoint({
    signedCheckpoint: signed(),
    trustedKeys: { 'frontier-test-key-1': publicPem },
    expected: { headHash: 'e'.repeat(64) }
  });
  assert.deepEqual(result, { accepted: false, reason: 'unexpected_headHash' });
});

test('canonical bytes are invariant to object insertion order for the constrained checkpoint', () => {
  const a = checkpoint();
  const b = {
    keyId: a.keyId,
    issuedAt: a.issuedAt,
    trialCount: a.trialCount,
    headHash: a.headHash,
    protocolHash: a.protocolHash,
    ledgerId: a.ledgerId,
    schemaVersion: a.schemaVersion
  };
  assert.equal(checkpointBytes(a).toString('utf8'), checkpointBytes(b).toString('utf8'));
});
