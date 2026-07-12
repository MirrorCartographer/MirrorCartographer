import { open, readFile, rename, unlink } from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { createMonotonicState } from './monotonic-witness-state.mjs';

const STORE_VERSION = 'frontier.atomic-monotonic-state-store.v1';

function validateState(state) {
  if (!state || typeof state !== 'object') throw new TypeError('state is required');
  const rebuilt = createMonotonicState(state);
  if (rebuilt.state_sha256 !== state.state_sha256) throw new TypeError('state digest mismatch');
  return state;
}

function encodeRecord(state) {
  validateState(state);
  return `${JSON.stringify({ version: STORE_VERSION, state })}\n`;
}

function decodeRecord(text) {
  let record;
  try { record = JSON.parse(text); } catch { throw new Error('persisted state is not valid JSON'); }
  if (!record || record.version !== STORE_VERSION) throw new Error('unsupported persisted state version');
  validateState(record.state);
  return record.state;
}

async function fsyncDirectory(path) {
  const handle = await open(path, 'r');
  try { await handle.sync(); } finally { await handle.close(); }
}

export async function persistMonotonicStateAtomic({ path, state, inject_failure_at = null }) {
  if (typeof path !== 'string' || path.length === 0) throw new TypeError('path is required');
  const directory = dirname(path);
  const temporary = join(directory, `.${basename(path)}.${process.pid}.${randomBytes(8).toString('hex')}.tmp`);
  const bytes = encodeRecord(state);
  let handle;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(bytes, 'utf8');
    if (inject_failure_at === 'after_write') throw new Error('injected failure after_write');
    await handle.sync();
    if (inject_failure_at === 'after_file_fsync') throw new Error('injected failure after_file_fsync');
    await handle.close();
    handle = null;
    await rename(temporary, path);
    if (inject_failure_at === 'after_rename') throw new Error('injected failure after_rename');
    await fsyncDirectory(directory);
    return { ok: true, classification: 'persisted', path, state_sha256: state.state_sha256, policy_sequence: state.policy_sequence };
  } catch (error) {
    if (handle) await handle.close().catch(() => {});
    await unlink(temporary).catch(() => {});
    throw error;
  }
}

export async function loadMonotonicState({ path, allow_missing = false }) {
  if (typeof path !== 'string' || path.length === 0) throw new TypeError('path is required');
  let text;
  try { text = await readFile(path, 'utf8'); }
  catch (error) {
    if (error?.code === 'ENOENT' && allow_missing) return null;
    if (error?.code === 'ENOENT') throw new Error('persisted state missing; refusing silent reset');
    throw error;
  }
  return decodeRecord(text);
}

export const versions = { STORE_VERSION };
