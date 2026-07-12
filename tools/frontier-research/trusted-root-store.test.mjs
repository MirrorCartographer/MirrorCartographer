import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compareAndSwapTrustedRoot, readTrustedRoot, recoverTrustedRootStore, rootDigest } from './trusted-root-store.mjs';

async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), 'trusted-root-'));
  return { dir, path: join(dir, 'trusted-root.json'), cleanup: () => rm(dir, { recursive: true, force: true }) };
}

const r1 = { signed: { version: 1, expires: '2030-01-01T00:00:00Z', keys: { a: {} }, roles: { root: { keyids: ['a'], threshold: 1 } } } };
const r2a = { signed: { ...r1.signed, version: 2, keys: { b: {} }, roles: { root: { keyids: ['b'], threshold: 1 } } } };
const r2b = { signed: { ...r1.signed, version: 2, keys: { c: {} }, roles: { root: { keyids: ['c'], threshold: 1 } } } };

test('initializes and reads a digest-bound root', async () => {
  const f = await fixture();
  try {
    const record = await compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: null, nextRoot: r1 });
    assert.equal(record.digest, rootDigest(r1));
    assert.deepEqual((await readTrustedRoot(f.path)).root, r1);
  } finally { await f.cleanup(); }
});

test('rejects stale expected digests', async () => {
  const f = await fixture();
  try {
    await compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: null, nextRoot: r1 });
    await assert.rejects(() => compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: null, nextRoot: r2a }), /compare-and-swap conflict/);
  } finally { await f.cleanup(); }
});

test('only one concurrent N+1 writer commits', async () => {
  const f = await fixture();
  try {
    const base = await compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: null, nextRoot: r1 });
    const results = await Promise.allSettled([
      compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: base.digest, nextRoot: r2a }),
      compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: base.digest, nextRoot: r2b })
    ]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal(results.filter((r) => r.status === 'rejected').length, 1);
    const trusted = await readTrustedRoot(f.path);
    assert.ok([rootDigest(r2a), rootDigest(r2b)].includes(trusted.digest));
  } finally { await f.cleanup(); }
});

test('recovery removes interrupted temporary files without replacing trusted state', async () => {
  const f = await fixture();
  try {
    const base = await compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: null, nextRoot: r1 });
    await writeFile(`${f.path}.tmp-crash`, '{"partial":', 'utf8');
    const recovered = await recoverTrustedRootStore(f.path);
    assert.equal(recovered.digest, base.digest);
    assert.equal((await readFile(f.path, 'utf8')).includes(base.digest), true);
  } finally { await f.cleanup(); }
});

test('detects tampering in the persisted record', async () => {
  const f = await fixture();
  try {
    await compareAndSwapTrustedRoot({ storePath: f.path, expectedDigest: null, nextRoot: r1 });
    const record = JSON.parse(await readFile(f.path, 'utf8'));
    record.root.signed.version = 99;
    await writeFile(f.path, JSON.stringify(record), 'utf8');
    await assert.rejects(() => readTrustedRoot(f.path), /digest mismatch/);
  } finally { await f.cleanup(); }
});
