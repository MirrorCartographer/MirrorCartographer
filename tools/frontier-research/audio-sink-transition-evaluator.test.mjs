import assert from 'node:assert/strict';
import { evaluateAudioSinkTransition } from './audio-sink-transition-evaluator.mjs';

const lost = evaluateAudioSinkTransition({ route: 'selected', deviceChangeObserved: true, selectedPresentBefore: true, selectedPresentAfter: false, mediaPaused: false });
assert.equal(lost.classification, 'selected_sink_lost_while_playing');
assert.equal(lost.proves_audibility, false);
assert.deepEqual(lost.privacy, { retained_device_id: false, retained_label: false });

const returned = evaluateAudioSinkTransition({ route: 'selected', deviceChangeObserved: true, selectedPresentBefore: false, selectedPresentAfter: true, mediaPaused: false });
assert.equal(returned.classification, 'selected_sink_reappeared');

const denied = evaluateAudioSinkTransition({ route: 'selected', selectedPresentBefore: true, selectedPresentAfter: true, setSinkIdOutcome: 'not_allowed' });
assert.equal(denied.classification, 'selection_not_allowed');

const fallback = evaluateAudioSinkTransition({ route: 'default' });
assert.equal(fallback.classification, 'default_route');

const insufficient = evaluateAudioSinkTransition({ route: 'unknown' });
assert.equal(insufficient.classification, 'insufficient_observation');

assert.throws(() => evaluateAudioSinkTransition({ route: 'speaker' }), /route/);
console.log('6 tests passed');
