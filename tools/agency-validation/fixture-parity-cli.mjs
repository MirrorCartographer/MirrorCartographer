import path from 'node:path';
import { parseArgs } from 'node:util';

export const FIXTURE_PARITY_CLI_VERSION = 'fixture-parity-cli.v1';

export const DEFAULT_FIXTURE_PARITY_CONFIG = Object.freeze({
  manifest: 'mind/fixtures/agency-validation/fixture-pack.v1.json',
  reportOut: 'artifacts/agency-validation/fixture-parity-report.v1.json',
  mode: 'fake',
  strict: true
});

const ALLOWED_MODES = new Set(['fake', 'real']);
const ADAPTER_LEAKING_FLAGS = new Set([
  '--node-adapter',
  '--python-adapter',
  '--adapter',
  '--ajv',
  '--jsonschema',
  '--python-bin',
  '--node-bin'
]);

export class FixtureParityCliError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'FixtureParityCliError';
    this.code = code;
    this.details = details;
  }
}

export function parseFixtureParityCli(argv = [], options = {}) {
  if (!Array.isArray(argv)) {
    throw new FixtureParityCliError('argv_not_array', 'argv must be an array of strings.');
  }

  const repoRoot = options.repoRoot ?? process.cwd();
  const normalizedArgv = argv.map((item) => {
    if (typeof item !== 'string') {
      throw new FixtureParityCliError('argv_item_not_string', 'argv entries must be strings.');
    }
    return item;
  });

  for (const token of normalizedArgv) {
    const flagName = token.includes('=') ? token.slice(0, token.indexOf('=')) : token;
    if (ADAPTER_LEAKING_FLAGS.has(flagName)) {
      throw new FixtureParityCliError(
        'adapter_flag_rejected',
        `Adapter-specific flag is not allowed in the public runner CLI: ${flagName}`,
        { flag: flagName }
      );
    }
  }

  let parsed;
  try {
    parsed = parseArgs({
      args: normalizedArgv,
      strict: true,
      allowPositionals: false,
      allowNegative: false,
      options: {
        manifest: { type: 'string' },
        'report-out': { type: 'string' },
        mode: { type: 'string' },
        strict: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' }
      }
    });
  } catch (error) {
    throw new FixtureParityCliError('parse_failed', error.message, { causeCode: error.code });
  }

  const values = parsed.values;
  if (values.help === true) {
    return Object.freeze({
      version: FIXTURE_PARITY_CLI_VERSION,
      help: true,
      manifest: null,
      reportOut: null,
      mode: null,
      strict: null
    });
  }

  const mode = values.mode ?? DEFAULT_FIXTURE_PARITY_CONFIG.mode;
  if (!ALLOWED_MODES.has(mode)) {
    throw new FixtureParityCliError('invalid_mode', `mode must be one of: ${[...ALLOWED_MODES].join(', ')}`, { mode });
  }

  const strict = values.strict ?? DEFAULT_FIXTURE_PARITY_CONFIG.strict;
  const manifest = resolveRepoRelativePath(values.manifest ?? DEFAULT_FIXTURE_PARITY_CONFIG.manifest, repoRoot, 'manifest');
  const reportOut = resolveRepoRelativePath(values['report-out'] ?? DEFAULT_FIXTURE_PARITY_CONFIG.reportOut, repoRoot, 'report-out');

  return Object.freeze({
    version: FIXTURE_PARITY_CLI_VERSION,
    help: false,
    manifest,
    reportOut,
    mode,
    strict
  });
}

export function resolveRepoRelativePath(inputPath, repoRoot = process.cwd(), fieldName = 'path') {
  if (typeof inputPath !== 'string' || inputPath.trim() === '') {
    throw new FixtureParityCliError('path_empty', `${fieldName} must be a non-empty repo-relative path.`, { fieldName });
  }

  if (inputPath.includes('\0')) {
    throw new FixtureParityCliError('path_nul_rejected', `${fieldName} must not contain NUL bytes.`, { fieldName });
  }

  if (path.isAbsolute(inputPath)) {
    throw new FixtureParityCliError('path_absolute_rejected', `${fieldName} must be repo-relative, not absolute.`, { fieldName, inputPath });
  }

  const normalized = path.posix.normalize(inputPath.replaceAll('\\', '/'));
  if (normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    throw new FixtureParityCliError('path_escape_rejected', `${fieldName} must stay inside the repository.`, { fieldName, inputPath });
  }

  const root = path.resolve(repoRoot);
  const resolved = path.resolve(root, normalized);
  const relative = path.relative(root, resolved);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new FixtureParityCliError('path_escape_rejected', `${fieldName} must stay inside the repository.`, { fieldName, inputPath });
  }

  return normalized;
}

export function fixtureParityCliUsage() {
  return [
    'Usage: node tools/agency-validation/run-fixture-parity.mjs [options]',
    '',
    'Options:',
    '  --manifest <path>    Repo-relative fixture-pack manifest path.',
    '  --report-out <path>  Repo-relative JSON failure/success report path.',
    '  --mode <fake|real>   Adapter mode. Default: fake.',
    '  --strict             Enable strict gates. Default: true.',
    '  -h, --help           Show this help text.',
    '',
    'Adapter-specific flags are intentionally rejected at this boundary.'
  ].join('\n');
}
