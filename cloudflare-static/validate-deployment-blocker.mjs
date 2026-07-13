#!/usr/bin/env node
import fs from 'node:fs';

const STATUS = new Set(['ready', 'blocked_external_configuration']);
const REASONS = new Set([
  'missing',
  'placeholder',
  'invalid_account_id_shape',
  'implausibly_short',
  'token_rejected',
  'permission_denied',
  'account_or_resource_not_found',
  'api_error',
  'not_attempted',
  'target_project_not_found',
  'target_project_missing_canonical_hostname',
  'unknown'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function validateDeploymentBlocker(value) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'blocker must be an object');
  assert(value.schema_version === '1.0.0', 'schema_version must be 1.0.0');
  assert(STATUS.has(value.status), 'status is invalid');
  assert(Number.isInteger(value.blocker_count) && value.blocker_count >= 0, 'blocker_count must be a non-negative integer');
  assert(Array.isArray(value.blockers), 'blockers must be an array');
  assert(value.blocker_count === value.blockers.length, 'blocker_count must equal blockers.length');

  for (const [index, blocker] of value.blockers.entries()) {
    assert(blocker && typeof blocker === 'object' && !Array.isArray(blocker), `blockers[${index}] must be an object`);
    assert(typeof blocker.name === 'string' && blocker.name.length > 0, `blockers[${index}].name must be non-empty`);
    assert(Array.isArray(blocker.reasons) && blocker.reasons.length > 0, `blockers[${index}].reasons must be non-empty`);
    assert(blocker.reasons.every((reason) => REASONS.has(reason)), `blockers[${index}].reasons contains an invalid code`);
    assert(Array.isArray(blocker.actions) && blocker.actions.length === blocker.reasons.length, `blockers[${index}].actions must align with reasons`);
    assert(blocker.actions.every((action) => typeof action === 'string' && action.length > 0), `blockers[${index}].actions must be non-empty strings`);
  }

  assert(typeof value.next_action === 'string' && value.next_action.length > 0, 'next_action must be non-empty');
  assert(value.privacy && typeof value.privacy === 'object', 'privacy must be an object');
  assert(value.privacy.secret_values_emitted === false, 'privacy.secret_values_emitted must be false');
  assert(typeof value.privacy.policy === 'string' && value.privacy.policy.length > 0, 'privacy.policy must be non-empty');

  if (value.status === 'ready') assert(value.blocker_count === 0, 'ready status requires zero blockers');
  if (value.status === 'blocked_external_configuration') assert(value.blocker_count > 0, 'blocked status requires at least one blocker');

  return { valid: true, status: value.status, blocker_count: value.blocker_count };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-blocker.json';
  const value = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  process.stdout.write(`${JSON.stringify(validateDeploymentBlocker(value))}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();