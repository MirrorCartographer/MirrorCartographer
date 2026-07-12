import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyBidiEvidenceFrames } from './bidi-evidence-pipeline.mjs';

const url = 'https://example.test/';
const commit = 'abc123';
const frame = (value) => JSON.stringify(value);

const validFrames = [
  frame({ type: 'event', method: 'browsingContext.navigationStarted', params: { context: 'ctx', timestamp: 1, url } }),
  frame({ type: 'event', method: 'network.responseCompleted', params: { context: 'ctx', timestamp: 2, request: { url }, response: { url, status: 200 } } }),
  frame({ type: 'event', method: 'browsingContext.load', params: { context: 'ctx', timestamp: 3 } }),
  frame({ type: 'success', id: 3, result: { result: { value: { commit } } } }),
  frame({ type: 'success', id: 4, result: { data: Buffer.from('image').toString('base64') } })
];

test('accepts raw frames only after wire and semantic stages pass', () => {
  const result = verifyBidiEvidenceFrames(validFrames, { expectedUrl: url, expectedCommit: commit });
  assert.equal(result.accepted, true);
  assert.equal(result.wireFrameCount, 5);
  assert.equal(result.verification.commit, commit);
});

test('labels malformed JSON as wire rejection', () => {
  const result = verifyBidiEvidenceFrames(['{'], { expectedUrl: url, expectedCommit: commit });
  assert.deepEqual(
    { accepted: result.accepted, stage: result.stage, reason: result.reason },
    { accepted: false, stage: 'wire', reason: 'invalid-json-frame:0' }
  );
});

test('preserves null-id protocol errors at the wire stage', () => {
  const result = verifyBidiEvidenceFrames([
    frame({ type: 'error', id: null, error: 'invalid argument', message: 'bad' })
  ], { expectedUrl: url, expectedCommit: commit });
  assert.equal(result.stage, 'wire');
  assert.equal(result.reason, 'uncorrelated-protocol-error');
  assert.equal(result.protocolError.error, 'invalid argument');
});

test('labels runtime commit mismatch as semantic rejection', () => {
  const frames = [...validFrames];
  frames[3] = frame({ type: 'success', id: 3, result: { result: { value: { commit: 'wrong' } } } });
  const result = verifyBidiEvidenceFrames(frames, { expectedUrl: url, expectedCommit: commit });
  assert.equal(result.stage, 'semantic');
  assert.equal(result.reason, 'runtime-commit-mismatch');
  assert.equal(result.wireFrameCount, 5);
});

test('rejects client commands on the server stream before semantic validation', () => {
  const result = verifyBidiEvidenceFrames([
    frame({ id: 9, method: 'session.status', params: {} })
  ], { expectedUrl: url, expectedCommit: commit });
  assert.equal(result.stage, 'wire');
  assert.equal(result.reason, 'unexpected-client-command-on-server-stream:0');
});
