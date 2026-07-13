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
  const durableJournal = createDurablePeerTerminalJournal({
    read: store.read,
    compareAndSet: store.compareAndSet,
    ...journalOptions
  });

  const terminalJournal = Object.freeze({
    async append(input) {
      const receipt = await durableJournal.append(input);
      if (receipt?.state !== 'recorded-indeterminate-reconciled') return receipt;
      return Object.freeze({
        ...receipt,
        state: 'recorded',
        durability_state: 'recorded-indeterminate-reconciled'
      });
    }
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
