const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));

function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36).padStart(7, '0');
}

function encodeBase64Url(text) {
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64url');
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value) {
  if (typeof Buffer !== 'undefined') return Buffer.from(value, 'base64url').toString('utf8');
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

export class AfterbellScore {
  constructor({ limit = 12, marks = [] } = {}) {
    this.limit = Math.max(3, Math.min(24, Number(limit) || 12));
    this.marks = [];
    marks.forEach(mark => this.add(mark));
  }

  add(mark) {
    const clean = {
      x: Number(clamp(mark?.x).toFixed(4)),
      y: Number(clamp(mark?.y).toFixed(4)),
      strength: Number(clamp(mark?.strength ?? 0.5).toFixed(4))
    };
    this.marks.push(clean);
    if (this.marks.length > this.limit) this.marks.shift();
    return clean;
  }

  clear() { this.marks.length = 0; }

  snapshot() {
    const intervals = [];
    let totalDistance = 0;
    for (let index = 1; index < this.marks.length; index += 1) {
      const previous = this.marks[index - 1];
      const current = this.marks[index];
      const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
      totalDistance += distance;
      intervals.push(Math.max(1, Math.min(12, Math.round(distance * 12))));
    }
    const meanDistance = intervals.length ? totalDistance / intervals.length : 0;
    const names = ['still', 'hollow', 'silver', 'weathered', 'far', 'returning'];
    const temperament = names[Math.min(names.length - 1, Math.floor(meanDistance * names.length))];
    const canonical = JSON.stringify({ version: 1, marks: this.marks });
    return {
      count: this.marks.length,
      intervals,
      meanDistance: Number(meanDistance.toFixed(4)),
      temperament,
      signature: fnv1a(canonical),
      marks: this.marks.map(mark => ({ ...mark }))
    };
  }

  fold() {
    return `ab1.${encodeBase64Url(JSON.stringify({ version: 1, marks: this.marks }))}`;
  }

  static unfold(seed, options = {}) {
    if (typeof seed !== 'string' || !seed.startsWith('ab1.')) throw new Error('Unsupported Afterbell seed');
    let parsed;
    try { parsed = JSON.parse(decodeBase64Url(seed.slice(4))); }
    catch { throw new Error('Malformed Afterbell seed'); }
    if (parsed?.version !== 1 || !Array.isArray(parsed.marks)) throw new Error('Malformed Afterbell seed');
    if (parsed.marks.length > 24) throw new Error('Afterbell seed exceeds mark limit');
    return new AfterbellScore({ ...options, marks: parsed.marks });
  }
}
