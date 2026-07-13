import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const SHA256 = /^[0-9a-f]{64}$/;
const COMMIT = /^[0-9a-f]{40}$/;

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function parseIdentity(text) {
  return Object.fromEntries(
    text.trim().split(/\r?\n/).filter(Boolean).map((line) => {
      const index = line.indexOf('=');
      if (index < 1) throw new Error(`invalid runner identity line: ${line}`);
      return [line.slice(0, index), line.slice(index + 1)];
    })
  );
}

function checkDigest(reasons, label, expected, bytes) {
  if (!SHA256.test(expected ?? '')) {
    reasons.push(`${label} digest is invalid`);
    return;
  }
  if (digest(bytes) !== expected) reasons.push(`${label} digest mismatch`);
}

export async function verifyCrashStressObservation({
  observationPath,
  identityPath,
  summaryPath,
  logPath,
  expectedCommit
}) {
  const [observationBytes, identityBytes, summaryBytes, logBytes] = await Promise.all([
    readFile(observationPath),
    readFile(identityPath),
    readFile(summaryPath),
    readFile(logPath)
  ]);
  const observation = JSON.parse(observationBytes.toString('utf8'));
  const identity = parseIdentity(identityBytes.toString('utf8'));
  const summary = JSON.parse(summaryBytes.toString('utf8'));
  const reasons = [];

  if (!COMMIT.test(expectedCommit ?? '')) reasons.push('expectedCommit must be a full lowercase git SHA');
  if (observation.commit !== expectedCommit) reasons.push('observation commit mismatch');
  if (identity.commit !== expectedCommit) reasons.push('identity commit mismatch');
  if (observation.runner_os !== identity.runner_os) reasons.push('runner_os mismatch');
  if (observation.runner_arch !== identity.runner_arch) reasons.push('runner_arch mismatch');
  if (observation.node !== identity.node) reasons.push('node version mismatch');
  if (observation.filesystem !== identity.filesystem) reasons.push('filesystem mismatch');

  for (const field of ['cycles_completed', 'terminal_records', 'residual_artifact_count']) {
    if (observation[field] !== summary[field]) reasons.push(`${field} mismatch`);
  }

  checkDigest(reasons, 'runner identity', observation.runner_identity_sha256, identityBytes);
  checkDigest(reasons, 'summary', observation.summary_sha256, summaryBytes);
  checkDigest(reasons, 'raw test log', observation.raw_test_log_sha256, logBytes);

  return {
    schema_version: '1.0.0',
    verified: reasons.length === 0,
    classification: reasons.length === 0 ? 'retained_bytes_match_observation' : 'observation_falsified_or_incomplete',
    commit: expectedCommit,
    runner_os: observation.runner_os,
    observation_sha256: digest(observationBytes),
    reasons,
    epistemic_limit: 'Verification proves only that the supplied retained bytes match the observation and exact commit. It does not prove GitHub runner identity, workflow authenticity, test correctness, or universal crash safety.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [observationPath, identityPath, summaryPath, logPath, expectedCommit] = process.argv.slice(2);
  if (!observationPath || !identityPath || !summaryPath || !logPath || !expectedCommit) {
    console.error('usage: node verify-crash-stress-observation.mjs <observation> <identity> <summary> <log> <expected-commit>');
    process.exit(2);
  }
  const result = await verifyCrashStressObservation({
    observationPath,
    identityPath,
    summaryPath,
    logPath,
    expectedCommit
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.verified) process.exitCode = 1;
}
