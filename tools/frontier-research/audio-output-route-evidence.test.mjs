import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAudioOutputRouteEvidence } from './audio-output-route-evidence.mjs';

const base = {
  schema_version: '1.0.0',
  session_id: 'session-iphone-001',
  source_commit: 'a'.repeat(40),
  deployment_url: 'https://example.vercel.app',
  captured_at: '2026-07-12T13:55:00Z',
  api_support: { sink_id: true, set_sink_id: true, select_audio_output: true, enumerate_devices: true },
  route: { sink_id: 'speaker-1', requested_sink_id: 'speaker-1', set_sink_id_outcome: 'fulfilled', devicechange_observed: false, observation_window_ms: 1200 },
  devices: [{ kind: 'audiooutput', device_id: 'speaker-1', label_exposed: true, label: 'Living Room Speaker' }]
};

test('accepts a browser-bound non-default route without claiming audibility', () => {
  const result = validateAudioOutputRouteEvidence(base);
  assert.equal(result.valid, true);
  assert.equal(result.classification, 'non_default_route_bound');
  assert.match(result.claim_limits.join(' '), /does not prove.*acoustic energy/i);
});

test('classifies an empty sink id as user-agent default only', () => {
  const record = structuredClone(base);
  record.route = { sink_id: '', requested_sink_id: null, set_sink_id_outcome: 'not_attempted' };
  record.devices = [];
  const result = validateAudioOutputRouteEvidence(record);
  assert.equal(result.valid, true);
  assert.equal(result.classification, 'user_agent_default_route_only');
});

test('rejects a fulfilled route selection when observed and requested sinks differ', () => {
  const record = structuredClone(base);
  record.route.sink_id = 'speaker-2';
  const result = validateAudioOutputRouteEvidence(record);
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /equal requested_sink_id/);
});

test('rejects a fulfilled route whose sink is absent from enumerateDevices', () => {
  const record = structuredClone(base);
  record.devices = [{ kind: 'audiooutput', device_id: 'speaker-2', label_exposed: false }];
  const result = validateAudioOutputRouteEvidence(record);
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /enumerated audiooutput/);
});

test('preserves privacy by rejecting an unexposed device label', () => {
  const record = structuredClone(base);
  record.devices[0] = { kind: 'audiooutput', device_id: 'speaker-1', label_exposed: false, label: 'Hidden Speaker' };
  const result = validateAudioOutputRouteEvidence(record);
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /label must be omitted/);
});

test('classifies unsupported route APIs without turning absence into failure', () => {
  const record = structuredClone(base);
  record.api_support = { sink_id: false, set_sink_id: false, select_audio_output: false, enumerate_devices: true };
  record.route = { sink_id: null, requested_sink_id: null, set_sink_id_outcome: 'unsupported' };
  record.devices = [];
  const result = validateAudioOutputRouteEvidence(record);
  assert.equal(result.valid, true);
  assert.equal(result.classification, 'route_api_unsupported');
});
