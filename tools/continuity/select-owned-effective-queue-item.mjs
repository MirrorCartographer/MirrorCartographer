import { readFileSync } from 'node:fs';
import { verifyEffectiveQueueArtifact } from './verify-effective-queue-artifact.mjs';

const TERMINAL_STATUSES = new Set(['completed', 'superseded', 'cancelled']);
const ACTIONABLE_STATUSES = new Set(['active', 'queued']);

function normalizedDependencies(item) {
  return Array.isArray(item.dependencies) ? item.dependencies : [];
}

export function selectOwnedActionableItem({ artifact, owner } = {}) {
  const errors = [];
  if (!owner || typeof owner !== 'string') {
    return { selected: false, item: null, errors: [{ code: 'EQS-001', message: 'owner must be a non-empty string' }] };
  }
  if (!artifact || !Array.isArray(artifact.effective_items)) {
    return { selected: false, item: null, errors: [{ code: 'EQS-002', message: 'artifact effective_items must be an array' }] };
  }

  const byId = new Map(artifact.effective_items.map((item) => [item.id, item]));
  const owned = artifact.effective_items
    .filter((item) => item.owner === owner)
    .filter((item) => ACTIONABLE_STATUSES.has(item.status))
    .sort((a, b) => Number(a.priority ?? Number.MAX_SAFE_INTEGER) - Number(b.priority ?? Number.MAX_SAFE_INTEGER) || String(a.id).localeCompare(String(b.id)));

  for (const item of owned) {
    const unresolved = [];
    for (const dependencyId of normalizedDependencies(item)) {
      const dependency = byId.get(dependencyId);
      if (!dependency) {
        unresolved.push({ id: dependencyId, reason: 'missing' });
      } else if (!TERMINAL_STATUSES.has(dependency.status)) {
        unresolved.push({ id: dependencyId, reason: `status:${dependency.status}` });
      }
    }
    if (unresolved.length === 0) {
      return {
        schema_version: '1.0.0',
        artifact_type: 'owned_effective_queue_selection',
        selected: true,
        owner,
        item,
        errors: []
      };
    }
    errors.push({ code: 'EQS-003', item_id: item.id, message: 'item dependencies are unresolved', dependencies: unresolved });
  }

  return {
    schema_version: '1.0.0',
    artifact_type: 'owned_effective_queue_selection',
    selected: false,
    owner,
    item: null,
    errors: errors.length > 0 ? errors : [{ code: 'EQS-004', message: 'no actionable item is owned by the requesting team' }]
  };
}

export function verifyAndSelectOwnedItem({ cwd = '.', artifact, owner, expectedCommit = 'HEAD' } = {}) {
  const verification = verifyEffectiveQueueArtifact({ cwd, artifact, expectedCommit });
  if (!verification.accepted) {
    return {
      schema_version: '1.0.0',
      artifact_type: 'verified_owned_effective_queue_selection',
      accepted: false,
      selected: false,
      owner: owner ?? null,
      item: null,
      verification,
      errors: [{ code: 'EQS-005', message: 'effective queue artifact failed consumer verification' }]
    };
  }

  const selection = selectOwnedActionableItem({ artifact, owner });
  return {
    schema_version: '1.0.0',
    artifact_type: 'verified_owned_effective_queue_selection',
    accepted: selection.selected,
    selected: selection.selected,
    owner: owner ?? null,
    item: selection.item,
    verification,
    errors: selection.errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const artifactPath = process.argv[2] ?? 'operations/generated/EFFECTIVE_QUEUE.json';
  const owner = process.argv[3];
  const cwd = process.argv[4] ?? '.';
  const expectedCommit = process.argv[5] ?? 'HEAD';
  let result;
  try {
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
    result = verifyAndSelectOwnedItem({ cwd, artifact, owner, expectedCommit });
  } catch (error) {
    result = {
      schema_version: '1.0.0',
      artifact_type: 'verified_owned_effective_queue_selection',
      accepted: false,
      selected: false,
      owner: owner ?? null,
      item: null,
      errors: [{ code: 'EQS-006', message: `startup selection failed: ${error.message}` }]
    };
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.accepted) process.exitCode = 1;
}
