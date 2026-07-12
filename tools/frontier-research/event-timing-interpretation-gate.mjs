import { evaluateEventTimingReplayAcceptance } from './event-timing-replay-acceptance-gate.mjs';
import { evaluateEventTimingCoverage } from './event-timing-coverage-gate.mjs';
import { bindEventTimingNavigation } from './event-timing-navigation-binding.mjs';

export function evaluateEventTimingInterpretation(input = {}, options = {}) {
  const replay = evaluateEventTimingReplayAcceptance(input.replayEvidence, options.replayOptions);
  const coverage = evaluateEventTimingCoverage(input.coveragePacket);
  const binding = bindEventTimingNavigation({
    replayNavigationId: replay.navigation_id,
    coverageNavigationId: input.coveragePacket?.navigationId
  });

  const result = {
    schema_version: '1.1.0',
    claim_state: 'unresolved',
    interpretation_valid: false,
    replay_acceptance_valid: replay.replay_acceptance_valid === true,
    coverage_accepted: coverage.accepted === true,
    navigation_binding_valid: binding.navigation_binding_valid === true,
    coverage_class: coverage.coverage,
    navigation_id: replay.navigation_id,
    reason: '',
    epistemic_limit: 'Structural replay validity, same-navigation binding, and observation coverage are necessary but do not prove event delivery, responsiveness quality, replay completeness, visual divergence, or causality.',
    privacy_boundary: {
      retains: ['opaque navigation id', 'layer validity flags', 'coverage class', 'reason code'],
      excludes: ['URLs', 'referrers', 'raw timing entries', 'event names', 'event targets', 'selectors', 'raw timestamps', 'time origins', 'user-agent strings']
    }
  };

  if (!result.replay_acceptance_valid) {
    result.reason = `replay_rejected:${replay.reason}`;
    return result;
  }
  if (!result.coverage_accepted) {
    result.reason = `coverage_invalid:${coverage.reasons.join(',')}`;
    return result;
  }
  if (!result.navigation_binding_valid) {
    result.reason = `navigation_binding_rejected:${binding.reason}`;
    return result;
  }
  if (coverage.coverage !== 'absence_interpretable') {
    result.reason = `coverage_partial:${coverage.epistemicLimit}`;
    return result;
  }

  result.claim_state = 'observed';
  result.interpretation_valid = true;
  result.reason = 'replay structure, same-navigation binding, and same-window observation coverage independently passed';
  return result;
}
