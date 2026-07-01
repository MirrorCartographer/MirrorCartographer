import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEFAULT_FIXTURE_PARITY_CONFIG,
  FixtureParityCliError,
  parseFixtureParityCli,
  resolveRepoRelativePath
} from './fixture-parity-cli.mjs';

describe('parseFixtureParityCli', () => {
  it('returns default repo-relative paths without reading files', () => {
    const config = parseFixtureParityCli([], { repoRoot: '/repo' });

    assert.equal(config.help, false);
    assert.equal(config.manifest, DEFAULT_FIXTURE_PARITY_CONFIG.manifest);
    assert.equal(config.reportOut, DEFAULT_FIXTURE_PARITY_CONFIG.reportOut);
    assert.equal(config.mode, 'fake');
    assert.equal(config.strict, true);
  });

  it('accepts declared public runner flags', () => {
    const config = parseFixtureParityCli([
      '--manifest',
      'mind/fixtures/agency-validation/custom-pack.json',
      '--report-out=artifacts/parity/custom-report.json',
      '--mode',
      'real',
      '--strict'
    ], { repoRoot: '/repo' });

    assert.equal(config.manifest, 'mind/fixtures/agency-validation/custom-pack.json');
    assert.equal(config.reportOut, 'artifacts/parity/custom-report.json');
    assert.equal(config.mode, 'real');
    assert.equal(config.strict, true);
  });

  it('returns help config without requiring fixture paths', () => {
    const config = parseFixtureParityCli(['--help'], { repoRoot: '/repo' });

    assert.equal(config.help, true);
    assert.equal(config.manifest, null);
    assert.equal(config.reportOut, null);
  });

  it('rejects unknown flags before runner execution', () => {
    assert.throws(
      () => parseFixtureParityCli(['--wat'], { repoRoot: '/repo' }),
      (error) => error instanceof FixtureParityCliError && error.code === 'parse_failed'
    );
  });

  it('rejects adapter-specific leaked flags', () => {
    assert.throws(
      () => parseFixtureParityCli(['--python-adapter', 'tools/x.py'], { repoRoot: '/repo' }),
      (error) => error instanceof FixtureParityCliError && error.code === 'adapter_flag_rejected'
    );
  });

  it('rejects invalid mode', () => {
    assert.throws(
      () => parseFixtureParityCli(['--mode', 'ajv-only'], { repoRoot: '/repo' }),
      (error) => error instanceof FixtureParityCliError && error.code === 'invalid_mode'
    );
  });

  it('rejects positionals', () => {
    assert.throws(
      () => parseFixtureParityCli(['mind/fixtures/pack.json'], { repoRoot: '/repo' }),
      (error) => error instanceof FixtureParityCliError && error.code === 'parse_failed'
    );
  });
});

describe('resolveRepoRelativePath', () => {
  it('normalizes safe repo-relative paths', () => {
    assert.equal(
      resolveRepoRelativePath('mind/fixtures/../fixtures/agency-validation/fixture-pack.v1.json', '/repo', 'manifest'),
      'mind/fixtures/agency-validation/fixture-pack.v1.json'
    );
  });

  it('rejects absolute paths', () => {
    assert.throws(
      () => resolveRepoRelativePath('/tmp/fixture-pack.v1.json', '/repo', 'manifest'),
      (error) => error instanceof FixtureParityCliError && error.code === 'path_absolute_rejected'
    );
  });

  it('rejects parent traversal', () => {
    assert.throws(
      () => resolveRepoRelativePath('../secrets.json', '/repo', 'manifest'),
      (error) => error instanceof FixtureParityCliError && error.code === 'path_escape_rejected'
    );
  });

  it('rejects NUL bytes', () => {
    assert.throws(
      () => resolveRepoRelativePath('mind/fixtures/pack.json\0.txt', '/repo', 'manifest'),
      (error) => error instanceof FixtureParityCliError && error.code === 'path_nul_rejected'
    );
  });
});
