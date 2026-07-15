const SHORT_SCRIPT = /^[A-Z][a-z]{3}$/u;
const LONG_SCRIPT = /^[A-Z][A-Za-z_]*$/u;

function dataLines(text) {
  if (typeof text !== 'string') throw new TypeError('PropertyValueAliases data must be a string');
  return text.split(/\r?\n/u).map((raw, index) => ({
    lineNumber: index + 1,
    content: raw.replace(/#.*/u, '').trim(),
  })).filter(({ content }) => content.length > 0);
}

export function parseScriptAliases(text) {
  const byShort = new Map();
  const byLong = new Map();
  for (const { content, lineNumber } of dataLines(text)) {
    const fields = content.split(';').map((field) => field.trim());
    if (fields[0] !== 'sc') continue;
    const short = fields[1];
    const long = fields[2];
    if (fields.length < 3 || !SHORT_SCRIPT.test(short) || !LONG_SCRIPT.test(long)) {
      throw new SyntaxError(`invalid Script alias record at line ${lineNumber}`);
    }
    if (byShort.has(short) || byLong.has(long)) {
      throw new RangeError(`duplicate Script alias at line ${lineNumber}`);
    }
    byShort.set(short, long);
    byLong.set(long, short);
    for (const alias of fields.slice(3).filter(Boolean)) {
      if (!LONG_SCRIPT.test(alias) || byLong.has(alias)) {
        throw new SyntaxError(`invalid additional Script alias at line ${lineNumber}`);
      }
      byLong.set(alias, short);
    }
  }
  if (byShort.size === 0) throw new RangeError('PropertyValueAliases data contains no Script aliases');
  return Object.freeze({
    toShort(value) {
      if (typeof value !== 'string') throw new TypeError('Script value must be a string');
      if (SHORT_SCRIPT.test(value) && byShort.has(value)) return value;
      const short = byLong.get(value);
      if (!short) throw new RangeError(`unknown Script value: ${value}`);
      return short;
    },
    toLong(value) {
      const short = this.toShort(value);
      return byShort.get(short);
    },
    size: byShort.size,
  });
}

export function normalizeScriptSets(scriptSets, aliases) {
  if (!Array.isArray(scriptSets)) throw new TypeError('scriptSets must be an array');
  return Object.freeze(scriptSets.map((set) => {
    if (!Array.isArray(set) || set.length === 0) throw new TypeError('each script set must be a non-empty array');
    return Object.freeze([...new Set(set.map((value) => aliases.toShort(value)))].sort());
  }));
}

export const TRUST_LIMIT = Object.freeze({
  authentication: 'Alias parsing does not authenticate source bytes, transport, or Unicode version; callers must verify a pinned digest and version before parsing.',
  semantics: 'Normalization proves namespace consistency only. It does not prove identifier safety, restriction level, confusability, bidi safety, or policy eligibility.',
});

export const FALSIFICATION_ROUTE = Object.freeze([
  'Provide a valid PropertyValueAliases Script record rejected by the parser.',
  'Provide a duplicate, malformed, or unknown Script alias that is accepted.',
  'Provide equivalent long and short Script names that normalize to different four-letter aliases.',
]);
