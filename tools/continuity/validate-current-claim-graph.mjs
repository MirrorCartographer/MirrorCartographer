import { readFile } from 'node:fs/promises';
import { validateClaimGraph } from './claim-graph.mjs';

const indexPath = process.argv[2] ?? 'operations/continuity/continuity-index.json';

try {
  const raw = await readFile(indexPath, 'utf8');
  const index = JSON.parse(raw);
  const result = validateClaimGraph(index);

  const report = {
    validator: 'continuity-claim-graph',
    index_path: indexPath,
    valid: result.valid,
    error_count: result.errors.length,
    errors: result.errors
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!result.valid) process.exitCode = 1;
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    validator: 'continuity-claim-graph',
    index_path: indexPath,
    valid: false,
    error_count: 1,
    errors: [{ code: 'CG-CLI-001', message: error instanceof Error ? error.message : String(error) }]
  }, null, 2)}\n`);
  process.exitCode = 1;
}
