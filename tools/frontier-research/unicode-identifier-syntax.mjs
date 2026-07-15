import { buildUnicodeIdentifierAdmission } from './unicode-identifier-admission.mjs';
import { applyDefaultIgnorableExclusion, parseDefaultIgnorableProfile } from './default-ignorable-profile.mjs';

function parseScalar(token, lineNumber) {
  if (!/^[0-9A-Fa-f]{4,6}$/.test(token)) throw new SyntaxError(`line ${lineNumber}: invalid code point ${token}`);
  const value = Number.parseInt(token, 16);
  if (value > 0x10FFFF || (value >= 0xD800 && value <= 0xDFFF)) throw new RangeError(`line ${lineNumber}: non-scalar code point ${token}`);
  return value;
}

function parsePropertyRanges(text, property) {
  const ranges = [];
  for (const [index, raw] of text.split(/\r?\n/u).entries()) {
    const body = raw.replace(/#.*/u, '').trim();
    if (!body) continue;
    const [rangeToken, propertyToken] = body.split(';').map((field) => field.trim());
    if (propertyToken !== property) continue;
    const endpoints = rangeToken.split('..');
    if (endpoints.length > 2) throw new SyntaxError(`line ${index + 1}: invalid range ${rangeToken}`);
    const start = parseScalar(endpoints[0], index + 1);
    const end = endpoints.length === 2 ? parseScalar(endpoints[1], index + 1) : start;
    if (end < start) throw new RangeError(`line ${index + 1}: descending range ${rangeToken}`);
    ranges.push(Object.freeze({ start, end, lineNumber: index + 1 }));
  }
  if (ranges.length === 0) throw new Error(`DerivedCoreProperties contains no ${property} ranges`);
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index].start <= ranges[index - 1].end) throw new Error(`overlapping ${property} ranges at lines ${ranges[index - 1].lineNumber} and ${ranges[index].lineNumber}`);
  }
  return Object.freeze(ranges);
}

function contains(ranges, codePoint) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const range = ranges[middle];
    if (codePoint < range.start) high = middle - 1;
    else if (codePoint > range.end) low = middle + 1;
    else return true;
  }
  return false;
}

export function parseXidSyntax(text, { version, sourceDigest } = {}) {
  if (typeof text !== 'string' || text.length === 0) throw new TypeError('DerivedCoreProperties source must be non-empty text');
  if (typeof version !== 'string' || version.length === 0) throw new TypeError('version is required');
  if (typeof sourceDigest !== 'string' || sourceDigest.length === 0) throw new TypeError('sourceDigest is required');
  const startRanges = parsePropertyRanges(text, 'XID_Start');
  const continueRanges = parsePropertyRanges(text, 'XID_Continue');
  return Object.freeze({
    version,
    sourceDigest,
    startRanges,
    continueRanges,
    isStart: (codePoint) => contains(startRanges, codePoint),
    isContinue: (codePoint) => contains(continueRanges, codePoint),
  });
}

export function evaluateXidSyntax(identifier, dataset) {
  if (typeof identifier !== 'string') throw new TypeError('identifier must be a string');
  const normalized = identifier.normalize('NFC');
  const scalars = Array.from(normalized, (character) => Object.freeze({ character, codePoint: character.codePointAt(0) }));
  const reasons = [];
  if (scalars.length === 0) reasons.push('empty_identifier');
  for (const [index, scalar] of scalars.entries()) {
    const allowed = index === 0 ? dataset.isStart(scalar.codePoint) : dataset.isContinue(scalar.codePoint);
    if (!allowed) reasons.push(`${index === 0 ? 'invalid_xid_start' : 'invalid_xid_continue'}:U+${scalar.codePoint.toString(16).toUpperCase().padStart(4, '0')}:index=${index}`);
  }
  return Object.freeze({
    schemaVersion: '1.0.0',
    identifier,
    normalized,
    version: dataset.version,
    syntaxEligible: reasons.length === 0,
    reasons: Object.freeze(reasons),
    sourceDigest: dataset.sourceDigest,
  });
}

export function buildUnicodeIdentifierAdmissionWithSyntax(manifest, files) {
  const authenticatedAdmission = buildUnicodeIdentifierAdmission(manifest, files);
  const sourceDigest = manifest.files.derivedCoreProperties.sha256;
  const defaultIgnorables = parseDefaultIgnorableProfile(files.derivedCoreProperties, {
    version: authenticatedAdmission.version,
    sourceDigest,
  });
  const admission = applyDefaultIgnorableExclusion(authenticatedAdmission, defaultIgnorables);
  const syntax = parseXidSyntax(files.derivedCoreProperties, {
    version: admission.version,
    sourceDigest,
  });

  function inspect(identifier) {
    const syntaxDecision = evaluateXidSyntax(identifier, syntax);
    const baseDecision = admission.inspect(identifier);
    const reasons = Object.freeze([...syntaxDecision.reasons, ...baseDecision.reasons]);
    return Object.freeze({
      ...baseDecision,
      syntaxEligible: syntaxDecision.syntaxEligible,
      admissible: syntaxDecision.syntaxEligible && baseDecision.admissible,
      reasons,
      syntax: syntaxDecision,
    });
  }

  return Object.freeze({
    version: admission.version,
    authenticatedBundle: true,
    inspect,
    register(identifier) {
      const decision = inspect(identifier);
      if (!decision.admissible) return Object.freeze({ accepted: false, ...decision });
      const registered = admission.register(identifier);
      return Object.freeze({
        ...registered,
        syntaxEligible: true,
        syntax: decision.syntax,
        defaultIgnorableFree: true,
        defaultIgnorableProfile: decision.defaultIgnorableProfile,
        reasons: registered.reasons,
      });
    },
  });
}

export const TRUST_LIMIT = Object.freeze({
  profile: 'This gate implements unmodified UAX #31 R1-1 XID_Start/XID_Continue syntax plus the UTS #39 General Security Profile exclusion of Default_Ignorable_Code_Point values.',
  context: 'Joining-control contextual allowances are intentionally not provided; script-restriction levels remain a separate security check.',
  authentication: 'The XID and default-ignorable data share authenticated DerivedCoreProperties bytes, but manifest authenticity still depends on an independently trusted channel.',
  normalization: 'Syntax and exclusion are evaluated after NFC normalization; applications must explicitly declare any different comparison or display normalization policy.',
});

export const FALSIFICATION_ROUTE = Object.freeze([
  'Provide an empty identifier that is admitted.',
  'Provide a scalar outside XID_Start in first position that is admitted.',
  'Provide a scalar outside XID_Continue after the first position that is admitted.',
  'Provide an authenticated Default_Ignorable_Code_Point that remains admissible or mutates the registry.',
  'Provide overlapping XID or Default_Ignorable ranges that parse successfully.',
  'Find a Unicode 17.0.0 UAX #31 or UTS #39 General Security Profile reference case where the evaluator disagrees.',
]);