import fs from 'node:fs';
import { createEvidenceAttestation, validateEvidenceAttestation } from '../tools/frontier-research/evidence-attestation.mjs';
import { createTrustedBuilderPolicy, evaluateTrustedBuilderPolicy } from '../tools/frontier-research/trusted-builder-policy.mjs';
import { createProvenanceExpectations, evaluateProvenanceExpectations } from '../tools/frontier-research/provenance-expectations.mjs';

const BUILD_TYPE = 'https://mirrorcartographer.org/build-types/evidence-envelope/v1';
const REPOSITORY = 'MirrorCartographer/MirrorCartographer';
const BUILDER_ID = 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main';
const ARTIFACT_NAME = 'cloudflare-deployment-proof.json';

const PROVENANCE_EXPECTATIONS = createProvenanceExpectations({
  buildType: BUILD_TYPE,
  externalParameters: {
    artifactName: ARTIFACT_NAME,
    sourceRepository: REPOSITORY
  }
});

export function evaluateDeploymentProvenance(statement) {
  return evaluateProvenanceExpectations(statement, PROVENANCE_EXPECTATIONS);
}

export function attestDeploymentProof({ proofText, sourceCommit, invocationId, startedOn, finishedOn }) {
  const attestation = createEvidenceAttestation({
    artifactName: ARTIFACT_NAME,
    artifactText: proofText,
    sourceRepository: REPOSITORY,
    sourceCommit,
    builderId: BUILDER_ID,
    invocationId,
    startedOn,
    finishedOn
  });

  const structural = validateEvidenceAttestation(attestation);
  const policy = createTrustedBuilderPolicy({
    allowedBuilderIds: [BUILDER_ID],
    allowedSourceRepositories: [REPOSITORY],
    allowedBuildTypes: [BUILD_TYPE],
    requireInvocationId: true
  });
  const trust = evaluateTrustedBuilderPolicy(attestation, policy);
  const provenance = evaluateDeploymentProvenance(attestation);

  if (!structural.valid) throw new Error(`attestation-structure-invalid:${structural.errors.join(',')}`);
  if (!trust.trusted) throw new Error(`attestation-policy-rejected:${trust.reasons.join(',')}`);
  if (!provenance.accepted) throw new Error(`attestation-provenance-rejected:${provenance.reasons.join(',')}`);

  return Object.freeze({ attestation, policyDecision: trust, provenanceDecision: provenance });
}

function main(argv = process.argv.slice(2)) {
  const [proofPath = 'cloudflare-deployment-proof.json', outputPath = 'cloudflare-deployment-proof.intoto.json'] = argv;
  const sourceCommit = process.env.GITHUB_SHA;
  const invocationId = process.env.GITHUB_RUN_ID;
  if (!sourceCommit) throw new Error('GITHUB_SHA-required');
  if (!invocationId) throw new Error('GITHUB_RUN_ID-required');

  const proofText = fs.readFileSync(proofPath, 'utf8');
  const finishedOn = new Date().toISOString();
  const startedOn = process.env.RUN_STARTED_AT || finishedOn;
  const result = attestDeploymentProof({ proofText, sourceCommit, invocationId, startedOn, finishedOn });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({
    artifact: proofPath,
    attestation: outputPath,
    subjectSha256: result.attestation.subject[0].digest.sha256,
    trustedBuilderPolicy: result.policyDecision.trusted,
    exactProvenanceExpectations: result.provenanceDecision.accepted
  }) + '\n');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
