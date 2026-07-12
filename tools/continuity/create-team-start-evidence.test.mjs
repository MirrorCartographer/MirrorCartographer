import assert from 'node:assert/strict';
import test from 'node:test';
import { buildTeamStartEvidence, digestSelection } from './create-team-start-evidence.mjs';

const generatedAt = '2026-07-12T02:31:00-04:00';
const acceptedSelection = {
  accepted: true,
  selected: true,
  owner: 'continuity_mining',
  item: {
    id: 'M-015',
    owner: 'continuity_mining',
    priority: 0,
    status: 'active',
    dependencies: ['M-014'],
    action: 'Bind verified startup selection to evidence.'
  },
  verification: { commit: 'abc123', artifact_source_commit: 'abc123', accepted: true, errors: [] },
  errors: []
};

test('accepts exactly one verified item owned by the registered team', () => {
  const result = buildTeamStartEvidence({
    teamName: 'Continuity Mining Team',
    selection: acceptedSelection,
    generatedAt
  });
  assert.equal(result.accepted, true);
  assert.equal(result.owner, 'continuity_mining');
  assert.equal(result.source_commit, 'abc123');
  assert.equal(result.selected_item.id, 'M-015');
  assert.match(result.selection_digest_sha256, /^[a-f0-9]{64}$/);
});

test('rejects an unregistered team name', () => {
  const result = buildTeamStartEvidence({ teamName: 'Continuity Team', selection: acceptedSelection, generatedAt });
  assert.equal(result.accepted, false);
  assert.equal(result.errors[0].code, 'TSE-001');
});

test('rejects a verified selection owned by another team', () => {
  const result = buildTeamStartEvidence({
    teamName: 'Frontier Research Team',
    selection: acceptedSelection,
    generatedAt
  });
  assert.equal(result.accepted, false);
  assert.equal(result.errors[0].code, 'TSE-002');
});

test('rejects a selector refusal or empty item', () => {
  const result = buildTeamStartEvidence({
    teamName: 'Continuity Mining Team',
    selection: { accepted: false, selected: false, owner: 'continuity_mining', item: null },
    generatedAt
  });
  assert.equal(result.accepted, false);
  assert.equal(result.selected_item, null);
});

test('rejects an accepted-looking selection without an immutable commit', () => {
  const selection = structuredClone(acceptedSelection);
  selection.verification = { accepted: true, errors: [] };
  const result = buildTeamStartEvidence({ teamName: 'Continuity Mining Team', selection, generatedAt });
  assert.equal(result.accepted, false);
  assert.equal(result.errors[0].code, 'TSE-004');
});

test('selection digest is stable across object key ordering', () => {
  const reordered = {
    item: {
      action: 'Bind verified startup selection to evidence.',
      dependencies: ['M-014'],
      status: 'active',
      priority: 0,
      owner: 'continuity_mining',
      id: 'M-015'
    },
    owner: 'continuity_mining',
    verification: { accepted: true, errors: [], artifact_source_commit: 'abc123', commit: 'abc123' },
    selected: true,
    accepted: true
  };
  assert.equal(digestSelection(acceptedSelection), digestSelection(reordered));
});
