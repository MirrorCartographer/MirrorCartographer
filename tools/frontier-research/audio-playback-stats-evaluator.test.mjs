import assert from 'node:assert/strict';
import { evaluatePlaybackStats } from './audio-playback-stats-evaluator.mjs';

const base = {
  underrunDuration: 0,
  underrunEvents: 0,
  totalDuration: 10,
  averageLatency: 0.02,
  minimumLatency: 0.01,
  maximumLatency: 0.03
};

{
  const result = evaluatePlaybackStats({ before: null, after: null, elapsedMs: 1500 });
  assert.equal(result.classification, 'audio_playback_stats_unsupported');
}

{
  const result = evaluatePlaybackStats({ before: base, after: { ...base, totalDuration: 11.2 }, elapsedMs: 1200 });
  assert.equal(result.classification, 'playback_progress_without_reported_underrun');
  assert.equal(result.deltas.totalDuration, 1.1999999999999993);
}

{
  const result = evaluatePlaybackStats({
    before: base,
    after: { ...base, totalDuration: 12, underrunDuration: 0.1, underrunEvents: 2 },
    elapsedMs: 2000
  });
  assert.equal(result.classification, 'playback_progress_with_underrun');
  assert.equal(result.deltas.underrunRatio, 0.05);
}

{
  const result = evaluatePlaybackStats({ before: base, after: base, elapsedMs: 500 });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'sampling_interval_below_spec_update_period');
}

{
  const result = evaluatePlaybackStats({
    before: base,
    after: { ...base, totalDuration: 9 },
    elapsedMs: 1500
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'counter_regression_or_reset');
}

{
  const result = evaluatePlaybackStats({ before: base, after: base, elapsedMs: 1500, documentVisible: false });
  assert.equal(result.classification, 'stats_update_privacy_gated_or_idle');
}

console.log('6 audio playback stats evaluator tests passed');
