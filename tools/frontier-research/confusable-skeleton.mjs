const SCALAR_MAX = 0x10FFFF;

function assertScalar(cp, label) {
  if (!Number.isInteger(cp) || cp < 0 || cp > SCALAR_MAX || (cp >= 0xD800 && cp <= 0xDFFF)) {
    throw new TypeError(`${label} contains a non-scalar code point`);
  }
}

function parseSequence(field, label) {
  const tokens = field.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) throw new TypeError(`${label} is empty`);
  return tokens.map((token) => {
    if (!/^[0-9A-Fa-f]{4,6}$/.test(token)) throw new TypeError(`${label} contains malformed code point ${token}`);
    const cp = Number.parseInt(token, 16);
    assertScalar(cp, label);
    return cp;
  });
}

export function parseConfusables(text, { version, sourceDigest } = {}) {
  if (typeof text !== 'string') throw new TypeError('confusables source must be text');
  if (typeof version !== 'string' || version.length === 0) throw new TypeError('version is required');
  if (typeof sourceDigest !== 'string' || sourceDigest.length === 0) throw new TypeError('sourceDigest is required');

  const mappings = new Map();
  let parsed = 0;
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const body = raw.split('#', 1)[0].trim();
    if (!body) continue;
    const fields = body.split(';').map((field) => field.trim());
    if (fields.length !== 3 || fields[2] !== 'MA') throw new TypeError(`line ${index + 1} is not a valid confusables mapping`);
    const source = parseSequence(fields[0], `line ${index + 1} source`);
    if (source.length !== 1) throw new TypeError(`line ${index + 1} source must contain exactly one scalar`);
    const target = parseSequence(fields[1], `line ${index + 1} target`);
    if (mappings.has(source[0])) throw new TypeError(`line ${index + 1} duplicates source U+${source[0].toString(16).toUpperCase()}`);
    mappings.set(source[0], target);
    parsed += 1;
  }
  if (parsed === 0) throw new TypeError('confusables source contains no mappings');
  return Object.freeze({ version, sourceDigest, mappings, mappingCount: parsed });
}

function fromCodePoints(points) {
  return String.fromCodePoint(...points);
}

export function internalSkeleton(input, dataset, { isDefaultIgnorable } = {}) {
  if (typeof input !== 'string') throw new TypeError('identifier must be a string');
  if (!dataset || !(dataset.mappings instanceof Map)) throw new TypeError('parsed confusables dataset is required');
  if (typeof isDefaultIgnorable !== 'function') throw new TypeError('isDefaultIgnorable predicate is required');

  const normalized = input.normalize('NFD');
  const output = [];
  const evidence = [];
  for (const char of normalized) {
    const cp = char.codePointAt(0);
    if (isDefaultIgnorable(cp)) {
      evidence.push({ codePoint: cp, action: 'removed_default_ignorable' });
      continue;
    }
    const target = dataset.mappings.get(cp) ?? [cp];
    output.push(...target);
    evidence.push({ codePoint: cp, action: dataset.mappings.has(cp) ? 'mapped' : 'identity', target: [...target] });
  }
  const skeleton = fromCodePoints(output).normalize('NFD');
  return Object.freeze({
    input,
    normalized,
    skeleton,
    version: dataset.version,
    sourceDigest: dataset.sourceDigest,
    complete: true,
    evidence: Object.freeze(evidence)
  });
}

export function createSkeletonRegistry(dataset, options) {
  const bySkeleton = new Map();
  return Object.freeze({
    inspect(identifier) {
      const result = internalSkeleton(identifier, dataset, options);
      const incumbent = bySkeleton.get(result.skeleton) ?? null;
      return Object.freeze({ ...result, skeletonUnique: incumbent === null || incumbent === identifier, incumbent });
    },
    register(identifier) {
      const result = this.inspect(identifier);
      if (!result.skeletonUnique) return Object.freeze({ accepted: false, ...result });
      bySkeleton.set(result.skeleton, identifier);
      return Object.freeze({ accepted: true, ...result });
    },
    size() { return bySkeleton.size; }
  });
}

export const TRUST_LIMIT = Object.freeze({
  sourceAuthentication: 'sourceDigest is retained but not cryptographically verified by this module',
  bidi: 'implements UTS #39 internalSkeleton only; full bidiSkeleton is out of scope',
  defaultIgnorables: 'caller must provide a version-matched Default_Ignorable_Code_Point predicate',
  claim: 'equal skeletons indicate confusability under the supplied version, not malicious intent'
});
