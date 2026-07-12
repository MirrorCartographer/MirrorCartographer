import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { evaluateRootRotation, rootDigest, versions } from './root-policy-rotation.mjs';

function key(id) {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  return { id, public_key_pem: publicKey.export({ type: 'spki', format: 'pem' }), privateKey };
}
function unsigned(version, set, threshold, keys) {
  return { version: versions.VERSION, root_version: version, authority_set: set, threshold, authorities: keys.map(({id, public_key_pem}) => ({id, public_key_pem})), issued_at: '2026-07-12T19:00:00Z', expires_at: '2026-07-13T19:00:00Z', signatures: [] };
}
function payload(root) {
  return Buffer.from(JSON.stringify({version: versions.VERSION, root_version: root.root_version, authority_set: root.authority_set, threshold: root.threshold, authorities: [...root.authorities].sort((a,b)=>a.id.localeCompare(b.id)), issued_at: root.issued_at, expires_at: root.expires_at}));
}
function addSignatures(root, keys) {
  root.signatures.push(...keys.map(k => ({ keyid: k.id, sig_base64: sign(null, payload(root), k.privateKey).toString('base64') })));
  return root;
}
const now = new Date('2026-07-12T20:00:00Z');

test('accepts sequential root signed by old and new thresholds', () => {
  const old = [key('o1'), key('o2'), key('o3')], fresh = [key('n1'), key('n2'), key('n3')];
  const trusted = unsigned(4, 'old', 2, old);
  const proposed = addSignatures(unsigned(5, 'new', 2, fresh), [old[0], old[1], fresh[0], fresh[1]]);
  assert.equal(evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now}).classification, 'dual_threshold_rotation_accepted');
});

test('rejects rollback or replay', () => {
  const ks = [key('a'), key('b')];
  const trusted = unsigned(4, 'old', 1, ks);
  const proposed = addSignatures(unsigned(4, 'new', 1, ks), [ks[0]]);
  assert.equal(evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now}).classification, 'root_rollback_or_replay');
});

test('rejects skipped root versions', () => {
  const ks = [key('a'), key('b')];
  const trusted = unsigned(4, 'old', 1, ks);
  const proposed = addSignatures(unsigned(6, 'new', 1, ks), [ks[0]]);
  assert.equal(evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now}).classification, 'non_sequential_root_version');
});

test('rejects rotation missing old threshold', () => {
  const old = [key('o1'), key('o2')], fresh = [key('n1'), key('n2')];
  const trusted = unsigned(1, 'old', 2, old);
  const proposed = addSignatures(unsigned(2, 'new', 2, fresh), [old[0], fresh[0], fresh[1]]);
  assert.equal(evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now}).classification, 'old_threshold_missing');
});

test('rejects rotation missing new threshold', () => {
  const old = [key('o1'), key('o2')], fresh = [key('n1'), key('n2')];
  const trusted = unsigned(1, 'old', 2, old);
  const proposed = addSignatures(unsigned(2, 'new', 2, fresh), [old[0], old[1], fresh[0]]);
  assert.equal(evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now}).classification, 'new_threshold_missing');
});

test('emergency recovery requires exact out-of-band digest and new threshold', () => {
  const old = [key('o1'), key('o2')], fresh = [key('n1'), key('n2')];
  const trusted = unsigned(1, 'old', 2, old);
  const proposed = addSignatures(unsigned(2, 'new', 2, fresh), [fresh[0], fresh[1]]);
  const result = evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now, emergency_recovery: {out_of_band_root_sha256: rootDigest(proposed)}});
  assert.equal(result.classification, 'out_of_band_emergency_rotation_accepted');
});

test('rejects expired proposed root', () => {
  const ks = [key('a')];
  const trusted = unsigned(1, 'old', 1, ks);
  const proposed = unsigned(2, 'new', 1, ks);
  proposed.expires_at = '2026-07-12T19:30:00Z';
  assert.throws(() => evaluateRootRotation({trusted_root: trusted, proposed_root: proposed, now}), /expired/);
});
