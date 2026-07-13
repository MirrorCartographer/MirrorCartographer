import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyAudioPlaybackStatsEvidence } from './audio-playback-stats-evidence.mjs';

const valid = {
  underrunDuration: 0,
  underrunEvents: 0,
  totalDuration: 4,
  averageLatency: 0.02,
  minimumLatency: 0.01,
  maximumLatency: 0.03
};

test('unsupported stats remain unresolved', () => {
  assert.equal(classifyAudioPlaybackStatsEvidence({}).classification, 'playback_stats_unsupported');
});

test('hidden document without microphone permission cannot claim fresh stats', () => {
  const result = classifyAudioPlaybackStatsEvidence({ support: { playbackStats: true }, sample: valid });
  assert.equal(result.classification, 'playback_stats_update_not_permitted');
});

test('valid zero-underrun playback does not prove audibility', () => {
  const result = classifyAudioPlaybackStatsEvidence({ support: { playbackStats: true }, documentVisible: true, sample: valid });
  assert.equal(result.classification, 'playback_path_no_underrun_observed');
  assert.equal(result.audible, 'unproven');
});

test('underrun evidence is observed but audibility is not determined', () => {
  const result = classifyAudioPlaybackStatsEvidence({
    support: { playbackStats: true }, documentVisible: true,
    sample: { ...valid, underrunDuration: 0.5, underrunEvents: 2, totalDuration: 5 }
  });
  assert.equal(result.classification, 'playback_underrun_observed');
  assert.equal(result.underrunRatio, 0.1);
  assert.equal(result.audible, 'not_determined');
});

test('rejects impossible latency ordering', () => {
  const result = classifyAudioPlaybackStatsEvidence({
    support: { playbackStats: true }, documentVisible: true,
    sample: { ...valid, minimumLatency: 0.04 }
  });
  assert.equal(result.claim, 'invalid');
});

test('rejects underrun duration larger than total duration', () => {
  const result = classifyAudioPlaybackStatsEvidence({
    support: { playbackStats: true }, microphonePermission: 'granted',
    sample: { ...valid, underrunDuration: 5, totalDuration: 4 }
  });
  assert.equal(result.classification, 'playback_stats_invalid');
});
