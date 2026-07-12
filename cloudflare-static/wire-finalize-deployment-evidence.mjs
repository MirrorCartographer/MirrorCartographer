import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const TEST_ANCHOR = '          node --test cloudflare-static/verify-cloudflare-deployment-metadata.test.mjs';
const TEST_LINE = '          node --test cloudflare-static/finalize-deployment-evidence.test.mjs';
const UPLOAD_ANCHOR = '      - name: Upload proof artifacts';
const MANIFEST_LINE = '            cloudflare-deployment-evidence-manifest.json';
const ACCEPTANCE_LINE = '            cloudflare-deployment-acceptance.json';
const SUMMARY_ANCHOR = '            echo "- Acceptance decision: `cloudflare-deployment-acceptance.json`"';
const SUMMARY_LINE = '            echo "- Atomic evidence manifest: `cloudflare-deployment-evidence-manifest.json` is created only after byte-level verification against this run and source commit"';
const FINALIZE_STEP = `      - name: Finalize and verify exact deployment evidence manifest
        if: always()
        run: >-
          node cloudflare-static/finalize-deployment-evidence.mjs
          .
          cloudflare-deployment-evidence-manifest.json

`;

export function wireFinalizeDeploymentEvidence(source) {
  if (typeof source !== 'string' || source.length === 0) throw new Error('workflow-source-required');

  const alreadyWired = source.includes(TEST_LINE)
    && source.includes('name: Finalize and verify exact deployment evidence manifest')
    && source.includes(MANIFEST_LINE)
    && source.includes(SUMMARY_LINE);
  if (alreadyWired) return { changed: false, source };

  for (const anchor of [TEST_ANCHOR, UPLOAD_ANCHOR, ACCEPTANCE_LINE, SUMMARY_ANCHOR]) {
    if (!source.includes(anchor)) throw new Error(`workflow-anchor-missing:${anchor.trim()}`);
  }

  let next = source;
  if (!next.includes(TEST_LINE)) next = next.replace(TEST_ANCHOR, `${TEST_ANCHOR}\n${TEST_LINE}`);
  if (!next.includes('name: Finalize and verify exact deployment evidence manifest')) next = next.replace(UPLOAD_ANCHOR, `${FINALIZE_STEP}${UPLOAD_ANCHOR}`);
  if (!next.includes(MANIFEST_LINE)) next = next.replace(ACCEPTANCE_LINE, `${ACCEPTANCE_LINE}\n${MANIFEST_LINE}`);
  if (!next.includes(SUMMARY_LINE)) next = next.replace(SUMMARY_ANCHOR, `${SUMMARY_ANCHOR}\n${SUMMARY_LINE}`);

  return { changed: true, source: next };
}

function main() {
  const [workflow = '.github/workflows/cloudflare-pages-research.yml'] = process.argv.slice(2);
  const original = fs.readFileSync(workflow, 'utf8');
  const result = wireFinalizeDeploymentEvidence(original);
  if (result.changed) fs.writeFileSync(workflow, result.source);
  process.stdout.write(`${JSON.stringify({ ok: true, changed: result.changed, workflow })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
