import assert from 'node:assert/strict';
import test from 'node:test';
import { validateBoundedReplayWindow } from './bounded-replay-window.mjs';

const base = {
  replayId: 'gesture:42',
  interaction: { navigationId: 'nav-7', timeOriginToken: 'origin-a', windowStartMs: 100, windowEndMs: 300, droppedEntries: 0, drained: true },
  frame: { navigationId: 'nav-7', timeOriginToken: 'origin-a', windowStartMs: 105, windowEndMs: 295, droppedEntries: 0, drained: true }
};

test('accepts same-navigation same-clock strongly overlapping drained windows', () => {
  const out = validateBoundedReplayWindow(base);
  assert.equal(out.window_integrity, true);
  assert.equal(out.claim_state, 'observed');
  assert.equal(out.shared_window.overlap_ratio, 0.95);
});

test('rejects navigation mismatch', () => {
  const out = validateBoundedReplayWindow({ ...base, frame: { ...base.frame, navigationId: 'nav-8' } });
  assert.equal(out.window_integrity, false);
  assert.equal(out.reason, 'navigation_identity_mismatch');
});

test('rejects clock-domain mismatch', () => {
  const out = validateBoundedReplayWindow({ ...base, frame: { ...base.frame, timeOriginToken: 'origin-b' } });
  assert.equal(out.reason, 'clock_domain_mismatch');
});

test('rejects undrained buffers and dropped entries', () => {
  assert.equal(validateBoundedReplayWindow({ ...base, frame: { ...base.frame, drained: false } }).reason, 'observer_buffers_not_drained');
  assert.equal(validateBoundedReplayWindow({ ...base, interaction: { ...base.interaction, droppedEntries: 2 } }).reason, 'dropped_entries_make_window_incomplete');
});

test('rejects non-overlapping or weakly overlapping windows', () => {
  assert.equal(validateBoundedReplayWindow({ ...base, frame: { ...base.frame, windowStartMs: 301, windowEndMs: 400 } }).reason, 'observer_windows_do_not_overlap');
  assert.equal(validateBoundedReplayWindow({ ...base, frame: { ...base.frame, windowStartMs: 250, windowEndMs: 350 } }).reason, 'observer_window_overlap_below_threshold');
});

test('does not serialize raw entries, DOM targets, event names, or script attribution', () => {
  const out = validateBoundedReplayWindow({
    ...base,
    interaction: { ...base.interaction, rawEntries: [{ target: '#buy', name: 'click' }] },
    frame: { ...base.frame, scripts: [{ sourceURL: 'https://private.example/app.js' }] }
  });
  const serialized = JSON.stringify(out);
  assert.equal(serialized.includes('#buy'), false);
  assert.equal(serialized.includes('click'), false);
  assert.equal(serialized.includes('private.example'), false);
});
