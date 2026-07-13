import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateUserActivationAudioGate } from './user-activation-audio-gate.mjs';

const base = {
  isActiveAtHandlerEntry: true,
  hasBeenActiveAtHandlerEntry: true,
  isActiveAtAudioInvocation: true,
  elapsedMsToAudioInvocation: 0.4,
  audioInvocationAttempted: true,
  audioInvocationOutcome: 'resolved',
};

test('classifies a synchronous invocation under live transient activation', () => {
  const result = evaluateUserActivationAudioGate(base);
  assert.equal(result.classification, 'invoked_while_transient_activation_live');
  assert.equal(result.claims.audioStartSucceeded, true);
  assert.equal(result.claims.audible, false);
});

test('detects transient activation lost before invocation', () => {
  const result = evaluateUserActivationAudioGate({ ...base, isActiveAtAudioInvocation: false, elapsedMsToAudioInvocation: 25 });
  assert.equal(result.classification, 'transient_activation_lost_before_audio_invocation');
  assert.match(result.nextAction, /await, timer, task, or indirection/);
});

test('does not confuse sticky activation with current transient activation', () => {
  const result = evaluateUserActivationAudioGate({ ...base, isActiveAtHandlerEntry: false, isActiveAtAudioInvocation: false });
  assert.equal(result.classification, 'sticky_only_at_handler_entry');
});

test('retains rejection as a separate outcome', () => {
  const result = evaluateUserActivationAudioGate({ ...base, audioInvocationOutcome: 'rejected' });
  assert.equal(result.classification, 'invoked_with_activation_but_rejected');
  assert.equal(result.claims.audioStartSucceeded, false);
});

test('rejects contradictory attempt metadata', () => {
  assert.throws(() => evaluateUserActivationAudioGate({ ...base, audioInvocationAttempted: false, audioInvocationOutcome: 'resolved' }), /not_attempted/);
});
