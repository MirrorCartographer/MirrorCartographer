import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';

function assertLeaseMs(leaseMs) {
  if (!Number.isFinite(leaseMs) || leaseMs <= 0) throw new Error('leaseMs must be a positive finite number');
}

async function readOwner(lockPath) {
  try {
    const value = JSON.parse(await readFile(`${lockPath}/owner.json`, 'utf8'));
    if (!value || value.schema_version !== '1.0.0' || typeof value.token !== 'string' || !Number.isFinite(value.expires_at_ms)) {
      return { valid: false, reason: 'invalid-owner-record' };
    }
    return { valid: true, value };
  } catch (error) {
    if (error?.code === 'ENOENT') return { valid: false, reason: 'missing-owner-record' };
    if (error instanceof SyntaxError) return { valid: false, reason: 'invalid-owner-json' };
    throw error;
  }
}

export async function inspectLeaseLock(lockPath, { now = Date.now } = {}) {
  const owner = await readOwner(lockPath);
  if (!owner.valid) return { state: owner.reason === 'missing-owner-record' ? 'absent-or-incomplete' : 'invalid', reason: owner.reason };
  const nowMs = now();
  return {
    state: owner.value.expires_at_ms <= nowMs ? 'expired' : 'active',
    token: owner.value.token,
    owner_id: owner.value.owner_id,
    acquired_at_ms: owner.value.acquired_at_ms,
    expires_at_ms: owner.value.expires_at_ms,
    remaining_ms: Math.max(0, owner.value.expires_at_ms - nowMs)
  };
}

export async function acquireLeaseLock(lockPath, {
  leaseMs = 30_000,
  ownerId = `${process.pid}`,
  now = Date.now,
  tokenFactory = randomUUID,
  maxAttempts = 8
} = {}) {
  assertLeaseMs(leaseMs);
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) throw new Error('maxAttempts must be a positive integer');
  await mkdir(dirname(lockPath), { recursive: true });

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const token = tokenFactory();
    const acquiredAt = now();
    try {
      await mkdir(lockPath);
      const record = {
        schema_version: '1.0.0',
        token,
        owner_id: ownerId,
        acquired_at_ms: acquiredAt,
        expires_at_ms: acquiredAt + leaseMs
      };
      await writeFile(`${lockPath}/owner.json`, `${JSON.stringify(record)}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
      let released = false;
      return {
        record,
        async release() {
          if (released) return false;
          released = true;
          const current = await readOwner(lockPath);
          if (!current.valid || current.value.token !== token) return false;
          await rm(lockPath, { recursive: true, force: true });
          return true;
        }
      };
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        await rm(lockPath, { recursive: true, force: true }).catch(() => {});
        throw error;
      }

      const observed = await inspectLeaseLock(lockPath, { now });
      if (observed.state === 'active') throw new Error(`lease lock is active until ${observed.expires_at_ms}`);
      if (observed.state === 'invalid' || observed.state === 'absent-or-incomplete') {
        throw new Error(`lease lock cannot be recovered safely: ${observed.reason}`);
      }

      const quarantinePath = `${lockPath}.stale-${observed.token}-${token}`;
      try {
        await rename(lockPath, quarantinePath);
        await rm(quarantinePath, { recursive: true, force: true });
      } catch (recoveryError) {
        if (!['ENOENT', 'EEXIST', 'ENOTEMPTY'].includes(recoveryError?.code)) throw recoveryError;
      }
    }
  }
  throw new Error('lease lock acquisition exhausted retry budget');
}
