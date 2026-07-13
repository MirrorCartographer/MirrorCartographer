import { createHash } from 'node:crypto';

const STATES = Object.freeze([
  'trigger_intent_recorded',
  'trigger_attempt_accepted',
  'peer_run_observed',
  'peer_output_committed',
  'peer_completion_verified'
]);

const REQUIRED_EVIDENCE = Object.freeze({
  trigger_intent_recorded: ['request_id', 'requester_team', 'target_team', 'requested_at'],
  trigger_attempt_accepted: ['control_plane', 'acknowledgement_id', 'accepted_at'],
  peer_run_observed: ['run_id', 'run_started_at', 'run_observer'],
  peer_output_committed: ['repository', 'commit_sha', 'output_paths'],
  peer_completion_verified: ['verifier', 'verified_at', 'verification_result', 'acceptance_criteria']
});

const NEXT_STATE = Object.freeze({
  trigger_intent_recorded: 'trigger_attempt_accepted',
  trigger_attempt_accepted: 'peer_run_observed',
  peer_run_observed: 'peer_output_committed',
  peer_output_committed: 'peer_completion_verified'
});

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash('sha256').update(canonicalize(value)).digest('hex');
}

function assertRequiredEvidence(state, evidence) {
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) {
    throw new TypeError(`evidence for ${state} must be an object`);
  }
  for (const field of REQUIRED_EVIDENCE[state]) {
    const value = evidence[field];
    if (Array.isArray(value)) {
      if (value.length === 0 || value.some((entry) => !isNonEmptyString(entry))) {
        throw new Error(`${state} requires non-empty ${field}`);
      }
    } else if (!isNonEmptyString(value)) {
      throw new Error(`${state} requires ${field}`);
    }
  }
}

export function validateTriggerReceiptChain(chain) {
  if (!chain || typeof chain !== 'object' || Array.isArray(chain)) {
    throw new TypeError('chain must be an object');
  }
  if (!isNonEmptyString(chain.correlation_id)) throw new Error('correlation_id is required');
  if (!Array.isArray(chain.receipts) || chain.receipts.length === 0) {
    throw new Error('receipts must be a non-empty array');
  }

  const seenIds = new Set();
  let previous = null;

  for (const [index, receipt] of chain.receipts.entries()) {
    if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
      throw new TypeError(`receipt ${index} must be an object`);
    }
    if (!STATES.includes(receipt.state)) throw new Error(`unknown state at receipt ${index}`);
    if (index === 0 && receipt.state !== STATES[0]) throw new Error('chain must begin with trigger_intent_recorded');
    if (previous && NEXT_STATE[previous.state] !== receipt.state) {
      throw new Error(`invalid transition ${previous.state} -> ${receipt.state}`);
    }
    if (!isNonEmptyString(receipt.receipt_id) || seenIds.has(receipt.receipt_id)) {
      throw new Error(`receipt ${index} requires a unique receipt_id`);
    }
    seenIds.add(receipt.receipt_id);
    if (receipt.correlation_id !== chain.correlation_id) throw new Error(`correlation mismatch at receipt ${index}`);
    if (index === 0) {
      if (receipt.previous_receipt_digest != null) throw new Error('first receipt must not claim a predecessor');
    } else {
      const expected = digest(previous);
      if (receipt.previous_receipt_digest !== expected) throw new Error(`broken receipt digest link at receipt ${index}`);
    }
    assertRequiredEvidence(receipt.state, receipt.evidence);
    previous = receipt;
  }

  return Object.freeze({
    accepted: true,
    correlation_id: chain.correlation_id,
    terminal_state: previous.state,
    complete: previous.state === 'peer_completion_verified',
    receipt_count: chain.receipts.length,
    chain_digest: digest(chain.receipts)
  });
}

export function appendTriggerReceipt(chain, nextReceipt) {
  const base = structuredClone(chain);
  validateTriggerReceiptChain(base);
  const previous = base.receipts.at(-1);
  const receipt = {
    ...structuredClone(nextReceipt),
    correlation_id: base.correlation_id,
    previous_receipt_digest: digest(previous)
  };
  base.receipts.push(receipt);
  validateTriggerReceiptChain(base);
  return base;
}

export const triggerReceiptStates = STATES;
