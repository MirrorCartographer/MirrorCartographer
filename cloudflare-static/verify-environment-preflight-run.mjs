#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

export function verifyEnvironmentPreflightRun(dir, expected = {}) {
  const read = (name) => fs.readFileSync(path.join(dir, name));
  const manifest = JSON.parse(read('cloudflare-environment-preflight-run.json').toString('utf8'));
  const evidence = JSON.parse(read('cloudflare-environment-preflight.json').toString('utf8'));
  const contract = JSON.parse(read('cloudflare-workflow-environment-contract.json').toString('utf8'));
  const checkoutSha = read('cloudflare-preflight-checkout-sha.txt').toString('utf8').trim();
  const digestLines = read('cloudflare-environment-preflight.sha256').toString('utf8').trim().split(/\r?\n/).filter(Boolean);
  const errors = [];
  const required = ['cloudflare-preflight-checkout-sha.txt','cloudflare-workflow-environment-contract.json','cloudflare-environment-preflight.json'];
  const digests = new Map();
  for (const line of digestLines) {
    const match = line.match(/^([a-f0-9]{64})\s+(.+)$/);
    if (!match) { errors.push('invalid-digest-line'); continue; }
    digests.set(match[2].replace(/^\*/, ''), match[1]);
  }
  for (const name of required) {
    if (!digests.has(name)) { errors.push(`missing-digest:${name}`); continue; }
    const actual = crypto.createHash('sha256').update(read(name)).digest('hex');
    if (actual !== digests.get(name)) errors.push(`digest-mismatch:${name}`);
  }
  const expectedCommit = expected.commit_sha || manifest.commit_sha;
  const expectedRepository = expected.repository || manifest.repository;
  if (!/^[a-f0-9]{40}$/.test(expectedCommit || '')) errors.push('invalid-expected-commit');
  if (checkoutSha !== expectedCommit) errors.push('checkout-commit-mismatch');
  if (manifest.commit_sha !== expectedCommit) errors.push('manifest-commit-mismatch');
  if (evidence.source?.commit_sha !== expectedCommit) errors.push('evidence-commit-mismatch');
  if (manifest.repository !== expectedRepository) errors.push('manifest-repository-mismatch');
  if (evidence.source?.repository !== expectedRepository) errors.push('evidence-repository-mismatch');
  if (contract.ok !== true) errors.push('workflow-contract-invalid');
  if (evidence.ready_for_dispatch !== true) errors.push('not-ready-for-dispatch');
  if (!manifest.run_id || !manifest.workflow_ref) errors.push('missing-run-provenance');
  const serialized = JSON.stringify({ manifest, evidence, contract });
  for (const forbidden of ['api_token_value','account_id_value','secret_value']) if (serialized.includes(forbidden)) errors.push(`forbidden-field:${forbidden}`);
  return {
    ok: errors.length === 0,
    classification: errors.length === 0 ? 'repository_declarations_verified' : 'rejected',
    errors,
    repository: expectedRepository,
    commit_sha: expectedCommit,
    run_id: manifest.run_id || null,
    claim_boundary: 'Authenticates exact-commit preflight artifact integrity and repository declaration readiness only; does not verify credential installation, Cloudflare authorization, deployment, hostname resolution, served identity, or scientific truth.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [dir, repository, commit_sha, output] = process.argv.slice(2);
  if (!dir || !repository || !commit_sha) {
    console.error('usage: verify-environment-preflight-run.mjs <artifact-dir> <repository> <commit-sha> [output.json]');
    process.exit(2);
  }
  try {
    const result = verifyEnvironmentPreflightRun(dir, { repository, commit_sha });
    const body = `${JSON.stringify(result, null, 2)}\n`;
    if (output) fs.writeFileSync(output, body); else process.stdout.write(body);
    if (!result.ok) process.exit(1);
  } catch (error) {
    const result = { ok: false, classification: 'rejected', errors: [`exception:${error.message}`] };
    const body = `${JSON.stringify(result, null, 2)}\n`;
    if (output) fs.writeFileSync(output, body); else process.stdout.write(body);
    process.exit(1);
  }
}
