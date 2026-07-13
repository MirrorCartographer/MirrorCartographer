import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createFilesystemPeerTerminalStore } from './filesystem-peer-terminal-store.mjs';
import { journalEtag } from './durable-peer-terminal-journal.mjs';

const EMPTY = { schema_version: '1.0.0', terminals: {} };

test('compare-and-set synchronizes the parent directory after replacement', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'peer-terminal-durability-'));
  const journalPath = join(directory, 'journal.json');
  const calls = [];
  const next = {
    schema_version: '1.0.0',
    terminals: {
      trigger: {
        packet_digest: 'digest',
        terminal_event: { id: 'event', data: { trigger_id: 'trigger', phase: 'executed' } }
      }
    }
  };

  try {
    const store = createFilesystemPeerTerminalStore({
      path: journalPath,
      syncDirectory: async directoryPath => {
        calls.push({
          directoryPath,
          persisted: JSON.parse(await readFile(journalPath, 'utf8'))
        });
      }
    });

    const result = await store.compareAndSet({
      expectedEtag: journalEtag(EMPTY),
      nextEtag: journalEtag(next),
      document: next
    });

    assert.deepEqual(result, { applied: true, etag: journalEtag(next) });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].directoryPath, dirname(journalPath));
    assert.deepEqual(calls[0].persisted, next);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('directory synchronization failure fails closed after a valid replacement', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'peer-terminal-durability-'));
  const journalPath = join(directory, 'journal.json');
  const next = { schema_version: '1.0.0', terminals: { trigger: { packet_digest: 'digest', terminal_event: { id: 'event', data: { trigger_id: 'trigger', phase: 'failed' } } } } };

  try {
    const store = createFilesystemPeerTerminalStore({
      path: journalPath,
      syncDirectory: async () => { throw new Error('directory-sync-failed'); }
    });

    await assert.rejects(
      store.compareAndSet({ expectedEtag: journalEtag(EMPTY), nextEtag: journalEtag(next), document: next }),
      /directory-sync-failed/
    );
    assert.deepEqual(JSON.parse(await readFile(journalPath, 'utf8')), next);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
