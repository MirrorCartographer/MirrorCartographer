import assert from 'node:assert/strict';
import { buildVerificationPlan, validateVerificationTranscript } from './browser-verification-transcript.mjs';

const url = 'https://example.pages.dev/';
const commit = '0123456789abcdef0123456789abcdef01234567';
const transcript = [
  { method: 'browsingContext.navigationStarted', context: 'ctx-1', timestamp: 1, url },
  { method: 'network.responseCompleted', context: 'ctx-1', timestamp: 2, url, resourceType: 'document', status: 200 },
  { method: 'browsingContext.load', context: 'ctx-1', timestamp: 3, url },
  { method: 'script.evaluate', context: 'ctx-1', timestamp: 4, result: { commit } },
  { method: 'browsingContext.captureScreenshot', context: 'ctx-1', timestamp: 5, data: 'aGVsbG8td29ybGQtc2NyZWVuc2hvdA==' }
];

const plan = buildVerificationPlan({ url, expectedCommit: commit, runtimeExpression: 'window.__DEPLOYMENT_IDENTITY__' });
assert.equal(plan.commands.length, 4);
assert.match(plan.acceptance.trustLimit, /does not prove physical audio output/);

const accepted = validateVerificationTranscript(transcript, { expectedUrl: url, expectedCommit: commit });
assert.equal(accepted.accepted, true);
assert.equal(accepted.screenshotSha256.length, 64);

const mixed = structuredClone(transcript);
mixed[3].context = 'ctx-2';
assert.deepEqual(validateVerificationTranscript(mixed, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'mixed-browsing-contexts' });

const reordered = [structuredClone(transcript[0]), structuredClone(transcript[2]), structuredClone(transcript[1]), structuredClone(transcript[3]), structuredClone(transcript[4])];
reordered.forEach((entry, index) => { entry.timestamp = index + 1; });
assert.deepEqual(validateVerificationTranscript(reordered, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'missing-or-out-of-order:browsingContext.load' });

const wrongCommit = structuredClone(transcript);
wrongCommit[3].result.commit = 'ffffffffffffffffffffffffffffffffffffffff';
assert.deepEqual(validateVerificationTranscript(wrongCommit, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'runtime-commit-mismatch' });

const errorResponse = structuredClone(transcript);
errorResponse[1].status = 503;
assert.deepEqual(validateVerificationTranscript(errorResponse, { expectedUrl: url, expectedCommit: commit }), { accepted: false, reason: 'document-response-not-successful' });

console.log('5 browser verification transcript tests passed');
