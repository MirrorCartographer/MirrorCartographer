const SHA256 = /^[0-9a-f]{64}$/;
const GIT_SHA = /^[0-9a-f]{40}$/;
const STATEMENT_TYPE = 'https://in-toto.io/Statement/v1';
const PROVENANCE_TYPE = 'https://slsa.dev/provenance/v1';

function exactMatch(value, allowed = []) {
  return typeof value === 'string' && allowed.includes(value);
}

export function evaluateTrustedBuilderPolicy(statement, policy) {
  const reasons = [];
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) {
    return Object.freeze({ trusted: false, reasons: ['policy-object-required'] });
  }
  if (policy.mode !== 'deny-by-default') reasons.push('policy.mode');
  if (!statement || typeof statement !== 'object' || Array.isArray(statement)) {
    return Object.freeze({ trusted: false, reasons: [...reasons, 'statement-object-required'] });
  }
  if (statement._type !== STATEMENT_TYPE) reasons.push('statement._type');
  if (statement.predicateType !== PROVENANCE_TYPE) reasons.push('statement.predicateType');
  if (!Array.isArray(statement.subject) || statement.subject.length !== 1) reasons.push('statement.subject');
  else if (!SHA256.test(statement.subject[0]?.digest?.sha256 ?? '')) reasons.push('statement.subject.digest.sha256');

  const definition = statement.predicate?.buildDefinition;
  const details = statement.predicate?.runDetails;
  const builderId = details?.builder?.id;
  const sourceRepository = definition?.externalParameters?.sourceRepository;
  const sourceCommit = definition?.resolvedDependencies?.[0]?.digest?.gitCommit;
  const buildType = definition?.buildType;

  if (!exactMatch(builderId, policy.allowedBuilderIds)) reasons.push('builder.id');
  if (!exactMatch(sourceRepository, policy.allowedSourceRepositories)) reasons.push('sourceRepository');
  if (!GIT_SHA.test(sourceCommit ?? '')) reasons.push('sourceCommit');
  if (!exactMatch(buildType, policy.allowedBuildTypes)) reasons.push('buildType');
  if (policy.requireInvocationId === true && !details?.metadata?.invocationId) reasons.push('invocationId');

  return Object.freeze({ trusted: reasons.length === 0, reasons: Object.freeze(reasons) });
}

export function createTrustedBuilderPolicy({ allowedBuilderIds, allowedSourceRepositories, allowedBuildTypes, requireInvocationId = true }) {
  for (const [name, value] of Object.entries({ allowedBuilderIds, allowedSourceRepositories, allowedBuildTypes })) {
    if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || !item)) {
      throw new TypeError(`${name}-nonempty-string-array-required`);
    }
  }
  return Object.freeze({
    schemaVersion: '1.0.0',
    mode: 'deny-by-default',
    allowedBuilderIds: Object.freeze([...allowedBuilderIds]),
    allowedSourceRepositories: Object.freeze([...allowedSourceRepositories]),
    allowedBuildTypes: Object.freeze([...allowedBuildTypes]),
    requireInvocationId
  });
}
