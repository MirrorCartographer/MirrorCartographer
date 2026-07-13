import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeInteropMatrix, validateInteropEvidence } from './indexeddb-browser-interop-evidence.mjs';

function base(overrides = {}) {
  return {
    browser: 'webkit',
    browser_version: 'test-build',
    platform: 'macOS',
    scenario: 'two_tab_contention',
    outcome: 'pass',
    capability_evidence: {
      indexeddb_available: true,
      transaction_options_supported: false,
      requested_durability: 'strict',
      observed_durability: 'default'
    },
    transaction_evidence: { started: true, completed: true, replay_rejected: true },
    recovery_evidence: {
      interruption_injected: false,
      reopen_attempted: false,
      recovered_record: null,
      persistence_claim: 'not_proven'
    },
    evidence_strength: 'browser_runtime_observation',
    uncertainty: 'device filesystem flush behavior not observed',
    falsification_route: 'repeat with controlled process termination and restart',
    source_commit: '0123456789abcdef0123456789abcdef01234567',
    ...overrides
  };
}

test('accepts contention evidence without inflating persistence', () => {
  const result = validateInteropEvidence(base());
  assert.equal(result.persistence_claim, 'not_proven');
});

test('requires interruption and reopen for abrupt termination evidence', () => {
  assert.throws(() => validateInteropEvidence(base({ scenario: 'abrupt_termination_recovery' })), /abrupt_termination_requires_interruption/);
});

test('accepts observed recovery after interruption', () => {
  const result = validateInteropEvidence(base({
    scenario: 'abrupt_termination_recovery',
    recovery_evidence: {
      interruption_injected: true,
      reopen_attempted: true,
      recovered_record: true,
      persistence_claim: 'recovered_after_interruption'
    }
  }));
  assert.equal(result.persistence_claim, 'recovered_after_interruption');
});

test('rejects false contention pass when replay was not rejected', () => {
  assert.throws(() => validateInteropEvidence(base({ transaction_evidence: { started: true, completed: true, replay_rejected: false } })), /contention_pass_requires_replay_rejection/);
});

test('matrix remains incomplete until every browser-scenario pair exists', () => {
  const summary = summarizeInteropMatrix([base()]);
  assert.equal(summary.complete, false);
  assert.equal(summary.matrix.webkit.two_tab_contention, 'pass');
  assert.equal(summary.persistence_proven, false);
});
