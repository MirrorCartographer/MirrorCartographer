import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { exactUnicodeUrl } from './unicode-data-bundle.mjs';
import { buildUnicodeIdentifierAdmissionWithSyntax, evaluateXidSyntax, parseXidSyntax } from './unicode-identifier-syntax.mjs';

const version = '17.0.0';
const files = Object.freeze({
  identifierStatus: '# IdentifierStatus-17.0.0.txt\n0030..0039 ; Allowed\n0041..005A ; Allowed\n005F ; Allowed\n0061..007A ; Allowed\n0301 ; Allowed\n0430 ; Allowed\n',
  confusables: '# confusables-17.0.0.txt\n0430 ; 0061 ; MA\n',
  derivedCoreProperties: '# DerivedCoreProperties-17.0.0.txt\n0041..005A ; XID_Start\n0061..007A ; XID_Start\n0430 ; XID_Start\n0030..0039 ; XID_Continue\n0041..005A ; XID_Continue\n005F ; XID_Continue\n0061..007A ; XID_Continue\n0301 ; XID_Continue\n0430 ; XID_Continue\n200B ; Default_Ignorable_Code_Point\n',
});

const digest = (text) => createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex');
const manifestFor = (input = files) => ({ version, files: {
  confusables: { url: exactUnicodeUrl(version, 'security/confusables.txt'), sha256: digest(input.confusables) },
  identifierStatus: { url: exactUnicodeUrl(version, 'security/IdentifierStatus.txt'), sha256: digest(input.identifierStatus) },
  derivedCoreProperties: { url: exactUnicodeUrl(version, 'ucd/DerivedCoreProperties.txt'), sha256: digest(input.derivedCoreProperties) },
}});

test('accepts UAX #31 R1-1 syntax from the authenticated bundle', () => {
  const gate = buildUnicodeIdentifierAdmissionWithSyntax(manifestFor(), files);
  const result = gate.register('alpha_2');
  assert.equal(result.accepted, true);
  assert.equal(result.syntaxEligible, true);
});

test('rejects a digit in first position even when Identifier_Status allows it', () => {
  const gate = buildUnicodeIdentifierAdmissionWithSyntax(manifestFor(), files);
  const result = gate.inspect('2alpha');
  assert.equal(result.profileEligible, true);
  assert.equal(result.syntaxEligible, false);
  assert.equal(result.admissible, false);
  assert.ok(result.reasons.includes('invalid_xid_start:U+0032:index=0'));
});

test('rejects an underscore in first position but permits it in continuation', () => {
  const dataset = parseXidSyntax(files.derivedCoreProperties, { version, sourceDigest: digest(files.derivedCoreProperties) });
  assert.equal(evaluateXidSyntax('_a', dataset).syntaxEligible, false);
  assert.equal(evaluateXidSyntax('a_b', dataset).syntaxEligible, true);
});

test('rejects an empty identifier', () => {
  const dataset = parseXidSyntax(files.derivedCoreProperties, { version, sourceDigest: digest(files.derivedCoreProperties) });
  assert.deepEqual(evaluateXidSyntax('', dataset).reasons, ['empty_identifier']);
});

test('preserves confusable collision rejection after syntax admission', () => {
  const gate = buildUnicodeIdentifierAdmissionWithSyntax(manifestFor(), files);
  assert.equal(gate.register('a').accepted, true);
  const collision = gate.register('\u0430');
  assert.equal(collision.accepted, false);
  assert.ok(collision.reasons.includes('confusable_skeleton_collision'));
});

test('fails closed on overlapping XID ranges', () => {
  const text = '# DerivedCoreProperties-17.0.0.txt\n0041..005A ; XID_Start\n0050..0060 ; XID_Start\n0041..005A ; XID_Continue\n';
  assert.throws(() => parseXidSyntax(text, { version, sourceDigest: digest(text) }), /overlapping XID_Start/);
});
