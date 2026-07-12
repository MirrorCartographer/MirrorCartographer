import assert from 'node:assert/strict';
import { classifyLongAnimationFrameEvidence as classify } from './long-animation-frame-evidence.mjs';

const supported = ['navigation', 'long-animation-frame'];

assert.equal(classify({supportedEntryTypes: [], callbackCount: 1}).state, 'unsupported');
assert.equal(classify({supportedEntryTypes: supported, callbackCount: 0}).state, 'unconfirmed');
assert.equal(classify({supportedEntryTypes: supported, callbackCount: 1, droppedEntriesCount: 2}).state, 'known_incomplete');

const none = classify({supportedEntryTypes: supported, callbackCount: 1, droppedEntriesCount: 0, entries: []});
assert.equal(none.state, 'bounded_no_observation');
assert.equal(none.absence_claim_allowed, true);

const normal = classify({supportedEntryTypes: supported, callbackCount: 1, droppedEntriesCount: 0, entries: [{entryType:'long-animation-frame', startTime:100, duration:80, blockingDuration:20, renderStart:150, styleAndLayoutStart:160, scripts:[{sourceURL:'private'}]}]});
assert.equal(normal.state, 'congestion_observed');
assert.deepEqual(Object.keys(normal.privacy_safe_summary).sort(), ['entry_count','max_duration_ms','max_style_layout_window_ms','rendering_frame_count','severe_frame_count','total_blocking_duration_ms'].sort());
assert.equal(JSON.stringify(normal).includes('private'), false);

const severe = classify({supportedEntryTypes: supported, callbackCount: 1, droppedEntriesCount: 0, entries: [{entryType:'long-animation-frame', startTime:0, duration:240, blockingDuration:170, renderStart:180, styleAndLayoutStart:190}]});
assert.equal(severe.state, 'severe_congestion_observed');
assert.equal(severe.privacy_safe_summary.severe_frame_count, 1);

console.log('6 deterministic tests passed');
