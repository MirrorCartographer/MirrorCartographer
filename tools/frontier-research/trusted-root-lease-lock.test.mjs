import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { acquireLeaseLock, inspectLeaseLock } from './trusted-root-lease-lock.mjs';

async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), 'mc-lease-lock-'));
  return { dir, lockPath: join(dir, 'root.lock'), cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test('active lease excludes a competing writer and owner can release', async () => {
  const f = await fixture();
  try {
    let now = 1000;
    const first = await acquireLeaseLock(f.lockPath, { leaseMs: 5000, now: () => now, tokenFactory: () => 'a', ownerId: 'one' });
    await assert.rejects(() => acquireLeaseLock(f.lockPath, { leaseMs: 5000, now: () => now, tokenFactory: () => 'b', ownerId: 'two' }), /active until 6000/);
    assert.equal(await first.release(), true);
    assert.equal((await inspectLeaseLock(f.lockPath, { now: () => now })).state, 'absent-or-incomplete');
  } finally { await f.cleanup(); }
});

test('expired lease is quarantined and replaced', async () => {
  const f = await fixture();
  try {
    let now = 1000;
    await acquireLeaseLock(f.lockPath, { leaseMs: 10, now: () => now, tokenFactory: () => 'old', ownerId: 'dead' });
    now = 2000;
    const next = await acquireLeaseLock(f.lockPath, { leaseMs: 100, now: () => now, tokenFactory: () => 'new', ownerId: 'live' });
    const owner = JSON.parse(await readFile(`${f.lockPath}/owner.json`, 'utf8'));
    assert.equal(owner.token, 'new');
    assert.equal(owner.owner_id, 'live');
    assert.equal(await next.release(), true);
  } finally { await f.cleanup(); }
});

test('stale owner cannot delete a successor lock', async () => {
  const f = await fixture();
  try {
    let now = 1000;
    const stale = await acquireLeaseLock(f.lockPath, { leaseMs: 10, now: () => now, tokenFactory: () => 'stale' });
    now = 2000;
    const current = await acquireLeaseLock(f.lockPath, { leaseMs: 100, now: () => now, tokenFactory: () => 'current' });
    assert.equal(await stale.release(), false);
    assert.equal((await inspectLeaseLock(f.lockPath, { now: () => now })).token, 'current');
    assert.equal(await current.release(), true);
  } finally { await f.cleanup(); }
});

test('incomplete or malformed locks fail closed instead of being stolen', async () => {
  const f = await fixture();
  try {
    await mkdir(f.lockPath);
    await assert.rejects(() => acquireLeaseLock(f.lockPath, { tokenFactory: () => 'x' }), /cannot be recovered safely: missing-owner-record/);
    await writeFile(`${f.lockPath}/owner.json`, '{bad json');
    await assert.rejects(() => acquireLeaseLock(f.lockPath, { tokenFactory: () => 'y' }), /cannot be recovered safely: invalid-owner-json/);
  } finally { await f.cleanup(); }
});
