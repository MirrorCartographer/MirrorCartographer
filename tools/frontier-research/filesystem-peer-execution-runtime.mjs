import { createPeerExecutionRuntime } from './peer-execution-runtime.mjs';
import { verifyPeerExecutionProof } from './peer-execution-proof.mjs';
import { createDurablePeerTerminalJournal } from './durable-peer-terminal-journal.mjs';
import { createFilesystemPeerTerminalStore } from './filesystem-peer-terminal-store.mjs';

export function createFilesystemPeerExecutionRuntime({
  localTeam,
  journalPath,
  appendEvent,
  verifyPacket = verifyPeerExecutionProof,
  storeOptions = {},
  journalOptions = {},
  now,
  uuid
}) {
  if (typeof journalPath !== 'string' || journalPath.trim() === '') {
    throw new TypeError('journal-path-required');
  }
  const store = createFilesystemPeerTerminalStore({ path: journalPath, ...storeOptions });
  const terminalJournal = createDurablePeerTerminalJournal({
    read: store.read,
    compareAndSet: store.compareAndSet,
    ...journalOptions
  });

  return createPeerExecutionRuntime({
    localTeam,
    appendEvent,
    verifyPacket,
    terminalJournal,
    now,
    uuid
  });
}
