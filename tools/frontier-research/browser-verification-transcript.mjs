import { createHash } from 'node:crypto';

const REQUIRED_SEQUENCE = [
  'browsingContext.navigationStarted',
  'network.responseCompleted',
  'browsingContext.load',
  'script.evaluate',
  'browsingContext.captureScreenshot'
];

function assertString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${name} must be a non-empty string`);
  return value;
}

export function sha256Utf8(value) {
  return createHash('sha256').update(assertString(value, 'value'), 'utf8').digest('hex');
}

export function buildVerificationPlan({ url, expectedCommit, runtimeExpression }) {
  assertString(url, 'url');
  assertString(expectedCommit, 'expectedCommit');
  assertString(runtimeExpression, 'runtimeExpression');
  return {
    standard: 'https://www.w3.org/TR/webdriver-bidi/',
    commands: [
      { method: 'session.subscribe', params: { events: ['browsingContext.navigationStarted', 'browsingContext.load', 'network.responseCompleted', 'log.entryAdded'] } },
      { method: 'browsingContext.navigate', params: { context: '$CONTEXT', url, wait: 'complete' } },
      { method: 'script.evaluate', params: { expression: runtimeExpression, target: { context: '$CONTEXT' }, awaitPromise: true, resultOwnership: 'none' } },
      { method: 'browsingContext.captureScreenshot', params: { context: '$CONTEXT', origin: 'viewport' } }
    ],
    acceptance: {
      expectedCommit,
      requiredSequence: REQUIRED_SEQUENCE,
      trustLimit: 'A conforming transcript proves only the recorded browser protocol observations; it does not prove physical audio output, user perception, or trusted deployment provenance.'
    }
  };
}

export function validateVerificationTranscript(transcript, { expectedUrl, expectedCommit }) {
  if (!Array.isArray(transcript) || transcript.length === 0) throw new TypeError('transcript must be a non-empty array');
  assertString(expectedUrl, 'expectedUrl');
  assertString(expectedCommit, 'expectedCommit');

  const normalized = transcript.map((entry, index) => {
    if (!entry || typeof entry !== 'object') throw new TypeError(`transcript[${index}] must be an object`);
    const method = assertString(entry.method, `transcript[${index}].method`);
    const context = assertString(entry.context, `transcript[${index}].context`);
    const timestamp = Number(entry.timestamp);
    if (!Number.isFinite(timestamp) || timestamp < 0) throw new TypeError(`transcript[${index}].timestamp must be a non-negative number`);
    return { ...entry, method, context, timestamp };
  });

  for (let i = 1; i < normalized.length; i += 1) {
    if (normalized[i].timestamp < normalized[i - 1].timestamp) return { accepted: false, reason: 'non-monotonic-timestamps' };
  }

  const context = normalized[0].context;
  if (normalized.some((entry) => entry.context !== context)) return { accepted: false, reason: 'mixed-browsing-contexts' };

  let cursor = -1;
  const selected = {};
  for (const method of REQUIRED_SEQUENCE) {
    cursor = normalized.findIndex((entry, index) => index > cursor && entry.method === method);
    if (cursor === -1) return { accepted: false, reason: `missing-or-out-of-order:${method}` };
    selected[method] = normalized[cursor];
  }

  const navigation = selected['browsingContext.navigationStarted'];
  if (navigation.url !== expectedUrl) return { accepted: false, reason: 'navigation-url-mismatch' };

  const response = selected['network.responseCompleted'];
  if (response.url !== expectedUrl || response.resourceType !== 'document') return { accepted: false, reason: 'document-response-mismatch' };
  if (!Number.isInteger(response.status) || response.status < 200 || response.status >= 400) return { accepted: false, reason: 'document-response-not-successful' };

  const evaluation = selected['script.evaluate'];
  if (evaluation.exceptionDetails) return { accepted: false, reason: 'runtime-evaluation-exception' };
  if (!evaluation.result || evaluation.result.commit !== expectedCommit) return { accepted: false, reason: 'runtime-commit-mismatch' };

  const screenshot = selected['browsingContext.captureScreenshot'];
  if (typeof screenshot.data !== 'string' || screenshot.data.length < 16) return { accepted: false, reason: 'missing-screenshot-data' };

  return {
    accepted: true,
    context,
    url: expectedUrl,
    commit: expectedCommit,
    screenshotSha256: sha256Utf8(screenshot.data),
    observedMethods: REQUIRED_SEQUENCE,
    claim: 'browser-observed-deployment-runtime-and-visual-state',
    limits: ['not-cryptographic-provenance', 'not-physical-output-proof', 'not-user-perception-proof']
  };
}
