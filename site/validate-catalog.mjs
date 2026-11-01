import { readFileSync, existsSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';

const catalogPath = 'site/catalog.json';
if (!existsSync(catalogPath)) throw new Error('Catalog generation did not produce ' + catalogPath);

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const allowedRepositories = new Set([
  'MirrorCartographer/MirrorCartographer',
  'MirrorCartographer/mirror-cartographer-ui',
]);
const blockedPath = /(^|\/)(private|secrets?|credentials?|personal-records?|raw-private|raw-conversations?|conversation-exports?|chat-exports?|medical-records?|health-records?|veterinary-records?|pet-records?|financial-records?|bank-records?|private-notes?|raw-notes?)(\/|$)|(^|\/)\.env($|\.)|(^|\/)(node_modules|\.git)(\/|$)/i;
const excludedExtensions = new Set([
  '.pem', '.key', '.p12', '.pfx', '.sqlite', '.db', '.dump', '.bak', '.kdbx', '.gpg', '.age', '.asc',
]);
const blockedBasename = /^(id_rsa|id_ed25519|authorized_keys|credentials?|secrets?|tokens?|passwords?)(\..*)?$/i;
const required = ['path', 'title', 'category', 'repository', 'source_commit', 'url'];
const seen = new Set();
const errors = [];

if (catalog.schema_version !== '1.0.0') errors.push('unexpected schema_version');
if (!Array.isArray(catalog.items) || !catalog.items.length) errors.push('items must be a non-empty array');
if (!Array.isArray(catalog.repositories) || catalog.repositories.length !== 2) errors.push('expected exactly two source repositories');

for (const [index, item] of (catalog.items || []).entries()) {
  for (const key of required) {
    if (typeof item[key] !== 'string' || !item[key].trim()) errors.push('item ' + index + ' missing ' + key);
  }

  if (typeof item.path !== 'string' || typeof item.repository !== 'string') continue;
  if (!allowedRepositories.has(item.repository)) errors.push('unexpected repository at item ' + index);

  const path = item.path;
  if (path.startsWith('/') || path.includes('\\\\') || path.split('/').some((part) => part === '.' || part === '..')) {
    errors.push('unsafe catalog path at item ' + index);
  }
  if (blockedPath.test(path) || excludedExtensions.has(extname(path).toLowerCase()) || blockedBasename.test(basename(path))) {
    errors.push('sensitive path or file type indexed: ' + path);
  }

  const key = item.repository + ':' + path;
  if (seen.has(key)) errors.push('duplicate ' + key);
  seen.add(key);

  if (!/^[0-9a-f]{40}$/i.test(item.source_commit || '')) {
    errors.push('invalid source_commit at item ' + index);
  } else {
    const repositoryPath = item.repository === 'MirrorCartographer/mirror-cartographer-ui'
      ? path.replace(/^mirror-cartographer-ui\//, '')
      : path;
    if (item.repository === 'MirrorCartographer/mirror-cartographer-ui' && repositoryPath === path) {
      errors.push('missing companion repository path prefix at item ' + index);
    }
    const expectedUrl = 'https://github.com/' + item.repository + '/blob/' + item.source_commit + '/'
      + repositoryPath.split('/').map(encodeURIComponent).join('/');
    if (item.url !== expectedUrl) errors.push('source URL is not pinned to the item commit at item ' + index);
  }
}

if (catalog.file_count !== (catalog.items || []).length) errors.push('file_count does not match item count');
if (errors.length) throw new Error('Catalog validation failed:\\n' + errors.slice(0, 40).join('\\n'));

console.log(JSON.stringify({
  result: 'PASS',
  fileCount: catalog.items.length,
  repositories: catalog.repositories,
  categories: catalog.categories,
  bytes: statSync(catalogPath).size,
  uniquePaths: seen.size,
  privacyPathLeaks: 0,
  sourceLinks: 'commit-pinned',
}, null, 2));
