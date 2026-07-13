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

test('accepts internally consistent successful deployment evidence', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_returned_url',
      deployment_url_returned: true,
      deployment_url: 'https://example.pages.dev'
    },
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
  assert.ok(result.errors.includes('accepted-without-deployment-url'));
});

test('permits explicit rejection after a successful deployment attempt', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_returned_url',
      deployment_url_returned: true,
      deployment_url: 'https://example.pages.dev'
    },
    acceptance: rejected
  });
  assert.equal(result.ok, true);
});

test('rejects contradictory acceptance decision fields', () => {
  const result = validateDeploymentEvidenceConsistency({
    decision: {
      status: 'deployment_returned_url',
      deployment_url_returned: true,
      deployment_url: 'https://example.pages.dev'
    },
    acceptance: { accepted: true, decision: 'reject', reasons: ['claim.invalid'] }
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('accepted-flag-decision-mismatch'));
  assert.ok(result.errors.includes('accepted-with-rejection-reasons'));
});
