import test from 'node:test';
import assert from 'node:assert/strict';
import { validateActionPinPlan } from './validate-action-pin-plan.mjs';

const audit = { required_resolution: [
  { ref: 'actions/checkout@v6', action: 'actions/checkout' },
  { ref: 'actions/upload-artifact@v4', action: 'actions/upload-artifact' }
] };

const validEntry = (ref, action, sha = 'a'.repeat(40)) => ({
  ref,
  action,
  resolved_sha: sha,
  upstream_tag: ref.split('@')[1],
  source_url: `https://github.com/${action}`,
  reviewed_by: 'cloudflare_research',
  reviewed_at: '2026-07-12T22:10:00Z',
  review_scope: 'release identity and upstream diff'
});

test('accepts complete reviewed immutable plan', () => {
  const result = validateActionPinPlan(audit, { entries: [
    validEntry('actions/checkout@v6', 'actions/checkout'),
    validEntry('actions/upload-artifact@v4', 'actions/upload-artifact', 'b'.repeat(40))
  ] });
  assert.equal(result.status, 'approved_pin_plan');
});

test('rejects missing resolution', () => {
  const result = validateActionPinPlan(audit, { entries: [validEntry('actions/checkout@v6', 'actions/checkout')] });
  assert.equal(result.status, 'pin_plan_rejected');
  assert.ok(result.findings.some((finding) => finding.status === 'missing_resolution'));
});

test('rejects mutable or malformed sha', () => {
  const result = validateActionPinPlan(audit, { entries: [
    validEntry('actions/checkout@v6', 'actions/checkout', 'v6'),
    validEntry('actions/upload-artifact@v4', 'actions/upload-artifact')
  ] });
  assert.ok(result.findings.some((finding) => finding.problems?.includes('resolved_sha_not_40_hex')));
});

test('rejects action mismatch and unexpected entries', () => {
  const result = validateActionPinPlan(audit, { entries: [
    validEntry('actions/checkout@v6', 'evil/checkout'),
    validEntry('actions/upload-artifact@v4', 'actions/upload-artifact'),
    validEntry('extra/action@v1', 'extra/action')
  ] });
  assert.equal(result.status, 'pin_plan_rejected');
  assert.ok(result.findings.some((finding) => finding.problems?.includes('action_mismatch')));
  assert.ok(result.findings.some((finding) => finding.status === 'unexpected_resolution'));
});
