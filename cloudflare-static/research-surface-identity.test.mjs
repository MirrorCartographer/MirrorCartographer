import test from 'node:test';
import assert from 'node:assert/strict';
import { REQUIRED_RESEARCH_SURFACE_MARKERS, inspectResearchSurfaceIdentity } from './research-surface-identity.mjs';

const complete = REQUIRED_RESEARCH_SURFACE_MARKERS.join('\n');

test('accepts a successful response containing every identity marker', () => {
  const result = inspectResearchSurfaceIdentity(complete, { status: 200, resolvedUrl: 'https://example.pages.dev/' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.missing_markers, []);
});

test('rejects source drift with a precise missing-marker list', () => {
  const body = complete.replace('Theory instrument', 'Different instrument');
  const result = inspectResearchSurfaceIdentity(body, { status: 200 });
  assert.equal(result.ok, false);
  assert.deepEqual(result.missing_markers, ['Theory instrument']);
});

test('rejects an error response even when cached body text contains markers', () => {
  const result = inspectResearchSurfaceIdentity(complete, { status: 503 });
  assert.equal(result.ok, false);
  assert.equal(result.valid_status, false);
});

test('rejects non-string bodies without throwing', () => {
  const result = inspectResearchSurfaceIdentity(null, { status: 200 });
  assert.equal(result.ok, false);
  assert.equal(result.missing_markers.length, REQUIRED_RESEARCH_SURFACE_MARKERS.length);
});
