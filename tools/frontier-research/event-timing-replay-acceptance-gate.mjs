import { evaluateEventTimingIntegration } from './event-timing-integration-gate.mjs';
import { evaluateEventTimingClockBinding } from './event-timing-clock-gate.mjs';

const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;

export function evaluateEventTimingReplayAcceptance(input = {}, options = {}) {
  const navigationId = validToken(input.navigationId);
  const integration = evaluateEventTimingIntegration({
    navigationId,
    capabilityPacket: input.capabilityPacket,
    replayWindow: input.replayWindow
  }, {
    nowMs: options.nowMs,
    maxAgeMs: options.maxWallClockAgeMs
  });

  const clock = evaluateEventTimingClockBinding({
    packet: input.clockPacket,
    replay: input.clockReplay,
    maxAgeMs: options.maxMonotonicAgeMs,
    originToleranceMs: options.originToleranceMs
  });

  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    replay_acceptance_valid: false,
    navigation_id: navigationId,
    integration_valid: integration.integration_valid === true,
    clock_binding_valid: clock.clock_binding_valid === true,
    capability_age_ms: integration.capability_age_ms,
    clock_packet_age_ms: clock.packet_age_ms,
    reason: '',
    privacy_boundary: {
      retains: ['opaque navigation id', 'bounded packet ages', 'layer validity flags', 'reason code'],
      excludes: ['raw time origin', 'raw monotonic timestamps', 'wall-clock timestamp', 'event names', 'event targets', 'selectors', 'raw timing entries', 'user-agent strings']
    }
  };

  if (!navigationId) return fail(result, 'invalid_navigation_identity');
  if (!result.integration_valid) return fail(result, `integration_rejected:${integration.reason}`);
  if (!result.clock_binding_valid) return fail(result, `clock_binding_rejected:${clock.reason}`);
  if (integration.navigation_id !== clock.navigation_id || integration.navigation_id !== navigationId) {
    return fail(result, 'layer_navigation_mismatch');
  }
  if (input.replayWindow?.navigation_id !== input.clockReplay?.navigation_id) {
    return fail(result, 'replay_layer_navigation_mismatch');
  }

  result.claim_state = 'observed';
  result.replay_acceptance_valid = true;
  result.reason = 'capability, replay integration, and monotonic clock binding are valid for one opaque navigation identity';
  return result;
}

function validToken(value) {
  return typeof value === 'string' && TOKEN.test(value) ? value : null;
}

function fail(result, reason) {
  result.reason = reason;
  return result;
}
