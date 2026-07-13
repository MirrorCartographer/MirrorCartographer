import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySigningTime } from './signing-time-policy.mjs';

const window = { certificateNotBefore: 1000, certificateNotAfter: 2000 };

test('accepts verified RFC3161 time within certificate validity', () => {
  const result = classifySigningTime({ ...window, timestampEvidence: { type: 'rfc3161', time: 1500, signature_verified: true, trusted_tsa: true } });
  assert.equal(result.accepted, true);
  assert.equal(result.trust_basis, 'verified_rfc3161_timestamp');
});

test('rejects bare Rekor v1 integrated time', () => {
  const result = classifySigningTime({ ...window, timestampEvidence: { type: 'rekor_v1', time: 1500 } });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'bare_rekor_integrated_time_not_trusted');
});

test('accepts Rekor v1 time only when the signed entry timestamp was verified', () => {
  const result = classifySigningTime({ ...window, timestampEvidence: { type: 'rekor_v1', time: 1500, signed_entry_timestamp_verified: true } });
  assert.equal(result.accepted, true);
  assert.equal(result.trust_basis, 'verified_rekor_signed_entry_timestamp');
});

test('rejects verified time outside certificate validity', () => {
  const result = classifySigningTime({ ...window, timestampEvidence: { type: 'rfc3161', time: 2001, signature_verified: true, trusted_tsa: true } });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'timestamp_outside_certificate_validity');
});

test('rejects Rekor v2 time without trusted TSA verification', () => {
  const result = classifySigningTime({ ...window, timestampEvidence: { type: 'rekor_v2', time: 1500, signature_verified: true, trusted_tsa: false } });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'unverified_rekor_v2_timestamp');
});
