function assertText(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${name} must be non-empty text`);
  return value;
}

function parseFrame(frame, index) {
  const text = typeof frame === 'string' ? frame : frame?.data;
  assertText(text, `frames[${index}]`);
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    return { accepted: false, reason: `invalid-json-frame:${index}` };
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { accepted: false, reason: `non-object-frame:${index}` };
  }
  return { accepted: true, value };
}

function classifyServerMessage(message, index) {
  if (message.type === 'event') {
    if (typeof message.method !== 'string' || !message.params || typeof message.params !== 'object') {
      return { accepted: false, reason: `malformed-event:${index}` };
    }
    return { accepted: true, message };
  }
  if (message.type === 'success') {
    if (!Number.isSafeInteger(message.id) || message.id < 0 || !message.result || typeof message.result !== 'object') {
      return { accepted: false, reason: `malformed-success-response:${index}` };
    }
    return { accepted: true, message };
  }
  if (message.type === 'error') {
    const idValid = message.id === null || (Number.isSafeInteger(message.id) && message.id >= 0);
    if (!idValid || typeof message.error !== 'string' || typeof message.message !== 'string') {
      return { accepted: false, reason: `malformed-error-response:${index}` };
    }
    if (message.id === null) {
      return {
        accepted: false,
        reason: 'uncorrelated-protocol-error',
        protocolError: { error: message.error, message: message.message, stacktrace: message.stacktrace ?? null }
      };
    }
    return { accepted: true, message };
  }
  if (Number.isSafeInteger(message.id) && typeof message.method === 'string') {
    return { accepted: false, reason: `unexpected-client-command-on-server-stream:${index}` };
  }
  return { accepted: false, reason: `unknown-server-message:${index}` };
}

export function normalizeBidiServerFrames(frames) {
  if (!Array.isArray(frames) || frames.length === 0) throw new TypeError('frames must be a non-empty array');
  const transcript = [];
  for (let index = 0; index < frames.length; index += 1) {
    const parsed = parseFrame(frames[index], index);
    if (!parsed.accepted) return parsed;
    const classified = classifyServerMessage(parsed.value, index);
    if (!classified.accepted) return classified;
    transcript.push(classified.message);
  }
  return {
    accepted: true,
    schema: 'mc.webdriver-bidi-wire.v1',
    transcript,
    frameCount: transcript.length,
    claim: 'normalized-server-to-client-webdriver-bidi-messages',
    limits: [
      'does-not-prove-client-command-emission',
      'does-not-prove-browser-conformance',
      'does-not-prove-deployment-provenance'
    ]
  };
}
