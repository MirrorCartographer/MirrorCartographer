#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error(`${file}: invalid JSON: ${error.message}`); }
}

function collectIds({ indexFile, recordDirs = [] }) {
  const occupied = new Map();
  const index = readJson(indexFile);
  for (const [position, record] of (index.records ?? []).entries()) {
    if (!record?.id) continue;
    const locator = `${indexFile}#records[${position}]`;
    if (!occupied.has(record.id)) occupied.set(record.id, []);
    occupied.get(record.id).push(locator);
  }

  const roots = [...new Set(recordDirs.filter(Boolean).map(dir => path.resolve(dir)))];
  for (const dir of roots) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort()) {
      const file = path.join(dir, name);
      const raw = readJson(file);
      const record = raw.id ? raw : raw.record;
      if (!record?.id) continue;
      if (!occupied.has(record.id)) occupied.set(record.id, []);
      occupied.get(record.id).push(file);
    }
  }
  return { occupied, roots };
}

export function allocateContinuityId({ indexFile, recordDirs = [], requestedId = null }) {
  const { occupied, roots } = collectIds({ indexFile, recordDirs });
  const duplicateIds = [...occupied.entries()]
    .filter(([, locators]) => locators.length > 1)
    .map(([id, locators]) => ({ id, locators }));

  if (duplicateIds.length) {
    return {
      ok: false,
      reason: 'existing_namespace_collision',
      duplicate_ids: duplicateIds,
      scanned_roots: roots,
      occupied_count: occupied.size
    };
  }

  if (requestedId !== null) {
    if (!/^CM-\d{4}$/.test(requestedId)) {
      return { ok: false, reason: 'invalid_requested_id', requested_id: requestedId, scanned_roots: roots };
    }
    if (occupied.has(requestedId)) {
      return {
        ok: false,
        reason: 'requested_id_occupied',
        requested_id: requestedId,
        occupied_at: occupied.get(requestedId),
        scanned_roots: roots
      };
    }
    return { ok: true, allocated_id: requestedId, allocation: 'requested', scanned_roots: roots };
  }

  const numbers = [...occupied.keys()]
    .filter(id => /^CM-\d{4}$/.test(id))
    .map(id => Number(id.slice(3)));
  const next = Math.max(0, ...numbers) + 1;
  if (next > 9999) return { ok: false, reason: 'namespace_exhausted', scanned_roots: roots };

  return {
    ok: true,
    allocated_id: `CM-${String(next).padStart(4, '0')}`,
    allocation: 'next_monotonic',
    occupied_count: occupied.size,
    scanned_roots: roots
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? process.cwd();
  const requestedId = process.argv[3] ?? null;
  const result = allocateContinuityId({
    indexFile: path.join(root, 'operations/continuity/continuity-index.json'),
    recordDirs: [
      path.join(root, 'operations/continuity/records'),
      path.join(root, 'operations/continuity/memory')
    ],
    requestedId
  });
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
