import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  FIXTURE_PARITY_EXIT_CODES,
  runFixtureParity
} from './run-fixture-parity.mjs';
import { DEFAULT_FIXTURE_PARITY_CONFIG } from './fixture-parity-cli.mjs';

function makeRecorder(overrides = {}) {
  const calls = {
    writes: [],
    stdout: [],
    stderr: [],
    fixtureReads: []
  };

  return {
    calls,
    capabilities: {
      repoRoot: '/repo',
      writeJson: async (repoRelativePath, value) => {
        calls.writes.push({ repoRelativePath, value });
      },
      stdout: async (text) => {
        calls.stdout.push(text);
      },
      stderr: async (text) => {
        calls.stderr.push(text);
      },
      readFixture: async (repoRelativePath) => {
        calls.fixtureReads.push(repoRelativePath);
        throw new Error('fixture reads are not allowed in the pre-manifest shell tests');
      },
      ...overrides
    }
  };
}

describe('runFixtureParity pre-manifest shell', () => {
  it('prints help without writing reports or reading fixtures', async () => {
    const { calls, capabilities } = makeRecorder();

    const result = await runFixtureParity(['--help'], capabilities);

    assert.equal(result.exitCode, FIXTURE_PARITY_EXIT_CODES.pass);
    assert.equal(result.report, null);
    assert.equal(result.config.help, true);
    assert.equal(calls.writes.length, 0);
    assert.equal(calls.fixtureReads.length, 0);
    assert.equal(calls.stderr.join(''), '');
    assert.match(calls.stdout.join(''), /Usage: node tools\/agency-validation\/run-fixture-parity\.mjs/);
  });

  it('emits a schema-shaped cli-parse pass report before reading fixtures', async () => {
    const { calls, capabilities } = makeRecorder();

    const result = await runFixtureParity([], capabilities);

    assert.equal(result.exitCode, FIXTURE_PARITY_EXIT_CODES.pass);
    assert.equal(calls.writes.length, 1);
    assert.equal(calls.writes[0].repoRelativePath, DEFAULT_FIXTURE_PARITY_CONFIG.reportOut);
    assert.equal(calls.fixtureReads.length, 0);
    assert.equal(calls.stderr.join(''), '');
    assert.match(calls.stdout.join(''), /cli-parse passed/);

    const report = calls.writes[0].value;
    assert.equal(report.schema_version, 'fixture-parity-failure-report.v1');
    assert.equal(report.fixture_pack.resolution_status, 'not-resolved');
    assert.equal(report.overall_status, 'pass');
    assert.deepEqual(report.gates.map((gate) => gate.gate_id), ['cli-parse']);
    assert.equal(report.gates[0].status, 'pass');
    assert.equal(report.summary.fixture_count, 0);
  });

  it('uses the caller report-out path after successful parser normalization', async () => {
    const { calls, capabilities } = makeRecorder();

    const result = await runFixtureParity([
      '--manifest',
      'mind/fixtures/agency-validation/fixture-pack.v1.json',
      '--report-out',
      'artifacts/agency-validation/custom-report.json',
      '--mode',
      'real'
    ], capabilities);

    assert.equal(result.exitCode, FIXTURE_PARITY_EXIT_CODES.pass);
    assert.equal(result.config.mode, 'real');
    assert.equal(calls.writes.length, 1);
    assert.equal(calls.writes[0].repoRelativePath, 'artifacts/agency-validation/custom-report.json');
    assert.equal(calls.writes[0].value.runner.mode, 'real-adapter');
    assert.equal(calls.fixtureReads.length, 0);
  });

  it('turns public CLI parser errors into deterministic cli-parse failure reports', async () => {
    const { calls, capabilities } = makeRecorder();

    const result = await runFixtureParity(['--python-adapter', 'tools/private.py'], capabilities);

    assert.equal(result.exitCode, FIXTURE_PARITY_EXIT_CODES.cliParseFailed);
    assert.equal(calls.writes.length, 1);
    assert.equal(calls.writes[0].repoRelativePath, DEFAULT_FIXTURE_PARITY_CONFIG.reportOut);
    assert.equal(calls.fixtureReads.length, 0);
    assert.match(calls.stderr.join(''), /cli-parse failed/);

    const report = calls.writes[0].value;
    assert.equal(report.overall_status, 'fail');
    assert.equal(report.fixture_pack.resolution_status, 'not-resolved');
    assert.equal(report.summary.first_failed_gate_id, 'cli-parse');
    assert.equal(report.summary.fixture_count, 0);
    assert.deepEqual(
      report.gates.map((gate) => [gate.gate_id, gate.status]),
      [
        ['cli-parse', 'fail'],
        ['manifest-validation', 'not-run'],
        ['path-authority', 'not-run'],
        ['expected-receipt-validation', 'not-run'],
        ['generated-receipt-validation', 'not-run'],
        ['category-set-comparison', 'not-run'],
        ['report-validation', 'not-run']
      ]
    );
    assert.equal(report.gates[0].evidence[0].kind, 'unknown-flag');
    assert.equal(report.gates[0].evidence[0].argument_name, '--python-adapter');
  });

  it('routes internal shell failures to runner-internal-error without fixture reads', async () => {
    const { calls, capabilities } = makeRecorder({
      writeJson: async () => {
        throw new Error('simulated output write failure');
      }
    });

    const result = await runFixtureParity([], capabilities);

    assert.equal(result.exitCode, FIXTURE_PARITY_EXIT_CODES.runnerInternalError);
    assert.equal(result.report, null);
    assert.equal(calls.fixtureReads.length, 0);
    assert.match(calls.stderr.join(''), /internal runner error/);
  });
});
