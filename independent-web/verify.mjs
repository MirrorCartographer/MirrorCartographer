import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const identity = readFileSync(new URL('./IDENTITY.md', import.meta.url), 'utf8');

const required = [
  '<canvas id="sky"',
  'Wake sound',
  'prefers-reduced-motion',
  'pointerdown',
  'AudioContext',
  'aria-live="polite"',
  'viewport-fit=cover'
];

for (const token of required) {
  if (!html.includes(token)) throw new Error(`missing required token: ${token}`);
}

const forbidden = [
  'Mirror Cartographer interface',
  'payment',
  'checkout',
  'analytics',
  'localStorage',
  'fetch('
];

for (const token of forbidden) {
  if (html.includes(token)) throw new Error(`forbidden dependency or product behavior: ${token}`);
}

if (!identity.includes('## Independence boundary')) throw new Error('identity boundary missing');
if (!identity.includes('zero-build static artifact')) throw new Error('hosting contract missing');
if ((html.match(/<script/g) || []).length !== 1) throw new Error('artifact must remain a single-script static instrument');
if ((html.match(/<canvas/g) || []).length !== 1) throw new Error('artifact must expose exactly one primary canvas');

execFileSync(process.execPath, [new URL('./rain-organ/contract.test.mjs', import.meta.url)], { stdio: 'inherit' });
execFileSync(process.execPath, ['--test', new URL('./anthology-contract.test.mjs', import.meta.url)], { stdio: 'inherit' });
execFileSync(process.execPath, ['--test', new URL('./cloud-press/contract.test.mjs', import.meta.url)], { stdio: 'inherit' });

console.log(JSON.stringify({
  valid: true,
  anthology: ['The Weather Inside a Bell', 'Afterbell', 'Rain Organ', 'Cloud Press'],
  progression: ['pressure score', 'echo room', 'rain instrument', 'pressure printing'],
  bytes: Buffer.byteLength(html),
  externalAssets: false,
  networkCalls: false,
  accessibility: ['keyboard', 'aria-live', 'reduced-motion', 'safe-area', 'reversible room navigation'],
  interactions: ['tap', 'drag', 'multi-pointer rain', 'keyboard strike', 'gesture-gated sound', 'hold-and-release printing']
}, null, 2));
