import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { verifyAndSelectOwnedItem } from './select-owned-effective-queue-item.mjs';

export const TEAM_OWNER_IDS = Object.freeze({
  'Vercel Studio Team': 'vercel_studio',
  'Cloudflare Research Team': 'cloudflare_research',
  'Independent Creative Web Team': 'independent_creative_web',
  'Continuity Mining Team': 'continuity_mining',
  'Frontier Research Team': 'frontier_research'
});

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function digestSelection(selection) {
  const canonical = JSON.stringify(stable({
    owner: selection.owner,
    item: selection.item,
    source_commit: selection.verification?.observed?.source_commit ?? selection.verification?.source_commit ?? null
  }));
  return createHash('sha256').update(canonical).digest('hex');
}

export function buildTeamStartEvidence({ teamName, selection, generatedAt = new Date().toISOString() } = {}) {
  const owner = TEAM_OWNER_IDS[teamName];
  if (!owner) {
    return {
      schema_version: '1.0.0',
      artifact_type: 'team_start_evidence',
      accepted: false,
      team_name: teamName ?? null,
      owner: null,
      generated_at: generatedAt,
      selection_digest_sha256: null,
      selected_item: null,
      errors: [{ code: 'TSE-001', message: 'team name is not registered in the startup owner map' }]
    };
  }

  if (!selection || selection.accepted !== true || selection.selected !== true || selection.owner !== owner || !selection.item) {
    return {
      schema_version: '1.0.0',
      artifact_type: 'team_start_evidence',
      accepted: false,
      team_name: teamName,
      owner,
      generated_at: generatedAt,
      selection_digest_sha256: null,
      selected_item: null,
      errors: [{ code: 'TSE-002', message: 'implementation is refused without one verified item owned by the registered team' }]
    };
  }

  return {
    schema_version: '1.0.0',
    artifact_type: 'team_start_evidence',
    accepted: true,
    team_name: teamName,
    owner,
    generated_at: generatedAt,
    source_commit: selection.verification?.observed?.source_commit ?? selection.verification?.source_commit ?? null,
    selection_digest_sha256: digestSelection(selection),
    selected_item: {
      id: selection.item.id,
      owner: selection.item.owner,
      priority: selection.item.priority,
      status: selection.item.status,
      dependencies: Array.isArray(selection.item.dependencies) ? selection.item.dependencies : []
    },
    errors: []
  };
}

export function createTeamStartEvidence({ cwd = '.', artifact, teamName, expectedCommit = 'HEAD', generatedAt } = {}) {
  const owner = TEAM_OWNER_IDS[teamName];
  if (!owner) return buildTeamStartEvidence({ teamName, selection: null, generatedAt });
  const selection = verifyAndSelectOwnedItem({ cwd, artifact, owner, expectedCommit });
  return buildTeamStartEvidence({ teamName, selection, generatedAt });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const artifactPath = process.argv[2] ?? 'operations/generated/EFFECTIVE_QUEUE.json';
  const teamName = process.argv[3];
  const cwd = process.argv[4] ?? '.';
  const expectedCommit = process.argv[5] ?? 'HEAD';
  let result;
  try {
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
    result = createTeamStartEvidence({ cwd, artifact, teamName, expectedCommit });
  } catch (error) {
    result = {
      schema_version: '1.0.0',
      artifact_type: 'team_start_evidence',
      accepted: false,
      team_name: teamName ?? null,
      owner: TEAM_OWNER_IDS[teamName] ?? null,
      generated_at: new Date().toISOString(),
      selection_digest_sha256: null,
      selected_item: null,
      errors: [{ code: 'TSE-003', message: `team-start evidence generation failed: ${error.message}` }]
    };
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.accepted) process.exitCode = 1;
}
