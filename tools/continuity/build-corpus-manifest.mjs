import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function requireRecord(record, sourcePath) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error(`invalid record object: ${sourcePath}`);
  if (typeof record.id !== 'string' || !/^CM-[0-9]+$/.test(record.id)) throw new Error(`invalid record id: ${sourcePath}`);
  return record;
}

export async function buildCorpusManifest({ snapshotPath, standalonePaths = [], generatedAt = new Date().toISOString() }) {
  if (!snapshotPath) throw new Error('snapshotPath is required');
  const snapshotBytes = await readFile(snapshotPath);
  const snapshot = JSON.parse(snapshotBytes.toString('utf8'));
  if (!Array.isArray(snapshot.records)) throw new Error('snapshot.records must be an array');

  const entries = [];
  for (const record of snapshot.records) {
    requireRecord(record, snapshotPath);
    entries.push({
      id: record.id,
      source_class: 'snapshot_embedded',
      source_path: snapshotPath,
      source_sha256: sha256(snapshotBytes)
    });
  }

  for (const sourcePath of [...standalonePaths].sort()) {
    const bytes = await readFile(sourcePath);
    const record = requireRecord(JSON.parse(bytes.toString('utf8')), sourcePath);
    entries.push({
      id: record.id,
      source_class: 'standalone_record',
      source_path: sourcePath,
      source_sha256: sha256(bytes)
    });
  }

  entries.sort((a, b) => a.id.localeCompare(b.id) || a.source_path.localeCompare(b.source_path));
  const duplicateIds = [...new Set(entries.filter((entry, index) => entries.some((other, otherIndex) => otherIndex !== index && other.id === entry.id)).map((entry) => entry.id))].sort();

  return {
    schema_version: '1.0.0',
    generated_at: generatedAt,
    authoritative: false,
    completeness: 'bounded_to_explicit_inputs',
    snapshot: {
      path: snapshotPath,
      sha256: sha256(snapshotBytes),
      generated_at: snapshot.generated_at ?? null,
      embedded_record_count: snapshot.records.length
    },
    standalone_inputs: [...standalonePaths].sort(),
    record_count: entries.length,
    duplicate_ids: duplicateIds,
    records: entries,
    privacy_boundary: 'Manifest contains record identifiers, source paths, and source digests only; it does not copy record summaries or private source material.'
  };
}

async function main() {
  const [snapshotPath, ...standalonePaths] = process.argv.slice(2);
  const manifest = await buildCorpusManifest({ snapshotPath, standalonePaths });
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
