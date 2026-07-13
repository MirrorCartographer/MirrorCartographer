#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function validatePromotionConsistency({ proofText, acceptance, promotionDecision }) {
  const errors = [];

  if (typeof proofText !== 'string' || proofText.length === 0) errors.push('proof.invalid');
  if (!isObject(acceptance)) errors.push('acceptance.invalid');
  if (!isObject(promotionDecision)) errors.push('promotion.invalid');
  if (errors.length) return { ok: false, errors };

  const subjectSha256 = sha256(proofText);
  const acceptanceDigest = acceptance.artifact_sha256 ?? null;
  const promotionDigest = promotionDecision.subject_sha256 ?? null;
  const promotionNestedDigest = promotionDecision.promotion?.subject_sha256 ?? null;

  if (acceptanceDigest !== subjectSha256) errors.push('acceptance.digest-mismatch');
  if (promotionDigest !== subjectSha256) errors.push('promotion.digest-mismatch');
  if (promotionNestedDigest !== subjectSha256) errors.push('promotion.nested-digest-mismatch');

  if (typeof acceptance.accepted !== 'boolean') errors.push('acceptance.accepted-invalid');
  if (typeof promotionDecision.promoted !== 'boolean') errors.push('promotion.promoted-invalid');

  if (promotionDecision.promoted === true) {
    if (acceptance.accepted !== true) errors.push('promoted-without-accepted-deployment');
    if (promotionDecision.decision !== 'promote-deployment-evidence') errors.push('promotion.flag-decision-mismatch');
    if (promotionDecision.acceptance_digest_matches_subject !== true) errors.push('promoted-without-acceptance-digest-match');
    if (promotionDecision.promotion?.promoted !== true) errors.push('promoted-without-nested-promotion');
  } else {
    if (promotionDecision.decision !== 'reject-deployment-evidence-promotion') errors.push('rejection.flag-decision-mismatch');
  }

  if (acceptance.accepted === false && promotionDecision.promoted === true) {
    errors.push('rejected-deployment-cannot-be-promoted');
  }

  return {
    ok: errors.length === 0,
    errors: [...new Set(errors)],
    subject_sha256: subjectSha256,
    claim_limit: 'Promotion consistency rejects contradictory or cross-subject evidence records; it does not prove deployment, hostname control, signature validity, scientific truth, diagnosis, or treatment efficacy.'
  };
}

function main() {
  const [proofPath='cloudflare-deployment-proof.json', acceptancePath='cloudflare-deployment-acceptance.json', promotionPath='cloudflare-evidence-promotion-decision.json', outputPath='cloudflare-promotion-consistency.json'] = process.argv.slice(2);
  const result = validatePromotionConsistency({
    proofText: fs.readFileSync(proofPath, 'utf8'),
    acceptance: JSON.parse(fs.readFileSync(acceptancePath, 'utf8')),
    promotionDecision: JSON.parse(fs.readFileSync(promotionPath, 'utf8'))
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
