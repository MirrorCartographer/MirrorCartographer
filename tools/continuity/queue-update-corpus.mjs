import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { evaluateQueueUpdates } from './queue-update-compatibility.mjs';

export async function discoverQueueUpdates(rootDir) {
  const names = (await readdir(rootDir)).filter((name) => name.endsWith('.json')).sort();
  const records = [];
  const parseFailures = [];
  for (const name of names) {
    const sourcePath = path.posix.join('operations/queue-updates', name);
    try {
      const update = JSON.parse(await readFile(path.join(rootDir, name), 'utf8'));
      records.push({ sourcePath, update });
    } catch (error) {
      parseFailures.push({
        source_path: sourcePath,
        classification: 'blocking_parse_failure',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return { records, parseFailures };
}

export async function buildQueueUpdateCorpusReport({
  rootDir,
  manifest = { exceptions: [] },
  generatedAt = new Date().toISOString(),
  sourceCommit = null
}) {
  const { records, parseFailures } = await discoverQueueUpdates(rootDir);
  const evaluated = evaluateQueueUpdates(records, manifest);
  const blocking = [...parseFailures, ...evaluated.blocking];
  return {
    schema_version: '1.0.0',
    generated_at: generatedAt,
    source_commit: sourceCommit,
    policy: evaluated.policy,
    corpus: {
      discovered_json_files: records.length + parseFailures.length,
      parsed_records: records.length,
      parse_failures: parseFailures.length
    },
    results: [...evaluated.results, ...parseFailures]
      .sort((a, b) => a.source_path.localeCompare(b.source_path)),
    blocking,
    compatible: evaluated.compatible,
    reconciliation_allowed: blocking.length === 0
  };
}
