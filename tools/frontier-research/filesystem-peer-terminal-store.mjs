import { mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { journalEtag } from './durable-peer-terminal-journal.mjs';

const EMPTY = Object.freeze({ schema_version: '1.0.0', terminals: {} });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function syncParentDirectory(directoryPath) {
  if (typeof directoryPath !== 'string' || directoryPath.trim() === '') throw new TypeError('directory-path-required');
  const handle = await open(directoryPath, 'r');
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === 'EPERM';
  }
}

export function createFilesystemPeerTerminalStore({
  path,
  lockTimeoutMs = 5000,
  retryDelayMs = 10,
  syncDirectory = syncParentDirectory,
  faultInjector = async () => {}
}) {
  if (typeof path !== 'string' || path.trim() === '') throw new TypeError('path-required');
  if (!Number.isInteger(lockTimeoutMs) || lockTimeoutMs < 1) throw new TypeError('lock-timeout-positive-integer');
  if (!Number.isInteger(retryDelayMs) || retryDelayMs < 1) throw new TypeError('retry-delay-positive-integer');
  if (typeof syncDirectory !== 'function') throw new TypeError('sync-directory-required');
  if (typeof faultInjector !== 'function') throw new TypeError('fault-injector-required');
  const lockPath = `${path}.lock`;
  const lockOwnerPath = join(lockPath, 'owner.json');

  async function readDocument() {
    try {
      const raw = await readFile(path, 'utf8');
      const document = JSON.parse(raw);
      if (!document || typeof document !== 'object' || Array.isArray(document)) throw new Error('journal-document-invalid');
      return document;
    } catch (error) {
      if (error?.code === 'ENOENT') return EMPTY;
      if (error instanceof SyntaxError) throw new Error('journal-json-invalid', { cause: error });
      throw error;
    }
  }

  async function read() {
    const document = await readDocument();
    return Object.freeze({ document, etag: journalEtag(document) });
  }

  async function recoverDeadOwnerLock() {
    let owner;
    try {
      owner = JSON.parse(await readFile(lockOwnerPath, 'utf8'));
    } catch (error) {
      if (error?.code === 'ENOENT' || error instanceof SyntaxError) return false;
      throw error;
    }
    if (processIsAlive(owner?.pid)) return false;
    const quarantinePath = `${lockPath}.stale.${process.pid}.${randomUUID()}`;
    try {
      await rename(lockPath, quarantinePath);
    } catch (error) {
      if (error?.code === 'ENOENT') return true;
      throw error;
    }
    await rm(quarantinePath, { recursive: true, force: true });
    return true;
  }

  async function acquireLock() {
    const deadline = Date.now() + lockTimeoutMs;
    await mkdir(dirname(path), { recursive: true });
    while (true) {
      try {
        await mkdir(lockPath);
        try {
          await writeFile(lockOwnerPath, `${JSON.stringify({ pid: process.pid, acquired_at: new Date().toISOString() })}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
        } catch (error) {
          await rm(lockPath, { recursive: true, force: true });
          throw error;
        }
        return;
      } catch (error) {
        if (error?.code !== 'EEXIST') throw error;
        if (await recoverDeadOwnerLock()) continue;
        if (Date.now() >= deadline) throw new Error('journal-lock-timeout');
        await sleep(retryDelayMs);
      }
    }
  }

  async function compareAndSet({ expectedEtag, nextEtag, document }) {
    if (typeof expectedEtag !== 'string' || expectedEtag === '') throw new TypeError('expected-etag-required');
    if (typeof nextEtag !== 'string' || nextEtag === '') throw new TypeError('next-etag-required');
    if (!document || typeof document !== 'object' || Array.isArray(document)) throw new TypeError('document-required');
    if (journalEtag(document) !== nextEtag) throw new Error('next-etag-mismatch');

    await acquireLock();
    await faultInjector('after-lock-acquired');
    const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
    let renamed = false;
    try {
      const current = await readDocument();
      if (journalEtag(current) !== expectedEtag) {
        return Object.freeze({ state: 'not-applied', applied: false, reason: 'precondition-failed' });
      }
      const handle = await open(temporaryPath, 'wx', 0o600);
      try {
        await handle.writeFile(`${JSON.stringify(document)}\n`, 'utf8');
        await handle.sync();
      } finally {
        await handle.close();
      }
      await faultInjector('before-rename');
      await rename(temporaryPath, path);
      renamed = true;
      await faultInjector('after-rename-before-directory-sync');
      try {
        await syncDirectory(dirname(path));
      } catch (error) {
        return Object.freeze({
          state: 'indeterminate',
          applied: false,
          reason: 'directory-sync-failed',
          etag: nextEtag,
          error_code: error?.code ?? error?.message ?? 'unknown'
        });
      }
      return Object.freeze({ state: 'applied', applied: true, etag: nextEtag });
    } finally {
      if (!renamed) await rm(temporaryPath, { force: true }).catch(() => {});
      await faultInjector('before-lock-release');
      await rm(lockPath, { recursive: true, force: true });
    }
  }

  return Object.freeze({ read, compareAndSet });
}
