import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';

const siteRoot = resolve('site');
const experimentSlugs = [
  '001-observatory',
  '002-machine-garden',
  '003-echo-cathedral',
  '004-carnival-of-thought',
  '005-ocean',
  '006-living-blueprint',
  '007-dream-library',
  '008-signal-forest',
  '009-impossible-museum',
  '010-composer',
];

const required = [
  'experiments/index.html',
  'music/index.html',
  'experiments/engine.js',
  'experiments/shared.css',
  ...experimentSlugs.map((slug) => 'experiments/' + slug + '/index.html'),
];

for (const path of required) {
  if (!existsSync(join(siteRoot, path))) {
    throw new Error('Missing published route or asset: site/' + path);
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
  });
}

function isExternal(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value.trim());
}

function resolveLocalTarget(file, rawValue) {
  const value = rawValue.trim();
  if (!value || value.startsWith('#') || isExternal(value)) return null;

  const pathPart = value.split(/[?#]/, 1)[0];
  if (!pathPart) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(pathPart);
  } catch {
    throw new Error('Invalid URL encoding in ' + relative(siteRoot, file) + ': ' + rawValue);
  }

  const target = decoded.startsWith('/')
    ? resolve(siteRoot, '.' + decoded)
    : resolve(dirname(file), decoded);
  const rel = relative(siteRoot, target);
  if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) {
    throw new Error('Local reference escapes the Pages artifact: ' + relative(siteRoot, file) + ' -> ' + rawValue);
  }

  const candidates = [];
  if (existsSync(target) && statSync(target).isDirectory()) candidates.push(join(target, 'index.html'));
  candidates.push(target);
  if (!extname(target)) candidates.push(join(target, 'index.html'));

  const found = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  if (!found) {
    throw new Error('Broken local reference: ' + relative(siteRoot, file) + ' -> ' + rawValue);
  }
  return found;
}

const htmlFiles = [
  ...walk(join(siteRoot, 'experiments')),
  ...walk(join(siteRoot, 'music')),
].filter((file) => extname(file).toLowerCase() === '.html');

let checkedReferences = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const refs = [
    ...[...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]),
    ...[...html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map((match) => match[1]),
  ];

  for (const ref of refs) {
    if (resolveLocalTarget(file, ref)) checkedReferences += 1;
  }
}

console.log(JSON.stringify({
  result: 'PASS',
  experimentRoutes: experimentSlugs.length,
  requiredFiles: required.length,
  htmlRoutesChecked: htmlFiles.length,
  localReferencesChecked: checkedReferences,
}, null, 2));
