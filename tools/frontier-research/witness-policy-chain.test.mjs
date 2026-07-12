import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { policyDigest, signPolicyUpdate, verifyPolicyUpdate, versions } from './witness-policy-chain.mjs';

const kp = () => generateKeyPairSync('ed25519', { publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
const a = kp(), b = kp(), c = kp(), e = kp();
const policy = (sequence, keys, threshold = 1) => ({ version: versions.POLICY_VERSION, sequence, issued_at: `2026-07-${10 + sequence}T00:00:00Z`, expires_at: `2026-08-${10 + sequence}T00:00:00Z`, threshold, keys });
const current = policy(1, [{ key_id: 'key-a', public_key_pem: a.publicKey }, { key_id: 'key-b', public_key_pem: b.publicKey }], 2);
const next = policy(2, [{ key_id: 'key-b', public_key_pem: b.publicKey }, { key_id: 'key-c', public_key_pem: c.publicKey }], 2);
const payload = { mode: 'rotation', previous_policy_sha256: policyDigest(current), next_policy: next };

function sig(key_id, pair, signer_set, p = payload) { return signPolicyUpdate({ payload: p, key_id, signer_set, private_key_pem: pair.privateKey }); }

test('accepts rotation only with thresholds from current and incoming policy', () => {
  const decision = verifyPolicyUpdate({ current_policy: current, update: { payload, signatures: [sig('key-a', a, 'current'), sig('key-b', b, 'current'), sig('key-b', b, 'incoming'), sig('key-c', c, 'incoming')] }, now: '2026-07-20T00:00:00Z' });
  assert.equal(decision.ok, true);
  assert.equal(decision.classification, 'accepted_rotation');
});

test('rejects rollback and skipped sequence', () => {
  const badNext = { ...next, sequence: 3 };
  const badPayload = { ...payload, next_policy: badNext };
  const decision = verifyPolicyUpdate({ current_policy: current, update: { payload: badPayload, signatures: [sig('key-a', a, 'current', badPayload), sig('key-b', b, 'current', badPayload), sig('key-b', b, 'incoming', badPayload), sig('key-c', c, 'incoming', badPayload)] }, now: '2026-07-20T00:00:00Z' });
  assert.equal(decision.ok, false);
  assert.match(decision.errors.join(' '), /exactly one/);
});

test('rejects rotation missing incoming authorization', () => {
  const decision = verifyPolicyUpdate({ current_policy: current, update: { payload, signatures: [sig('key-a', a, 'current'), sig('key-b', b, 'current')] }, now: '2026-07-20T00:00:00Z' });
  assert.equal(decision.ok, false);
  assert.match(decision.errors.join(' '), /incoming policy threshold/);
});

test('accepts emergency revocation only with emergency and incoming thresholds and no retained current key ids', () => {
  const emergency = policy(1, [{ key_id: 'key-emergency', public_key_pem: e.publicKey }], 1);
  const emergencyNext = policy(2, [{ key_id: 'key-c', public_key_pem: c.publicKey }], 1);
  const emergencyPayload = { mode: 'emergency_revocation', previous_policy_sha256: policyDigest(current), next_policy: emergencyNext, emergency_reason: 'confirmed key custody compromise' };
  const signatures = [sig('key-emergency', e, 'emergency', emergencyPayload), sig('key-c', c, 'incoming', emergencyPayload)];
  const decision = verifyPolicyUpdate({ current_policy: current, emergency_policy: emergency, update: { payload: emergencyPayload, signatures }, now: '2026-07-20T00:00:00Z' });
  assert.equal(decision.ok, true);
  assert.equal(decision.classification, 'accepted_emergency_revocation');
});

test('rejects emergency update that retains a current key id', () => {
  const emergency = policy(1, [{ key_id: 'key-emergency', public_key_pem: e.publicKey }], 1);
  const emergencyNext = policy(2, [{ key_id: 'key-b', public_key_pem: b.publicKey }], 1);
  const emergencyPayload = { mode: 'emergency_revocation', previous_policy_sha256: policyDigest(current), next_policy: emergencyNext, emergency_reason: 'confirmed key custody compromise' };
  const signatures = [sig('key-emergency', e, 'emergency', emergencyPayload), sig('key-b', b, 'incoming', emergencyPayload)];
  const decision = verifyPolicyUpdate({ current_policy: current, emergency_policy: emergency, update: { payload: emergencyPayload, signatures }, now: '2026-07-20T00:00:00Z' });
  assert.equal(decision.ok, false);
  assert.match(decision.errors.join(' '), /remove all current/);
});
