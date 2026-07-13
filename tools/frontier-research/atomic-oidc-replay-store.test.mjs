import assert from 'node:assert/strict'
import test from 'node:test'
import { acceptReplayOnce, initializeReplayStore, REPLAY_TABLE_SQL } from './atomic-oidc-replay-store.mjs'

class FakeAtomicSql {
  constructor() {
    this.rows = new Map()
    this.initialized = false
  }

  exec(query, ...bindings) {
    if (query === REPLAY_TABLE_SQL) {
      this.initialized = true
      return { toArray: () => [] }
    }
    if (!this.initialized) throw new Error('store_not_initialized')
    if (query.startsWith('DELETE FROM oidc_replay')) {
      const [now] = bindings
      for (const [key, row] of this.rows) if (row.expires_at < now) this.rows.delete(key)
      return { toArray: () => [] }
    }
    if (query.includes('INSERT INTO oidc_replay')) {
      const [key, issuer, expiresAt, acceptedAt, runId, runAttempt] = bindings
      if (this.rows.has(key)) return { toArray: () => [] }
      this.rows.set(key, { replay_key: key, issuer, expires_at: expiresAt, accepted_at: acceptedAt, run_id: runId, run_attempt: runAttempt })
      return { toArray: () => [{ replay_key: key }] }
    }
    throw new Error('unexpected_query')
  }
}

const entry = {
  replay_key: 'a'.repeat(64),
  issuer: 'https://token.actions.githubusercontent.com',
  expires_at: 2000,
  accepted_at: 1000,
  run_id: '12345',
  run_attempt: '1'
}

test('initializes a primary-key replay table and expiry index', () => {
  const sql = new FakeAtomicSql()
  initializeReplayStore(sql)
  assert.equal(sql.initialized, true)
  assert.match(REPLAY_TABLE_SQL, /replay_key TEXT PRIMARY KEY/)
  assert.match(REPLAY_TABLE_SQL, /expires_at_idx/)
})

test('accepts the first unique replay key', () => {
  const sql = new FakeAtomicSql(); initializeReplayStore(sql)
  const result = acceptReplayOnce({ sql, entry, nowEpochSeconds: 1000 })
  assert.equal(result.accepted, true)
  assert.equal(result.reason, 'atomic_unique_insert')
})

test('rejects every duplicate after one winner', async () => {
  const sql = new FakeAtomicSql(); initializeReplayStore(sql)
  const attempts = await Promise.all(Array.from({ length: 32 }, async () => acceptReplayOnce({ sql, entry, nowEpochSeconds: 1000 })))
  assert.equal(attempts.filter((result) => result.accepted).length, 1)
  assert.equal(attempts.filter((result) => result.reason === 'token_replay_detected').length, 31)
})

test('prunes expired state before accepting a reused derived key', () => {
  const sql = new FakeAtomicSql(); initializeReplayStore(sql)
  assert.equal(acceptReplayOnce({ sql, entry, nowEpochSeconds: 1000 }).accepted, true)
  const renewed = { ...entry, expires_at: 4000, accepted_at: 3000, run_id: '67890', run_attempt: '2' }
  assert.equal(acceptReplayOnce({ sql, entry: renewed, nowEpochSeconds: 3000 }).accepted, true)
})

test('rejects an already expired token without inserting it', () => {
  const sql = new FakeAtomicSql(); initializeReplayStore(sql)
  const result = acceptReplayOnce({ sql, entry: { ...entry, expires_at: 999 }, nowEpochSeconds: 1000 })
  assert.deepEqual(result, { accepted: false, reason: 'token_expired', replay_key: entry.replay_key })
  assert.equal(sql.rows.size, 0)
})
