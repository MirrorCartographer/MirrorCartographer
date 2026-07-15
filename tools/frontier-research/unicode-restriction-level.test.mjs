import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyRestrictionLevel, LEVELS } from './unicode-restriction-level.mjs';

const recommendedScripts = ['Latn', 'Arab', 'Deva', 'Hebr', 'Cyrl', 'Grek'];

test('profile failure is Unrestricted before script analysis', () => {
  const decision = classifyRestrictionLevel({ identifier: 'a', profileEligible: false, scriptSets: [['Latn']], recommendedScripts });
  assert.equal(decision.level, LEVELS.UNRESTRICTED);
});

test('ASCII and non-ASCII single-script identifiers are separated', () => {
  assert.equal(classifyRestrictionLevel({ identifier: 'alpha', profileEligible: true, scriptSets: Array(5).fill(['Latn']), recommendedScripts }).level, LEVELS.ASCII_ONLY);
  assert.equal(classifyRestrictionLevel({ identifier: 'αλφα', profileEligible: true, scriptSets: Array(4).fill(['Grek']), recommendedScripts }).level, LEVELS.SINGLE_SCRIPT);
});

test('Latin plus Japanese coverage is Highly Restrictive', () => {
  const decision = classifyRestrictionLevel({ identifier: 'a日カ', profileEligible: true, scriptSets: [['Latn'], ['Hani'], ['Kana']], recommendedScripts });
  assert.equal(decision.level, LEVELS.HIGHLY_RESTRICTIVE);
});

test('Latin plus one Recommended script excluding Greek and Cyrillic is Moderately Restrictive', () => {
  const decision = classifyRestrictionLevel({ identifier: 'aअ', profileEligible: true, scriptSets: [['Latn'], ['Deva']], recommendedScripts });
  assert.equal(decision.level, LEVELS.MODERATELY_RESTRICTIVE);
  assert.deepEqual(decision.reasons, ['recommended_companion:Deva']);
});

test('Latin plus Greek and Latin plus Cyrillic remain Minimally Restrictive', () => {
  for (const [identifier, script] of [['aα', 'Grek'], ['aа', 'Cyrl']]) {
    const decision = classifyRestrictionLevel({ identifier, profileEligible: true, scriptSets: [['Latn'], [script]], recommendedScripts });
    assert.equal(decision.level, LEVELS.MINIMALLY_RESTRICTIVE);
  }
});

test('Common and Inherited entries do not manufacture a mixed-script result', () => {
  const decision = classifyRestrictionLevel({ identifier: 'é·', profileEligible: true, scriptSets: [['Latn'], ['Common']], recommendedScripts });
  assert.equal(decision.level, LEVELS.SINGLE_SCRIPT);
});

test('scalar cardinality and script codes fail closed', () => {
  assert.throws(() => classifyRestrictionLevel({ identifier: 'ab', profileEligible: true, scriptSets: [['Latn']], recommendedScripts }), /one entry per Unicode scalar/);
  assert.throws(() => classifyRestrictionLevel({ identifier: 'a', profileEligible: true, scriptSets: [['latin']], recommendedScripts }), /invalid script code/);
});
