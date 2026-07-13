import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const COMMIT = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const REQUIRED = ['Linux', 'macOS'];

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function normalizePlatform(value) {
  if (value === 'Linux' || value === 'ubuntu-latest') return 'Linux';
  if (value === 'macOS' || value === 'macos-latest') return 'macOS';
  return value;
}

export async function buildVerifiedCrashStressPacket({ expectedCommit, entries }) {
  const reasons = [];
  if (!COMMIT.test(expectedCommit ?? '')) reasons.push('expectedCommit must be a full lowercase git SHA');
  if (!Array.isArray(entries) || entries.length !== 2) reasons.push('exactly two platform entries are required');

  const observations = [];
  const verification_bindings = [];
  const seen = new Set();

  for (const [index, entry] of (entries ?? []).entries()) {
    const prefix = `entries[${index}]`;
    let observationBytes;
    let verifierBytes;
    try {
      [observationBytes, verifierBytes] = await Promise.all([
        readFile(entry.observationPath),
        readFile(entry.verifierResultPath)
      ]);
    } catch (error) {
      reasons.push(`${prefix} retained file read failed: ${error.message}`);
      continue;
    }

    let observation;
    let verifier;
    try {
      observation = JSON.parse(observationBytes.toString('utf8'));
      verifier = JSON.parse(verifierBytes.toString('utf8'));
    } catch (error) {
      reasons.push(`${prefix} JSON parse failed: ${error.message}`);
      continue;
    }

    const platform = normalizePlatform(observation.runner_os);
    if (!REQUIRED.includes(platform)) reasons.push(`${prefix} platform is not Linux or macOS`);
    else if (seen.has(platform)) reasons.push(`${prefix} duplicates ${platform}`);
    else seen.add(platform);

    if (observation.commit !== expectedCommit) reasons.push(`${prefix} observation commit mismatch`);
    if (verifier.commit !== expectedCommit) reasons.push(`${prefix} verifier commit mismatch`);
    if (verifier.runner_os !== observation.runner_os) reasons.push(`${prefix} verifier runner_os mismatch`);
    if (verifier.verified !== true || verifier.classification !== 'retained_bytes_match_observation') {
      reasons.push(`${prefix} verifier did not accept retained bytes`);
    }

    const observationSha = digest(observationBytes);
    if (!SHA256.test(verifier.observation_sha256 ?? '') || verifier.observation_sha256 !== observationSha) {
      reasons.push(`${prefix} verifier observation digest mismatch`);
    }

    observations.push(observation);
    verification_bindings.push({
      runner_os: platform,
      observation_sha256: observationSha,
      verifier_result_sha256: digest(verifierBytes),
      verifier_classification: verifier.classification
    });
  }

  for (const platform of REQUIRED) if (!seen.has(platform)) reasons.push(`missing verified ${platform} entry`);
  const accepted = reasons.length === 0;

  return {
    schema_version: '1.0.0',
    accepted,
    classification: accepted ? 'verified_cross_platform_packet_ready' : 'verified_packet_rejected',
    expected_commit: expectedCommit,
    observations: accepted ? observations.sort((a, b) => normalizePlatform(a.runner_os).localeCompare(normalizePlatform(b.runner_os))) : [],
    verification_bindings: accepted ? verification_bindings.sort((a, b) => a.runner_os.localeCompare(b.runner_os)) : [],
    reasons,
    epistemic_limit: 'Packet acceptance proves only that independently retained verifier results bind the supplied observation bytes to one exact commit on Linux and macOS. It does not prove workflow authenticity, runner identity, classifier correctness, or universal crash safety.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [expectedCommit, linuxObservation, linuxVerifier, macObservation, macVerifier] = process.argv.slice(2);
  if (!macVerifier) {
    console.error('usage: node build-verified-crash-stress-packet.mjs <commit> <linux-observation> <linux-verifier> <mac-observation> <mac-verifier>');
    process.exit(2);
  }
  const result = await buildVerifiedCrashStressPacket({
    expectedCommit,
    entries: [
      { observationPath: linuxObservation, verifierResultPath: linuxVerifier },
      { observationPath: macObservation, verifierResultPath: macVerifier }
    ]
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.accepted) process.exitCode = 1;
}
