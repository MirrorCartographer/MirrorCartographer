import { createHash } from 'node:crypto';

function assertUnicodeScalarString(value, path) {
  for (let i = 0; i < value.length; i += 1) {
    const unit = value.charCodeAt(i);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new TypeError(`${path} contains an unpaired high surrogate`);
      }
      i += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      throw new TypeError(`${path} contains an unpaired low surrogate`);
    }
  }
}

function serialize(value, path, seen) {
  if (value === null) return 'null';

  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number':
      if (!Number.isFinite(value)) {
        throw new TypeError(`${path} contains a non-finite number`);
      }
      return JSON.stringify(value);
    case 'string':
      assertUnicodeScalarString(value, path);
      return JSON.stringify(value);
    case 'object': {
      if (seen.has(value)) throw new TypeError(`${path} contains a cycle`);
      seen.add(value);
      try {
        if (Array.isArray(value)) {
          return `[${value.map((entry, index) => serialize(entry, `${path}[${index}]`, seen)).join(',')}]`;
        }

        const prototype = Object.getPrototypeOf(value);
        if (prototype !== Object.prototype && prototype !== null) {
          throw new TypeError(`${path} must be a plain JSON object`);
        }
        if (Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
          throw new TypeError(`${path} must not define toJSON`);
        }

        const keys = Object.keys(value).sort();
        return `{${keys.map((key) => {
          assertUnicodeScalarString(key, `${path} property name`);
          const entry = value[key];
          if (entry === undefined || typeof entry === 'function' || typeof entry === 'symbol' || typeof entry === 'bigint') {
            throw new TypeError(`${path}.${key} is not representable in I-JSON`);
          }
          return `${JSON.stringify(key)}:${serialize(entry, `${path}.${key}`, seen)}`;
        }).join(',')}}`;
      } finally {
        seen.delete(value);
      }
    }
    default:
      throw new TypeError(`${path} is not representable in I-JSON`);
  }
}

export function canonicalizeJson(value) {
  return serialize(value, '$', new Set());
}

export function canonicalJsonDigest(value, algorithm = 'sha256') {
  const canonical = canonicalizeJson(value);
  return {
    algorithm,
    canonical,
    digest: createHash(algorithm).update(canonical, 'utf8').digest('hex'),
    byteLength: Buffer.byteLength(canonical, 'utf8'),
  };
}
