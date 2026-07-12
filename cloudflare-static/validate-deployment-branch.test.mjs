import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDeploymentBranch } from './validate-deployment-branch.mjs';

test('accepts ordinary Pages branch names', () => {
  for (const branch of ['main', 'preview/mobile-audio', 'release_2026-07']) {
    const result = validateDeploymentBranch(branch);
    assert.equal(result.valid, true);
    assert.equal(result.branch, branch);
    assert.deepEqual(result.reasons, []);
  }
});

test('rejects option injection and malformed refs', () => {
  const cases = ['--commit-dirty=true', '../main', 'feature//test', 'feature@{1}', 'feature\\test', 'feature/'];
  for (const branch of cases) {
    const result = validateDeploymentBranch(branch);
    assert.equal(result.valid, false, branch);
    assert.equal(result.branch, null, branch);
  }
});

test('rejects missing and overlong values', () => {
  assert.deepEqual(validateDeploymentBranch(''), {
    schemaVersion: '1.0.0', valid: false, branch: null, reasons: ['branch_missing']
  });
  const result = validateDeploymentBranch(`a${'b'.repeat(128)}`);
  assert.equal(result.valid, false);
  assert.ok(result.reasons.includes('branch_too_long'));
});
