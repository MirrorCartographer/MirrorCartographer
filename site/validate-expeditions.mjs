import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';

const root = resolve('site/expeditions');
const routes = [
  'index.html',
  'riddle-arcade.html',
  'pattern-loom.html',
  'the-between.html',
  'signal-garden.html',
  'specimen-garden.html',
  'ecology-lab.html',
];
const failures = [];
for (const route of routes) {
  const file = resolve(root, route);
  if (!existsSync(file) || !statSync(file).isFile()) {
    failures.push(`Missing published route: ${route}`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  if (!html.toLowerCase().includes('<!doctype html>')) failures.push(`Missing HTML doctype: ${route}`);
  if (!html.includes('name="viewport"')) failures.push(`Missing mobile viewport: ${route}`);
  if (route !== 'index.html' && !html.includes('<script')) failures.push(`Missing playable script: ${route}`);
  for (const [, href] of html.matchAll(/href=["']([^"']+)["']/gi)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) continue;
    const pathname = decodeURIComponent(href.split(/[?#]/, 1)[0]);
    let target = resolve(dirname(file), pathname || 'index.html');
    if (!target.startsWith(resolve('site') + sep) && target !== resolve('site')) continue;
    if (existsSync(target) && statSync(target).isDirectory()) target = resolve(target, 'index.html');
    if (!existsSync(target)) failures.push(`Broken local link in ${route}: ${href}`);
  }
}
const requiredEdges = [
  ['index.html', 'specimen-garden.html'],
  ['index.html', 'the-between.html'],
  ['index.html', 'riddle-arcade.html'],
  ['riddle-arcade.html', 'pattern-loom.html'],
  ['the-between.html', 'signal-garden.html'],
  ['specimen-garden.html', 'ecology-lab.html'],
];
for (const [from, to] of requiredEdges) {
  const html = readFileSync(resolve(root, from), 'utf8');
  if (!html.includes(to)) failures.push(`Missing navigation edge: ${from} -> ${to}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${routes.length} expedition pages exist; all local links and six world-to-side-room routes resolve.`);
}
