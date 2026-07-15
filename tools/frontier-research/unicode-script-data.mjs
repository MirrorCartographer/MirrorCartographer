const MAX_SCALAR = 0x10FFFF;
const SHORT_SCRIPT = /^[A-Z][a-z]{3}$/u;
const LONG_SCRIPT = /^[A-Z][A-Za-z_]*$/u;

function parseCodePointRange(field, lineNumber) {
  const parts = field.trim().split('..');
  if (parts.length > 2 || parts.some((part) => !/^[0-9A-F]{4,6}$/u.test(part))) {
    throw new SyntaxError(`invalid code point range at line ${lineNumber}`);
  }
  const start = Number.parseInt(parts[0], 16);
  const end = Number.parseInt(parts[1] ?? parts[0], 16);
  if (start > end || end > MAX_SCALAR || (start <= 0xDFFF && end >= 0xD800)) {
    throw new RangeError(`invalid Unicode scalar range at line ${lineNumber}`);
  }
  return { start, end };
}

function dataLines(text) {
  if (typeof text !== 'string') throw new TypeError('Unicode data must be a string');
  return text.split(/\r?\n/u).map((raw, index) => ({
    lineNumber: index + 1,
    content: raw.replace(/#.*/u, '').trim(),
  })).filter(({ content }) => content.length > 0);
}

function assertNonOverlapping(ranges, label) {
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index].start <= ranges[index - 1].end) {
      throw new RangeError(`${label} contains overlapping ranges`);
    }
  }
}

export function parseScripts(text) {
  const ranges = dataLines(text).map(({ content, lineNumber }) => {
    const fields = content.split(';').map((field) => field.trim());
    if (fields.length !== 2 || !LONG_SCRIPT.test(fields[1])) {
      throw new SyntaxError(`invalid Scripts.txt record at line ${lineNumber}`);
    }
    return Object.freeze({ ...parseCodePointRange(fields[0], lineNumber), script: fields[1] });
  });
  assertNonOverlapping(ranges, 'Scripts.txt');
  return Object.freeze(ranges);
}

export function parseScriptExtensions(text) {
  const ranges = dataLines(text).map(({ content, lineNumber }) => {
    const fields = content.split(';').map((field) => field.trim());
    const scripts = fields[1]?.split(/\s+/u) ?? [];
    if (fields.length !== 2 || scripts.length === 0 || scripts.some((script) => !SHORT_SCRIPT.test(script)) || new Set(scripts).size !== scripts.length) {
      throw new SyntaxError(`invalid ScriptExtensions.txt record at line ${lineNumber}`);
    }
    return Object.freeze({ ...parseCodePointRange(fields[0], lineNumber), scripts: Object.freeze([...scripts].sort()) });
  });
  assertNonOverlapping(ranges, 'ScriptExtensions.txt');
  return Object.freeze(ranges);
}

function lookupRange(ranges, codePoint) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const range = ranges[middle];
    if (codePoint < range.start) high = middle - 1;
    else if (codePoint > range.end) low = middle + 1;
    else return range;
  }
  return undefined;
}

export function buildScriptData({ scriptsText, scriptExtensionsText }) {
  const scripts = parseScripts(scriptsText);
  const extensions = parseScriptExtensions(scriptExtensionsText);
  return Object.freeze({
    schemaVersion: '1.0.0',
    scriptSetForCodePoint(codePoint) {
      if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > MAX_SCALAR || (codePoint >= 0xD800 && codePoint <= 0xDFFF)) {
        throw new RangeError('codePoint must be a Unicode scalar value');
      }
      const extension = lookupRange(extensions, codePoint);
      if (extension) return extension.scripts;
      const script = lookupRange(scripts, codePoint)?.script ?? 'Unknown';
      return Object.freeze([script]);
    },
    scriptSetsForIdentifier(identifier) {
      if (typeof identifier !== 'string') throw new TypeError('identifier must be a string');
      return Object.freeze(Array.from(identifier, (character) => this.scriptSetForCodePoint(character.codePointAt(0))));
    },
  });
}

export const TRUST_LIMIT = Object.freeze({
  authentication: 'This parser does not authenticate Unicode data bytes or version metadata; callers must verify exact-version digests before parsing.',
  aliases: 'Scripts.txt uses long Script names while ScriptExtensions.txt uses four-letter aliases; downstream code must normalize names or intentionally consume the two representations.',
  scope: 'This module derives Script_Extensions sets only. Restriction-level classification, identifier profile eligibility, confusable checks, and bidi safety remain separate predicates.',
});

export const FALSIFICATION_ROUTE = Object.freeze([
  'Provide a valid Unicode data record that the parser rejects.',
  'Provide overlapping or surrogate-containing ranges that the parser accepts.',
  'Provide a code point explicitly listed in ScriptExtensions.txt for which lookup returns the Scripts.txt fallback.',
  'Provide an unlisted code point for which lookup does not return its Script value, or Unknown when absent from Scripts.txt.',
]);
