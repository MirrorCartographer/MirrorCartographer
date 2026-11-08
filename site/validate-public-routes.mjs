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
  'forest/index.html',
  'forest/orrery.html',
  'forest/midnight-mile.html',
  'forest/weather-between.html',
  'forest/permission-room.html',
  'experiments/engine.js',
  'experiments/shared.css',
  'companion/index.html',
  'companion/atlas/index.html',
  'companion/atlas/rooms/index.html',
  'companion/atlas/rooms/annexes.html',
  'companion/atlas/rooms/room-identities.json',
  'companion/atlas/rooms/character-atelier/index.html',
  'companion/atlas/rooms/character-atelier/character-engine.mjs',
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
  if (decoded.startsWith('#')) return null;

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

const roomsRoot = join(siteRoot, 'companion/atlas/rooms');
const roomIndexPath = join(roomsRoot, 'index.html');
const roomCatalog = JSON.parse(readFileSync(join(roomsRoot, 'room-identities.json'), 'utf8'));
if (roomCatalog.count !== 40 || !Array.isArray(roomCatalog.rooms) || roomCatalog.rooms.length !== 40) {
  throw new Error('The public companion room catalog must contain exactly 40 named destinations.');
}
const roomDirectory = readFileSync(roomIndexPath, 'utf8');
const roomCards = [...roomDirectory.matchAll(/<a class="room" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(match => ({
  href: match[1],
  name: match[2].match(/<h2>([\s\S]*?)<\/h2>/)?.[1]?.trim()
}));
if (roomCards.length !== 40) throw new Error('The public room directory must expose exactly 40 room cards.');
const roomIds = new Set();
const roomNames = new Set();
for (const room of roomCatalog.rooms) {
  if (!room.id || !room.name || !room.path || roomIds.has(room.id) || roomNames.has(room.name)) {
    throw new Error('Missing or duplicate public room identity: ' + JSON.stringify(room));
  }
  if (!room.implementation_status || !room.interaction_status || !room.memory_status) {
    throw new Error('Room status metadata must be explicit: ' + room.id + ' / ' + room.name);
  }
  roomIds.add(room.id);
  roomNames.add(room.name);
  const expected = resolveLocalTarget(roomIndexPath, room.path);
  const card = roomCards.find(item => item.name === room.name);
  if (!expected || !card) throw new Error('Missing room route or directory card: ' + room.name);
  const actual = resolveLocalTarget(roomIndexPath, card.href);
  if (actual !== expected) throw new Error('Room directory card points to the wrong destination: ' + room.name);
}
const atelierHtml = readFileSync(join(roomsRoot, 'character-atelier/index.html'), 'utf8');
if (!atelierHtml.includes("from './character-engine.mjs'")) {
  throw new Error('Character Atelier must load its published local engine module.');
}

const htmlFiles = [
  ...walk(join(siteRoot, 'experiments')),
  ...walk(join(siteRoot, 'music')),
  ...walk(join(siteRoot, 'forest')),
  ...walk(roomsRoot),
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
  publishedRoomDestinations: roomCatalog.rooms.length,
  requiredFiles: required.length,
  htmlRoutesChecked: htmlFiles.length,
  localReferencesChecked: checkedReferences,
}, null, 2));
