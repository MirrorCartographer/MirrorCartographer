import fs from 'node:fs';

const EXPECTED_REPOSITORY = 'MirrorCartographer/MirrorCartographer';
const EXPECTED_WORKFLOW = '.github/workflows/cloudflare-pages-research.yml';

export function normalizeGitHubAttestationVerification(rows, {
  repository = EXPECTED_REPOSITORY,
  workflow = EXPECTED_WORKFLOW
} = {}) {
  if (!Array.isArray(rows)) throw new TypeError('verification rows must be an array');

  const accepted = rows.find((row) => {
    const verification = row?.verificationResult ?? row;
    const source = verification?.verifiedSourceRepository ?? verification?.sourceRepository;
    const signer = verification?.signerWorkflow ?? verification?.workflow;
    const digest = verification?.subjectDigest ?? verification?.digest;
    return verification?.verified === true
      && source === repository
      && typeof signer === 'string'
      && signer.includes(workflow)
      && typeof digest === 'string'
      && /^sha256:[a-f0-9]{64}$/i.test(digest);
  });

  if (!accepted) {
    return Object.freeze({
      status: 'not_verified',
      verifier: 'gh attestation verify',
      repository,
      workflow,
      reason: 'No verification row satisfied exact repository, workflow, and SHA-256 subject requirements.'
    });
  }

  const verification = accepted.verificationResult ?? accepted;
  return Object.freeze({
    status: 'verified',
    verifier: 'gh attestation verify',
    repository,
    workflow,
    subject_digest: verification.subjectDigest ?? verification.digest,
    certificate_identity: verification.certificateIdentity ?? null,
    transparency_log_verified: verification.transparencyLogVerified === true
  });
}

function main(argv = process.argv.slice(2)) {
  const [inputPath = 'cloudflare-deployment-proof.signature-verification.raw.json', outputPath = 'cloudflare-deployment-proof.signature-verification.json'] = argv;
  const rows = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = normalizeGitHubAttestationVerification(rows);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ output: outputPath, status: result.status }) + '\n');
  if (result.status !== 'verified') process.exitCode = 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
