import assert from 'node:assert/strict';
import { classifyAudioRenderCapacity } from './audio-render-capacity-evidence.mjs';

assert.equal(classifyAudioRenderCapacity().state, 'unsupported');
assert.equal(classifyAudioRenderCapacity({ supported: true }).state, 'available_unobserved');
assert.equal(classifyAudioRenderCapacity({ supported: true, averageLoad: NaN, peakLoad: 0, underrunRatio: 0 }).state, 'invalid_sample');
assert.equal(classifyAudioRenderCapacity({ supported: true, averageLoad: 0.3, peakLoad: 0.7, underrunRatio: 0 }).state, 'healthy_sample');
assert.equal(classifyAudioRenderCapacity({ supported: true, averageLoad: 0.4, peakLoad: 1.02, underrunRatio: 0 }).state, 'pressure_sample');
assert.equal(classifyAudioRenderCapacity({ supported: true, averageLoad: 0.4, peakLoad: 0.8, underrunRatio: 0.01 }).state, 'pressure_sample');
console.log('audio-render-capacity-evidence: 6 assertions passed');
