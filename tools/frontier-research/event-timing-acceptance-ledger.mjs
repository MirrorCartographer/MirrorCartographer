import { mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const OPAQUE_ID = /^[A-Za-z0-9_-]{16,128}$/;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeLedger(value) {
  if (!value || value.schema_version !== '1.0.0' || !Array.isArray(value.entries)) {
    throw new Error('acceptance_ledger_invalid');
  }
  return value;
}

async function readLedger(path) {
  try {
    return normalizeLedger(JSON.parse(await readFile(path, 'utf8')));
  } catch (error) {
    if (error?.code === 'ENOENT') return { schema_version: '1.0.0', entries: [] };
    throw error;
  }
}

async function acquireLock(lockPath, { timeoutMs, retryMs }) {
  const deadline = Date.now() + timeoutMs;
  while (true) {
    try {
      return await open(lockPath, 'wx', 0o600);
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      if (Date.now() >= deadline) throw new Error('acceptance_ledger_lock_timeout');
      await sleep(retryMs);
    }
  }
}

async function atomicWrite(path, value) {
  const tempPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(tempPath, path);
}

export async function consumeAcceptanceId({
  ledgerPath,
  acceptanceId,
  nowMs = Date.now(),
  retentionMs = 24 * 60 * 60 * 1000,
  maxEntries = 2048,
  lockTimeoutMs = 2000,
  lockRetryMs = 10
} = {}) {
  if (typeof ledgerPath !== 'string' || ledgerPath.length === 0) throw new Error('ledger_path_required');
  if (!OPAQUE_ID.test(acceptanceId ?? '')) throw new Error('acceptance_id_missing_or_invalid');
  if (!Number.isFinite(nowMs) || !Number.isFinite(retentionMs) || retentionMs <= 0) throw new Error('retention_invalid');
  if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new Error('max_entries_invalid');

  await mkdir(dirname(ledgerPath), { recursive: true });
  const lockPath = `${ledgerPath}.lock`;
  const lock = await acquireLock(lockPath, { timeoutMs: lockTimeoutMs, retryMs: lockRetryMs });
  try {
    const ledger = await readLedger(ledgerPath);
    const cutoff = nowMs - retentionMs;
    const retained = ledger.entries
      .filter((entry) => OPAQUE_ID.test(entry.acceptance_id ?? '') && Number.isFinite(entry.accepted_at_ms) && entry.accepted_at_ms >= cutoff)
      .sort((a, b) => a.accepted_at_ms - b.accepted_at_ms);

    if (retained.some((entry) => entry.acceptance_id === acceptanceId)) {
      return { accepted: false, reason: 'acceptance_replay_detected', retained_entries: retained.length };
    }

    retained.push({ acceptance_id: acceptanceId, accepted_at_ms: nowMs });
    const bounded = retained.slice(-maxEntries);
    await atomicWrite(ledgerPath, { schema_version: '1.0.0', entries: bounded });
    return {
      accepted: true,
      reason: 'acceptance_id_consumed_atomically',
      retained_entries: bounded.length,
      evicted_entries: Math.max(0, retained.length - bounded.length)
    };
  } finally {
    await lock.close();
    await rm(lockPath, { force: true });
  }
}

export async function inspectAcceptanceLedger({ ledgerPath } = {}) {
  const ledger = await readLedger(ledgerPath);
  return { schema_version: ledger.schema_version, entries: ledger.entries.map((entry) => ({ ...entry })) };
}
