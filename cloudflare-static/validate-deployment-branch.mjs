#!/usr/bin/env node

const SAFE_BRANCH = /^(?![./])(?!.*(?:\.\.|\/\/|@\{|\\))(?!.*[/.]$)[A-Za-z0-9](?:[A-Za-z0-9._/-]{0,126}[A-Za-z0-9_-])?$/;

export function validateDeploymentBranch(value) {
  const branch = typeof value === 'string' ? value.trim() : '';
  const reasons = [];

  if (!branch) reasons.push('branch_missing');
  if (branch.length > 128) reasons.push('branch_too_long');
  if (branch && !SAFE_BRANCH.test(branch)) reasons.push('branch_invalid_format');
  if (branch.startsWith('-')) reasons.push('branch_option_injection');

  return {
    schemaVersion: '1.0.0',
    valid: reasons.length === 0,
    branch: reasons.length === 0 ? branch : null,
    reasons
  };
}

function main() {
  const result = validateDeploymentBranch(process.argv[2] ?? process.env.CLOUDFLARE_PAGES_BRANCH ?? '');
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.valid) process.exitCode = 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
