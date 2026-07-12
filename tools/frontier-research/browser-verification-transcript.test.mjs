import assert from 'node:assert/strict';
import { buildVerificationPlan, validateVerificationTranscript } from './browser-verification-transcript.mjs';

const url = 'https://example.pages.dev/';
const commit = '0123456789abcdef0123456789abcdef01234567';
const screenshotData = Buffer.from('hello-world-screenshot').toString('base64');
const transcript = [
  { type: 'event', method: 'browsingContext.navigationStarted', params: { context: 'ctx-1', timestamp: 1, url } },
  { type: 'event', method: 'network.responseCompleted', params: { context: 'ctx-1', timestamp: 2, request: { url }, response: { url, status: 200 } } },
  { type: 'event', method: 'browsingContext.load', params: { context: 'ctx-1', timestamp: 3, url } },
  { type: 'success', id: 3, result: { type: 'success', result: { type: 'object', value: { commit } }, realm: 'realm-1' } },
  { type: 'success', id: 4, result: { data: screenshotData } }
];

const plan = buildVerificationPlan({ url, expectedCommit: commit, runtimeExpression: 'window.__DEPLOYMENT_IDENTITY__' });
assert.equal(plan.transcriptSchema, 'mc.webdriver-bidi-verification.v2');
assert.deepEqual(plan.acceptance.requiredCommandResponses, [3, 4]);
assert.match(plan.acceptance.trustLimit, /correlated command results/);

const accepted = validateVerificationTranscript(transcript, { expectedUrl: url, expectedCommit: commit });
assert.equal(accepted.accepted, true);
assert.equal(accepted.screenshotBytes, 22);
assert.equal(accepted.screenshotSha256, 'dd709cbfdc758a709cfe7d0f7fffe6ee4ff1378fa65dcc4f7aaef9dbe9d97e83');

const fakeScreenshotEvent = structuredClone(transcript);
fakeScreenshotEvent[4] = { type: 'event', method: 'browsingContext.captureScreenshot', params: { context: 'ctx-1', timestamp: 4, data: screenshotData } };
assert.deepEqual(validateVerificationTranscript(fakeScreenshotEvent, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'missing-screenshot-response' });

const duplicateResponse = structuredClone(transcript);
duplicateResponse.push(structuredClone(transcript[4]));
assert.deepEqual(validateVerificationTranscript(duplicateResponse, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'duplicate-command-response:4' });

const wrongCommandId = structuredClone(transcript);
wrongCommandId[3].id = 8;
assert.deepEqual(validateVerificationTranscript(wrongCommandId, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'missing-script-evaluate-response' });

const invalidBase64 = structuredClone(transcript);
invalidBase64[4].result.data = 'not base64';
assert.deepEqual(validateVerificationTranscript(invalidBase64, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'invalid-screenshot-base64' });

const mixed = structuredClone(transcript);
mixed[2].params.context = 'ctx-2';
assert.deepEqual(validateVerificationTranscript(mixed, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'mixed-browsing-contexts' });

const errorResponse = structuredClone(transcript);
errorResponse[1].params.response.status = 503;
assert.deepEqual(validateVerificationTranscript(errorResponse, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'document-response-not-successful' });

console.log('7 browser verification transcript v2 tests passed');
