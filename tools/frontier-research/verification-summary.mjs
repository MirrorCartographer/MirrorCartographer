import { createHash } from 'node:crypto';

const STATEMENT_TYPE = 'https://in-toto.io/Statement/v1';
const VSA_TYPE = 'https://slsa.dev/verification_summary/v1';
const SHA256 = /^[0-9a-f]{64}$/;
const RESULT = new Set(['PASSED', 'FAILED']);

function requireUri(value, name) {
  try {
    const url = new URL(value);
    if (!url.protocol) throw new Error();
  } catch {
    throw new TypeError(`${name}-absolute-uri-required`);
  }
  return value;
}

function requireDigest(value, name) {
  if (!SHA256.test(value ?? '')) throw new TypeError(`${name}-sha256-required`);
  return value;
}

export function sha256Json(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function createVerificationSummary({
  subjectName,
  subjectSha256,
  verifierId,
  verifierVersion = {},
  resourceUri,
  policyUri,
  policySha256,
  inputAttestations = [],
  verificationResult,
  verifiedLevels = ['MC_EVIDENCE_POLICY_V1'],
  timeVerified = new Date().toISOString(),
  slsaVersion = '1.2'
}) {
  if (typeof subjectName !== 'string' || !subjectName) throw new TypeError('subjectName-required');
  requireDigest(subjectSha256, 'subject');
  requireUri(verifierId, 'verifierId');
  requireUri(resourceUri, 'resourceUri');
  requireUri(policyUri, 'policyUri');
  requireDigest(policySha256, 'policy');
  if (!RESULT.has(verificationResult)) throw new TypeError('verificationResult-PASSED-or-FAILED-required');
  if (!Array.isArray(verifiedLevels) || verifiedLevels.length === 0 || verifiedLevels.some((level) => typeof level !== 'string' || !level)) {
    throw new TypeError('verifiedLevels-nonempty-string-array-required');
  }
  if (verificationResult === 'FAILED' && !verifiedLevels.includes('FAILED')) {
    throw new TypeError('failed-result-requires-FAILED-level');
  }
  if (verificationResult === 'PASSED' && verifiedLevels.includes('FAILED')) {
    throw new TypeError('passed-result-cannot-include-FAILED-level');
  }
  const timestamp = new Date(timeVerified);
  if (Number.isNaN(timestamp.getTime())) throw new TypeError('timeVerified-timestamp-required');

  const normalizedInputs = inputAttestations.map((item, index) => ({
    uri: requireUri(item?.uri, `inputAttestations[${index}].uri`),
    digest: { sha256: requireDigest(item?.sha256, `inputAttestations[${index}]`) }
  }));

  return Object.freeze({
    _type: STATEMENT_TYPE,
    subject: Object.freeze([{ name: subjectName, digest: Object.freeze({ sha256: subjectSha256 }) }]),
    predicateType: VSA_TYPE,
    predicate: Object.freeze({
      verifier: Object.freeze({ id: verifierId, version: Object.freeze({ ...verifierVersion }) }),
      timeVerified: timestamp.toISOString(),
      resourceUri,
      policy: Object.freeze({ uri: policyUri, digest: Object.freeze({ sha256: policySha256 }) }),
      inputAttestations: Object.freeze(normalizedInputs),
      verificationResult,
      verifiedLevels: Object.freeze([...verifiedLevels]),
      slsaVersion
    })
  });
}

export function evaluateVerificationSummary(statement, expectations) {
  const reasons = [];
  if (statement?._type !== STATEMENT_TYPE) reasons.push('statement._type');
  if (statement?.predicateType !== VSA_TYPE) reasons.push('statement.predicateType');
  if (!Array.isArray(statement?.subject) || statement.subject.length !== 1) reasons.push('statement.subject');
  const subject = statement?.subject?.[0];
  if (subject?.name !== expectations?.subjectName) reasons.push('subject.name');
  if (subject?.digest?.sha256 !== expectations?.subjectSha256) reasons.push('subject.digest.sha256');
  if (statement?.predicate?.verifier?.id !== expectations?.verifierId) reasons.push('verifier.id');
  if (statement?.predicate?.resourceUri !== expectations?.resourceUri) reasons.push('resourceUri');
  if (statement?.predicate?.policy?.uri !== expectations?.policyUri) reasons.push('policy.uri');
  if (statement?.predicate?.policy?.digest?.sha256 !== expectations?.policySha256) reasons.push('policy.digest.sha256');
  if (statement?.predicate?.verificationResult !== 'PASSED') reasons.push('verificationResult');
  if (!statement?.predicate?.verifiedLevels?.includes(expectations?.requiredLevel)) reasons.push('verifiedLevels');
  return Object.freeze({ accepted: reasons.length === 0, reasons: Object.freeze(reasons) });
}
