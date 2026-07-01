import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  DEFAULT_FIXTURE_PARITY_CONFIG,
  FixtureParityCliError,
  fixtureParityCliUsage,
  parseFixtureParityCli
} from './fixture-parity-cli.mjs';

export const FIXTURE_PARITY_RUNNER_VERSION = 'v0.1.0';

export const FIXTURE_PARITY_EXIT_CODES = Object.freeze({
  pass: 0,
  cliParseFailed: 2,
  reportValidationFailed: 7,
  runnerInternalError: 8
});

const DEFAULT_ORDERING_POLICY = Object.freeze({
  gate_sort: 'stage_order_then_gate_id_ascending',
  fixture_sort: 'fixture_id_ascending',
  runtime_sort: 'node_then_python',
  category_sort: 'category_id_ascending',
  object_key_sort: 'lexicographic_recursive'
});

const DEFAULT_SAFETY_POLICY = Object.freeze({
  fixture_material: 'abstracted-public-safe-fixtures-only',
  message_dependence: 'do-not-compare-validator-message-wording',
  path_scope: 'repo-relative-mind-json-paths-only'
});

export async function runFixtureParity(argv = [], capabilities = {}) {
  const io = makeCapabilities(capabilities);

  try {
    const config = parseFixtureParityCli(argv, { repoRoot: io.repoRoot });

    if (config.help) {
      await io.stdout(`${fixtureParityCliUsage()}\n`);
      return { exitCode: FIXTURE_PARITY_EXIT_CODES.pass, report: null, config };
    }

    const report = buildPreflightPassReport(config, argv);
    await io.writeJson(config.reportOut, report);
    await io.stdout(
      `fixture-parity: cli-parse passed; staged fixture gates are not wired in this shell version; report=${config.reportOut}\n`
    );
    return { exitCode: FIXTURE_PARITY_EXIT_CODES.pass, report, config };
  } catch (error) {
    if (error instanceof FixtureParityCliError) {
      const report = buildCliParseFailureReport(error, argv);
      const reportPath = DEFAULT_FIXTURE_PARITY_CONFIG.reportOut;
      await io.writeJson(reportPath, report);
      await io.stderr(`fixture-parity: cli-parse failed; report=${reportPath}; code=${error.code}\n`);
      return { exitCode: FIXTURE_PARITY_EXIT_CODES.cliParseFailed, report, error };
    }

    await io.stderr(`fixture-parity: internal runner error; code=runner_internal_error\n`);
    return { exitCode: FIXTURE_PARITY_EXIT_CODES.runnerInternalError, report: null, error };
  }
}

export function buildCliParseFailureReport(error, argv = []) {
  const evidence = cliErrorToEvidence(error, argv);
  return freezeJson({
    schema_version: 'fixture-parity-failure-report.v1',
    report_id: stableId('fpr', ['cli-parse-failed', error.code, argv]),
    runner: {
      runner_id: 'run-fixture-parity',
      runner_version: FIXTURE_PARITY_RUNNER_VERSION,
      mode: 'fake-adapter',
      command_fingerprint: sha256Json(argv)
    },
    fixture_pack: {
      resolution_status: 'not-resolved'
    },
    overall_status: 'fail',
    ordering_policy: DEFAULT_ORDERING_POLICY,
    gates: [
      {
        gate_id: 'cli-parse',
        stage: 'cli-parse',
        status: 'fail',
        evidence: [evidence]
      },
      {
        gate_id: 'manifest-validation',
        stage: 'manifest-validation',
        status: 'not-run',
        evidence: []
      },
      {
        gate_id: 'path-authority',
        stage: 'path-authority',
        status: 'not-run',
        evidence: []
      },
      {
        gate_id: 'expected-receipt-validation',
        stage: 'expected-receipt-validation',
        status: 'not-run',
        evidence: []
      },
      {
        gate_id: 'generated-receipt-validation',
        stage: 'generated-receipt-validation',
        status: 'not-run',
        evidence: []
      },
      {
        gate_id: 'category-set-comparison',
        stage: 'category-set-comparison',
        status: 'not-run',
        evidence: []
      },
      {
        gate_id: 'report-validation',
        stage: 'report-validation',
        status: 'not-run',
        evidence: []
      }
    ],
    summary: {
      gate_count: 7,
      failed_gate_count: 1,
      fixture_count: 0,
      failed_fixture_count: 0,
      first_failed_gate_id: 'cli-parse'
    },
    safety_policy: DEFAULT_SAFETY_POLICY
  });
}

export function buildPreflightPassReport(config, argv = []) {
  return freezeJson({
    schema_version: 'fixture-parity-failure-report.v1',
    report_id: stableId('fpr', ['cli-parse-passed', config, argv]),
    runner: {
      runner_id: 'run-fixture-parity',
      runner_version: FIXTURE_PARITY_RUNNER_VERSION,
      mode: config.mode === 'real' ? 'real-adapter' : 'fake-adapter',
      command_fingerprint: sha256Json(argv)
    },
    fixture_pack: {
      resolution_status: 'not-resolved'
    },
    overall_status: 'pass',
    ordering_policy: DEFAULT_ORDERING_POLICY,
    gates: [
      {
        gate_id: 'cli-parse',
        stage: 'cli-parse',
        status: 'pass',
        evidence: []
      }
    ],
    summary: {
      gate_count: 1,
      failed_gate_count: 0,
      fixture_count: 0,
      failed_fixture_count: 0
    },
    safety_policy: DEFAULT_SAFETY_POLICY
  });
}

function cliErrorToEvidence(error, argv) {
  const kind = cliErrorCodeToEvidenceKind(error.code);
  const evidence = {
    evidence_id: stableId('ev', ['cli-parse', error.code, error.details, argv]),
    kind,
    summary: publicSafeCliSummary(error),
    repair_hint: cliRepairHint(error.code)
  };

  const argumentName = error.details?.flag ?? fieldNameToArgumentName(error.details?.fieldName);
  if (argumentName) {
    evidence.argument_name = argumentName;
  }

  return evidence;
}

function cliErrorCodeToEvidenceKind(code) {
  if (code === 'adapter_flag_rejected') return 'unknown-flag';
  if (code === 'path_empty') return 'missing-required-argument';
  if (code === 'path_absolute_rejected') return 'unsafe-path';
  if (code === 'path_escape_rejected') return 'unsafe-path';
  if (code === 'path_nul_rejected') return 'unsafe-path';
  if (code === 'invalid_mode') return 'cli-parse-error';
  return 'cli-parse-error';
}

function cliRepairHint(code) {
  if (code === 'adapter_flag_rejected') {
    return 'Remove adapter-specific flags from the public CLI and inject adapters through test capabilities.';
  }
  if (code === 'path_absolute_rejected' || code === 'path_escape_rejected' || code === 'path_nul_rejected') {
    return 'Use a safe repo-relative path that stays inside the repository and contains no NUL bytes.';
  }
  if (code === 'invalid_mode') {
    return 'Use --mode fake or --mode real; do not expose runtime adapter implementation flags.';
  }
  return 'Fix the public CLI arguments before the runner reads fixture files or invokes adapters.';
}

function publicSafeCliSummary(error) {
  return `Public CLI preflight rejected arguments with code ${error.code}.`;
}

function fieldNameToArgumentName(fieldName) {
  if (fieldName === 'manifest') return '--manifest';
  if (fieldName === 'report-out') return '--report-out';
  return null;
}

function makeCapabilities(capabilities) {
  const repoRoot = capabilities.repoRoot ?? process.cwd();
  return {
    repoRoot,
    stdout: capabilities.stdout ?? ((text) => process.stdout.write(text)),
    stderr: capabilities.stderr ?? ((text) => process.stderr.write(text)),
    writeJson:
      capabilities.writeJson ??
      (async (repoRelativePath, value) => {
        const outputPath = path.resolve(repoRoot, repoRelativePath);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
      })
  };
}

function stableId(prefix, parts) {
  return `${prefix}-${hashJson(parts).slice(0, 24)}`;
}

function sha256Json(value) {
  return `sha256:${hashJson(value)}`;
}

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function freezeJson(value) {
  if (Array.isArray(value)) {
    for (const item of value) freezeJson(item);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) freezeJson(item);
    Object.freeze(value);
  }
  return value;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await runFixtureParity(process.argv.slice(2));
  process.exitCode = result.exitCode;
}
