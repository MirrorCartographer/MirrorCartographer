import fs from 'node:fs';
import path from 'node:path';
import { reconcileEffectiveQueue } from './effective-queue-reconciler.mjs';

function listJsonFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...listJsonFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(fullPath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

export function generateEffectiveQueue({ canonicalPath, updatesDir, outputPath }) {
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  const updatePaths = listJsonFiles(updatesDir);
  if (updatePaths.length === 0) throw new Error(`No queue update files found in ${updatesDir}`);

  const updates = updatePaths.map((sourcePath) => ({
    sourcePath: path.relative(process.cwd(), sourcePath),
    update: JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
  }));

  const result = reconcileEffectiveQueue(canonical, updates);
  const generated = {
    ...result,
    generated_at: new Date().toISOString(),
    canonical_source: path.relative(process.cwd(), canonicalPath),
    update_file_count: updatePaths.length
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(generated, null, 2)}\n`);

  if (generated.conflicts.length > 0) {
    const details = generated.conflicts.map((conflict) => `${conflict.item_id}@${conflict.timestamp}`).join(', ');
    throw new Error(`Effective queue contains unresolved conflicts: ${details}`);
  }

  return generated;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [canonicalPath = 'operations/ACTIVE_QUEUE.json', updatesDir = 'operations/queue-updates', outputPath = 'operations/generated/EFFECTIVE_QUEUE.json'] = process.argv.slice(2);
  try {
    const generated = generateEffectiveQueue({ canonicalPath, updatesDir, outputPath });
    console.log(`Generated ${outputPath} from ${generated.update_file_count} queue updates with no unresolved conflicts.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
