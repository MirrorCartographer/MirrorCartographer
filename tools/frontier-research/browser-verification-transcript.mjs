import { createHash } from 'node:crypto';

const REQUIRED_EVENT_SEQUENCE = [
  'browsingContext.navigationStarted',
  'network.responseCompleted',
  'browsingContext.load'
];

function assertString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${name} must be a non-empty string`);
  return value;
}

function assertCommandId(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(`${name} must be a non-negative safe integer`);
  return value;
}

function decodeBase64(value, name) {
  assertString(value, name);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 !== 0) throw new TypeError(`${name} must be canonical base64`);
  const bytes = Buffer.from(value, 'base64');
  if (bytes.length === 0 || bytes.toString('base64') !== value) throw new TypeError(`${name} must decode to non-empty bytes`);
  return bytes;
}

export function sha256Bytes(value) {
  if (!Buffer.isBuffer(value) && !(value instanceof Uint8Array)) throw new TypeError('value must be bytes');
  return createHash('sha256').update(value).digest('hex');
}

export function buildVerificationPlan({ url, expectedCommit, runtimeExpression }) {
  assertString(url, 'url');
  assertString(expectedCommit, 'expectedCommit');
  assertString(runtimeExpression, 'runtimeExpression');
  return {
    standard: 'https://www.w3.org/TR/webdriver-bidi/',
    transcriptSchema: 'mc.webdriver-bidi-verification.v2',
    commands: [
      { id: 1, method: 'session.subscribe', params: { events: REQUIRED_EVENT_SEQUENCE } },
      { id: 2, method: 'browsingContext.navigate', params: { context: '$CONTEXT', url, wait: 'complete' } },
      { id: 3, method: 'script.evaluate', params: { expression: runtimeExpression, target: { context: '$CONTEXT' }, awaitPromise: true, resultOwnership: 'none' } },
      { id: 4, method: 'browsingContext.captureScreenshot', params: { context: '$CONTEXT', origin: 'viewport' } }
    ],
    acceptance: {
      expectedCommit,
      requiredEventSequence: REQUIRED_EVENT_SEQUENCE,
      requiredCommandResponses: [3, 4],
      trustLimit: 'A conforming transcript proves only the recorded browser protocol observations and correlated command results; it does not prove physical audio output, user perception, or trusted deployment provenance.'
    }
  };
}

export function validateVerificationTranscript(transcript, { expectedUrl, expectedCommit, evaluateCommandId = 3, screenshotCommandId = 4 }) {
  if (!Array.isArray(transcript) || transcript.length === 0) throw new TypeError('transcript must be a non-empty array');
  assertString(expectedUrl, 'expectedUrl');
  assertString(expectedCommit, 'expectedCommit');
  assertCommandId(evaluateCommandId, 'evaluateCommandId');
  assertCommandId(screenshotCommandId, 'screenshotCommandId');

  const events = [];
  const responses = new Map();
  for (let index = 0; index < transcript.length; index += 1) {
    const entry = transcript[index];
    if (!entry || typeof entry !== 'object') throw new TypeError(`transcript[${index}] must be an object`);
    if (entry.type === 'event') {
      const method = assertString(entry.method, `transcript[${index}].method`);
      const params = entry.params;
      if (!params || typeof params !== 'object') throw new TypeError(`transcript[${index}].params must be an object`);
      const context = assertString(params.context, `transcript[${index}].params.context`);
      const timestamp = Number(params.timestamp);
      if (!Number.isFinite(timestamp) || timestamp < 0) throw new TypeError(`transcript[${index}].params.timestamp must be a non-negative number`);
      events.push({ method, params, context, timestamp });
    } else if (entry.type === 'success' || entry.type === 'error') {
      const id = assertCommandId(entry.id, `transcript[${index}].id`);
      if (responses.has(id)) return { accepted: false, reason: `duplicate-command-response:${id}` };
      responses.set(id, entry);
    } else {
      throw new TypeError(`transcript[${index}].type must be event, success, or error`);
    }
  }

  for (let i = 1; i < events.length; i += 1) {
    if (events[i].timestamp < events[i - 1].timestamp) return { accepted: false, reason: 'non-monotonic-event-timestamps' };
  }
  if (events.length === 0) return { accepted: false, reason: 'missing-events' };
  const context = events[0].context;
  if (events.some((entry) => entry.context !== context)) return { accepted: false, reason: 'mixed-browsing-contexts' };

  let cursor = -1;
  const selected = {};
  for (const method of REQUIRED_EVENT_SEQUENCE) {
    cursor = events.findIndex((entry, index) => index > cursor && entry.method === method);
    if (cursor === -1) return { accepted: false, reason: `missing-or-out-of-order-event:${method}` };
    selected[method] = events[cursor];
  }

  const navigation = selected['browsingContext.navigationStarted'].params;
  if (navigation.url !== expectedUrl) return { accepted: false, reason: 'navigation-url-mismatch' };

  const response = selected['network.responseCompleted'].params;
  const responseUrl = response.response?.url ?? response.url;
  const status = response.response?.status ?? response.status;
  if (responseUrl !== expectedUrl || response.request?.url && response.request.url !== expectedUrl) return { accepted: false, reason: 'document-response-mismatch' };
  if (!Number.isInteger(status) || status < 200 || status >= 400) return { accepted: false, reason: 'document-response-not-successful' };

  const evaluation = responses.get(evaluateCommandId);
  if (!evaluation) return { accepted: false, reason: 'missing-script-evaluate-response' };
  if (evaluation.type === 'error') return { accepted: false, reason: 'script-evaluate-error' };
  const evaluationResult = evaluation.result?.result ?? evaluation.result;
  const commit = evaluationResult?.value?.commit ?? evaluationResult?.commit;
  if (commit !== expectedCommit) return { accepted: false, reason: 'runtime-commit-mismatch' };

  const screenshot = responses.get(screenshotCommandId);
  if (!screenshot) return { accepted: false, reason: 'missing-screenshot-response' };
  if (screenshot.type === 'error') return { accepted: false, reason: 'screenshot-command-error' };
  let screenshotBytes;
  try {
    screenshotBytes = decodeBase64(screenshot.result?.data, 'screenshot.result.data');
  } catch {
    return { accepted: false, reason: 'invalid-screenshot-base64' };
  }

  return {
    accepted: true,
    context,
    url: expectedUrl,
    commit: expectedCommit,
    screenshotSha256: sha256Bytes(screenshotBytes),
    screenshotBytes: screenshotBytes.length,
    observedEvents: REQUIRED_EVENT_SEQUENCE,
    correlatedCommandResponses: [evaluateCommandId, screenshotCommandId],
    claim: 'browser-observed-deployment-runtime-and-visual-state',
    limits: ['not-cryptographic-provenance', 'not-physical-output-proof', 'not-user-perception-proof']
  };
}
