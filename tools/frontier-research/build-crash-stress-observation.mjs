import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

function parseIdentity(text) {
  return Object.fromEntries(
    text.trim().split(/\r?\n/).filter(Boolean).map(line => {
      const index = line.indexOf('=');
      if (index < 1) throw new Error(`invalid runner identity line: ${line}`);
      return [line.slice(0, index), line.slice(index + 1)];
    })
  );
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export async function buildCrashStressObservation({ identityPath, summaryPath, logPath, outputPath, testExitCode = 0 }) {
  const [identityBytes, summaryBytes, logBytes] = await Promise.all([
    readFile(identityPath),
    readFile(summaryPath),
    readFile(logPath)
  ]);
  const identity = parseIdentity(identityBytes.toString('utf8'));
  const summary = JSON.parse(summaryBytes.toString('utf8'));

  if (!/^[0-9a-f]{40}$/.test(identity.commit ?? '')) throw new Error('runner identity commit must be a full lowercase git SHA');
  if (!['Linux', 'macOS'].includes(identity.runner_os)) throw new Error('runner identity runner_os must be Linux or macOS');
  if (!Number.isInteger(testExitCode)) throw new Error('testExitCode must be an integer');

  const observation = {
    schema_version: '1.0.0',
    commit: identity.commit,
    runner_os: identity.runner_os,
    runner_arch: identity.runner_arch,
    node: identity.node,
    filesystem: identity.filesystem,
    test_exit_code: testExitCode,
    cycles_completed: summary.cycles_completed,
    terminal_records: summary.terminal_records,
    residual_artifact_count: summary.residual_artifact_count,
    runner_identity_artifact: identityPath,
    raw_test_log_artifact: logPath,
    runner_identity_sha256: sha256(identityBytes),
    raw_test_log_sha256: sha256(logBytes),
    summary_artifact: summaryPath,
    summary_sha256: sha256(summaryBytes)
  };

  await writeFile(outputPath, `${JSON.stringify(observation, null, 2)}\n`, 'utf8');
  return observation;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [identityPath, summaryPath, logPath, outputPath, exitCode = '0'] = process.argv.slice(2);
  if (!identityPath || !summaryPath || !logPath || !outputPath) {
    console.error('usage: node build-crash-stress-observation.mjs <identity> <summary> <log> <output> [exit-code]');
    process.exit(2);
  }
  await buildCrashStressObservation({
    identityPath,
    summaryPath,
    logPath,
    outputPath,
    testExitCode: Number(exitCode)
  });
}