import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeploymentResponse } from './deployment-response-contract.mjs';

const validBody = '<title>Mirror Cartographer Research Field</title> Build theories that can survive contact with evidence. Theory instrument';

test('accepts bounded HTML with complete research identity', () => {
  const result = evaluateDeploymentResponse({ body: validBody, status: 200, resolvedUrl: 'https://mirror-cartographer-research.pages.dev/', contentType: 'text/html; charset=utf-8', contentLength: Buffer.byteLength(validBody) });
  assert.equal(result.ok, true);
  assert.deepEqual(result.reasons, []);
});

test('rejects non-HTML even when identity markers are present', () => {
  const result = evaluateDeploymentResponse({ body: validBody, status: 200, contentType: 'text/plain' });
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('unexpected-content-type'));
});

test('rejects an oversized declared response before trusting markers', () => {
  const result = evaluateDeploymentResponse({ body: validBody, status: 200, contentType: 'text/html', contentLength: 2000, maxBodyBytes: 1000 });
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('declared-body-too-large-or-invalid'));
});

test('rejects an oversized actual body', () => {
  const result = evaluateDeploymentResponse({ body: `${validBody}${'x'.repeat(2000)}`, status: 200, contentType: 'text/html', maxBodyBytes: 1000 });
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('body-too-large'));
});

test('preserves identity and status rejection reasons', () => {
  const result = evaluateDeploymentResponse({ body: '<html></html>', status: 503, contentType: 'text/html' });
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('invalid-http-status'));
  assert.ok(result.reasons.includes('research-identity-mismatch'));
  assert.equal(result.missing_markers.length, 3);
});
