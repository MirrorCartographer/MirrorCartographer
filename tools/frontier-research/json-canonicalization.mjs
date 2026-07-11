import { createHash } from 'node:crypto';

function assertValidUnicode(value, path) {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new TypeError(`Lone high surrogate at ${path}`);
      }
      i += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      throw new TypeError(`Lone low surrogate at ${path}`);
    }
  }
}

function serialize(value, path = '$') {
  if (value === null) return 'null';
  if (value === true) return 'true';
  if (value === false) return 'false';

  if (typeof value === 'string') {
    assertValidUnicode(value, path);
    return JSON.stringify(value);
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Non-finite number at ${path}`);
    }
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry, index) => serialize(entry, `${path}[${index}]`)).join(',')}]`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value).sort();
    const members = keys.map((key) => {
      assertValidUnicode(key, `${path} key`);
      const entry = value[key];
      if (entry === undefined || typeof entry === 'function' || typeof entry === 'symbol' || typeof entry === 'bigint') {
        throw new TypeError(`Unsupported JSON value at ${path}.${key}`);
      }
      return `${JSON.stringify(key)}:${serialize(entry, `${path}.${key}`)}`;
    });
    return `{${members.join(',')}}`;
  }

  throw new TypeError(`Unsupported JSON value at ${path}`);
}

export function canonicalizeJson(value) {
  return serialize(value);
}

export function canonicalizeJsonBytes(value) {
  return Buffer.from(canonicalizeJson(value), 'utf8');
}

export function canonicalJsonSha256(value) {
  return createHash('sha256').update(canonicalizeJsonBytes(value)).digest('hex');
}

export function parseAndCanonicalizeJson(text) {
  return canonicalizeJson(JSON.parse(text));
}
