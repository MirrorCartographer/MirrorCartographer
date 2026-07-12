#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRepositoryContinuityInventory } from './continuity-inventory-discovery.mjs';
import { buildContinuityInventoryReport } from './continuity-inventory-report.mjs';

export async function generateContinuityInventory({
  rootDir,
  outputPath = null,
  generatedAt = new Date().toISOString(),
} = {}) {
  if (!rootDir) throw new TypeError('rootDir is required');

  const report = await buildRepositoryContinuityInventory(
    rootDir,
    buildContinuityInventoryReport,
    generatedAt,
  );
  const serialized = `${JSON.stringify(report, null, 2)}\n`;

  if (outputPath) {
    const resolvedOutput = path.resolve(rootDir, outputPath);
    await writeFile(resolvedOutput, serialized, 'utf8');
  }

  return { report, serialized };
}

function parseArgs(argv) {
  const args = { rootDir: process.cwd(), outputPath: null, generatedAt: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--root') args.rootDir = argv[++index];
    else if (token === '--output') args.outputPath = argv[++index];
    else if (token === '--generated-at') args.generatedAt = argv[++index];
    else if (token === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write('Usage: node tools/continuity/generate-continuity-inventory.mjs [--root DIR] [--output PATH] [--generated-at ISO]\n');
    return;
  }
  const { serialized } = await generateContinuityInventory({
    rootDir: args.rootDir,
    outputPath: args.outputPath,
    generatedAt: args.generatedAt ?? new Date().toISOString(),
  });
  if (!args.outputPath) process.stdout.write(serialized);
}

const isDirectExecution = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
