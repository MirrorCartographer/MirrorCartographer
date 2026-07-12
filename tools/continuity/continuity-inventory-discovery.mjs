import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const QUEUE_PATTERN = /^M-\d+.*\.json$/;

export async function discoverContinuityQueueEntries(rootDir, relativeDir = 'operations/queue-updates') {
  const directory = path.resolve(rootDir, relativeDir);
  const names = await readdir(directory, { withFileTypes: true });
  const files = names
    .filter((entry) => entry.isFile() && QUEUE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'en'));

  return Promise.all(files.map(async (name) => ({
    path: path.posix.join(relativeDir.replaceAll('\\', '/'), name),
    content: await readFile(path.join(directory, name), 'utf8'),
  })));
}

export async function buildRepositoryContinuityInventory(rootDir, composeReport, generatedAt = null) {
  if (typeof composeReport !== 'function') throw new TypeError('composeReport must be a function');
  const entries = await discoverContinuityQueueEntries(rootDir);
  const report = composeReport(entries, generatedAt);
  return {
    ...report,
    discovery: {
      root_scope: 'operations/queue-updates',
      filename_pattern: 'M-*.json',
      discovered_paths: entries.map((entry) => entry.path),
      discovered_count: entries.length,
      deterministic_order: true,
      history_modified: false,
    },
  };
}
