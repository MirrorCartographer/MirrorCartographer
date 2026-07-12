const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;

export function bindEventTimingNavigation({ replayNavigationId, coverageNavigationId } = {}) {
  const replay = validToken(replayNavigationId);
  const coverage = validToken(coverageNavigationId);
  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    navigation_binding_valid: false,
    navigation_id: replay,
    reason: '',
    privacy_boundary: {
      retains: ['one opaque navigation id', 'binding validity', 'reason code'],
      excludes: ['URLs', 'referrers', 'raw timestamps', 'event names', 'event targets', 'selectors', 'user-agent strings']
    }
  };

  if (!replay) return fail(result, 'replay_navigation_identity_invalid');
  if (!coverage) return fail(result, 'coverage_navigation_identity_invalid');
  if (replay !== coverage) return fail(result, 'coverage_replay_navigation_mismatch');

  result.claim_state = 'observed';
  result.navigation_binding_valid = true;
  result.reason = 'replay and coverage evidence are bound to the same opaque navigation identity';
  return result;
}

function validToken(value) {
  return typeof value === 'string' && TOKEN.test(value) ? value : null;
}

function fail(result, reason) {
  result.reason = reason;
  return result;
}
