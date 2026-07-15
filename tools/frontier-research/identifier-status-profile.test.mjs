import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateIdentifierStatus, parseIdentifierStatus } from './identifier-status-profile.mjs';

const DATA = `
0041..005A ; Allowed # Latin uppercase
0061..007A ; Allowed
00E9 ; Allowed
0301 ; Allowed
200D ; Restricted
`;
const dataset = parseIdentifierStatus(DATA, { version: 'synthetic-17.0.0', sourceDigest: 'sha256:test' });

test('allows covered Allowed scalars', () => {
  const result = evaluateIdentifierStatus('Alpha', dataset);
  assert.equal(result.complete, true);
  assert.equal(result.eligible, true);
  assert.deepEqual(result.reasons, []);
});

test('rejects a covered Restricted scalar', () => {
  const result = evaluateIdentifierStatus(`a\u200Db`, dataset);
  assert.equal(result.complete, true);
  assert.equal(result.eligible, false);
  assert.deepEqual(result.reasons, ['restricted:U+200D']);
});

test('fails closed when status coverage is missing', () => {
  const result = evaluateIdentifierStatus('a1', dataset);
  assert.equal(result.complete, false);
  assert.equal(result.eligible, false);
  assert.deepEqual(result.reasons, ['status_missing:U+0031']);
});

test('uses NFC so canonically equivalent forms agree', () => {
  const composed = evaluateIdentifierStatus('\u00E9', dataset);
  const decomposed = evaluateIdentifierStatus('e\u0301', dataset);
  assert.equal(composed.normalized, decomposed.normalized);
  assert.equal(composed.eligible, decomposed.eligible);
  assert.deepEqual(composed.reasons, decomposed.reasons);
});

test('rejects overlapping source ranges', () => {
  assert.throws(() => parseIdentifierStatus('0041..005A ; Allowed\n005A ; Restricted', {
    version: 'x', sourceDigest: 'sha256:x',
  }), /overlapping/);
});

test('rejects non-scalar source values', () => {
  assert.throws(() => parseIdentifierStatus('D800 ; Restricted', {
    version: 'x', sourceDigest: 'sha256:x',
  }), /non-scalar/);
});
