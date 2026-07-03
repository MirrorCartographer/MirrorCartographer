#!/usr/bin/env node
// Replay MC canonical JSON fixtures as stable governance artifacts.
// Public-safe: reads only fixture JSON and writes deterministic result files.

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  canonicalize,
  sha256HexOfCanonicalJson,
  GovernanceCanonicalJsonError
} from './lib/governance-canonical-json.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_FIXTURE_DIR = join(ROOT, 'mind', 'fixtures', 'governance.canonical-json.v1');
const DEFAULT_RESULT_JSON = join(ROOT, 'artifacts', 'governance', 'canonical-json-replay-result.json');
const DEFAULT_RESULT_MD = join(ROOT, 'artifacts', 'governance', 'canonical-json-replay-summary.md');

const args = parseArgs(process.argv.slice(2));
const fixtureDir = args.fixtures ?? DEFAULT_FIXTURE_DIR;
const resultJsonPath = args.resultJson ?? DEFAULT_RESULT_JSON;
const resultMdPath = args.resultMd ?? DEFAULT_RESULT_MD;

const result = await replayFixtures(fixtureDir);
const json = `${canonicalize(result)}\n`;
const markdown = renderMarkdown(result);

await mkdir(dirname(resultJsonPath), { recursive: true });
await mkdir(dirname(resultMdPath), { recursive: true });
await writeFile(resultJsonPath, json, 'utf8');
await writeFile(resultMdPath, markdown, 'utf8');

if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, markdown, { encoding: 'utf8', flag: 'a' });
}

for (const check of result.checks) {
  if (check.status !== 'pass') emitGitHubAnnotation(check);
}

process.exitCode = result.status === 'pass' ? 0 : 1;

async function replayFixtures(dir) {
  const files = (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => join(dir, entry.name))
    .sort();

  const checks = [];

  for (const file of files) {
    const fixturePath = relative(ROOT, file).replaceAll('\\', '/');
    let fixture;
    try {
      fixture = JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
      checks.push(check('fail', 'GOVERNANCE_CANONICAL_JSON_REPLAY/FIXTURE_PARSE_ERROR', fixturePath, error.message));
      continue;
    }

    checks.push(runFixture(fixture, fixturePath));
  }

  return {
    schemaVersion: 'governance.canonical-json.replay.result.v1',
    tool: 'tools/replay-governance-canonical-json-fixtures.mjs',
    status: checks.every((item) => item.status === 'pass') ? 'pass' : 'fail',
    totals: {
      fixtures: files.length,
      pass: checks.filter((item) => item.status === 'pass').length,
      fail: checks.filter((item) => item.status === 'fail').length
    },
    checks
  };
}

function runFixture(fixture, fixturePath) {
  const id = fixture.id ?? fixturePath;
  const expected = fixture.expected ?? {};

  try {
    const actualCanonical = canonicalize(fixture.input);
    const actualSha256 = sha256HexOfCanonicalJson(fixture.input);

    if (fixture.caseType === 'fail') {
      return check('fail', 'GOVERNANCE_CANONICAL_JSON_REPLAY/EXPECTED_FAILURE_DID_NOT_FAIL', fixturePath, `${id} expected canonicalization failure but canonicalized successfully`);
    }

    if (expected.canonical !== actualCanonical) {
      return check('fail', 'GOVERNANCE_CANONICAL_JSON_REPLAY/CANONICAL_MISMATCH', fixturePath, `${id} canonical mismatch`);
    }

    if (expected.sha256 !== actualSha256) {
      return check('fail', 'GOVERNANCE_CANONICAL_JSON_REPLAY/HASH_MISMATCH', fixturePath, `${id} hash mismatch`);
    }

    return check('pass', 'GOVERNANCE_CANONICAL_JSON_REPLAY/PASS', fixturePath, `${id} matched canonical JSON and SHA-256`);
  } catch (error) {
    const actualCode = error instanceof GovernanceCanonicalJsonError ? error.code : 'GOVERNANCE_CANONICAL_JSON_REPLAY/UNEXPECTED_ERROR';

    if (fixture.caseType === 'fail' && fixture.expectedFailureCode === actualCode) {
      return check('pass', 'GOVERNANCE_CANONICAL_JSON_REPLAY/EXPECTED_FAILURE', fixturePath, `${id} failed with expected code ${actualCode}`);
    }

    return check('fail', actualCode, fixturePath, `${id} failed unexpectedly: ${error.message}`);
  }
}

function check(status, code, fixturePath, message) {
  return { status, code, fixturePath, message };
}

function renderMarkdown(result) {
  const lines = [
    '# Canonical JSON replay summary',
    '',
    `Status: **${result.status}**`,
    '',
    `Fixtures: ${result.totals.fixtures}`,
    `Pass: ${result.totals.pass}`,
    `Fail: ${result.totals.fail}`,
    '',
    '## Checks',
    '',
    '| Status | Code | Fixture | Message |',
    '|---|---|---|---|'
  ];

  for (const item of result.checks) {
    lines.push(`| ${escapeMd(item.status)} | ${escapeMd(item.code)} | ${escapeMd(item.fixturePath)} | ${escapeMd(item.message)} |`);
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function emitGitHubAnnotation(check) {
  const level = check.status === 'fail' ? 'error' : 'warning';
  const message = escapeWorkflowCommand(check.message);
  const file = escapeWorkflowCommand(check.fixturePath);
  console.log(`::${level} file=${file},title=${check.code}::${message}`);
}

function escapeMd(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function escapeWorkflowCommand(value) {
  return String(value)
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A')
    .replaceAll(':', '%3A')
    .replaceAll(',', '%2C');
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--fixtures') parsed.fixtures = argv[++index];
    else if (arg === '--result-json') parsed.resultJson = argv[++index];
    else if (arg === '--result-md') parsed.resultMd = argv[++index];
    else if (arg === '--help') {
      console.log('Usage: node tools/replay-governance-canonical-json-fixtures.mjs [--fixtures DIR] [--result-json FILE] [--result-md FILE]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}
