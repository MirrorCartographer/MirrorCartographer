const LEGACY = /^repo:([^/@:]+)\/([^/@:]+):(environment|ref|pull_request):(.+)$/;
const IMMUTABLE = /^repo:([^/@:]+)@(\d+)\/([^/@:]+)@(\d+):(environment|ref|pull_request):(.+)$/;

function freeze(result) {
  return Object.freeze({ ...result, reasons: Object.freeze(result.reasons ?? []) });
}

export function parseGitHubOidcSubject(subject) {
  if (typeof subject !== 'string' || subject.length === 0) {
    return freeze({ valid: false, format: 'invalid', reasons: ['subject-string-required'] });
  }

  const immutable = IMMUTABLE.exec(subject);
  if (immutable) {
    return freeze({
      valid: true,
      format: 'immutable',
      owner: immutable[1],
      ownerId: immutable[2],
      repository: immutable[3],
      repositoryId: immutable[4],
      qualifierType: immutable[5],
      qualifier: immutable[6],
      reasons: []
    });
  }

  const legacy = LEGACY.exec(subject);
  if (legacy) {
    return freeze({
      valid: true,
      format: 'legacy',
      owner: legacy[1],
      ownerId: null,
      repository: legacy[2],
      repositoryId: null,
      qualifierType: legacy[3],
      qualifier: legacy[4],
      reasons: []
    });
  }

  return freeze({ valid: false, format: 'invalid', reasons: ['unsupported-subject-format'] });
}

export function evaluateGitHubOidcSubject(subject, policy) {
  const parsed = parseGitHubOidcSubject(subject);
  const reasons = [...parsed.reasons];

  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) {
    return freeze({ accepted: false, migrationRequired: false, parsed, reasons: [...reasons, 'policy-object-required'] });
  }
  if (policy.mode !== 'deny-by-default') reasons.push('policy.mode');
  if (!parsed.valid) return freeze({ accepted: false, migrationRequired: false, parsed, reasons });

  if (parsed.owner !== policy.owner) reasons.push('owner');
  if (parsed.repository !== policy.repository) reasons.push('repository');
  if (parsed.qualifierType !== policy.qualifierType) reasons.push('qualifierType');
  if (parsed.qualifier !== policy.qualifier) reasons.push('qualifier');

  if (parsed.format === 'immutable') {
    if (parsed.ownerId !== policy.ownerId) reasons.push('ownerId');
    if (parsed.repositoryId !== policy.repositoryId) reasons.push('repositoryId');
  } else if (policy.requireImmutable === true) {
    reasons.push('immutable-subject-required');
  }

  const accepted = reasons.length === 0;
  return freeze({
    accepted,
    migrationRequired: parsed.format === 'legacy' && accepted && policy.requireImmutable !== true,
    parsed,
    reasons
  });
}

export function createGitHubOidcSubjectPolicy({ owner, ownerId, repository, repositoryId, qualifierType, qualifier, requireImmutable = false }) {
  for (const [name, value] of Object.entries({ owner, ownerId, repository, repositoryId, qualifierType, qualifier })) {
    if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name}-nonempty-string-required`);
  }
  if (!/^\d+$/.test(ownerId)) throw new TypeError('ownerId-decimal-string-required');
  if (!/^\d+$/.test(repositoryId)) throw new TypeError('repositoryId-decimal-string-required');
  if (!['environment', 'ref', 'pull_request'].includes(qualifierType)) throw new TypeError('qualifierType-unsupported');
  return Object.freeze({
    schemaVersion: '1.0.0',
    mode: 'deny-by-default',
    owner,
    ownerId,
    repository,
    repositoryId,
    qualifierType,
    qualifier,
    requireImmutable
  });
}
