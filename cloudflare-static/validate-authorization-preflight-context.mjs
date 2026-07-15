import fs from 'node:fs';

export function validateAuthorizationPreflightContext(packet, context = {}) {
  const errors = [];
  const expected = {
    repository: context.repository,
    workflow: context.workflow,
    source_commit: context.sourceCommit,
    run_id: context.runId,
    run_attempt: context.runAttempt
  };

  for (const [field, value] of Object.entries(expected)) {
    if (!value) errors.push(`missing-expected-${field}`);
  }

  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) {
    return { ok: false, errors: [...errors, 'packet-must-be-object'] };
  }

  const observed = packet.provenance;
  if (!observed || typeof observed !== 'object' || Array.isArray(observed)) {
    return { ok: false, errors: [...errors, 'missing-provenance'] };
  }

  for (const [field, expectedValue] of Object.entries(expected)) {
    if (expectedValue && String(observed[field] ?? '') !== String(expectedValue)) {
      errors.push(`${field}-mismatch`);
    }
  }

  if (packet.privacy?.secret_values_emitted !== false) errors.push('secret-values-must-be-redacted');
  if (packet.dispatch?.secret_values_in_command !== false) errors.push('dispatch-command-must-not-contain-secret-values');

  return {
    ok: errors.length === 0,
    errors,
    verified: errors.length === 0 ? expected : null
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [packetPath, outputPath] = process.argv.slice(2);
  if (!packetPath || !outputPath) {
    console.error('usage: node validate-authorization-preflight-context.mjs <packet.json> <result.json>');
    process.exit(2);
  }
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const result = validateAuthorizationPreflightContext(packet, {
    repository: process.env.GITHUB_REPOSITORY,
    workflow: process.env.GITHUB_WORKFLOW_REF,
    sourceCommit: process.env.GITHUB_SHA,
    runId: process.env.GITHUB_RUN_ID,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exit(1);
}
