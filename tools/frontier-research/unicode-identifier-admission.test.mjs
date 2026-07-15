import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { exactUnicodeUrl } from './unicode-data-bundle.mjs';
import { buildUnicodeIdentifierAdmission, parseDefaultIgnorables } from './unicode-identifier-admission.mjs';

const version = '17.0.0';
const files = Object.freeze({
  identifierStatus: '# IdentifierStatus-17.0.0.txt\n0041..005A ; Allowed\n0061..007A ; Allowed\n0430 ; Allowed\n200B ; Restricted\n',
  confusables: '# confusables-17.0.0.txt\n0430 ; 0061 ; MA # CYRILLIC SMALL LETTER A\n',
  derivedCoreProperties: '# DerivedCoreProperties-17.0.0.txt\n200B ; Default_Ignorable_Code_Point # ZERO WIDTH SPACE\n',
});

function digest(text) {
  return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex');
}

function manifestFor(input = files) {
  return {
    version,
    files: {
      confusables: { url: exactUnicodeUrl(version, 'security/confusables.txt'), sha256: digest(input.confusables) },
      identifierStatus: { url: exactUnicodeUrl(version, 'security/IdentifierStatus.txt'), sha256: digest(input.identifierStatus) },
      derivedCoreProperties: { url: exactUnicodeUrl(version, 'ucd/DerivedCoreProperties.txt'), sha256: digest(input.derivedCoreProperties) },
    },
  };
}

test('builds one admission gate from one authenticated exact-version bundle', () => {
  const gate = buildUnicodeIdentifierAdmission(manifestFor(), files);
  const result = gate.inspect('alpha');
  assert.equal(gate.version, version);
  assert.equal(result.authenticatedBundle, true);
  assert.equal(result.profileEligible, true);
  assert.equal(result.skeletonUnique, true);
  assert.equal(result.admissible, true);
  assert.equal(result.sourceDigests.confusables, digest(files.confusables));
});

test('rejects a restricted identifier before registration', () => {
  const gate = buildUnicodeIdentifierAdmission(manifestFor(), files);
  const result = gate.register('\u200B');
  assert.equal(result.accepted, false);
  assert.equal(result.profileEligible, false);
  assert.ok(result.reasons.includes('restricted:U+200B'));
});

test('rejects a second identifier with the same authenticated confusable skeleton', () => {
  const gate = buildUnicodeIdentifierAdmission(manifestFor(), files);
  const latin = gate.register('a');
  const cyrillic = gate.register('\u0430');
  assert.equal(latin.accepted, true);
  assert.equal(cyrillic.accepted, false);
  assert.equal(cyrillic.skeletonUnique, false);
  assert.ok(cyrillic.reasons.includes('confusable_skeleton_collision'));
});

test('uses version-matched Default_Ignorable_Code_Point data in skeleton computation', () => {
  const dataset = parseDefaultIgnorables(files.derivedCoreProperties, { version, sourceDigest: digest(files.derivedCoreProperties) });
  assert.equal(dataset.contains(0x200B), true);
  assert.equal(dataset.contains(0x0061), false);
});

test('fails closed when any authenticated source byte changes', () => {
  const changed = { ...files, confusables: `${files.confusables}006F ; 0030 ; MA\n` };
  assert.throws(() => buildUnicodeIdentifierAdmission(manifestFor(), changed), /digest mismatch/);
});

test('fails closed on overlapping Default_Ignorable ranges', () => {
  const text = '# DerivedCoreProperties-17.0.0.txt\n200B..200D ; Default_Ignorable_Code_Point\n200C ; Default_Ignorable_Code_Point\n';
  assert.throws(() => parseDefaultIgnorables(text, { version, sourceDigest: digest(text) }), /overlapping/);
});
