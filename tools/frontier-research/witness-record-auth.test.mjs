import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { createEquivocationPacket, signWitnessRecord, verifyWitnessRecord } from './witness-record-auth.mjs';

const pair = () => generateKeyPairSync('ed25519', { publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
const a = pair();
const b = pair();
const checkpoint = (root) => ({ version: 'frontier.signed-checkpoint.v1', signer_id: 'log/main', checkpoint: { version: 'frontier.peer-trigger-checkpoint.v1', tree_size: 9, root_hash_sha256: root }, algorithm: 'Ed25519', signature_base64: 'checkpoint-signature-is-opaque-here' });
const policy = { version: 'frontier.witness-key-policy.v1', keys: [
  { witness_id: 'witness/a', key_id: 'a-2026q3', public_key_pem: a.publicKey, valid_from: '2026-07-01T00:00:00Z', valid_until: '2026-10-01T00:00:00Z' },
  { witness_id: 'witness/b', key_id: 'b-2026q3', public_key_pem: b.publicKey, valid_from: '2026-07-01T00:00:00Z', valid_until: '2026-10-01T00:00:00Z', revoked_at: '2026-08-15T00:00:00Z' }
]};
const root1 = '11'.repeat(32);
const root2 = '22'.repeat(32);

test('accepts a signature inside its configured key epoch', () => {
  const record = signWitnessRecord({ witness_id: 'witness/a', key_id: 'a-2026q3', observed_at: '2026-07-12T19:00:00Z', signed_checkpoint: checkpoint(root1), private_key_pem: a.privateKey });
  assert.equal(verifyWitnessRecord(record, policy).classification, 'authenticated');
});

test('rejects a record after key revocation', () => {
  const record = signWitnessRecord({ witness_id: 'witness/b', key_id: 'b-2026q3', observed_at: '2026-08-16T00:00:00Z', signed_checkpoint: checkpoint(root1), private_key_pem: b.privateKey });
  assert.match(verifyWitnessRecord(record, policy).errors.join(' '), /revoked/);
});

test('rejects a signature relabeled to another key epoch', () => {
  const record = signWitnessRecord({ witness_id: 'witness/a', key_id: 'a-2026q3', observed_at: '2026-07-12T19:00:00Z', signed_checkpoint: checkpoint(root1), private_key_pem: a.privateKey });
  record.key_id = 'a-lookalike';
  assert.equal(verifyWitnessRecord(record, policy).ok, false);
});

test('emits a portable packet only for authenticated same-size divergent roots', () => {
  const ra = signWitnessRecord({ witness_id: 'witness/a', key_id: 'a-2026q3', observed_at: '2026-07-12T19:00:00Z', signed_checkpoint: checkpoint(root1), private_key_pem: a.privateKey });
  const rb = signWitnessRecord({ witness_id: 'witness/b', key_id: 'b-2026q3', observed_at: '2026-07-12T19:00:01Z', signed_checkpoint: checkpoint(root2), private_key_pem: b.privateKey });
  const packet = createEquivocationPacket({ records: [rb, ra], policy, detected_at: '2026-07-12T19:01:00Z' });
  assert.equal(packet.classification, 'authenticated_equivocation_evidence');
  assert.deepEqual(packet.divergent_roots_sha256, [root1, root2]);
  assert.match(packet.record_bundle_sha256, /^[0-9a-f]{64}$/);
});
