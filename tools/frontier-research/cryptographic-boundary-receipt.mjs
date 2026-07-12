import { createHash } from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be an object`);
  return value;
}
function requireString(value, label) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${label} must be a non-empty string`);
  return value;
}
function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function buildCryptographicBoundaryReceipt({ artifactSha256, verificationOutput, verifier }) {
  if (!SHA256.test(artifactSha256)) throw new TypeError('artifactSha256 must be lowercase SHA-256');
  if (!Array.isArray(verificationOutput) || verificationOutput.length !== 1) throw new Error('verificationOutput must contain exactly one verified attestation');
  const result = requireObject(requireObject(verificationOutput[0], 'verificationOutput[0]').verificationResult, 'verificationResult');
  const certificate = requireObject(requireObject(result.signature, 'verificationResult.signature').certificate, 'verificationResult.signature.certificate');
  if (!Array.isArray(result.verifiedTimestamps) || result.verifiedTimestamps.length === 0) throw new Error('verifiedTimestamps must contain at least one cryptographically verified witness');
  const statement = requireObject(result.statement, 'verificationResult.statement');
  const subject = Array.isArray(statement.subject) ? statement.subject : [];
  if (!subject.some((item) => item?.digest?.sha256 === artifactSha256)) throw new Error('verified statement subject does not match artifactSha256');
  const verifierInfo = requireObject(verifier, 'verifier');
  const receipt = {
    schemaVersion: '1.0.0', result: 'cryptographically_verified', artifact: { sha256: artifactSha256 },
    verifier: { tool: requireString(verifierInfo.tool, 'verifier.tool'), version: requireString(verifierInfo.version, 'verifier.version'), commandPolicy: requireString(verifierInfo.commandPolicy, 'verifier.commandPolicy') },
    cryptographicFacts: { certificate, verifiedTimestamps: result.verifiedTimestamps },
    workflowControlledClaims: { predicateType: statement.predicateType ?? null, predicate: statement.predicate ?? null, subject },
    trustLimit: 'Cryptographic verification binds the artifact to certificate identity and witnessed timestamps; workflow-controlled predicate content and the underlying scientific or deployment claim require independent policy and evidence review.'
  };
  return { ...receipt, receiptSha256: createHash('sha256').update(canonicalJson(receipt)).digest('hex') };
}
