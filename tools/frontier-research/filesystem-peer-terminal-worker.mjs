import { access } from 'node:fs/promises';
import { createDurablePeerTerminalJournal } from './durable-peer-terminal-journal.mjs';
import { createFilesystemPeerTerminalStore } from './filesystem-peer-terminal-store.mjs';

const [journalPath, barrierPath, eventId, phase, digest, crashPoint = ''] = process.argv.slice(2);

while (true) {
  try {
    await access(barrierPath);
    break;
  } catch {
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}

const faultInjector = async point => {
  if (point === crashPoint) process.kill(process.pid, 'SIGKILL');
};

const store = createFilesystemPeerTerminalStore({
  path: journalPath,
  retryDelayMs: 2,
  lockTimeoutMs: 500,
  faultInjector
});
const journal = createDurablePeerTerminalJournal({ ...store, maxRetries: 8 });

try {
  const result = await journal.append({
    triggerId: 'shared-trigger',
    packetDigest: digest,
    terminalEvent: {
      id: eventId,
      data: { trigger_id: 'shared-trigger', phase }
    }
  });
  process.stdout.write(JSON.stringify({ ok: true, result }));
} catch (error) {
  process.stdout.write(JSON.stringify({ ok: false, error: error.message }));
  process.exitCode = error.message === 'terminal-conflict' ? 0 : 1;
}
