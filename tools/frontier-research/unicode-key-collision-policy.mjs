const FORMS = new Set(['NFC', 'NFD', 'NFKC', 'NFKD']);

function assertForm(form) {
  if (!FORMS.has(form)) throw new RangeError(`unsupported Unicode normalization form ${form}`);
}

function assertJsonTree(value, path = '$', seen = new Set()) {
  if (value === null || ['string', 'boolean', 'number'].includes(typeof value)) return;
  if (typeof value !== 'object') throw new TypeError(`${path} is not JSON data`);
  if (seen.has(value)) throw new TypeError(`${path} contains a cycle`);
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      value.forEach((entry, index) => assertJsonTree(entry, `${path}[${index}]`, seen));
      return;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) throw new TypeError(`${path} must be a plain object`);
    for (const [key, entry] of Object.entries(value)) assertJsonTree(entry, `${path}.${key}`, seen);
  } finally {
    seen.delete(value);
  }
}

export function findUnicodeKeyCollisions(value, { form = 'NFC' } = {}) {
  assertForm(form);
  assertJsonTree(value);
  const collisions = [];

  function visit(node, path) {
    if (node === null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((entry, index) => visit(entry, `${path}[${index}]`));
      return;
    }

    const groups = new Map();
    for (const key of Object.keys(node)) {
      const normalized = key.normalize(form);
      const keys = groups.get(normalized) ?? [];
      keys.push(key);
      groups.set(normalized, keys);
    }
    for (const [normalizedKey, originalKeys] of groups) {
      if (new Set(originalKeys).size > 1) collisions.push({ path, form, normalizedKey, originalKeys: [...originalKeys].sort() });
    }
    for (const [key, entry] of Object.entries(node)) visit(entry, `${path}.${key}`);
  }

  visit(value, '$');
  return collisions;
}

export function enforceUnicodeKeyCollisionPolicy(value, options = {}) {
  const collisions = findUnicodeKeyCollisions(value, options);
  if (collisions.length > 0) {
    const first = collisions[0];
    throw new TypeError(`Unicode ${first.form} key collision at ${first.path}: ${first.originalKeys.map(JSON.stringify).join(', ')}`);
  }
  return value;
}
