import assert from 'node:assert/strict';
import { classifyAudioOutputTimestampSequence } from './audio-output-timestamp-sequence.mjs';

assert.equal(classifyAudioOutputTimestampSequence().state, 'unsupported');
assert.equal(classifyAudioOutputTimestampSequence({ supported: true, samples: [] }).state, 'invalid_sequence');
assert.equal(classifyAudioOutputTimestampSequence({
  supported: true,
  samples: [{ contextTime: 0, performanceTime: 0 }, { contextTime: 0, performanceTime: 0 }]
}).state, 'unstarted_zero');
assert.equal(classifyAudioOutputTimestampSequence({
  supported: true,
  samples: [{ contextTime: 1, performanceTime: 1000 }, { contextTime: 1.02, performanceTime: 1020 }]
}).state, 'advancing');
assert.equal(classifyAudioOutputTimestampSequence({
  supported: true,
  samples: [{ contextTime: 1, performanceTime: 1000 }, { contextTime: 1, performanceTime: 1020 }]
}).state, 'stalled');
assert.equal(classifyAudioOutputTimestampSequence({
  supported: true,
  samples: [{ contextTime: 1, performanceTime: 1000 }, { contextTime: 0.9, performanceTime: 1020 }]
}).state, 'clock_regression');
assert.equal(classifyAudioOutputTimestampSequence({
  supported: true,
  samples: [{ contextTime: 1, performanceTime: 1000 }, { contextTime: 1.02, performanceTime: 990 }]
}).state, 'clock_regression');

const advancing = classifyAudioOutputTimestampSequence({
  supported: true,
  samples: [
    { contextTime: 2, performanceTime: 2000 },
    { contextTime: 2.032, performanceTime: 2032 },
    { contextTime: 2.064, performanceTime: 2064 }
  ]
});
assert.deepEqual(advancing.metrics, {
  sampleCount: 3,
  contextAdvanceSeconds: 0.06400000000000006,
  performanceAdvanceMilliseconds: 64
});
assert.match(advancing.limits.join(' '), /does not prove that sound reached/);

console.log('audio-output-timestamp-sequence: 9 assertions passed');
