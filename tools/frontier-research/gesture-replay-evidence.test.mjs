import test from 'node:test';
import assert from 'node:assert/strict';
import { combineGestureReplayEvidence } from './gesture-replay-evidence.mjs';

const baseInteraction = {
  claimState: 'observed', classification: 'slow_interaction',
  summary: { interactionCount: 1, observedEventCount: 2, droppedEntries: 0,
    worstDurationMs: 260, worstInputDelayMs: 20, worstProcessingDurationMs: 180, worstPresentationDelayMs: 60,
    target: '#private', name: 'click' }
};
const baseFrame = {
  state: 'severe_congestion_observed', observation_complete: true,
  privacy_safe_summary: { entry_count: 1, max_duration_ms: 240, total_blocking_duration_ms: 170,
    rendering_frame_count: 1, severe_frame_count: 1, max_style_layout_window_ms: 80, scripts: ['private.js'] }
};

test('fails closed for invalid replay identity', () => {
  assert.equal(combineGestureReplayEvidence({ replayId: '../secret', interaction: baseInteraction, frame: baseFrame }).claim_state, 'unresolved');
});

test('fails closed when either observer is incomplete', () => {
  const result = combineGestureReplayEvidence({ replayId: 'replay-1', interaction: {...baseInteraction, summary: {...baseInteraction.summary, droppedEntries: 2}}, frame: baseFrame });
  assert.equal(result.observation_complete, false);
  assert.equal(result.diagnosis, 'undetermined');
});

test('identifies handler work associated with severe congestion', () => {
  const result = combineGestureReplayEvidence({ replayId: 'replay-2', interaction: baseInteraction, frame: baseFrame });
  assert.equal(result.diagnosis, 'handler_work_dominant_with_severe_main_thread_congestion');
  assert.equal(result.confidence, 'strong_association');
});

test('distinguishes input delay without frame congestion', () => {
  const interaction = {...baseInteraction, summary: {...baseInteraction.summary, worstInputDelayMs: 210, worstProcessingDurationMs: 30, worstPresentationDelayMs: 20}};
  const frame = {...baseFrame, state: 'bounded_no_observation', privacy_safe_summary: {...baseFrame.privacy_safe_summary, entry_count: 0, severe_frame_count: 0}};
  const result = combineGestureReplayEvidence({ replayId: 'replay-3', interaction, frame });
  assert.equal(result.diagnosis, 'input_delay_dominant');
});

test('permits only a bounded no-signal statement when both complete observers are empty', () => {
  const interaction = {...baseInteraction, classification: 'no_qualifying_interaction_observed', summary: {...baseInteraction.summary, interactionCount: 0, observedEventCount: 0, worstDurationMs: 0, worstInputDelayMs: 0, worstProcessingDurationMs: 0, worstPresentationDelayMs: 0}};
  const frame = {...baseFrame, state: 'bounded_no_observation', privacy_safe_summary: {...baseFrame.privacy_safe_summary, entry_count: 0, severe_frame_count: 0, max_duration_ms: 0, total_blocking_duration_ms: 0}};
  const result = combineGestureReplayEvidence({ replayId: 'replay-4', interaction, frame });
  assert.equal(result.diagnosis, 'bounded_no_latency_signal');
  assert.equal(result.confidence, 'bounded');
});

test('does not serialize target, event, or script attribution', () => {
  const result = combineGestureReplayEvidence({ replayId: 'replay-5', interaction: baseInteraction, frame: baseFrame });
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('#private'), false);
  assert.equal(serialized.includes('click'), false);
  assert.equal(serialized.includes('private.js'), false);
});
