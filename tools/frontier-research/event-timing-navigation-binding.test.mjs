import test from 'node:test';
import assert from 'node:assert/strict';
import { bindEventTimingNavigation } from './event-timing-navigation-binding.mjs';

test('accepts exact opaque navigation identity match', () => {
  const result = bindEventTimingNavigation({ replayNavigationId: 'nav-020', coverageNavigationId: 'nav-020' });
  assert.equal(result.navigation_binding_valid, true);
  assert.equal(result.claim_state, 'observed');
  assert.equal(result.navigation_id, 'nav-020');
});

test('rejects coverage from a different navigation', () => {
  const result = bindEventTimingNavigation({ replayNavigationId: 'nav-020', coverageNavigationId: 'nav-019' });
  assert.equal(result.navigation_binding_valid, false);
  assert.equal(result.reason, 'coverage_replay_navigation_mismatch');
});

test('rejects absent coverage identity', () => {
  const result = bindEventTimingNavigation({ replayNavigationId: 'nav-020' });
  assert.equal(result.navigation_binding_valid, false);
  assert.equal(result.reason, 'coverage_navigation_identity_invalid');
});

test('does not retain URL or timing material', () => {
  const result = bindEventTimingNavigation({ replayNavigationId: 'nav-020', coverageNavigationId: 'nav-020' });
  for (const forbidden of ['url', 'referrer', 'time_origin_ms', 'event_name', 'event_target', 'selector', 'user_agent']) {
    assert.equal(Object.hasOwn(result, forbidden), false);
  }
});
