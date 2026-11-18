import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const CM_ID = /^CM-\d{4}$/;
const ROOT_INDEX = 'operations/continuity/continuity-index.json';
const SCAN_DIRS = ['operations/continuity/records', 'operations/continuity/memory'];

function filesToInspect(root) {
  const list = [ROOT_INDEX];
  for (const dir of SCAN_DIRS) {
    const absolute = path.join(root, dir);
    if (!fs.existsSync(absolute)) continue;
    list.push(...fs.readdirSync(absolute).filter(name => name.endsWith('.json')).sort().map(name => path.posix.join(dir, name)));
  }
  return list.filter(file => fs.existsSync(path.join(root, file)));
}

function familyOf(source, isIndex) {
  if (isIndex && Array.isArray(source?.records)) return 'claim_index';
  if (Array.isArray(source?.records)) return 'record_bundle';
  if (Array.isArray(source?.claims)) return 'claim_bundle';
  if (source?.record && typeof source.record === 'object') return 'wrapped_record';
  if (typeof source?.id === 'string' && 'claim_state' in source) return 'atomic_claim';
  if (Array.isArray(source?.claim_states)) return 'compound_memory';
  if (typeof source?.record_id === 'string' || source?.memory) return 'structured_memory';
  return 'unclassified_source';
}

function subjects(source, family) {
  if (family === 'claim_index' || family === 'record_bundle') return source.records;
  if (family === 'claim_bundle') return source.claims;
  if (family === 'wrapped_record') return [source.record];
  return [source];
}

// A read-only provenance inventory, NOT a promotion of legacy files into canonical authority.
// Reports carry paths, IDs and hashes, never source narratives, private fields or raw relation targets.
export function inventoryContinuitySources(root) {
  const sources = [];
  const bad_relations = [];
  const idsBySource = new Map();
  for (const relative_path of filesToInspect(root)) {
    const bytes = fs.readFileSync(path.join(root, relative_path));
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const source = JSON.parse(bytes.toString('utf8'));
    const family = familyOf(source, relative_path === ROOT_INDEX);
    const records = subjects(source, family);
    const ids = [...new Set(records.map(record => record?.id ?? record?.record_id).filter(x => typeof x === 'string'))].sort();
    sources.push({ relative_path, sha256, family, ids, schema_version: source.schema_version ?? null });
    for (const id of ids) {
      if (!idsBySource.has(id)) idsBySource.set(id, []);
      idsBySource.get(id).push(relative_path);
    }
    for (const record of records) {
      for (const relation of ['contradicts', 'supersedes']) {
        if (record?.[relation] === undefined) continue;
        if (!Array.isArray(record[relation])) {
          bad_relations.push({ relative_path, id: record?.id ?? null, relation, defect: 'not_an_array' });
          continue;
        }
        for (const target of record[relation]) {
          if (typeof target !== 'string' || !CM_ID.test(target)) {
            bad_relations.push({ relative_path, id: record?.id ?? null, relation, defect: 'not_canonical_id' });
          }
        }
      }
    }
  }
  const collisions = [...idsBySource.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([id, paths]) => ({ id, paths }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const families = Object.fromEntries([...new Set(sources.map(source => source.family))].sort()
    .map(family => [family, sources.filter(source => source.family === family).length]));
  return {
    schema_version: 1,
    scope: 'public core continuity index and two public artifact directories only',
    source_count: sources.length,
    source_families: families,
    collisions,
    malformed_relation_count: bad_relations.length,
    malformed_relations: bad_relations,
    unclassified_paths: sources.filter(source => source.family === 'unclassified_source').map(source => source.relative_path),
    sources,
    warning: 'Collisions and legacy relations are reported, not silently resolved. The inventory does not verify truth or live deployment.'
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] ?? '.');
  process.stdout.write(JSON.stringify(inventoryContinuitySources(root), null, 2) + '\n');
}
