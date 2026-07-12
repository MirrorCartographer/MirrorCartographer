import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyAudioOutputRouting, ROUTING_STATES } from './audio-output-routing.mjs';

const mediaDevices = { enumerateDevices() {} };

test('classifies absent sink APIs as unsupported', () => {
  const result = classifyAudioOutputRouting({ audioContext: {}, mediaDevices });
  assert.equal(result.state, ROUTING_STATES.UNSUPPORTED);
  assert.equal(result.canSelectOutput, false);
});

test('policy denial overrides available APIs', () => {
  const result = classifyAudioOutputRouting({
    audioContext: { sinkId: '', setSinkId() {} },
    mediaDevices,
    speakerSelectionAllowed: false
  });
  assert.equal(result.state, ROUTING_STATES.BLOCKED);
});

test('default sink is not treated as verified speaker output', () => {
  const result = classifyAudioOutputRouting({
    audioContext: { sinkId: '', setSinkId() {} },
    mediaDevices
  });
  assert.equal(result.state, ROUTING_STATES.DEFAULT_ONLY);
});

test('non-default sink without completion evidence remains unverified', () => {
  const result = classifyAudioOutputRouting({
    audioContext: { sinkId: 'device-123', setSinkId() {} },
    mediaDevices
  });
  assert.equal(result.state, ROUTING_STATES.SELECTABLE_UNVERIFIED);
});

test('sinkchange plus non-default identity confirms browser-visible selection only', () => {
  const result = classifyAudioOutputRouting({
    audioContext: { sinkId: { type: 'none' }, setSinkId() {} },
    mediaDevices,
    observedSinkChange: true
  });
  assert.equal(result.state, ROUTING_STATES.SELECTED_CONFIRMED);
  assert.equal(result.currentSink, 'type:none');
  assert.match(result.falsification, /hardware receiving/);
});
