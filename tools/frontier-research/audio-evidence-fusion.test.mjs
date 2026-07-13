import assert from 'node:assert/strict';
import { fuseAudioEvidence } from './audio-evidence-fusion.mjs';

const audible = fuseAudioEvidence({ render: 'advanced', playback: 'progress_without_underrun', route: 'available', physical: 'audible', directGesture: true });
assert.equal(audible.classification, 'audibility_observed');
assert.equal(audible.proves_audibility, true);

const contradiction = fuseAudioEvidence({ render: 'advanced', playback: 'progress_without_underrun', route: 'available', physical: 'inaudible', directGesture: true });
assert.equal(contradiction.classification, 'inaudible_despite_render_progress');
assert.equal(contradiction.confidence, 'strong_contradiction');

const routeLoss = fuseAudioEvidence({ render: 'advanced', playback: 'progress_without_underrun', route: 'lost', physical: 'inaudible', directGesture: true });
assert.equal(routeLoss.classification, 'inaudible_with_route_loss');

const stalled = fuseAudioEvidence({ render: 'stalled', playback: 'no_progress', route: 'default', physical: 'not_observed', directGesture: false });
assert.equal(stalled.classification, 'browser_path_stalled');
assert.equal(stalled.confidence, 'browser_convergent_without_gesture_control');

const unsupported = fuseAudioEvidence({ render: 'unsupported', playback: 'unsupported', route: 'unknown', physical: 'not_observed' });
assert.equal(unsupported.classification, 'insufficient_cross_channel_evidence');
assert.equal(unsupported.proves_audibility, false);

assert.throws(() => fuseAudioEvidence({ render: 'playing' }), /render has invalid value/);
console.log('6 audio evidence fusion tests passed');
