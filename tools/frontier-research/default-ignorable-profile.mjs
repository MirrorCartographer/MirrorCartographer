function parseScalar(token, lineNumber) {
  if (!/^[0-9A-Fa-f]{4,6}$/.test(token)) throw new SyntaxError(`line ${lineNumber}: invalid code point ${token}`);
  const value = Number.parseInt(token, 16);
  if (value > 0x10FFFF || (value >= 0xD800 && value <= 0xDFFF)) throw new RangeError(`line ${lineNumber}: non-scalar code point ${token}`);
  return value;
}

export function parseDefaultIgnorableProfile(text, { version, sourceDigest } = {}) {
  if (typeof text !== 'string' || text.length === 0) throw new TypeError('DerivedCoreProperties source must be non-empty text');
  if (typeof version !== 'string' || version.length === 0) throw new TypeError('version is required');
  if (typeof sourceDigest !== 'string' || sourceDigest.length === 0) throw new TypeError('sourceDigest is required');
  const ranges = [];
  for (const [index, raw] of text.split(/\r?\n/u).entries()) {
    const body = raw.replace(/#.*/u, '').trim();
    if (!body) continue;
    const [rangeToken, propertyToken] = body.split(';').map((field) => field.trim());
    if (propertyToken !== 'Default_Ignorable_Code_Point') continue;
    const endpoints = rangeToken.split('..');
    if (endpoints.length > 2) throw new SyntaxError(`line ${index + 1}: invalid range ${rangeToken}`);
    const start = parseScalar(endpoints[0], index + 1);
    const end = endpoints.length === 2 ? parseScalar(endpoints[1], index + 1) : start;
    if (end < start) throw new RangeError(`line ${index + 1}: descending range ${rangeToken}`);
    ranges.push(Object.freeze({ start, end, lineNumber: index + 1 }));
  }
  if (ranges.length === 0) throw new Error('DerivedCoreProperties contains no Default_Ignorable_Code_Point ranges');
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index].start <= ranges[index - 1].end) throw new Error(`overlapping Default_Ignorable ranges at lines ${ranges[index - 1].lineNumber} and ${ranges[index].lineNumber}`);
  }
  function contains(codePoint) {
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
  return Object.freeze({ version, sourceDigest, ranges: Object.freeze(ranges), contains });
}

export function evaluateDefaultIgnorableExclusion(identifier, dataset) {
  if (typeof identifier !== 'string') throw new TypeError('identifier must be a string');
  if (!dataset || typeof dataset.contains !== 'function') throw new TypeError('dataset.contains is required');
  const normalized = identifier.normalize('NFC');
  const excluded = [];
  for (const [index, character] of Array.from(normalized).entries()) {
    const codePoint = character.codePointAt(0);
    if (dataset.contains(codePoint)) excluded.push(Object.freeze({ index, codePoint, label: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}` }));
  }
  return Object.freeze({
    schemaVersion: '1.0.0',
    identifier,
    normalized,
    version: dataset.version,
    sourceDigest: dataset.sourceDigest,
    defaultIgnorableFree: excluded.length === 0,
    excluded: Object.freeze(excluded),
    reasons: Object.freeze(excluded.map((entry) => `default_ignorable_excluded:${entry.label}:index=${entry.index}`)),
  });
}

export function applyDefaultIgnorableExclusion(baseAdmission, dataset) {
  if (!baseAdmission || typeof baseAdmission.inspect !== 'function' || typeof baseAdmission.register !== 'function') throw new TypeError('baseAdmission inspect/register interface is required');
  function inspect(identifier) {
    const base = baseAdmission.inspect(identifier);
    const exclusion = evaluateDefaultIgnorableExclusion(identifier, dataset);
    return Object.freeze({
      ...base,
      defaultIgnorableFree: exclusion.defaultIgnorableFree,
      admissible: Boolean(base.admissible && exclusion.defaultIgnorableFree),
      reasons: Object.freeze([...(base.reasons ?? []), ...exclusion.reasons]),
      defaultIgnorableProfile: exclusion,
    });
  }
  return Object.freeze({
    version: baseAdmission.version ?? dataset.version,
    authenticatedBundle: baseAdmission.authenticatedBundle === true,
    inspect,
    register(identifier) {
      const decision = inspect(identifier);
      if (!decision.admissible) return Object.freeze({ accepted: false, ...decision });
      const registered = baseAdmission.register(identifier);
      return Object.freeze({ ...registered, defaultIgnorableFree: true, defaultIgnorableProfile: decision.defaultIgnorableProfile });
    },
  });
}

export const TRUST_LIMIT = Object.freeze({
  profile: 'This implements only the UTS #39 General Security Profile exclusion of Default_Ignorable_Code_Point values; joining-control contextual allowances are intentionally not provided.',
  authentication: 'The parsed ranges are trustworthy only when their source digest and Unicode version were authenticated through an independent channel.',
  display: 'Rejecting default ignorables reduces invisible-character risk but does not establish safe rendering, bidi behavior, script restriction, or benign intent.',
});

export const FALSIFICATION_ROUTE = Object.freeze([
  'Provide U+200C, U+200D, a variation selector, or another authenticated Default_Ignorable_Code_Point that is admitted.',
  'Provide an ordinary XID identifier that is rejected solely by this profile.',
  'Provide overlapping or descending ranges that parse successfully.',
  'Find a Unicode 17.0.0 General Security Profile case where the evaluator disagrees with the pinned data.',
]);
