import crypto from 'node:crypto';
import fs from 'node:fs';

const EXPECTED = Object.freeze({
  builderId: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  sourceRepository: 'MirrorCartographer/MirrorCartographer',
  buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1',
  artifactName: 'cloudflare-deployment-proof.json',
  team: 'cloudflare_research',
  queueItem: 'C-001'
});

function status(ok, success = 'verified', failure = 'not_verified') {
  return ok === true ? success : failure;
}

function traceparentFor(invocationId, digest) {
  const seed = crypto.createHash('sha256').update(`${invocationId || 'unknown'}:${digest}`).digest('hex');
  const traceId = /^0+$/.test(seed.slice(0, 32)) ? `1${'0'.repeat(31)}` : seed.slice(0, 32);
  const parentId = /^0+$/.test(seed.slice(32, 48)) ? `1${'0'.repeat(15)}` : seed.slice(32, 48);
  return `00-${traceId}-${parentId}-01`;
}

function normalizeDigest(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.toLowerCase().replace(/^sha256:/, '');
  return /^[a-f0-9]{64}$/.test(normalized) ? normalized : null;
}

export function buildEvidenceVerificationInput({ proofText, proof, attestationBundle, signatureVerification = null }) {
  if (typeof proofText !== 'string' || !proofText) throw new TypeError('proofText must be a non-empty string');
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) throw new TypeError('proof must be an object');
  if (!attestationBundle || typeof attestationBundle !== 'object' || Array.isArray(attestationBundle)) throw new TypeError('attestationBundle must be an object');
  const statement = attestationBundle.attestation;
  if (!statement || typeof statement !== 'object' || Array.isArray(statement)) throw new TypeError('attestationBundle.attestation must be an object');

  const digest = crypto.createHash('sha256').update(proofText).digest('hex');
  const declaredDigest = statement.subject?.[0]?.digest?.sha256;
  const definition = statement.predicate?.buildDefinition;
  const details = statement.predicate?.runDetails;
  const invocationId = details?.metadata?.invocationId ?? null;
  const verifierRows = Array.isArray(proof.verifier_output) ? proof.verifier_output : [];
  const claimVerified = proof.deployment_decision?.status === 'deployment_returned_url'
    && typeof proof.deployment_url === 'string' && proof.deployment_url.length > 0
    && verifierRows.some((row) => row?.ok === true);

  const reportedSignatureDigest = normalizeDigest(signatureVerification?.subject_digest);
  const signatureDigestMatches = reportedSignatureDigest === digest;
  const normalizedSignature = signatureVerification?.status === 'verified' && signatureDigestMatches
    ? { status: 'verified', verified: true, verifier: signatureVerification.verifier ?? 'gh attestation verify', repository: signatureVerification.repository ?? null, workflow: signatureVerification.workflow ?? null, subject_digest: signatureVerification.subject_digest, certificate_identity: signatureVerification.certificate_identity ?? null, transparency_log_verified: signatureVerification.transparency_log_verified === true }
    : { status: 'not_verified', verified: false, verifier: signatureVerification?.verifier ?? 'gh attestation verify', reason: signatureVerification?.status === 'verified' ? 'Verified signature report was not bound to the exact deployment proof SHA-256.' : signatureVerification?.reason ?? 'No accepted cryptographic verification result was supplied.', subject_digest: signatureVerification?.subject_digest ?? null };

  const subjectVerification = { status: status(declaredDigest === digest, 'match', 'mismatch'), computed_sha256: digest, declared_sha256: typeof declaredDigest === 'string' ? declaredDigest : null };
  const signatureSubjectVerification = { status: status(signatureDigestMatches, 'match', 'mismatch'), computed_sha256: digest, reported_sha256: reportedSignatureDigest };
  const trustedBuilderPolicy = {
    builder: status(details?.builder?.id === EXPECTED.builderId, 'trusted', 'untrusted'),
    source: status(definition?.externalParameters?.sourceRepository === EXPECTED.sourceRepository, 'trusted', 'untrusted'),
    buildType: status(definition?.buildType === EXPECTED.buildType, 'match', 'mismatch'),
    externalParameters: status(Boolean(invocationId), 'recognized', 'unrecognized')
  };
  const claimEvidence = {
    status: status(claimVerified, 'valid', 'invalid'),
    deployment_url: proof.deployment_url ?? null,
    verified_candidates: verifierRows.filter((row) => row?.ok === true).map((row) => row.resolvedUrl || row.candidate || null).filter(Boolean)
  };

  const envelope = {
    schema_version: '1.0.0', traceparent: traceparentFor(invocationId, digest), created_at: proof.generated_at ?? new Date(0).toISOString(),
    team: EXPECTED.team, queue_item: EXPECTED.queueItem,
    claim_state: claimVerified ? 'observed' : 'unresolved', evidence_state: claimVerified ? 'deployment-verified' : 'unverified',
    summary: claimVerified ? 'Cloudflare returned a deployment URL and the served identity verifier reported success.' : 'Cloudflare deployment evidence is incomplete or the served identity verifier did not report success.',
    sources: [{ repository: EXPECTED.sourceRepository, commit: proof.source_commit ?? null }],
    artifacts: [{ name: EXPECTED.artifactName, sha256: digest }], verification: verifierRows,
    falsification_routes: ['Recompute the proof SHA-256 and compare it with the attestation subject.', 'Re-run gh attestation verify against the exact proof bytes and repository.', 'Fetch the recorded deployment URL and rerun the served identity verifier.'],
    limits: ['Artifact and provenance acceptance does not prove scientific truth.', 'A deployment URL without successful served-identity verification is not deployment evidence.'], peer_triggers: []
  };

  const policy = { schema_version: '1.0.0', enabled: true, allowed_builder_ids: [EXPECTED.builderId], allowed_source_repositories: [EXPECTED.sourceRepository], allowed_build_types: [EXPECTED.buildType], require_invocation_id: true };

  return {
    schema_version: '2.1.0', artifactName: EXPECTED.artifactName, artifactText: proofText, envelope, attestation: statement, policy,
    signatureVerification: normalizedSignature,
    expected: { sourceRepository: EXPECTED.sourceRepository, sourceCommit: proof.source_commit ?? null, team: EXPECTED.team, queueItem: EXPECTED.queueItem },
    subjectVerification, signatureSubjectVerification, trustedBuilderPolicy, claimEvidence,
    diagnostics: { signatureVerification: normalizedSignature, subjectVerification, signatureSubjectVerification, trustedBuilderPolicy, claimEvidence },
    limits: ['Subject digest matching is not signature verification.', 'A cryptographic verification report is accepted only when its reported subject digest matches the exact proof bytes.', 'Trusted workflow identity is a policy check, not proof that the deployment claim is true.', 'A verified signature authenticates provenance identity and artifact binding, not scientific truth or deployment availability.']
  };
}

function main(argv = process.argv.slice(2)) {
  const [proofPath = 'cloudflare-deployment-proof.json', attestationPath = 'cloudflare-deployment-proof.intoto.json', signaturePath = 'cloudflare-deployment-proof.signature-verification.json', outputPath = 'cloudflare-evidence-verification-input.json'] = argv;
  const proofText = fs.readFileSync(proofPath, 'utf8');
  const proof = JSON.parse(proofText);
  const attestationBundle = JSON.parse(fs.readFileSync(attestationPath, 'utf8'));
  const signatureVerification = fs.existsSync(signaturePath) ? JSON.parse(fs.readFileSync(signaturePath, 'utf8')) : null;
  const result = buildEvidenceVerificationInput({ proofText, proof, attestationBundle, signatureVerification });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ output: outputPath, signature: result.signatureVerification.status, claim: result.claimEvidence.status }) + '\n');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
