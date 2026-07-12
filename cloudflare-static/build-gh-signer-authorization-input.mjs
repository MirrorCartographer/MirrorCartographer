import fs from 'node:fs';

const HEX64 = /^[a-f0-9]{64}$/;

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function fingerprintFromCertificate(certificate) {
  const candidates = [
    certificate?.sha256Fingerprint,
    certificate?.SHA256Fingerprint,
    certificate?.fingerprintSHA256,
    certificate?.FingerprintSHA256,
    certificate?.fingerprint,
    certificate?.Fingerprint
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const normalized = candidate.toLowerCase().replace(/^sha256:/, '').replace(/:/g, '');
    if (HEX64.test(normalized)) return normalized;
  }
  return null;
}

function workflowFromCertificate(certificate) {
  return text(certificate?.WorkflowRef)
    || text(certificate?.workflowRef)
    || text(certificate?.Workflow)
    || text(certificate?.workflow);
}

export function buildGhSignerAuthorizationInput(payload, policy) {
  const reasons = [];
  if (!Array.isArray(payload) || payload.length !== 1) {
    return { accepted: false, reasons: ['exactly-one-verified-attestation-required'] };
  }

  const result = payload[0]?.verificationResult;
  const certificate = result?.signature?.certificate;
  if (!object(result)) reasons.push('verification-result-required');
  if (!object(certificate)) reasons.push('verified-certificate-required');
  if (!Array.isArray(result?.verifiedTimestamps) || result.verifiedTimestamps.length === 0) {
    reasons.push('verified-timestamp-required');
  }

  const repository = text(certificate?.SourceRepository) || text(certificate?.sourceRepository);
  const workflow = workflowFromCertificate(certificate);
  const ref = text(certificate?.SourceRepositoryRef) || text(certificate?.sourceRepositoryRef);
  const fingerprint = fingerprintFromCertificate(certificate);

  if (!repository) reasons.push('certificate.repository-required');
  if (!workflow) reasons.push('certificate.workflow-required');
  if (!ref) reasons.push('certificate.ref-required');
  if (!fingerprint) reasons.push('certificate.sha256-fingerprint-required');
  if (!object(policy)) reasons.push('policy-object-required');

  if (reasons.length > 0) return { accepted: false, reasons: [...new Set(reasons)].sort() };

  return {
    accepted: true,
    reasons: [],
    input: {
      verification: {
        verified: true,
        acceptedKeyFingerprints: [fingerprint]
      },
      repository,
      workflow,
      ref,
      policy
    },
    trust_limit: 'This adapter only maps verifier-authenticated certificate fields and an explicit SHA-256 certificate fingerprint into authorization input. It does not establish that the policy is correct, that the workflow was safe, or that the deployment claim is true.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const verificationPath = process.argv[2] || 'cloudflare-deployment-proof.signature-verification.raw.json';
  const policyPath = process.argv[3] || 'cloudflare-signer-policy.json';
  const outputPath = process.argv[4] || 'cloudflare-signer-authorization-input.json';
  const payload = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  const result = buildGhSignerAuthorizationInput(payload, policy);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.accepted) process.exitCode = 1;
}
