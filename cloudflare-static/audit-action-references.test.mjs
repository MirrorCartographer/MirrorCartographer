import test from 'node:test';
import assert from 'node:assert/strict';
import { auditActionReferences } from './audit-action-references.mjs';

test('accepts exact 40-character commit pins', () => {
  const result = auditActionReferences([{ file: 'x.yml', text: 'steps:\n  - uses: actions/checkout@0123456789abcdef0123456789abcdef01234567\n' }]);
  assert.equal(result.status, 'all_remote_actions_immutable');
  assert.equal(result.counts.unpinned, 0);
});

test('reports mutable major tags as unresolved', () => {
  const result = auditActionReferences([{ file: 'x.yml', text: 'steps:\n  - uses: actions/checkout@v6\n' }]);
  assert.equal(result.status, 'immutable_pins_required');
  assert.equal(result.required_resolution[0].ref, 'actions/checkout@v6');
});

test('reports missing refs', () => {
  const result = auditActionReferences([{ file: 'x.yml', text: 'steps:\n  - uses: owner/action\n' }]);
  assert.equal(result.references[0].reason, 'missing_ref');
});

test('does not misclassify local actions as remote git refs', () => {
  const result = auditActionReferences([{ file: 'x.yml', text: 'steps:\n  - uses: ./local-action\n' }]);
  assert.equal(result.counts.remote, 0);
  assert.equal(result.status, 'all_remote_actions_immutable');
});

test('preserves file-level provenance across workflows', () => {
  const result = auditActionReferences([
    { file: 'a.yml', text: '- uses: actions/checkout@v6\n' },
    { file: 'b.yml', text: '- uses: actions/upload-artifact@v4\n' }
  ]);
  assert.deepEqual(result.required_resolution.map((x) => x.file), ['a.yml', 'b.yml']);
});
