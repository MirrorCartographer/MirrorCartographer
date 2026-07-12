import test from 'node:test';
import assert from 'node:assert/strict';
import { applyActionPinPlan } from './apply-action-pin-plan.mjs';

const plan = {
  status: 'approved_pin_plan',
  entries: [
    {
      ref: 'actions/checkout@v6',
      action: 'actions/checkout',
      resolved_sha: '8e8c483db84b4bee98b60c0593521ed34d9990e8',
      upstream_tag: 'v6.0.1'
    },
    {
      ref: 'actions/upload-artifact@v4',
      action: 'actions/upload-artifact',
      resolved_sha: 'ea165f8d65b6e75b540449e92b4886f43607fa02',
      upstream_tag: 'v4.6.2'
    }
  ]
};

test('applies every reviewed pin and leaves no mutable uses reference', () => {
  const input = `steps:\n  - uses: actions/checkout@v6\n  - uses: actions/upload-artifact@v4\n`;
  const result = applyActionPinPlan(input, plan);
  assert.equal(result.status, 'workflow_pins_applied');
  assert.match(result.workflow, /actions\/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8 # v6\.0\.1/);
  assert.match(result.workflow, /actions\/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4\.6\.2/);
  assert.deepEqual(result.remaining_mutable, []);
});

test('reports reviewed entries absent from a workflow without inventing replacements', () => {
  const result = applyActionPinPlan('steps:\n  - run: echo ok\n', plan);
  assert.equal(result.status, 'workflow_pins_applied');
  assert.deepEqual(result.findings.map((item) => item.occurrences), [0, 0]);
});

test('fails closed for an unapproved plan', () => {
  assert.throws(() => applyActionPinPlan('uses: actions/checkout@v6', { ...plan, status: 'draft' }), /approved non-empty pin plan required/);
});

test('rejects malformed immutable targets', () => {
  const bad = structuredClone(plan);
  bad.entries[0].resolved_sha = 'abc123';
  assert.throws(() => applyActionPinPlan('uses: actions/checkout@v6', bad), /invalid pin entry/);
});

test('detects a mutable action not covered by the reviewed plan', () => {
  const input = `steps:\n  - uses: actions/checkout@v6\n  - uses: owner/unknown@main\n`;
  const result = applyActionPinPlan(input, plan);
  assert.equal(result.status, 'mutable_references_remain');
  assert.deepEqual(result.remaining_mutable, ['uses: owner/unknown@main']);
});
