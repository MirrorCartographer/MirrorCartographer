// Governance replay checks helper for MC durable artifacts.
// Public-safe: contains no private user material.
// Purpose: construct normalized governance.replay.check.v1 objects without tool-local error strings.

export class GovernanceReplayCheckError extends Error {
  constructor(code, message, detail = {}) {
    super(`${code}: ${message}`);
    this.name = 'GovernanceReplayCheckError';
    this.code = code;
    this.detail = detail;
  }
}

export const CHECK_SCHEMA_ID = 'governance.replay.check.v1';

export const CHECK_PREFIXES = Object.freeze({
  replay: 'GHR',
  manifest: 'GHM',
  schema: 'GHS',
  publicSafety: 'GHP',
  actions: 'GHA'
});

export const CHECK_CATEGORIES = Object.freeze([
  'descriptor.validation',
  'temp.synthesis',
  'helper.execution',
  'public_safety',
  'schema.validation',
  'artifact.manifest',
  'github_actions.emission',
  'exit_behavior',
  'contract'
]);

export const CHECK_STATES = Object.freeze([
  'passed',
  'expected_failure_observed',
  'unsafe_blocked',
  'schema_invalid_observed',
  'unexpected_failure',
  'contract_violation',
  'not_applicable'
]);

export const CHECK_SEVERITIES = Object.freeze(['info', 'notice', 'warning', 'error', 'blocked']);
export const CHECK_EXPECTEDNESS = Object.freeze(['expected', 'unexpected', 'diagnostic', 'not_applicable']);

export const CHECK_CODES = Object.freeze({
  GHR_DESCRIPTOR_VALID: Object.freeze({
    code: 'GHR_DESCRIPTOR_VALID',
    category: 'descriptor.validation',
    state: 'passed',
    severity: 'notice',
    expectedness: 'expected',
    defaultMessage: 'Replay descriptor passed public-safe structural validation.'
  }),
  GHR_EXPECTED_FAILURE_OBSERVED: Object.freeze({
    code: 'GHR_EXPECTED_FAILURE_OBSERVED',
    category: 'helper.execution',
    state: 'expected_failure_observed',
    severity: 'notice',
    expectedness: 'expected',
    defaultMessage: 'Replay observed the expected failure state.'
  }),
  GHR_UNEXPECTED_FAILURE: Object.freeze({
    code: 'GHR_UNEXPECTED_FAILURE',
    category: 'helper.execution',
    state: 'unexpected_failure',
    severity: 'error',
    expectedness: 'unexpected',
    defaultMessage: 'Replay encountered an unexpected failure.'
  }),
  GHR_SENTINEL_EXIT_STABLE: Object.freeze({
    code: 'GHR_SENTINEL_EXIT_STABLE',
    category: 'exit_behavior',
    state: 'passed',
    severity: 'notice',
    expectedness: 'expected',
    defaultMessage: 'Sentinel exit behavior matched the replay contract.'
  }),
  GHM_MANIFEST_CREATED: Object.freeze({
    code: 'GHM_MANIFEST_CREATED',
    category: 'artifact.manifest',
    state: 'passed',
    severity: 'notice',
    expectedness: 'expected',
    defaultMessage: 'Artifact manifest was created with deterministic file custody metadata.'
  }),
  GHM_MANIFEST_INVALID: Object.freeze({
    code: 'GHM_MANIFEST_INVALID',
    category: 'artifact.manifest',
    state: 'contract_violation',
    severity: 'error',
    expectedness: 'unexpected',
    defaultMessage: 'Artifact manifest did not satisfy the replay contract.'
  }),
  GHS_SCHEMA_VALID: Object.freeze({
    code: 'GHS_SCHEMA_VALID',
    category: 'schema.validation',
    state: 'passed',
    severity: 'notice',
    expectedness: 'expected',
    defaultMessage: 'Governance object matched its declared schema.'
  }),
  GHS_SCHEMA_INVALID_OBSERVED: Object.freeze({
    code: 'GHS_SCHEMA_INVALID_OBSERVED',
    category: 'schema.validation',
    state: 'schema_invalid_observed',
    severity: 'warning',
    expectedness: 'expected',
    defaultMessage: 'Replay observed the expected schema-invalid state without persisting unsafe details.'
  }),
  GHP_UNSAFE_SYMBOLIC_CASE_BLOCKED: Object.freeze({
    code: 'GHP_UNSAFE_SYMBOLIC_CASE_BLOCKED',
    category: 'public_safety',
    state: 'unsafe_blocked',
    severity: 'blocked',
    expectedness: 'expected',
    defaultMessage: 'Unsafe symbolic fixture material was blocked before artifact persistence.'
  }),
  GHP_PUBLIC_SAFE_OUTPUT_CONFIRMED: Object.freeze({
    code: 'GHP_PUBLIC_SAFE_OUTPUT_CONFIRMED',
    category: 'public_safety',
    state: 'passed',
    severity: 'notice',
    expectedness: 'expected',
    defaultMessage: 'Replay output passed the public-safety emission boundary.'
  }),
  GHA_ANNOTATION_EMITTED: Object.freeze({
    code: 'GHA_ANNOTATION_EMITTED',
    category: 'github_actions.emission',
    state: 'passed',
    severity: 'notice',
    expectedness: 'diagnostic',
    defaultMessage: 'GitHub annotation emission was derived from a normalized check.'
  })
});

const SECRET_LIKE_PATTERN = /(?:ghp_|github_pat_|sk-[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY|password=|token=|api[_-]?key\s*[:=])/i;
const ABSOLUTE_PATH_PATTERN = /(?:^|\s)(?:\/Users\/|\/home\/|C:\\Users\\)[^\s]*/i;
const RELATIVE_PATH_PATTERN = /^(?!\/)(?!~)(?![A-Za-z]:)(?!.*\\)(?!.*(?:^|/)\.\.(?:\/|$))(?!.*\/\/)[A-Za-z0-9._/-]+$/;
const JSON_POINTER_PATTERN = /^(?:|\/(?:[^~/]|~0|~1)*)$/;

function assertEnum(name, value, allowed) {
  if (!allowed.includes(value)) {
    throw new GovernanceReplayCheckError('GOVERNANCE_REPLAY_CHECK_INVALID', `${name} is not part of the v1 check contract`, { value });
  }
}

export function isPublicSafeText(value) {
  if (typeof value !== 'string') return true;
  return !SECRET_LIKE_PATTERN.test(value) && !ABSOLUTE_PATH_PATTERN.test(value);
}

export function redactPublicText(value, fallback = '[redacted]') {
  if (value === undefined || value === null) return fallback;
  const text = String(value);
  if (!text.trim()) return fallback;
  if (!isPublicSafeText(text)) return fallback;
  return text.length > 240 ? `${text.slice(0, 237)}...` : text;
}

export function safeDetailValue(value) {
  if (value === null || ['boolean', 'number'].includes(typeof value)) return value;
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string') return redactPublicText(value);
  return '[redacted-non-scalar]';
}

export function sanitizeSafeDetails(details = {}) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) return undefined;
  const output = {};
  for (const [key, value] of Object.entries(details).slice(0, 12)) {
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(key)) continue;
    output[key] = safeDetailValue(value);
  }
  return Object.keys(output).length ? output : undefined;
}

export function normalizeCheckLocation(location) {
  if (!location) return undefined;
  const normalized = {};
  if (location.path !== undefined) {
    const path = String(location.path).trim();
    if (!RELATIVE_PATH_PATTERN.test(path)) {
      throw new GovernanceReplayCheckError('GOVERNANCE_REPLAY_CHECK_LOCATION_INVALID', 'check location path must be public-safe and repository-relative');
    }
    normalized.path = path;
  }
  if (location.jsonPointer !== undefined) {
    const jsonPointer = String(location.jsonPointer);
    if (!JSON_POINTER_PATTERN.test(jsonPointer) || jsonPointer.length > 240) {
      throw new GovernanceReplayCheckError('GOVERNANCE_REPLAY_CHECK_LOCATION_INVALID', 'check location jsonPointer is invalid');
    }
    normalized.jsonPointer = jsonPointer;
  }
  if (Number.isInteger(location.line) && location.line > 0) normalized.line = location.line;
  if (Number.isInteger(location.column) && location.column > 0) normalized.column = location.column;
  return Object.keys(normalized).length ? normalized : undefined;
}

export function defaultEmissionFor({ severity, state }) {
  const githubAnnotation = severity === 'error'
    ? 'error'
    : severity === 'warning' || severity === 'blocked'
      ? 'warning'
      : severity === 'notice'
        ? 'notice'
        : 'none';
  const summaryVisibility = state === 'unsafe_blocked' ? 'redacted' : 'include';
  const dashboardVisibility = state === 'unexpected_failure' ? 'include' : 'include';
  return { githubAnnotation, summaryVisibility, dashboardVisibility };
}

export function createReplayCheck({
  code,
  publicMessage,
  severity,
  category,
  state,
  expectedness,
  location,
  safeDetails,
  problem,
  emission
}) {
  const definition = CHECK_CODES[code];
  if (!definition) {
    throw new GovernanceReplayCheckError('GOVERNANCE_REPLAY_CHECK_CODE_UNKNOWN', 'check code is not registered in the append-only v1 taxonomy', { code });
  }

  const resolved = {
    schema: CHECK_SCHEMA_ID,
    code,
    severity: severity || definition.severity,
    category: category || definition.category,
    state: state || definition.state,
    expectedness: expectedness || definition.expectedness,
    publicMessage: redactPublicText(publicMessage || definition.defaultMessage, definition.defaultMessage)
  };

  assertEnum('severity', resolved.severity, CHECK_SEVERITIES);
  assertEnum('category', resolved.category, CHECK_CATEGORIES);
  assertEnum('state', resolved.state, CHECK_STATES);
  assertEnum('expectedness', resolved.expectedness, CHECK_EXPECTEDNESS);

  const normalizedLocation = normalizeCheckLocation(location);
  if (normalizedLocation) resolved.location = normalizedLocation;

  const normalizedDetails = sanitizeSafeDetails(safeDetails);
  if (normalizedDetails) resolved.safeDetails = normalizedDetails;

  if (problem) {
    resolved.problem = {
      type: redactPublicText(problem.type || `urn:mirror-cartographer:governance:checks:${code}`),
      title: redactPublicText(problem.title || definition.defaultMessage, definition.defaultMessage).slice(0, 80),
      detail: redactPublicText(problem.detail || resolved.publicMessage, resolved.publicMessage),
      instance: redactPublicText(problem.instance || code, code).slice(0, 160)
    };
  }

  resolved.emission = emission || defaultEmissionFor(resolved);
  return Object.freeze(resolved);
}

export function createProblemCheck(code, error, options = {}) {
  const message = error?.message || options.publicMessage || CHECK_CODES[code]?.defaultMessage;
  return createReplayCheck({
    code,
    ...options,
    publicMessage: options.publicMessage || message,
    safeDetails: {
      ...(options.safeDetails || {}),
      errorName: error?.name || 'Error',
      sourceCode: error?.code || 'unclassified'
    },
    problem: {
      type: `urn:mirror-cartographer:governance:checks:${code}`,
      title: CHECK_CODES[code]?.defaultMessage || 'Governance replay check',
      detail: options.publicMessage || message,
      instance: options.instance || code
    }
  });
}

export function summarizeChecks(checks = []) {
  const summary = {
    total: checks.length,
    passed: 0,
    expectedFailures: 0,
    unsafeBlocked: 0,
    schemaInvalidObserved: 0,
    unexpectedFailures: 0,
    contractViolations: 0
  };
  for (const check of checks) {
    if (check.state === 'passed') summary.passed += 1;
    if (check.state === 'expected_failure_observed') summary.expectedFailures += 1;
    if (check.state === 'unsafe_blocked') summary.unsafeBlocked += 1;
    if (check.state === 'schema_invalid_observed') summary.schemaInvalidObserved += 1;
    if (check.state === 'unexpected_failure') summary.unexpectedFailures += 1;
    if (check.state === 'contract_violation') summary.contractViolations += 1;
  }
  return Object.freeze(summary);
}

export function hasFatalReplayChecks(checks = []) {
  return checks.some((check) => check.expectedness === 'unexpected' || check.state === 'unexpected_failure' || check.state === 'contract_violation');
}

export function checksToMarkdown(checks = []) {
  const lines = ['| Code | State | Severity | Public message |', '|---|---:|---:|---|'];
  for (const check of checks) {
    lines.push(`| ${check.code} | ${check.state} | ${check.severity} | ${redactPublicText(check.publicMessage)} |`);
  }
  return `${lines.join('\n')}\n`;
}
