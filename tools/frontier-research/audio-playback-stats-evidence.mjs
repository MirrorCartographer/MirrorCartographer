const finiteNonNegative = value => Number.isFinite(value) && value >= 0;

export function classifyAudioPlaybackStatsEvidence(input = {}) {
  const support = input.support ?? {};
  const sample = input.sample ?? {};
  const visible = input.documentVisible === true;
  const microphonePermission = input.microphonePermission === 'granted';

  if (support.playbackStats !== true) {
    return { classification: 'playback_stats_unsupported', claim: 'unresolved', audible: 'unproven' };
  }

  if (!visible && !microphonePermission) {
    return {
      classification: 'playback_stats_update_not_permitted',
      claim: 'unresolved',
      audible: 'unproven'
    };
  }

  const fields = ['underrunDuration', 'underrunEvents', 'totalDuration', 'averageLatency', 'minimumLatency', 'maximumLatency'];
  if (!fields.every(field => finiteNonNegative(sample[field]))) {
    return { classification: 'playback_stats_invalid', claim: 'invalid', audible: 'unproven' };
  }

  if (sample.minimumLatency > sample.averageLatency || sample.averageLatency > sample.maximumLatency) {
    return { classification: 'playback_stats_invalid', claim: 'invalid', audible: 'unproven' };
  }

  if (sample.underrunDuration > sample.totalDuration) {
    return { classification: 'playback_stats_invalid', claim: 'invalid', audible: 'unproven' };
  }

  const underrunRatio = sample.totalDuration === 0 ? 0 : sample.underrunDuration / sample.totalDuration;
  if (sample.underrunEvents > 0 || sample.underrunDuration > 0) {
    return {
      classification: 'playback_underrun_observed',
      claim: 'observed',
      underrunRatio,
      audible: 'not_determined'
    };
  }

  if (sample.totalDuration > 0) {
    return {
      classification: 'playback_path_no_underrun_observed',
      claim: 'observed',
      underrunRatio: 0,
      audible: 'unproven'
    };
  }

  return { classification: 'playback_stats_no_duration', claim: 'unresolved', audible: 'unproven' };
}
