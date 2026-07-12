import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { signCheckpoint, createWitnessRecord } from './signed-checkpoint-witness.mjs';
import { evaluateWitnessQuorum } from './multi-witness-quorum.mjs';

const keys = generateKeyPairSync('ed25519');
const signerId = 'frontier-log';
const trustedSigners = { [signerId]: keys.publicKey.export({ type: 'spki', format: 'pem' }) };
const policy = { version: 'frontier.multi-witness-policy.v1', minimum_witnesses: 2, maximum_age_seconds: 300, trusted_witness_ids: ['witness-a', 'witness-b', 'witness-c'] };
const now = '2026-07-12T19:04:00.000Z';
function signed(size, rootChar) { return signCheckpoint({ checkpoint: { version: 'frontier.peer-trigger-checkpoint.v1', tree_size: size, root_hash_sha256: rootChar.repeat(64) }, signer_id: signerId, private_key_pem: keys.privateKey }); }
function record(id, cp, at = now) { return createWitnessRecord({ witness_id: id, observed_at: at, signed_checkpoint: cp }); }

test('accepts fresh unique trusted witnesses agreeing on one signed checkpoint', () => {
  const cp = signed(9, 'a');
  const result = evaluateWitnessQuorum({ records: [record('witness-a', cp), record('witness-b', cp)], policy, trusted_signers: trustedSigners, now });
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'quorum_accepted');
  assert.deepEqual(result.accepted_witness_ids, ['witness-a', 'witness-b']);
});

test('duplicate witness cannot satisfy quorum', () => {
  const cp = signed(9, 'a');
  const result = evaluateWitnessQuorum({ records: [record('witness-a', cp), record('witness-a', cp)], policy, trusted_signers: trustedSigners, now });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'insufficient_quorum');
});

test('equal-size divergent roots fail as equivocation', () => {
  const result = evaluateWitnessQuorum({ records: [record('witness-a', signed(9, 'a')), record('witness-b', signed(9, 'b'))], policy, trusted_signers: trustedSigners, now });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'equivocation');
});

test('stale and untrusted witnesses are excluded from quorum', () => {
  const cp = signed(9, 'a');
  const result = evaluateWitnessQuorum({ records: [record('witness-a', cp, '2026-07-12T18:00:00.000Z'), record('rogue', cp)], policy, trusted_signers: trustedSigners, now });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'insufficient_quorum');
});
