import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDeploymentEvidenceConsistency } from './validate-deployment-evidence-consistency.mjs';

const accepted = {
  accepted: true,
  decision: 'accept',
  reasons: []
};

const rejected = {
  accepted: false,
  decision: 'reject',
  reasons: ['claim.invalid']
};

const successfulDecision = {
  status: 'deployment_returned_url',
  deployment_url_returned: true,
  deployment_url: 'https://example.pages.dev'
};

test('accepts internally consistent successful deployment evidence', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: successfulDecision,
    acceptance: accepted
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('rejects acceptance when deployment was skipped', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'skipped_external_configuration',
      deployment_url_returned: false,
      deployment_url: null
    },
    acceptance: accepted
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('accepted-without-successful-deployment-decision'));
  assert.ok(result.errors.includes('non-success-deployment-cannot-be-accepted'));
});

test('rejects acceptance without a returned URL', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_returned_url',
      deployment_url_returned: false,
      deployment_url: null
    },
    acceptance: accepted
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('accepted-without-returned-url'));
  assert.ok(result.errors.includes('accepted-without-valid-https-deployment-url'));
  assert.ok(result.errors.includes('success-status-without-returned-url-flag'));
});

test('permits explicit rejection after a successful deployment attempt', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: successfulDecision,
    acceptance: rejected
  });
  assert.equal(result.ok, true);
});

test('rejects contradictory acceptance decision fields', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: successfulDecision,
    acceptance: { accepted: true, decision: 'reject', reasons: ['claim.invalid'] }
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('accepted-flag-decision-mismatch'));
  assert.ok(result.errors.includes('accepted-with-rejection-reasons'));
});

test('rejects unknown deployment status', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'maybe_deployed',
      deployment_url_returned: false,
      deployment_url: null
    },
    acceptance: rejected
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('decision.status-unknown'));
});

test('rejects success status paired with an insecure URL', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_returned_url',
      deployment_url_returned: true,
      deployment_url: 'http://example.pages.dev'
    },
    acceptance: accepted
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('url-flag-true-without-valid-https-url'));
  assert.ok(result.errors.includes('success-status-without-valid-https-url'));
  assert.ok(result.errors.includes('accepted-without-valid-https-deployment-url'));
});

test('rejects non-success status that still carries a URL', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_attempt_failed',
      deployment_url_returned: false,
      deployment_url: 'https://stale.pages.dev'
    },
    acceptance: rejected
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('url-present-while-url-flag-false'));
  assert.ok(result.errors.includes('non-success-status-with-deployment-url'));
});

test('rejects rejection records without an explicit reason', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: successfulDecision,
    acceptance: { accepted: false, decision: 'reject', reasons: [] }
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('rejected-without-reasons'));
});

test('rejects URLs containing embedded credentials', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_returned_url',
      deployment_url_returned: true,
      deployment_url: 'https://user:secret@example.pages.dev'
    },
    acceptance: accepted
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('url-flag-true-without-valid-https-url'));
});
