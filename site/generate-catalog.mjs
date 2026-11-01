import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { isCredentialLikeFile, isPrivateCatalogPath } from './atlas-privacy-policy.mjs';

const sources = [
  { dir: '.', prefix: '', repo: 'MirrorCartographer/MirrorCartographer' },
  { dir: 'ui-repository', prefix: 'mirror-cartographer-ui/', repo: 'MirrorCartographer/mirror-cartographer-ui' },
];

const excludedMediaExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.mp4', '.mov', '.mp3', '.wav', '.zip', '.pdf',
]);
const generated = new Set([
  'site/catalog.json',
  'public/atlas/catalog-main.json',
  'public/atlas/catalog-ui.json',
  'public/atlas/catalog-index.json',
]);

function isExcluded(path) {
  return isPrivateCatalogPath(path)
    || isCredentialLikeFile(path)
    || excludedMediaExtensions.has(extname(path).toLowerCase());
}

function category(path) {
  const p = path.toLowerCase();
  if (p.startsWith('research/') || p.startsWith('evidence/') || p.startsWith('research-atlas/') || p.startsWith('public/research-atlas/')) return 'research';
  if (p.startsWith('architecture/') || p.startsWith('foundation/')) return 'architecture';
  if (p.startsWith('demonstrations/') || p.startsWith('open-mic/')) return 'demonstrations';
  if (p.startsWith('art/') || p.startsWith('music/') || p.startsWith('creative_universe/') || p.startsWith('independent') || p.startsWith('public/experiments/') || p.startsWith('operations/independent')) return 'creative';
  if (p.startsWith('tools/') || p.startsWith('forge/') || p.startsWith('functions/') || p.startsWith('scripts/') || p.startsWith('src/') || p.startsWith('engines/') || p.startsWith('server/') || p.startsWith('api/')) return 'tools';
  if (p.startsWith('governance/') || p.startsWith('ledgers/') || p.startsWith('proof/')) return 'governance';
  if (p.startsWith('docs/') || p.endsWith('readme.md') || p.endsWith('.md')) return 'documentation';
  return 'other';
}

function title(root, path) {
  let value = basename(path).replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ');
  if (extname(path).toLowerCase() === '.md') {
    try {
      const heading = readFileSync(join(root, path), 'utf8').match(/^#\s+(.+)$/m);
      if (heading) value = heading[1].trim();
    } catch {
      // Keep the filename-derived title when a file cannot be read as text.
    }
  }
  return value.slice(0, 110) || basename(path);
}

function sourceCommit(root) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
}

const items = sources.flatMap((source) => {
  const commit = sourceCommit(source.dir);
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: source.dir, encoding: 'utf8' }).split('\0').filter(Boolean);
  return tracked
    .filter((path) => !isExcluded(path) && !path.startsWith('.github/') && !generated.has(path))
    .map((path) => ({
      path: source.prefix + path,
      title: title(source.dir, path),
      category: category(path),
      repository: source.repo,
      source_commit: commit,
      url: 'https://github.com/' + source.repo + '/blob/' + commit + '/' + path.split('/').map(encodeURIComponent).join('/'),
    }));
});

items.sort((a, b) => a.category.localeCompare(b.category) || a.path.localeCompare(b.path));

writeFileSync('site/catalog.json', JSON.stringify({
  schema_version: '1.0.0',
  repositories: sources.map((source) => source.repo),
  generated_at: new Date().toISOString(),
  file_count: items.length,
  categories: [...new Set(items.map((item) => item.category))].sort(),
  items,
}));

console.log('Indexed ' + items.length + ' public files across ' + sources.length + ' repositories with commit-pinned source links.');
