import assert from 'node:assert/strict';
import { normalizeBidiServerFrames } from './bidi-wire-transcript.mjs';

const event = JSON.stringify({ type: 'event', method: 'browsingContext.load', params: { context: 'ctx', timestamp: 1, url: 'https://example.test' } });
const success = JSON.stringify({ type: 'success', id: 4, result: { data: 'aGVsbG8=' } });

{
  const result = normalizeBidiServerFrames([event, success]);
  assert.equal(result.accepted, true);
  assert.equal(result.schema, 'mc.webdriver-bidi-wire.v1');
  assert.equal(result.frameCount, 2);
  assert.equal(result.transcript[1].id, 4);
}
{
  const result = normalizeBidiServerFrames(['{']);
  assert.deepEqual(result, { accepted: false, reason: 'invalid-json-frame:0' });
}
{
  const result = normalizeBidiServerFrames([JSON.stringify({ id: 7, method: 'script.evaluate', params: {} })]);
  assert.deepEqual(result, { accepted: false, reason: 'unexpected-client-command-on-server-stream:0' });
}
{
  const result = normalizeBidiServerFrames([JSON.stringify({ type: 'error', id: null, error: 'invalid argument', message: 'cannot correlate' })]);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'uncorrelated-protocol-error');
  assert.equal(result.protocolError.error, 'invalid argument');
}
{
  const result = normalizeBidiServerFrames([JSON.stringify({ type: 'success', id: 1 })]);
  assert.deepEqual(result, { accepted: false, reason: 'malformed-success-response:0' });
}
{
  const result = normalizeBidiServerFrames([JSON.stringify({ type: 'event', method: 'browsingContext.load' })]);
  assert.deepEqual(result, { accepted: false, reason: 'malformed-event:0' });
}
{
  const result = normalizeBidiServerFrames([JSON.stringify({ type: 'mystery' })]);
  assert.deepEqual(result, { accepted: false, reason: 'unknown-server-message:0' });
}

console.log('7 BiDi wire transcript tests passed');
