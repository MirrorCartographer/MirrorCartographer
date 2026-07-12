import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const REQUIRED_WIRING = Object.freeze([
  {
    id: 'finalizer-test',
    needle: 'node --test cloudflare-static/finalize-deployment-evidence.test.mjs'
  },
  {
    id: 'finalizer-step',
    needle: 'name: Finalize and verify exact deployment evidence manifest'
  },
  {
    id: 'manifest-upload',
    needle: 'cloudflare-deployment-evidence-manifest.json'
  },
  {
    id: 'manifest-summary',
    needle: 'Atomic evidence manifest:'
  }
]);

export function verifyFinalizerWorkflowWiring(source) {
  if (typeof source !== 'string' || source.length === 0) {
    throw new Error('workflow-source-required');
  }

  const checks = REQUIRED_WIRING.map(({ id, needle }) => ({
    id,
    present: source.includes(needle)
  }));
  const missing = checks.filter((check) => !check.present).map((check) => check.id);

  return {
    schemaVersion: '1.0.0',
    status: missing.length === 0 ? 'wired' : 'not_wired',
    checks,
    missing
  };
}

function main() {
  const [workflow = '.github/workflows/cloudflare-pages-research.yml', output] = process.argv.slice(2);
  const source = fs.readFileSync(workflow, 'utf8');
  const result = verifyFinalizerWorkflowWiring(source);
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (output) fs.writeFileSync(output, serialized);
  process.stdout.write(serialized);
  if (result.status !== 'wired') process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
