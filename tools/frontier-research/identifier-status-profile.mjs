function assertString(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} must be a non-empty string`);
}

function parseCodePoint(token, lineNumber) {
  if (!/^[0-9A-Fa-f]{4,6}$/.test(token)) throw new SyntaxError(`line ${lineNumber}: invalid code point ${token}`);
  const value = Number.parseInt(token, 16);
  if (value > 0x10FFFF || (value >= 0xD800 && value <= 0xDFFF)) {
    throw new RangeError(`line ${lineNumber}: non-scalar code point ${token}`);
  }
  return value;
}

export function parseIdentifierStatus(text, { version, sourceDigest } = {}) {
  assertString(text, 'text');
  assertString(version, 'version');
  assertString(sourceDigest, 'sourceDigest');

  const ranges = [];
  for (const [index, raw] of text.split(/\r?\n/u).entries()) {
    const lineNumber = index + 1;
    const body = raw.replace(/#.*/u, '').trim();
    if (!body) continue;
    const fields = body.split(';').map((field) => field.trim());
    if (fields.length < 2) throw new SyntaxError(`line ${lineNumber}: expected range and status`);
    const [rangeToken, status] = fields;
    if (status !== 'Allowed' && status !== 'Restricted') {
      throw new SyntaxError(`line ${lineNumber}: unsupported status ${status}`);
    }
    const endpoints = rangeToken.split('..');
    if (endpoints.length > 2) throw new SyntaxError(`line ${lineNumber}: invalid range ${rangeToken}`);
    const start = parseCodePoint(endpoints[0], lineNumber);
    const end = endpoints.length === 2 ? parseCodePoint(endpoints[1], lineNumber) : start;
    if (end < start) throw new RangeError(`line ${lineNumber}: descending range ${rangeToken}`);
    ranges.push(Object.freeze({ start, end, status, lineNumber }));
  }

  if (ranges.length === 0) throw new Error('IdentifierStatus data contains no ranges');
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let i = 1; i < ranges.length; i += 1) {
    if (ranges[i].start <= ranges[i - 1].end) {
      throw new Error(`overlapping IdentifierStatus ranges at lines ${ranges[i - 1].lineNumber} and ${ranges[i].lineNumber}`);
    }
  }

  return Object.freeze({
    schemaVersion: '1.0.0',
    version,
    sourceDigest,
    ranges: Object.freeze(ranges),
  });
}

function lookupStatus(codePoint, ranges) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const range = ranges[mid];
    if (codePoint < range.start) high = mid - 1;
    else if (codePoint > range.end) low = mid + 1;
    else return range.status;
  }
  return null;
}

export function evaluateIdentifierStatus(identifier, dataset) {
  assertString(identifier, 'identifier');
  if (!dataset || typeof dataset !== 'object' || !Array.isArray(dataset.ranges)) {
    throw new TypeError('dataset must be produced by parseIdentifierStatus');
  }

  const normalized = identifier.normalize('NFC');
  const codePoints = [];
  const reasons = [];
  for (const character of normalized) {
    const codePoint = character.codePointAt(0);
    const status = lookupStatus(codePoint, dataset.ranges);
    codePoints.push(Object.freeze({ codePoint, hex: codePoint.toString(16).toUpperCase().padStart(4, '0'), status }));
    if (status === null) reasons.push(`status_missing:U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`);
    else if (status !== 'Allowed') reasons.push(`restricted:U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`);
  }

  return Object.freeze({
    schemaVersion: '1.0.0',
    identifier,
    normalized,
    normalization: 'NFC',
    version: dataset.version,
    sourceDigest: dataset.sourceDigest,
    complete: reasons.every((reason) => !reason.startsWith('status_missing:')),
    eligible: reasons.length === 0,
    reasons: Object.freeze(reasons),
    codePoints: Object.freeze(codePoints),
    trustLimit: 'This evaluator checks only version-pinned Identifier_Status coverage after NFC normalization. It does not validate XID syntax, joining-control contexts, script restrictions, confusable skeletons, dataset authenticity, or full UTS #39 conformance.',
    falsificationRoute: 'Provide malformed or overlapping data that is accepted, an uncovered or Restricted scalar that is marked eligible, or canonically equivalent inputs that receive inconsistent results.',
  });
}
