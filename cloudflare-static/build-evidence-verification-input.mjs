import crypto from 'node:crypto';
import fs from 'node:fs';

const EXPECTED = Object.freeze({
  builderId: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  sourceRepository: 'MirrorCartographer/MirrorCartographer',
  buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1'
});

function status(ok, success = 'verified', failure = 'not_verified') {
  return ok === true ? success : failure;
}

export function buildEvidenceVerificationInput({ proofText, proof, attestationBundle }) {
  if (typeof proofText !== 'string' || !proofText) throw new TypeError('proofText must be a non-empty string');
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) throw new TypeError('proof must be an object');
  if (!attestationBundle || typeof attestationBundle !== 'object' || Array.isArray(attestationBundle)) {
    throw new TypeError('attestationBundle must be an object');
  }

  const statement = attestationBundle.attestation;
  if (!statement || typeof statement !== 'object' || Array.isArray(statement)) {
    throw new TypeError('attestationBundle.attestation must be an object');
  }

  const digest = crypto.createHash('sha256').update(proofText).digest('hex');
  const declaredDigest = statement.subject?.[0]?.digest?.sha256;
  const definition = statement.predicate?.buildDefinition;
  const details = statement.predicate?.runDetails;
  const verifierRows = Array.isArray(proof.verifier_output) ? proof.verifier_output : [];
  const claimVerified = proof.deployment_decision?.status === 'deployment_returned_url'
    && typeof proof.deployment_url === 'string'
    && proof.deployment_url.length > 0
    && verifierRows.some((row) => row?.ok === true);

  return {
    schema_version: '1.0.0',
    signatureVerification: {
      status: 'not_verified',
      reason: 'No cryptographic signature verifier is executed by this workflow yet.'
    },
    subjectVerification: {
      status: status(declaredDigest === digest, 'match', 'mismatch'),
      computed_sha256: digest,
      declared_sha256: typeof declaredDigest === 'string' ? declaredDigest : null
    },
    trustedBuilderPolicy: {
      builder: status(details?.builder?.id === EXPECTED.builderId, 'trusted', 'untrusted'),
      source: status(definition?.externalParameters?.sourceRepository === EXPECTED.sourceRepository, 'trusted', 'untrusted'),
      buildType: status(definition?.buildType === EXPECTED.buildType, 'match', 'mismatch'),
      externalParameters: status(Boolean(details?.metadata?.invocationId), 'recognized', 'unrecognized')
    },
    claimEvidence: {
      status: status(claimVerified, 'valid', 'invalid'),
      deployment_url: proof.deployment_url ?? null,
      verified_candidates: verifierRows.filter((row) => row?.ok === true).map((row) => row.resolvedUrl || row.candidate || null).filter(Boolean)
    },
    limits: [
      'Subject digest matching is not signature verification.',
      'Trusted workflow identity is a policy check, not proof that the deployment claim is true.',
      'Overall acceptance must remain false until signatureVerification.status is verified.'
    ]
  };
}

function main(argv = process.argv.slice(2)) {
  const [proofPath = 'cloudflare-deployment-proof.json', attestationPath = 'cloudflare-deployment-proof.intoto.json', outputPath = 'cloudflare-evidence-verification-input.json'] = argv;
  const proofText = fs.readFileSync(proofPath, 'utf8');
  const proof = JSON.parse(proofText);
  const attestationBundle = JSON.parse(fs.readFileSync(attestationPath, 'utf8'));
  const result = buildEvidenceVerificationInput({ proofText, proof, attestationBundle });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ output: outputPath, signature: result.signatureVerification.status, claim: result.claimEvidence.status }) + '\n');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
