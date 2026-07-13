import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createFilesystemPeerTerminalStore } from './filesystem-peer-terminal-store.mjs';
import { createDurablePeerTerminalJournal } from './durable-peer-terminal-journal.mjs';

const event = id => ({ id, data: { trigger_id: 'trigger-1', phase: 'executed' } });

test('reconciles directory-sync failure by rereading exact committed terminal', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'journal-indeterminate-'));
  const path = join(dir, 'journal.json');
  try {
    const store = createFilesystemPeerTerminalStore({
      path,
      syncDirectory: async () => { throw Object.assign(new Error('simulated-sync-failure'), { code: 'EIO' }); }
    });
    const journal = createDurablePeerTerminalJournal(store);
    const result = await journal.append({
      triggerId: 'trigger-1',
      terminalEvent: event('terminal-a'),
      packetDigest: 'sha256:packet-a'
    });
    assert.equal(result.state, 'recorded-indeterminate-reconciled');
    const persisted = JSON.parse(await readFile(path, 'utf8'));
    assert.equal(persisted.terminals['trigger-1'].terminal_event.id, 'terminal-a');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('does not retry a conflicting terminal after an indeterminate outcome', async () => {
  let writes = 0;
  const committed = {
    schema_version: '1.0.0',
    terminals: {
      'trigger-1': {
        packet_digest: 'sha256:other',
        terminal_event: event('terminal-other')
      }
    }
  };
  const journal = createDurablePeerTerminalJournal({
    read: async () => {
      if (writes === 0) return { document: { schema_version: '1.0.0', terminals: {} }, etag: '"before"' };
      return { document: committed, etag: '"after"' };
    },
    compareAndSet: async () => {
      writes += 1;
      return { state: 'indeterminate', applied: false, reason: 'directory-sync-failed' };
    }
  });
  await assert.rejects(
    journal.append({
      triggerId: 'trigger-1',
      terminalEvent: event('terminal-a'),
      packetDigest: 'sha256:packet-a'
    }),
    /terminal-conflict/
  );
  assert.equal(writes, 1);
});

test('unresolved indeterminate outcome fails closed without a second write', async () => {
  let writes = 0;
  const empty = { schema_version: '1.0.0', terminals: {} };
  const journal = createDurablePeerTerminalJournal({
    read: async () => ({ document: empty, etag: '"same"' }),
    compareAndSet: async () => {
      writes += 1;
      return { state: 'indeterminate', applied: false, reason: 'directory-sync-failed' };
    }
  });
  await assert.rejects(
    journal.append({
      triggerId: 'trigger-1',
      terminalEvent: event('terminal-a'),
      packetDigest: 'sha256:packet-a'
    }),
    /journal-write-indeterminate:directory-sync-failed/
  );
  assert.equal(writes, 1);
});
