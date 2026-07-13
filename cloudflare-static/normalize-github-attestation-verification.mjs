import fs from 'node:fs';

const EXPECTED_REPOSITORY = 'MirrorCartographer/MirrorCartographer';
const EXPECTED_WORKFLOW = '.github/workflows/cloudflare-pages-research.yml';
const EXPECTED_REF = 'refs/heads/main';

export function expectedGitHubWorkflowIdentity({
  repository = EXPECTED_REPOSITORY,
  workflow = EXPECTED_WORKFLOW,
  ref = EXPECTED_REF
} = {}) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new TypeError('repository-invalid');
  if (!workflow.startsWith('.github/workflows/') || !workflow.endsWith('.yml')) throw new TypeError('workflow-invalid');
  if (!ref.startsWith('refs/')) throw new TypeError('ref-invalid');
  return `https://github.com/${repository}/${workflow}@${ref}`;
}

export function normalizeGitHubAttestationVerification(rows, {
  repository = EXPECTED_REPOSITORY,
  workflow = EXPECTED_WORKFLOW,
  ref = EXPECTED_REF
} = {}) {
  if (!Array.isArray(rows)) throw new TypeError('verification rows must be an array');

  const expectedIdentity = expectedGitHubWorkflowIdentity({ repository, workflow, ref });
  const accepted = rows.find((row) => {
    const verification = row?.verificationResult ?? row;
    const source = verification?.verifiedSourceRepository ?? verification?.sourceRepository;
    const signer = verification?.signerWorkflow ?? verification?.workflow;
    const digest = verification?.subjectDigest ?? verification?.digest;
    const certificateIdentity = verification?.certificateIdentity;
    return verification?.verified === true
      && source === repository
      && signer === expectedIdentity
      && certificateIdentity === expectedIdentity
      && verification?.transparencyLogVerified === true
      && typeof digest === 'string'
      && /^sha256:[a-f0-9]{64}$/i.test(digest);
  });

  if (!accepted) {
    return Object.freeze({
      status: 'not_verified',
      verifier: 'gh attestation verify',
      repository,
      workflow,
      ref,
      expected_identity: expectedIdentity,
      reason: 'No verification row satisfied exact repository, workflow identity, certificate identity, transparency-log, and SHA-256 subject requirements.'
    });
  }

  const verification = accepted.verificationResult ?? accepted;
  return Object.freeze({
    status: 'verified',
    verifier: 'gh attestation verify',
    repository,
    workflow,
    ref,
    expected_identity: expectedIdentity,
    subject_digest: verification.subjectDigest ?? verification.digest,
    certificate_identity: verification.certificateIdentity,
    transparency_log_verified: true
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