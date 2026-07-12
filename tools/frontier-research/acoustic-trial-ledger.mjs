import { createHash } from 'node:crypto';

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
}

function digest(value) {
  return createHash('sha256').update(canonicalize(value), 'utf8').digest('hex');
}

function assertHex(value, name) {
  if (typeof value !== 'string' || !/^[0-9a-f]{64}$/.test(value)) throw new TypeError(`${name} must be a lowercase SHA-256 hex digest`);
}

export function createTrialProtocol({ protocolId, createdAt, maximumTrials, minimumTrials, alpha, nullSuccessProbability, challengeSpaceSize }) {
  if (typeof protocolId !== 'string' || protocolId.length < 8) throw new TypeError('protocolId must be a stable identifier');
  if (!Number.isInteger(maximumTrials) || maximumTrials < 1) throw new RangeError('maximumTrials must be a positive integer');
  if (!Number.isInteger(minimumTrials) || minimumTrials < 1 || minimumTrials > maximumTrials) throw new RangeError('minimumTrials must be between 1 and maximumTrials');
  if (!Number.isFinite(alpha) || alpha <= 0 || alpha >= 1) throw new RangeError('alpha must be between 0 and 1');
  if (!Number.isFinite(nullSuccessProbability) || nullSuccessProbability <= 0 || nullSuccessProbability >= 1) throw new RangeError('nullSuccessProbability must be between 0 and 1');
  if (!Number.isInteger(challengeSpaceSize) || challengeSpaceSize < 2) throw new RangeError('challengeSpaceSize must be an integer of at least 2');
  const protocol = { protocolId, createdAt, maximumTrials, minimumTrials, alpha, nullSuccessProbability, challengeSpaceSize, stoppingRule: 'evaluate_once_at_maximum_trials' };
  return { ...protocol, protocolDigest: digest(protocol) };
}

export function appendTrial({ ledger = [], protocol, trial }) {
  if (!Array.isArray(ledger)) throw new TypeError('ledger must be an array');
  assertHex(protocol?.protocolDigest, 'protocol.protocolDigest');
  const { protocolDigest, ...unsignedProtocol } = protocol;
  if (digest(unsignedProtocol) !== protocolDigest) throw new Error('protocol_digest_mismatch');
  if (ledger.length >= protocol.maximumTrials) throw new Error('maximum_trials_exceeded');
  if (!trial || typeof trial !== 'object') throw new TypeError('trial must be an object');
  if (typeof trial.trialId !== 'string' || trial.trialId.length < 8) throw new TypeError('trial.trialId must be a stable identifier');
  if (ledger.some((entry) => entry.trialId === trial.trialId)) throw new Error('duplicate_trial_id');
  if (typeof trial.challengeId !== 'string' || trial.challengeId.length < 8) throw new TypeError('trial.challengeId must be a stable identifier');
  if (ledger.some((entry) => entry.challengeId === trial.challengeId)) throw new Error('replayed_challenge_id');
  if (typeof trial.acceptedAsCodewordResponse !== 'boolean') throw new TypeError('trial.acceptedAsCodewordResponse must be boolean');
  const previousDigest = ledger.length === 0 ? '0'.repeat(64) : ledger.at(-1).entryDigest;
  const entry = { sequence: ledger.length + 1, protocolDigest, previousDigest, ...trial };
  return [...ledger, { ...entry, entryDigest: digest(entry) }];
}

export function verifyTrialLedger({ protocol, ledger }) {
  const errors = [];
  if (!Array.isArray(ledger)) return { valid: false, errors: ['ledger_not_array'], complete: false, evaluationAllowed: false };
  try {
    assertHex(protocol?.protocolDigest, 'protocol.protocolDigest');
    const { protocolDigest, ...unsignedProtocol } = protocol;
    if (digest(unsignedProtocol) !== protocolDigest) errors.push('protocol_digest_mismatch');
  } catch { errors.push('invalid_protocol_digest'); }
  const trialIds = new Set();
  const challengeIds = new Set();
  let previousDigest = '0'.repeat(64);
  ledger.forEach((entry, index) => {
    if (entry.sequence !== index + 1) errors.push(`sequence_mismatch:${index + 1}`);
    if (entry.protocolDigest !== protocol?.protocolDigest) errors.push(`protocol_binding_mismatch:${index + 1}`);
    if (entry.previousDigest !== previousDigest) errors.push(`chain_link_mismatch:${index + 1}`);
    const { entryDigest, ...unsignedEntry } = entry;
    if (digest(unsignedEntry) !== entryDigest) errors.push(`entry_digest_mismatch:${index + 1}`);
    if (trialIds.has(entry.trialId)) errors.push(`duplicate_trial_id:${index + 1}`);
    if (challengeIds.has(entry.challengeId)) errors.push(`replayed_challenge_id:${index + 1}`);
    trialIds.add(entry.trialId);
    challengeIds.add(entry.challengeId);
    previousDigest = entryDigest;
  });
  if (ledger.length > (protocol?.maximumTrials ?? 0)) errors.push('maximum_trials_exceeded');
  const complete = ledger.length === protocol?.maximumTrials;
  return { valid: errors.length === 0, errors, complete, evaluationAllowed: errors.length === 0 && complete && protocol?.stoppingRule === 'evaluate_once_at_maximum_trials', ledgerDigest: previousDigest };
}
