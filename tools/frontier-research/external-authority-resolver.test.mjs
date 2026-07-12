import assert from 'node:assert/strict';
import test from 'node:test';
import { generateKeyPairSync, sign } from 'node:crypto';
import { resolveExternalAuthority, versions } from './external-authority-resolver.mjs';

const keys = ['alpha', 'beta', 'gamma'].map(id => {
  const pair = generateKeyPairSync('ed25519');
  return { id, privateKey: pair.privateKey, public_key_pem: pair.publicKey.export({ type: 'spki', format: 'pem' }) };
});
const policy = { authority_set: 'mc-frontier-root-v1', threshold: 2, authorities: keys.map(({ id, public_key_pem }) => ({ id, public_key_pem })) };
const candidates = [
  { policy_sequence: 7, state_sha256: 'a'.repeat(64) },
  { policy_sequence: 8, state_sha256: 'b'.repeat(64) }
];
const now = new Date('2026-07-12T20:00:00Z');

function statement(candidate, signerIds = ['alpha', 'beta'], overrides = {}) {
  const base = {
    version: versions.VERSION,
    authority_set: policy.authority_set,
    policy_sequence: candidate.policy_sequence,
    state_sha256: candidate.state_sha256,
    issued_at: '2026-07-12T19:00:00Z',
    expires_at: '2026-07-13T19:00:00Z',
    ...overrides
  };
  const payload = Buffer.from(JSON.stringify({ version: base.version, authority_set: base.authority_set, policy_sequence: base.policy_sequence, state_sha256: base.state_sha256, issued_at: base.issued_at, expires_at: base.expires_at }));
  base.signatures = signerIds.map(id => ({ keyid: id, sig_base64: sign(null, payload, keys.find(key => key.id === id).privateKey).toString('base64') }));
  return base;
}

test('selects a candidate with threshold signatures', () => {
  const result = resolveExternalAuthority({ policy, statements: [statement(candidates[1])], candidates, now });
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'threshold_authority_selected');
  assert.deepEqual(result.selected, candidates[1]);
});

test('rejects a single valid signer below threshold', () => {
  const result = resolveExternalAuthority({ policy, statements: [statement(candidates[0], ['alpha'])], candidates, now });
  assert.equal(result.classification, 'no_threshold_authority');
});

test('does not count duplicate signatures from one authority twice', () => {
  const signed = statement(candidates[0], ['alpha']);
  signed.signatures.push({ ...signed.signatures[0] });
  const result = resolveExternalAuthority({ policy, statements: [signed], candidates, now });
  assert.equal(result.classification, 'no_threshold_authority');
});

test('rejects expired authority statements', () => {
  const result = resolveExternalAuthority({ policy, statements: [statement(candidates[0], ['alpha', 'beta'], { expires_at: '2026-07-12T19:30:00Z' })], candidates, now });
  assert.equal(result.classification, 'no_threshold_authority');
  assert.equal(result.observations[0].reason, 'expired');
});

test('rejects statements for a state outside the divergent candidate set', () => {
  const outsider = { policy_sequence: 99, state_sha256: 'c'.repeat(64) };
  const result = resolveExternalAuthority({ policy, statements: [statement(outsider)], candidates, now });
  assert.equal(result.observations[0].reason, 'statement_not_for_candidate');
});

test('fails closed when separate threshold statements authorize different candidates', () => {
  const result = resolveExternalAuthority({ policy, statements: [statement(candidates[0]), statement(candidates[1], ['beta', 'gamma'])], candidates, now });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'conflicting_threshold_authorities');
});
