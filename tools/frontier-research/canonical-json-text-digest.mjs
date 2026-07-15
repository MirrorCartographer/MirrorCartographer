import { canonicalJsonDigest } from './canonical-json-digest.mjs';

export const DEFAULT_JSON_TEXT_LIMITS = Object.freeze({
  maxBytes: 1_048_576,
  maxDepth: 128,
});

function normalizeLimits(options = {}) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('options must be an object');
  const maxBytes = options.maxBytes ?? DEFAULT_JSON_TEXT_LIMITS.maxBytes;
  const maxDepth = options.maxDepth ?? DEFAULT_JSON_TEXT_LIMITS.maxDepth;
  for (const [name, value] of Object.entries({ maxBytes, maxDepth })) {
    if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer`);
  }
  return { maxBytes, maxDepth };
}

function fail(message, index) {
  throw new SyntaxError(`${message} at byte offset ${Buffer.byteLength(this.text.slice(0, index), 'utf8')}`);
}

class StrictJsonScanner {
  constructor(text, limits) { this.text = text; this.i = 0; this.limits = limits; }
  error(message, index = this.i) { fail.call(this, message, index); }
  ws() { while (/[\u0009\u000a\u000d\u0020]/.test(this.text[this.i] ?? '')) this.i += 1; }
  expect(char) { if (this.text[this.i] !== char) this.error(`expected ${JSON.stringify(char)}`); this.i += 1; }
  enter(depth) { if (depth > this.limits.maxDepth) this.error(`maximum nesting depth ${this.limits.maxDepth} exceeded`); }
  string() {
    const start = this.i;
    this.expect('"');
    while (this.i < this.text.length) {
      const ch = this.text[this.i++];
      if (ch === '"') {
        const raw = this.text.slice(start, this.i);
        try { return JSON.parse(raw); } catch { this.error('invalid JSON string', start); }
      }
      if (ch === '\\') {
        if (this.i >= this.text.length) this.error('unterminated escape');
        const esc = this.text[this.i++];
        if (esc === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(this.text.slice(this.i, this.i + 4))) this.error('invalid Unicode escape', this.i - 2);
          this.i += 4;
        } else if (!'"\\/bfnrt'.includes(esc)) this.error('invalid escape', this.i - 2);
      } else if (ch.charCodeAt(0) <= 0x1f) this.error('unescaped control character', this.i - 1);
    }
    this.error('unterminated string', start);
  }
  number() {
    const rest = this.text.slice(this.i);
    const match = rest.match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (!match) this.error('invalid number');
    this.i += match[0].length;
  }
  literal(word) { if (this.text.slice(this.i, this.i + word.length) !== word) this.error(`expected ${word}`); this.i += word.length; }
  value(depth = 0) {
    this.ws();
    const ch = this.text[this.i];
    if (ch === '{') return this.object(depth + 1);
    if (ch === '[') return this.array(depth + 1);
    if (ch === '"') { this.string(); return; }
    if (ch === '-' || /\d/.test(ch ?? '')) { this.number(); return; }
    if (ch === 't') return this.literal('true');
    if (ch === 'f') return this.literal('false');
    if (ch === 'n') return this.literal('null');
    this.error('expected JSON value');
  }
  object(depth) {
    this.enter(depth); this.expect('{'); this.ws();
    const keys = new Set();
    if (this.text[this.i] === '}') { this.i += 1; return; }
    while (true) {
      this.ws();
      if (this.text[this.i] !== '"') this.error('expected object member name');
      const keyIndex = this.i;
      const key = this.string();
      if (keys.has(key)) this.error(`duplicate object member ${JSON.stringify(key)}`, keyIndex);
      keys.add(key);
      this.ws(); this.expect(':'); this.value(depth); this.ws();
      if (this.text[this.i] === '}') { this.i += 1; return; }
      this.expect(',');
    }
  }
  array(depth) {
    this.enter(depth); this.expect('['); this.ws();
    if (this.text[this.i] === ']') { this.i += 1; return; }
    while (true) {
      this.value(depth); this.ws();
      if (this.text[this.i] === ']') { this.i += 1; return; }
      this.expect(',');
    }
  }
  scan() { this.ws(); this.value(); this.ws(); if (this.i !== this.text.length) this.error('trailing data'); }
}

export function parseStrictIJson(text, options = {}) {
  if (typeof text !== 'string') throw new TypeError('JSON input must be a string');
  const limits = normalizeLimits(options);
  const byteLength = Buffer.byteLength(text, 'utf8');
  if (byteLength > limits.maxBytes) throw new RangeError(`JSON input exceeds maximum byte length ${limits.maxBytes}`);
  new StrictJsonScanner(text, limits).scan();
  return JSON.parse(text);
}

export function canonicalJsonTextDigest(text, algorithm = 'sha256', options = {}) {
  return canonicalJsonDigest(parseStrictIJson(text, options), algorithm);
}
