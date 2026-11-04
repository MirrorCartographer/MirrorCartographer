import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const protectedUrls = [
  'https://mirror-cartographer-ui-3orp.vercel.app',
  'https://mirrorcartographeravprototypev4.vercel.app/#',
];

test('Observatory and coordination guide preserve both canonical experiences', () => {
  const readme = read('../../README.md');
  const coordination = read('../../WORK_COORDINATION.md');
  for (const url of protectedUrls) {
    assert.ok(readme.includes(url), `README must retain ${url}`);
    assert.ok(coordination.includes(url), `coordination guide must retain ${url}`);
  }
});

test('deployment policy requires evidence before accepting a replacement', () => {
  const coordination = read('../../WORK_COORDINATION.md');
  assert.match(coordination, /Do not claim a replacement is working until it has been deployed and verified in a browser/);
  assert.match(coordination, /Other Vercel URLs are untrusted until tested/);
  assert.match(coordination, /DEPLOYED-UNVERIFIED/);
});

test('daemon workforce preserves private-repository and read-only boundaries', () => {
  const workforce = read('../../DAEMON_WORKFORCE.md');
  assert.match(workforce, /Private repositories remain private/);
  assert.match(workforce, /No source edits or deletions/);
  assert.match(workforce, /not autonomous software engineers/);
});
