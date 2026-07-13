const REQUIRED_PLATFORMS = new Set(['Linux', 'macOS']);

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizePlatform(value) {
  if (value === 'Linux' || value === 'ubuntu-latest') return 'Linux';
  if (value === 'macOS' || value === 'macos-latest') return 'macOS';
  return value;
}

export function classifyCrashStressEvidence(packet) {
  const reasons = [];
  const expectedCommit = packet?.expected_commit;
  const observations = Array.isArray(packet?.observations) ? packet.observations : [];

  if (!/^[0-9a-f]{40}$/.test(expectedCommit ?? '')) {
    reasons.push('expected_commit must be a full 40-character lowercase git SHA');
  }

  const seen = new Set();
  for (const [index, observation] of observations.entries()) {
    const prefix = `observations[${index}]`;
    const platform = normalizePlatform(observation?.runner_os);

    if (!REQUIRED_PLATFORMS.has(platform)) {
      reasons.push(`${prefix}.runner_os is not an accepted platform`);
    } else if (seen.has(platform)) {
      reasons.push(`${prefix}.runner_os duplicates ${platform}`);
    } else {
      seen.add(platform);
    }

    if (observation?.commit !== expectedCommit) {
      reasons.push(`${prefix}.commit does not equal expected_commit`);
    }
    if (observation?.test_exit_code !== 0) {
      reasons.push(`${prefix}.test_exit_code is not zero`);
    }
    if (observation?.cycles_completed !== 12) {
      reasons.push(`${prefix}.cycles_completed is not exactly 12`);
    }
    if (observation?.terminal_records !== 12) {
      reasons.push(`${prefix}.terminal_records is not exactly one per cycle`);
    }
    if (observation?.residual_artifact_count !== 0) {
      reasons.push(`${prefix}.residual_artifact_count is not zero`);
    }
    if (!nonEmptyString(observation?.runner_identity_artifact)) {
      reasons.push(`${prefix}.runner_identity_artifact is missing`);
    }
    if (!nonEmptyString(observation?.raw_test_log_artifact)) {
      reasons.push(`${prefix}.raw_test_log_artifact is missing`);
    }
    if (!/^[0-9a-f]{64}$/.test(observation?.runner_identity_sha256 ?? '')) {
      reasons.push(`${prefix}.runner_identity_sha256 is invalid`);
    }
    if (!/^[0-9a-f]{64}$/.test(observation?.raw_test_log_sha256 ?? '')) {
      reasons.push(`${prefix}.raw_test_log_sha256 is invalid`);
    }
  }

  for (const platform of REQUIRED_PLATFORMS) {
    if (!seen.has(platform)) reasons.push(`missing required ${platform} observation`);
  }

  const accepted = reasons.length === 0;
  return {
    schema_version: '1.0.0',
    accepted,
    classification: accepted ? 'cross_platform_contract_observed' : 'insufficient_or_falsifying_evidence',
    observed_platforms: [...seen].sort(),
    reasons,
    epistemic_limit: 'Acceptance proves only that the bounded 12-cycle crash-recovery contract passed on the retained runner observations for the exact commit. It does not prove universal filesystem, scheduler, or process-crash safety.'
  };
}
