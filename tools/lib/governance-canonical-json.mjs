// Governance canonical JSON helper for MC durable artifacts.
// Public-safe: contains no private user material.
// Implements the MC v1 canonicalization subset aligned with RFC 8785/JCS:
// - JSON-only values: null, booleans, finite numbers, strings, arrays, plain objects
// - no undefined, functions, symbols, BigInt, NaN, Infinity, or -Infinity
// - no lone surrogate code units in strings
// - object keys sorted by ECMAScript/UTF-16 lexical order
// - arrays preserve order
// - canonical output is UTF-8 encoded before hashing

import { createHash } from 'node:crypto';

export class GovernanceCanonicalJsonError extends Error {
  constructor(code, message, path = '$') {
    super(`${code} at ${path}: ${message}`);
    this.name = 'GovernanceCanonicalJsonError';
    this.code = code;
    this.path = path;
  }
}

export function canonicalize(value) {
  return serialize(value, '$');
}

export function canonicalBytes(value) {
  return Buffer.from(canonicalize(value), 'utf8');
}

export function sha256HexOfCanonicalJson(value) {
  return createHash('sha256').update(canonicalBytes(value)).digest('hex');
}

export function sha256UriOfCanonicalJson(value) {
  return `sha256:${sha256HexOfCanonicalJson(value)}`;
}

function serialize(value, path) {
  if (value === null) return 'null';

  const t = typeof value;

  if (t === 'boolean') return value ? 'true' : 'false';

  if (t === 'number') {
    if (!Number.isFinite(value)) {
      throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/NON_FINITE_NUMBER', 'numbers must be finite JSON numbers', path);
    }
    if (Object.is(value, -0)) return '0';
    return JSON.stringify(value);
  }

  if (t === 'string') {
    assertNoLoneSurrogates(value, path);
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const parts = value.map((item, index) => {
      if (item === undefined || typeof item === 'function' || typeof item === 'symbol') {
        throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/NON_JSON_ARRAY_VALUE', 'arrays must not contain undefined, functions, or symbols', `${path}[${index}]`);
      }
      return serialize(item, `${path}[${index}]`);
    });
    return `[${parts.join(',')}]`;
  }

  if (t === 'object') {
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/NON_PLAIN_OBJECT', 'objects must be plain JSON objects', path);
    }

    const keys = Object.keys(value).sort();
    const parts = [];
    for (const key of keys) {
      assertNoLoneSurrogates(key, `${path}.{key:${key}}`);
      const child = value[key];
      if (child === undefined || typeof child === 'function' || typeof child === 'symbol') {
        throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/NON_JSON_OBJECT_VALUE', 'objects must not contain undefined, functions, or symbols', `${path}.${key}`);
      }
      parts.push(`${JSON.stringify(key)}:${serialize(child, `${path}.${key}`)}`);
    }
    return `{${parts.join(',')}}`;
  }

  throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/UNSUPPORTED_TYPE', `unsupported JSON value type: ${t}`, path);
}

function assertNoLoneSurrogates(s, path) {
  for (let i = 0; i < s.length; i += 1) {
    const code = s.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = s.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/LONE_SURROGATE', 'strings must not contain lone surrogate code units', path);
      }
      i += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      throw new GovernanceCanonicalJsonError('GOVERNANCE_CANONICAL_JSON/LONE_SURROGATE', 'strings must not contain lone surrogate code units', path);
    }
  }
}
