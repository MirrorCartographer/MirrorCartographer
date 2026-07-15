import { canonicalJsonDigest } from './canonical-json-digest.mjs';

function fail(message, index) {
  throw new SyntaxError(`${message} at byte offset ${Buffer.byteLength(this.text.slice(0, index), 'utf8')}`);
}

class StrictJsonScanner {
  constructor(text) { this.text = text; this.i = 0; }
  error(message, index = this.i) { fail.call(this, message, index); }
  ws() { while (/[\u0009\u000a\u000d\u0020]/.test(this.text[this.i] ?? '')) this.i += 1; }
  expect(char) { if (this.text[this.i] !== char) this.error(`expected ${JSON.stringify(char)}`); this.i += 1; }
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
  value() {
    this.ws();
    const ch = this.text[this.i];
    if (ch === '{') return this.object();
    if (ch === '[') return this.array();
    if (ch === '"') { this.string(); return; }
    if (ch === '-' || /\d/.test(ch ?? '')) { this.number(); return; }
    if (ch === 't') return this.literal('true');
    if (ch === 'f') return this.literal('false');
    if (ch === 'n') return this.literal('null');
    this.error('expected JSON value');
  }
  object() {
    this.expect('{'); this.ws();
    const keys = new Set();
    if (this.text[this.i] === '}') { this.i += 1; return; }
    while (true) {
      this.ws();
      if (this.text[this.i] !== '"') this.error('expected object member name');
      const keyIndex = this.i;
      const key = this.string();
      if (keys.has(key)) this.error(`duplicate object member ${JSON.stringify(key)}`, keyIndex);
      keys.add(key);
      this.ws(); this.expect(':'); this.value(); this.ws();
      if (this.text[this.i] === '}') { this.i += 1; return; }
      this.expect(',');
    }
  }
  array() {
    this.expect('['); this.ws();
    if (this.text[this.i] === ']') { this.i += 1; return; }
    while (true) {
      this.value(); this.ws();
      if (this.text[this.i] === ']') { this.i += 1; return; }
      this.expect(',');
    }
  }
  scan() { this.ws(); this.value(); this.ws(); if (this.i !== this.text.length) this.error('trailing data'); }
}

export function parseStrictIJson(text) {
  if (typeof text !== 'string') throw new TypeError('JSON input must be a string');
  new StrictJsonScanner(text).scan();
  return JSON.parse(text);
}

export function canonicalJsonTextDigest(text, algorithm = 'sha256') {
  return canonicalJsonDigest(parseStrictIJson(text), algorithm);
}
