import { createHash } from 'node:crypto';

const SHA256 = /^[0-9a-f]{64}$/;
const GIT_SHA = /^[0-9a-f]{40}$/;
const STATEMENT_TYPE = 'https://in-toto.io/Statement/v1';
const PROVENANCE_TYPE = 'https://slsa.dev/provenance/v1';

export function sha256Text(value) {
  if (typeof value !== 'string') throw new TypeError('text-required');
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function validateEvidenceAttestation(statement) {
  const errors = [];
  if (!statement || typeof statement !== 'object' || Array.isArray(statement)) return { valid: false, errors: ['statement-object-required'] };
  if (statement._type !== STATEMENT_TYPE) errors.push('_type');
  if (!Array.isArray(statement.subject) || statement.subject.length === 0) errors.push('subject');
  else for (const subject of statement.subject) {
    if (!subject || typeof subject.name !== 'string' || !subject.name) errors.push('subject.name');
    if (!subject?.digest || !SHA256.test(subject.digest.sha256 ?? '')) errors.push('subject.digest.sha256');
  }
  if (statement.predicateType !== PROVENANCE_TYPE) errors.push('predicateType');
  const p = statement.predicate;
  if (!p?.buildDefinition || !p?.runDetails) errors.push('predicate');
  if (p?.buildDefinition?.buildType !== 'https://mirrorcartographer.org/build-types/evidence-envelope/v1') errors.push('buildType');
  if (!GIT_SHA.test(p?.buildDefinition?.resolvedDependencies?.[0]?.digest?.gitCommit ?? '')) errors.push('resolvedDependencies.gitCommit');
  if (typeof p?.runDetails?.builder?.id !== 'string' || !p.runDetails.builder.id) errors.push('builder.id');
  if (typeof p?.runDetails?.metadata?.invocationId !== 'string' || !p.runDetails.metadata.invocationId) errors.push('invocationId');
  return { valid: errors.length === 0, errors };
}

export function createEvidenceAttestation({ artifactName, artifactText, sourceRepository, sourceCommit, builderId, invocationId, startedOn, finishedOn }) {
  const statement = {
    _type: STATEMENT_TYPE,
    subject: [{ name: artifactName, digest: { sha256: sha256Text(artifactText) } }],
    predicateType: PROVENANCE_TYPE,
    predicate: {
      buildDefinition: {
        buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1',
        externalParameters: { artifactName, sourceRepository },
        internalParameters: {},
        resolvedDependencies: [{ uri: `git+https://github.com/${sourceRepository}`, digest: { gitCommit: sourceCommit } }]
      },
      runDetails: {
        builder: { id: builderId, version: { contract: '1.0.0' } },
        metadata: { invocationId, startedOn, finishedOn },
        byproducts: []
      }
    }
  };
  const result = validateEvidenceAttestation(statement);
  if (!result.valid) throw new TypeError(`Invalid evidence attestation: ${result.errors.join(', ')}`);
  return Object.freeze(statement);
}

export const EVIDENCE_ATTESTATION_TYPES = Object.freeze({ statement: STATEMENT_TYPE, predicate: PROVENANCE_TYPE });
