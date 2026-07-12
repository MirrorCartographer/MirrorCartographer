import assert from 'node:assert/strict';
import { classifyQueueUpdate, evaluateQueueUpdates } from './queue-update-compatibility.mjs';

const valid = {
  item_id: 'M-006', owner: 'continuity_mining', status: 'completed',
  updated_at: '2026-07-12T01:15:00-04:00',
  claims: { observed: ['artifact committed'], unresolved: [] }
};

assert.equal(classifyQueueUpdate(valid, 'valid.json').classification, 'conformant');

const malformed = { id: 'OLD-1', status: 'completed' };
assert.equal(classifyQueueUpdate(malformed, 'old.json').classification, 'blocking_incompatible');

const manifest = {
  exceptions: [{
    source_path: 'old.json',
    allowed_defects: ['missing_or_invalid_timestamp','missing_owner'],
    rationale: 'Legacy event predates the queue-event schema; preserved for audit only.',
    reviewed_by: 'continuity_mining',
    replacement_path: 'operations/queue-updates/OLD-1-normalized.json',
    expires_at: '2099-01-01T00:00:00Z'
  }]
};
assert.equal(classifyQueueUpdate(malformed, 'old.json', manifest).classification, 'compatible_via_explicit_exception');

const incompleteManifest = {
  exceptions: [{ source_path: 'old.json', allowed_defects: ['missing_owner'] }]
};
assert.equal(classifyQueueUpdate(malformed, 'old.json', incompleteManifest).classification, 'blocking_invalid_exception');

const report = evaluateQueueUpdates([
  { sourcePath: 'valid.json', update: valid },
  { sourcePath: 'old.json', update: malformed }
], manifest);
assert.equal(report.blocking.length, 0);
assert.equal(report.compatible.length, 2);
assert.equal(report.results[1].defects.includes('missing_owner'), true);

console.log('queue-update compatibility tests passed');
