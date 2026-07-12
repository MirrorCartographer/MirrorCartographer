import { createHash, randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { open, readFile, mkdir, rename, rm, readdir } from 'node:fs/promises';

export function canonicalJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function rootDigest(root) {
  return createHash('sha256').update(canonicalJson(root)).digest('hex');
}

async function syncDirectory(path) {
  const handle = await open(path, 'r');
  try { await handle.sync(); } finally { await handle.close(); }
}

async function acquireLock(lockPath) {
  try {
    await mkdir(lockPath);
    return async () => { await rm(lockPath, { recursive: true, force: true }); };
  } catch (error) {
    if (error?.code === 'EEXIST') throw new Error('trusted-root store is locked');
    throw error;
  }
}

export async function readTrustedRoot(storePath) {
  try {
    const bytes = await readFile(storePath, 'utf8');
    const record = JSON.parse(bytes);
    if (!record || record.schema_version !== '1.0.0' || !record.root || typeof record.digest !== 'string') {
      throw new Error('invalid trusted-root record');
    }
    const actual = rootDigest(record.root);
    if (actual !== record.digest) throw new Error('trusted-root digest mismatch');
    return record;
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

export async function recoverTrustedRootStore(storePath) {
  const directory = dirname(storePath);
  await mkdir(directory, { recursive: true });
  const prefix = `${storePath.split('/').pop()}.tmp-`;
  for (const name of await readdir(directory)) {
    if (name.startsWith(prefix)) await rm(join(directory, name), { force: true });
  }
  return readTrustedRoot(storePath);
}

export async function compareAndSwapTrustedRoot({ storePath, expectedDigest = null, nextRoot }) {
  if (!nextRoot || typeof nextRoot !== 'object') throw new Error('nextRoot must be an object');
  const directory = dirname(storePath);
  const lockPath = `${storePath}.lock`;
  await mkdir(directory, { recursive: true });
  const release = await acquireLock(lockPath);
  const tempPath = `${storePath}.tmp-${process.pid}-${randomUUID()}`;
  try {
    const current = await readTrustedRoot(storePath);
    const currentDigest = current?.digest ?? null;
    if (currentDigest !== expectedDigest) {
      throw new Error(`compare-and-swap conflict: expected ${expectedDigest ?? 'null'}, found ${currentDigest ?? 'null'}`);
    }
    const record = {
      schema_version: '1.0.0',
      digest: rootDigest(nextRoot),
      previous_digest: currentDigest,
      root: nextRoot
    };
    const handle = await open(tempPath, 'wx', 0o600);
    try {
      await handle.writeFile(`${canonicalJson(record)}\n`, 'utf8');
      await handle.sync();
    } finally {
      await handle.close();
    }
    await rename(tempPath, storePath);
    await syncDirectory(directory);
    return record;
  } finally {
    await rm(tempPath, { force: true });
    await release();
  }
}
