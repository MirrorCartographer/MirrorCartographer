import fs from 'node:fs';

const HEX64 = /^[a-f0-9]{64}$/;
const REPOSITORY = 'MirrorCartographer/MirrorCartographer';
const WORKFLOW = '.github/workflows/cloudflare-pages-research.yml';
const CLAIM_CLASS = 'cloudflare.deployment-proof';

function normalizeFingerprint(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase().replace(/^sha256:/, '').replace(/:/g, '');
  return HEX64.test(normalized) ? normalized : null;
}

export function buildSignerPolicy({ fingerprint, ref = 'refs/heads/main' } = {}) {
  const normalizedFingerprint = normalizeFingerprint(fingerprint);
  const reasons = [];
  if (!normalizedFingerprint) reasons.push('trusted-signer-fingerprint-required');
  if (!/^refs\/(heads|tags)\/[A-Za-z0-9._\/-]+$/.test(ref)) reasons.push('exact-git-ref-required');

  if (reasons.length > 0) {
    return {
      accepted: false,
      reasons: [...new Set(reasons)].sort(),
      policy: { enabled: false, default: 'deny', rules: [] },
      trust_limit: 'Signer trust must be configured independently of the attestation being evaluated. Missing or malformed configuration fails closed.'
    };
  }

  return {
    accepted: true,
    reasons: [],
    policy: {
      enabled: true,
      default: 'deny',
      rules: [{
        fingerprint: normalizedFingerprint,
        repository: REPOSITORY,
        workflow: WORKFLOW,
        ref,
        claimClasses: [CLAIM_CLASS]
      }]
    },
    trust_limit: 'This policy pins one independently configured SHA-256 certificate fingerprint to an exact repository, workflow path, git ref, and claim class. It does not prove that the configured signer is benevolent or that a signed deployment claim is scientifically true.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] || 'cloudflare-signer-policy.json';
  const result = buildSignerPolicy({
    fingerprint: process.env.TRUSTED_SIGNER_CERT_SHA256,
    ref: process.env.GITHUB_REF || 'refs/heads/main'
  });
  fs.writeFileSync(outputPath, JSON.stringify(result.policy, null, 2) + '\n');
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.accepted) process.exitCode = 1;
}
