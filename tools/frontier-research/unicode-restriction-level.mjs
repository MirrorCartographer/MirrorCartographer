const LEVELS = Object.freeze({
  ASCII_ONLY: 'ASCII-Only',
  SINGLE_SCRIPT: 'Single Script',
  HIGHLY_RESTRICTIVE: 'Highly Restrictive',
  MODERATELY_RESTRICTIVE: 'Moderately Restrictive',
  MINIMALLY_RESTRICTIVE: 'Minimally Restrictive',
  UNRESTRICTED: 'Unrestricted',
});

function normalizeSet(value, index) {
  if (!Array.isArray(value)) throw new TypeError(`scriptSets[${index}] must be an array`);
  const scripts = new Set(value.filter((script) => script !== 'Common' && script !== 'Inherited' && script !== 'Zyyy' && script !== 'Zinh'));
  for (const script of scripts) {
    if (typeof script !== 'string' || !/^[A-Z][a-z]{3}$/u.test(script)) throw new TypeError(`invalid script code at scriptSets[${index}]`);
  }
  return scripts;
}

function intersectsAll(sets) {
  if (sets.length === 0) return new Set();
  const result = new Set(sets[0]);
  for (const script of [...result]) {
    if (!sets.every((entry) => entry.has(script))) result.delete(script);
  }
  return result;
}

function isCoveredBy(sets, allowed) {
  return sets.every((entry) => [...entry].some((script) => allowed.has(script)));
}

export function classifyRestrictionLevel({ identifier, profileEligible, scriptSets, recommendedScripts = [] }) {
  if (typeof identifier !== 'string') throw new TypeError('identifier must be a string');
  if (typeof profileEligible !== 'boolean') throw new TypeError('profileEligible must be boolean');
  if (!Array.isArray(scriptSets)) throw new TypeError('scriptSets must be an array');
  if (Array.from(identifier).length !== scriptSets.length) throw new RangeError('scriptSets must contain one entry per Unicode scalar');

  const normalizedSets = scriptSets.map(normalizeSet);
  const recommended = new Set(recommendedScripts);
  const reasons = [];

  if (!profileEligible) {
    reasons.push('outside_identifier_profile');
    return Object.freeze({ schemaVersion: '1.0.0', level: LEVELS.UNRESTRICTED, reasons: Object.freeze(reasons), profileEligible });
  }

  if ([...identifier].every((character) => character.codePointAt(0) <= 0x7F)) {
    return Object.freeze({ schemaVersion: '1.0.0', level: LEVELS.ASCII_ONLY, reasons: Object.freeze(reasons), profileEligible });
  }

  const soss = normalizedSets.filter((entry) => entry.size > 0);
  const commonIntersection = intersectsAll(soss);
  if (soss.length === 0 || commonIntersection.size > 0) {
    return Object.freeze({ schemaVersion: '1.0.0', level: LEVELS.SINGLE_SCRIPT, reasons: Object.freeze(reasons), profileEligible });
  }

  const withoutLatin = soss.filter((entry) => !entry.has('Latn'));
  const highCoverage = [
    new Set(['Hani', 'Hira', 'Kana']),
    new Set(['Hani', 'Bopo']),
    new Set(['Hani', 'Hang']),
  ];
  if (highCoverage.some((coverage) => isCoveredBy(withoutLatin, coverage))) {
    return Object.freeze({ schemaVersion: '1.0.0', level: LEVELS.HIGHLY_RESTRICTIVE, reasons: Object.freeze(reasons), profileEligible });
  }

  const moderateIntersection = intersectsAll(withoutLatin);
  const moderateScript = [...moderateIntersection].find((script) => recommended.has(script) && script !== 'Cyrl' && script !== 'Grek');
  if (moderateScript) {
    reasons.push(`recommended_companion:${moderateScript}`);
    return Object.freeze({ schemaVersion: '1.0.0', level: LEVELS.MODERATELY_RESTRICTIVE, reasons: Object.freeze(reasons), profileEligible });
  }

  reasons.push('arbitrary_script_mixture');
  return Object.freeze({ schemaVersion: '1.0.0', level: LEVELS.MINIMALLY_RESTRICTIVE, reasons: Object.freeze(reasons), profileEligible });
}

export { LEVELS };

export const TRUST_LIMIT = Object.freeze({
  sourceData: 'This classifier assumes each scalar script set was derived from authenticated, exact-version Script and Script_Extensions data.',
  conformance: 'It implements the UTS #39 Version 17.0.0 restriction-level decision order but does not itself parse Unicode data files or establish profile eligibility.',
  intent: 'A restrictive classification is not proof of benign intent; whole-script confusables, bidi display safety, and application policy remain separate checks.',
});

export const FALSIFICATION_ROUTE = Object.freeze([
  'Provide an identifier outside the selected profile that does not classify as Unrestricted.',
  'Provide an all-ASCII identifier that does not classify as ASCII-Only.',
  'Provide a non-ASCII single-script identifier that does not classify as Single Script.',
  'Provide a Latin plus Japanese, Bopomofo, or Korean coverage case that does not classify as Highly Restrictive.',
  'Provide a Latin plus one non-Greek, non-Cyrillic Recommended script case that does not classify as Moderately Restrictive.',
  'Find a Unicode 17.0.0 UTS #39 Section 5.2 reference case where this classifier disagrees when fed correct augmented script sets.',
]);
