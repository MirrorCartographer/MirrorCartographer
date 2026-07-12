import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { consumeAcceptanceId, inspectAcceptanceLedger } from './event-timing-acceptance-ledger.mjs';

const id = (suffix) => `acceptance_${suffix.padEnd(20, '_')}`;
async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), 'acceptance-ledger-'));
  return { dir, path: join(dir, 'ledger.json') };
}

test('persists acceptance across reloads and rejects replay', async () => {
  const fx = await fixture();
  try {
    assert.equal((await consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id('one'), nowMs: 1000 })).accepted, true);
    assert.equal((await consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id('one'), nowMs: 1001 })).reason, 'acceptance_replay_detected');
    assert.equal((await inspectAcceptanceLedger({ ledgerPath: fx.path })).entries.length, 1);
  } finally { await rm(fx.dir, { recursive: true, force: true }); }
});

test('serializes concurrent consumers so exactly one wins', async () => {
  const fx = await fixture();
  try {
    const results = await Promise.all(Array.from({ length: 8 }, () => consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id('race'), nowMs: 2000 })));
    assert.equal(results.filter((result) => result.accepted).length, 1);
    assert.equal(results.filter((result) => result.reason === 'acceptance_replay_detected').length, 7);
  } finally { await rm(fx.dir, { recursive: true, force: true }); }
});

test('prunes expired entries and permits reuse only after retention', async () => {
  const fx = await fixture();
  try {
    await consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id('old'), nowMs: 1000, retentionMs: 100 });
    const result = await consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id('old'), nowMs: 1200, retentionMs: 100 });
    assert.equal(result.accepted, true);
  } finally { await rm(fx.dir, { recursive: true, force: true }); }
});

test('bounds retained entries deterministically', async () => {
  const fx = await fixture();
  try {
    for (let index = 0; index < 5; index += 1) await consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id(String(index)), nowMs: 1000 + index, maxEntries: 3 });
    const ledger = await inspectAcceptanceLedger({ ledgerPath: fx.path });
    assert.deepEqual(ledger.entries.map((entry) => entry.acceptance_id), [id('2'), id('3'), id('4')]);
  } finally { await rm(fx.dir, { recursive: true, force: true }); }
});

test('fails closed on malformed persistent state without overwriting it', async () => {
  const fx = await fixture();
  try {
    await writeFile(fx.path, '{not-json', 'utf8');
    await assert.rejects(() => consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: id('bad') }));
    assert.equal(await readFile(fx.path, 'utf8'), '{not-json');
  } finally { await rm(fx.dir, { recursive: true, force: true }); }
});

test('rejects invalid identifiers before touching storage', async () => {
  const fx = await fixture();
  try {
    await assert.rejects(() => consumeAcceptanceId({ ledgerPath: fx.path, acceptanceId: 'short' }), /acceptance_id_missing_or_invalid/);
  } finally { await rm(fx.dir, { recursive: true, force: true }); }
});
