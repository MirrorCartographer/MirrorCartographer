import { verifyUnicodeDataBundle } from './unicode-data-bundle.mjs';
import { parseIdentifierStatus, evaluateIdentifierStatus } from './identifier-status-profile.mjs';
import { parseConfusables, createSkeletonRegistry } from './confusable-skeleton.mjs';

function parseScalar(token, lineNumber) {
  if (!/^[0-9A-Fa-f]{4,6}$/.test(token)) throw new SyntaxError(`line ${lineNumber}: invalid code point ${token}`);
  const value = Number.parseInt(token, 16);
  if (value > 0x10FFFF || (value >= 0xD800 && value <= 0xDFFF)) {
    throw new RangeError(`line ${lineNumber}: non-scalar code point ${token}`);
  }
  return value;
}

export function parseDefaultIgnorables(text, { version, sourceDigest } = {}) {
  if (typeof text !== 'string' || text.length === 0) throw new TypeError('DerivedCoreProperties source must be non-empty text');
  if (typeof version !== 'string' || version.length === 0) throw new TypeError('version is required');
  if (typeof sourceDigest !== 'string' || sourceDigest.length === 0) throw new TypeError('sourceDigest is required');

  const ranges = [];
  for (const [index, raw] of text.split(/\r?\n/u).entries()) {
    const lineNumber = index + 1;
    const body = raw.replace(/#.*/u, '').trim();
    if (!body) continue;
    const fields = body.split(';').map((field) => field.trim());
    if (fields.length < 2 || fields[1] !== 'Default_Ignorable_Code_Point') continue;
    const endpoints = fields[0].split('..');
    if (endpoints.length > 2) throw new SyntaxError(`line ${lineNumber}: invalid range ${fields[0]}`);
    const start = parseScalar(endpoints[0], lineNumber);
    const end = endpoints.length === 2 ? parseScalar(endpoints[1], lineNumber) : start;
    if (end < start) throw new RangeError(`line ${lineNumber}: descending range ${fields[0]}`);
    ranges.push(Object.freeze({ start, end, lineNumber }));
  }
  if (ranges.length === 0) throw new Error('DerivedCoreProperties contains no Default_Ignorable_Code_Point ranges');
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index].start <= ranges[index - 1].end) {
      throw new Error(`overlapping Default_Ignorable ranges at lines ${ranges[index - 1].lineNumber} and ${ranges[index].lineNumber}`);
    }
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

export function buildUnicodeIdentifierAdmission(manifest, files) {
  const authenticated = verifyUnicodeDataBundle(manifest, files);
  const version = authenticated.version;
  const identifierStatus = parseIdentifierStatus(files.identifierStatus, {
    version,
    sourceDigest: authenticated.files.identifierStatus.sha256,
  });
  const confusables = parseConfusables(files.confusables, {
    version,
    sourceDigest: authenticated.files.confusables.sha256,
  });
  const defaultIgnorables = parseDefaultIgnorables(files.derivedCoreProperties, {
    version,
    sourceDigest: authenticated.files.derivedCoreProperties.sha256,
  });
  const registry = createSkeletonRegistry(confusables, {
    isDefaultIgnorable: (codePoint) => defaultIgnorables.contains(codePoint),
  });

  function inspect(identifier) {
    const profile = evaluateIdentifierStatus(identifier, identifierStatus);
    const skeleton = registry.inspect(profile.normalized);
    const reasons = [...profile.reasons];
    if (!skeleton.skeletonUnique) reasons.push('confusable_skeleton_collision');
    return Object.freeze({
      schemaVersion: '1.0.0',
      identifier,
      normalized: profile.normalized,
      version,
      authenticatedBundle: authenticated.authenticated,
      profileEligible: profile.eligible,
      skeletonUnique: skeleton.skeletonUnique,
      admissible: profile.eligible && skeleton.skeletonUnique,
      reasons: Object.freeze(reasons),
      profile,
      skeleton,
      sourceDigests: Object.freeze({
        identifierStatus: authenticated.files.identifierStatus.sha256,
        confusables: authenticated.files.confusables.sha256,
        derivedCoreProperties: authenticated.files.derivedCoreProperties.sha256,
      }),
    });
  }

  return Object.freeze({
    version,
    authenticatedBundle: true,
    inspect,
    register(identifier) {
      const decision = inspect(identifier);
      if (!decision.admissible) return Object.freeze({ accepted: false, ...decision });
      const registration = registry.register(decision.normalized);
      if (!registration.accepted) {
        return Object.freeze({ accepted: false, ...decision, skeletonUnique: false, admissible: false, reasons: Object.freeze([...decision.reasons, 'confusable_skeleton_race']) });
      }
      return Object.freeze({ accepted: true, ...decision });
    },
  });
}

export const TRUST_LIMIT = Object.freeze({
  syntax: 'This gate does not yet enforce XID_Start/XID_Continue syntax, joining-control contexts, script restrictions, or application-specific exceptions.',
  normalization: 'Profile eligibility uses NFC while the confusable skeleton uses the UTS #39 NFD-based internal skeleton supplied by the existing modules.',
  authentication: 'Digest verification authenticates bytes only when manifest digests arrive through an independently trusted channel.',
  intent: 'A collision indicates confusability under the pinned data, not malicious intent.',
  conformance: 'Production use still requires exhaustive Unicode 17.0.0 reference-conformance and idempotency testing.'
});

export const FALSIFICATION_ROUTE = Object.freeze([
  'Provide a digest-mismatched or cross-version bundle that is accepted.',
  'Provide a Restricted or uncovered scalar that is admitted.',
  'Register two identifiers with the same internal skeleton and observe both accepted.',
  'Provide a Default_Ignorable_Code_Point that remains in the computed skeleton.',
  'Find a Unicode 17.0.0 reference case where this gate disagrees with the specified profile or skeleton behavior.'
]);
