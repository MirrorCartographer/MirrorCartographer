import { readFile } from 'node:fs/promises';
import { analyzeGraph } from './relationship-engine.mjs';
const graph = JSON.parse(await readFile(new URL('../../demonstrations/001-cross-domain-bridge/graph.json', import.meta.url), 'utf8'));
const result = analyzeGraph(graph);
console.log(JSON.stringify({ notice: graph.notice, ...result }, null, 2));
