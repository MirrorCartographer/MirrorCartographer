const HEX64 = /^[a-f0-9]{64}$/;
const EXACT_REF = /^refs\/(heads|tags)\/[A-Za-z0-9._\/-]+$/;

function asString(value) {
  return typeof value === 'string' ? value : '';
}

function normalizeFingerprint(value) {
  const normalized = asString(value).toLowerCase().replace(/^sha256:/, '');
  return HEX64.test(normalized) ? normalized : null;
}

function normalizeRule(rule, index) {
  const fingerprint = normalizeFingerprint(rule?.fingerprint);
  const repository = asString(rule?.repository);
  const workflow = asString(rule?.workflow);
  const ref = asString(rule?.ref);
  const claimClasses = Array.isArray(rule?.claimClasses)
    ? [...new Set(rule.claimClasses.filter((value) => typeof value === 'string' && value.length > 0))].sort()
    : [];

  const errors = [];
  if (!fingerprint) errors.push(`rules.${index}.fingerprint`);
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) errors.push(`rules.${index}.repository`);
  if (!/^\.github\/workflows\/[A-Za-z0-9_.\/-]+\.(?:yml|yaml)$/.test(workflow)) errors.push(`rules.${index}.workflow`);
  if (!EXACT_REF.test(ref)) errors.push(`rules.${index}.ref`);
  if (claimClasses.length === 0) errors.push(`rules.${index}.claimClasses`);

  return { errors, rule: { fingerprint, repository, workflow, ref, claimClasses } };
}

export function evaluateSignerAuthorization({ verification, identity, claimClass, policy }) {
  const reasons = [];
  if (verification?.verified !== true) reasons.push('verification.required');

  const fingerprints = Array.isArray(verification?.acceptedKeyFingerprints)
    ? [...new Set(verification.acceptedKeyFingerprints.map(normalizeFingerprint).filter(Boolean))].sort()
    : [];
  if (fingerprints.length === 0) reasons.push('verification.fingerprints');

  const repository = asString(identity?.repository);
  const workflow = asString(identity?.workflow);
  const ref = asString(identity?.ref);
  if (!repository) reasons.push('identity.repository');
  if (!workflow) reasons.push('identity.workflow');
  if (!ref) reasons.push('identity.ref');
  if (typeof claimClass !== 'string' || claimClass.length === 0) reasons.push('claimClass');
  if (policy?.enabled !== true) reasons.push('policy.disabled');
  if (policy?.default !== 'deny') reasons.push('policy.default-deny');
  if (!Array.isArray(policy?.rules) || policy.rules.length === 0) reasons.push('policy.rules');

  const normalizedRules = [];
  if (Array.isArray(policy?.rules)) {
    policy.rules.forEach((candidate, index) => {
      const normalized = normalizeRule(candidate, index);
      reasons.push(...normalized.errors);
      if (normalized.errors.length === 0) normalizedRules.push(normalized.rule);
    });
  }

  const authorizedFingerprints = fingerprints.filter((fingerprint) => normalizedRules.some((rule) =>
    rule.fingerprint === fingerprint &&
    rule.repository === repository &&
    rule.workflow === workflow &&
    rule.ref === ref &&
    rule.claimClasses.includes(claimClass)
  ));

  if (reasons.length === 0 && authorizedFingerprints.length !== fingerprints.length) {
    reasons.push('signer.unauthorized');
  }

  return Object.freeze({
    schemaVersion: '1.0.0',
    authorized: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)].sort()),
    authorizedFingerprints: Object.freeze(authorizedFingerprints),
    evaluatedFingerprints: Object.freeze(fingerprints),
    identity: Object.freeze({ repository, workflow, ref }),
    claimClass,
    policyMode: 'deny-by-default',
    trustLimit: 'This policy authorizes already-verified key fingerprints for an exact repository, workflow path, git ref, and claim class. It does not verify signatures, prove workflow execution, validate certificate identity or transparency logs, establish trusted time, or prove that a signed claim is true.'
  });
}
