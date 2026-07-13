import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyAudioInterruptionRecovery } from './audio-interruption-recovery.mjs';

test('classifies an active interruption without guessing its cause', () => {
  const result = classifyAudioInterruptionRecovery({ before: 'running', after: 'interrupted', stateChangeObserved: true });
  assert.equal(result.classification, 'interruption_active');
  assert.equal(result.proves_audibility, false);
  assert.equal(result.privacy.retain_interruption_cause, false);
});

test('requires render progress after an interrupted-to-running transition', () => {
  const result = classifyAudioInterruptionRecovery({ before: 'interrupted', after: 'running', stateChangeObserved: true, renderAdvancedAfter: true });
  assert.equal(result.classification, 'interruption_recovered_with_render_progress');
  assert.equal(result.confidence, 'browser_convergent');
});

test('detects state recovery without render progress', () => {
  const result = classifyAudioInterruptionRecovery({ before: 'interrupted', after: 'running', renderAdvancedAfter: false });
  assert.equal(result.classification, 'state_recovered_without_render_progress');
  assert.equal(result.confidence, 'browser_contradiction');
});

test('does not treat a resolved resume promise as recovery', () => {
  const result = classifyAudioInterruptionRecovery({ before: 'suspended', after: 'suspended', resumeResolved: true, directGesture: true });
  assert.equal(result.classification, 'resume_resolution_state_mismatch');
});

test('treats a closed context as terminal', () => {
  const result = classifyAudioInterruptionRecovery({ before: 'running', after: 'closed' });
  assert.equal(result.classification, 'terminal_context');
});

test('provides an explicit fallback when interrupted is unsupported', () => {
  const result = classifyAudioInterruptionRecovery({ before: 'unsupported', after: 'running', renderAdvancedAfter: true });
  assert.equal(result.classification, 'interruption_state_unsupported');
});
