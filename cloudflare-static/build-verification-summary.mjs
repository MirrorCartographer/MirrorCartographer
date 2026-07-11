import crypto from 'node:crypto';
import fs from 'node:fs';
import { validateVerificationReceipt } from '../tools/frontier-research/verification-receipt.mjs';
import { buildVerificationSummaryAttestation } from '../tools/frontier-research/verification-summary-attestation.mjs';

const CHECKS = Object.freeze([
  ['signature', (m) => m.signatureVerification?.status],
  ['subjectDigest', (m) => m.subjectVerification?.status],
  ['builder', (m) => m.trustedBuilderPolicy?.builder],
  ['source', (m) => m.trustedBuilderPolicy?.source],
  ['buildType', (m) => m.trustedBuilderPolicy?.buildType],
  ['externalParameters', (m) => m.trustedBuilderPolicy?.externalParameters],
  ['claimEvidence', (m) => m.claimEvidence?.status]
]);

const NORMALIZE = Object.freeze({
  signature: { verified: 'verified', not_verified: 'not_verified', failed: 'failed' },
  subjectDigest: { match: 'match', mismatch: 'mismatch' },
  builder: { trusted: 'trusted', untrusted: 'untrusted' },
  source: { trusted: 'match', match: 'match', untrusted: 'mismatch', mismatch: 'mismatch' },
  buildType: { match: 'recognized', recognized: 'recognized', mismatch: 'unrecognized', unrecognized: 'unrecognized' },
  externalParameters: { recognized: 'valid', valid: 'valid', unrecognized: 'invalid', invalid: 'invalid' },
  claimEvidence: { valid: 'verified', verified: 'verified', invalid: 'failed', failed: 'failed' }
});

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function requireIso(value, name) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${name} must be an ISO date-time`);
  return value;
}

export function buildCloudflareVerificationSummary({ manifest, manifestText, manifestUri, verifierVersion, policyUri, policyText, resourceUri, observedAt }) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new TypeError('manifest must be an object');
  if (typeof manifestText !== 'string' || !manifestText) throw new TypeError('manifestText must be non-empty');
  if (typeof policyText !== 'string' || !policyText) throw new TypeError('policyText must be non-empty');
  const time = requireIso(observedAt, 'observedAt');
  const subjectSha = manifest.subjectVerification?.computed_sha256;
  if (typeof subjectSha !== 'string' || !/^[a-f0-9]{64}$/.test(subjectSha)) throw new Error('manifest subject digest is invalid');

  const subject = { name: 'cloudflare-deployment-proof.json', sha256: subjectSha };
  const receipts = CHECKS.map(([check, read]) => {
    const raw = read(manifest);
    const status = NORMALIZE[check]?.[raw];
    if (!status) throw new Error(`unsupported ${check} status: ${String(raw)}`);
    return validateVerificationReceipt({
      schemaVersion: '1.0.0',
      check,
      status,
      uncertainty: status === 'not_verified' ? 'material' : 'none',
      verifier: {
        name: 'cloudflare-evidence-workflow',
        version: verifierVersion,
        invocation: manifestUri
      },
      subject,
      observedAt: time,
      evidenceRef: `${manifestUri}#${check}`,
      falsificationRoute: `Recompute ${check} from preserved proof, attestation, policy, and workflow outputs; reject on disagreement.`
    });
  });

  const descriptorDigest = sha256(manifestText);
  const receiptDescriptors = receipts.map((receipt) => ({
    uri: `${manifestUri}#receipt-${receipt.check}`,
    sha256: sha256(JSON.stringify(receipt))
  }));

  const summary = buildVerificationSummaryAttestation({
    receipts,
    receiptDescriptors,
    verifier: { id: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml', version: verifierVersion },
    policy: { uri: policyUri, sha256: sha256(policyText) },
    resourceUri,
    timeVerified: time
  });

  return {
    schema_version: '1.0.0',
    manifest: { uri: manifestUri, sha256: descriptorDigest },
    receipts,
    summary,
    acceptance_boundary: 'The summary is unsigned and must not be accepted until its signature and verifier identity are independently verified.'
  };
}

function main(argv = process.argv.slice(2)) {
  const [manifestPath = 'cloudflare-evidence-verification-input.json', policyPath = 'cloudflare-static/build-evidence-verification-input.mjs', outputPath = 'cloudflare-verification-summary.json'] = argv;
  const manifestText = fs.readFileSync(manifestPath, 'utf8');
  const policyText = fs.readFileSync(policyPath, 'utf8');
  const manifest = JSON.parse(manifestText);
  const result = buildCloudflareVerificationSummary({
    manifest,
    manifestText,
    manifestUri: `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY || 'MirrorCartographer/MirrorCartographer'}/actions/runs/${process.env.GITHUB_RUN_ID || 'local'}/artifacts/cloudflare-evidence-verification-input.json`,
    verifierVersion: process.env.GITHUB_SHA || 'local',
    policyUri: 'https://github.com/MirrorCartographer/MirrorCartographer/blob/main/cloudflare-static/build-evidence-verification-input.mjs',
    policyText,
    resourceUri: manifest.claimEvidence?.deployment_url || 'urn:mirrorcartographer:cloudflare-research:deployment-unresolved',
    observedAt: new Date().toISOString()
  });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ output: outputPath, result: result.summary.predicate.verificationResult }) + '\n');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
