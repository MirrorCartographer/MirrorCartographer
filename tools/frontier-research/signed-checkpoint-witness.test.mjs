import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { signCheckpoint, verifySignedCheckpoint, compareWitnessedCheckpoints, createWitnessRecord } from './signed-checkpoint-witness.mjs';

const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const private_key_pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
const public_key_pem = publicKey.export({ type: 'spki', format: 'pem' });
const trusted = { 'team/frontier': public_key_pem };
const checkpoint = (tree_size, root) => ({ version: 'frontier.peer-trigger-checkpoint.v1', tree_size, root_hash_sha256: root.repeat(64) });
const signed = cp => signCheckpoint({ checkpoint: cp, signer_id: 'team/frontier', private_key_pem });

test('accepts a trusted Ed25519 checkpoint signature', () => {
  const value = signed(checkpoint(4, 'a'));
  assert.deepEqual(verifySignedCheckpoint(value, trusted), { ok: true, errors: [] });
});

test('rejects tampering and untrusted signer identity', () => {
  const value = signed(checkpoint(4, 'a'));
  value.checkpoint.root_hash_sha256 = 'b'.repeat(64);
  assert.equal(verifySignedCheckpoint(value, trusted).ok, false);
  assert.equal(verifySignedCheckpoint({ ...value, signer_id: 'team/lookalike' }, trusted).ok, false);
});

test('detects equal-size divergent roots as equivocation', () => {
  const result = compareWitnessedCheckpoints({
    previous: signed(checkpoint(8, 'a')),
    next: signed(checkpoint(8, 'b')),
    trusted_signers: trusted
  });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'equivocation');
});

test('classifies rollback and missing consistency evidence', () => {
  const rollback = compareWitnessedCheckpoints({ previous: signed(checkpoint(8, 'a')), next: signed(checkpoint(4, 'b')), trusted_signers: trusted });
  assert.equal(rollback.classification, 'rollback');
  const unproven = compareWitnessedCheckpoints({ previous: signed(checkpoint(4, 'a')), next: signed(checkpoint(8, 'b')), trusted_signers: trusted });
  assert.equal(unproven.classification, 'unproven_extension');
});

test('creates normalized witness observations without asserting global truth', () => {
  const record = createWitnessRecord({ witness_id: 'observer/a', observed_at: '2026-07-12T18:00:00Z', signed_checkpoint: signed(checkpoint(4, 'a')) });
  assert.equal(record.version, 'frontier.checkpoint-witness.v1');
  assert.equal(record.observed_at, '2026-07-12T18:00:00.000Z');
});
