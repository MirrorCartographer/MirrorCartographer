import { createHash } from 'node:crypto';

const SHA40 = /^[0-9a-f]{40}$/;
const SAFE_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._\-/]+$/;

function digest(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function fail(code, detail) {
  return { verified: false, code, detail };
}

export function verifyQueueUpdateReferences(update, inventory) {
  if (!update || typeof update !== 'object' || Array.isArray(update)) return fail('invalid_update', 'update must be an object');
  if (!inventory || typeof inventory !== 'object' || Array.isArray(inventory)) return fail('invalid_inventory', 'inventory must be an object');
  if (update.canonical_queue_update_policy !== 'Append-only team-owned update; operations/ACTIVE_QUEUE.json was not overwritten.') {
    return fail('non_append_only_policy', 'queue update must declare the canonical append-only policy');
  }
  if (!Array.isArray(update.outputs) || update.outputs.length === 0) return fail('missing_outputs', 'outputs must be a non-empty array');

  const commits = new Set((inventory.commits ?? []).map(String));
  const paths = new Map((inventory.paths ?? []).map((entry) => [entry.path, entry]));
  const seen = new Set();
  const verifiedOutputs = [];

  for (const output of update.outputs) {
    if (!output || typeof output !== 'object') return fail('invalid_output', 'each output must be an object');
    const { path, commit } = output;
    if (typeof path !== 'string' || !SAFE_PATH.test(path)) return fail('unsafe_path', String(path));
    if (!SHA40.test(String(commit))) return fail('invalid_commit_sha', String(commit));
    const key = `${path}@${commit}`;
    if (seen.has(key)) return fail('duplicate_output', key);
    seen.add(key);
    if (!commits.has(commit)) return fail('missing_commit', commit);
    const retained = paths.get(path);
    if (!retained) return fail('missing_path', path);
    if (retained.commit !== commit) return fail('path_commit_mismatch', `${path}: expected ${commit}, found ${retained.commit}`);
    if (retained.kind && !['blob', 'file'].includes(retained.kind)) return fail('invalid_path_kind', `${path}: ${retained.kind}`);
    verifiedOutputs.push({ path, commit });
  }

  return {
    verified: true,
    code: 'references_verified',
    claim_ceiling: 'repository-reference-existence-and-binding-only',
    update_digest_sha256: digest(update),
    inventory_digest_sha256: digest(inventory),
    verified_outputs: verifiedOutputs,
    limits: [
      'Does not prove output semantics, runtime behavior, deployment, peer execution, or human outcome.',
      'Inventory trust is external; callers must construct it from an authenticated immutable repository view.'
    ]
  };
}
