const BROWSERS = new Set(['chromium', 'firefox', 'webkit']);
const SCENARIOS = new Set([
  'two_tab_contention',
  'versionchange_forced_close',
  'bfcache_restore',
  'quota_pressure',
  'abrupt_termination_recovery'
]);
const OUTCOMES = new Set(['pass', 'fail', 'blocked', 'not_run']);
const PERSISTENCE_CLAIMS = new Set(['not_tested', 'not_proven', 'recovered_after_interruption', 'lost_after_interruption']);

function requireString(value, code) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(code);
}

function requireBoolean(value, code) {
  if (typeof value !== 'boolean') throw new Error(code);
}

export function validateInteropEvidence(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('record_invalid');
  if (!BROWSERS.has(record.browser)) throw new Error('browser_invalid');
  requireString(record.browser_version, 'browser_version_missing');
  requireString(record.platform, 'platform_missing');
  if (!SCENARIOS.has(record.scenario)) throw new Error('scenario_invalid');
  if (!OUTCOMES.has(record.outcome)) throw new Error('outcome_invalid');

  const capability = record.capability_evidence;
  if (!capability || typeof capability !== 'object') throw new Error('capability_evidence_missing');
  requireBoolean(capability.indexeddb_available, 'indexeddb_available_invalid');
  requireBoolean(capability.transaction_options_supported, 'transaction_options_supported_invalid');
  requireString(capability.requested_durability, 'requested_durability_missing');
  requireString(capability.observed_durability, 'observed_durability_missing');

  const transaction = record.transaction_evidence;
  if (!transaction || typeof transaction !== 'object') throw new Error('transaction_evidence_missing');
  requireBoolean(transaction.started, 'transaction_started_invalid');
  requireBoolean(transaction.completed, 'transaction_completed_invalid');
  requireBoolean(transaction.replay_rejected, 'replay_rejected_invalid');

  const recovery = record.recovery_evidence;
  if (!recovery || typeof recovery !== 'object') throw new Error('recovery_evidence_missing');
  if (!PERSISTENCE_CLAIMS.has(recovery.persistence_claim)) throw new Error('persistence_claim_invalid');
  requireBoolean(recovery.interruption_injected, 'interruption_injected_invalid');
  requireBoolean(recovery.reopen_attempted, 'reopen_attempted_invalid');
  if (recovery.recovered_record !== null && typeof recovery.recovered_record !== 'boolean') {
    throw new Error('recovered_record_invalid');
  }

  if (record.scenario === 'abrupt_termination_recovery') {
    if (!recovery.interruption_injected) throw new Error('abrupt_termination_requires_interruption');
    if (!recovery.reopen_attempted) throw new Error('abrupt_termination_requires_reopen');
    if (!['recovered_after_interruption', 'lost_after_interruption'].includes(recovery.persistence_claim)) {
      throw new Error('abrupt_termination_requires_observed_persistence_outcome');
    }
  } else if (recovery.persistence_claim === 'recovered_after_interruption' || recovery.persistence_claim === 'lost_after_interruption') {
    if (!recovery.interruption_injected || !recovery.reopen_attempted) {
      throw new Error('persistence_outcome_requires_interruption_and_reopen');
    }
  }

  if (record.outcome === 'pass' && !transaction.completed) throw new Error('pass_requires_completed_transaction');
  if (record.outcome === 'pass' && record.scenario === 'two_tab_contention' && !transaction.replay_rejected) {
    throw new Error('contention_pass_requires_replay_rejection');
  }

  requireString(record.evidence_strength, 'evidence_strength_missing');
  requireString(record.uncertainty, 'uncertainty_missing');
  requireString(record.falsification_route, 'falsification_route_missing');
  requireString(record.source_commit, 'source_commit_missing');

  return {
    valid: true,
    browser: record.browser,
    scenario: record.scenario,
    outcome: record.outcome,
    persistence_claim: recovery.persistence_claim
  };
}

export function summarizeInteropMatrix(records) {
  if (!Array.isArray(records) || records.length === 0) throw new Error('records_missing');
  const validated = records.map(validateInteropEvidence);
  const matrix = {};
  for (const browser of BROWSERS) {
    matrix[browser] = {};
    for (const scenario of SCENARIOS) matrix[browser][scenario] = 'missing';
  }
  for (const item of validated) {
    if (matrix[item.browser][item.scenario] !== 'missing') throw new Error('duplicate_browser_scenario');
    matrix[item.browser][item.scenario] = item.outcome;
  }
  return {
    matrix,
    complete: [...BROWSERS].every((browser) => [...SCENARIOS].every((scenario) => matrix[browser][scenario] !== 'missing')),
    persistence_proven: validated.some((item) => item.persistence_claim === 'recovered_after_interruption')
  };
}
