import fs from 'node:fs';
import crypto from 'node:crypto';
import { decideEvidencePromotion } from '../tools/frontier-research/evidence-promotion-gate.mjs';

function requireObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
  return value;
}

export function buildEvidencePromotionDecision({ proofText, verificationInput, acceptance }) {
  if (typeof proofText !== 'string' || proofText.length === 0) {
    throw new TypeError('proofText must be a non-empty string');
  }
  requireObject(verificationInput, 'verificationInput');
  requireObject(acceptance, 'acceptance');

  const subjectSha256 = crypto.createHash('sha256').update(proofText).digest('hex');
  const reportedDigest = acceptance.artifact_sha256 ?? null;
  const digestMatches = reportedDigest === subjectSha256;

  const decisions = {
    trusted_builder: {
      subject_sha256: subjectSha256,
      trusted: digestMatches
        && verificationInput.trustedBuilderPolicy?.builder === 'trusted'
        && verificationInput.trustedBuilderPolicy?.source === 'trusted'
        && verificationInput.trustedBuilderPolicy?.buildType === 'match'
        && verificationInput.trustedBuilderPolicy?.externalParameters === 'recognized',
      classification: 'trusted_builder_policy',
      reason: digestMatches ? 'policy_evaluated' : 'acceptance_digest_mismatch'
    },
    dsse_transparency: {
      subject_sha256: subjectSha256,
      accepted: digestMatches
        && verificationInput.signatureVerification?.status === 'verified'
        && verificationInput.signatureSubjectVerification?.status === 'match'
        && verificationInput.subjectVerification?.status === 'match',
      classification: 'dsse_transparency_verification',
      reason: digestMatches ? 'signature_and_subject_evaluated' : 'acceptance_digest_mismatch'
    },
    signing_time: {
      subject_sha256: subjectSha256,
      accepted: digestMatches && verificationInput.freshnessEvidence?.status === 'fresh',
      classification: 'trusted_signing_time',
      reason: digestMatches ? 'freshness_evaluated' : 'acceptance_digest_mismatch'
    },
    signer_identity: {
      subject_sha256: subjectSha256,
      accepted: digestMatches
        && verificationInput.signatureVerification?.status === 'verified'
        && verificationInput.signatureSubjectVerification?.status === 'match',
      classification: 'signer_identity_authorization',
      reason: digestMatches ? 'identity_evaluated' : 'acceptance_digest_mismatch'
    }
  };

  const promotion = decideEvidencePromotion({ subjectSha256, decisions });
  const accepted = acceptance.accepted === true && promotion.promoted === true;

  return {
    schema_version: '1.0.0',
    promoted: accepted,
    decision: accepted ? 'promote-deployment-evidence' : 'reject-deployment-evidence-promotion',
    subject_sha256: subjectSha256,
    acceptance_digest_matches_subject: digestMatches,
    acceptance_decision: acceptance.decision ?? null,
    promotion,
    claim_boundary: [
      'promotion requires deployment acceptance and all trust decisions for the same proof digest',
      'promotion authenticates bounded evidence but does not establish scientific or medical truth',
      'no diagnosis or treatment claim is evaluated or published by this gate'
    ],
    falsification_route: 'Alter the proof bytes, reject any trust predicate, or bind acceptance to another digest; promotion must fail closed.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const proofPath = process.argv[2] || 'cloudflare-deployment-proof.json';
  const verificationPath = process.argv[3] || 'cloudflare-evidence-verification-input.json';
  const acceptancePath = process.argv[4] || 'cloudflare-deployment-acceptance.json';
  const outputPath = process.argv[5] || 'cloudflare-evidence-promotion-decision.json';
  const result = buildEvidencePromotionDecision({
    proofText: fs.readFileSync(proofPath, 'utf8'),
    verificationInput: JSON.parse(fs.readFileSync(verificationPath, 'utf8')),
    acceptance: JSON.parse(fs.readFileSync(acceptancePath, 'utf8'))
  });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.promoted) process.exitCode = 1;
}
