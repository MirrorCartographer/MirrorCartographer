function requiredString(value, label) {
  const cleaned = typeof value === 'string' ? value.trim() : ''
  if (!cleaned) throw new Error(`missing_${label}`)
  return cleaned
}

function requiredEpoch(value, label) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`invalid_${label}`)
  return value
}

export const REPLAY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS oidc_replay (
  replay_key TEXT PRIMARY KEY,
  issuer TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER NOT NULL,
  run_id TEXT NOT NULL,
  run_attempt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS oidc_replay_expires_at_idx
  ON oidc_replay(expires_at);
`.trim()

export function initializeReplayStore(sql) {
  if (!sql || typeof sql.exec !== 'function') throw new Error('invalid_sql_adapter')
  sql.exec(REPLAY_TABLE_SQL)
}

export function acceptReplayOnce({ sql, entry, nowEpochSeconds = Math.floor(Date.now() / 1000) } = {}) {
  if (!sql || typeof sql.exec !== 'function') throw new Error('invalid_sql_adapter')
  if (!Number.isInteger(nowEpochSeconds) || nowEpochSeconds <= 0) throw new Error('invalid_now')

  const replayKey = requiredString(entry?.replay_key, 'replay_key')
  const issuer = requiredString(entry?.issuer, 'issuer')
  const expiresAt = requiredEpoch(entry?.expires_at, 'expires_at')
  const acceptedAt = requiredEpoch(entry?.accepted_at, 'accepted_at')
  const runId = requiredString(entry?.run_id, 'run_id')
  const runAttempt = requiredString(entry?.run_attempt, 'run_attempt')

  sql.exec('DELETE FROM oidc_replay WHERE expires_at < ?', nowEpochSeconds)

  if (expiresAt < nowEpochSeconds) {
    return { accepted: false, reason: 'token_expired', replay_key: replayKey }
  }

  const inserted = sql.exec(
    `INSERT INTO oidc_replay
      (replay_key, issuer, expires_at, accepted_at, run_id, run_attempt)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(replay_key) DO NOTHING
     RETURNING replay_key`,
    replayKey,
    issuer,
    expiresAt,
    acceptedAt,
    runId,
    runAttempt
  ).toArray()

  if (inserted.length === 1 && inserted[0]?.replay_key === replayKey) {
    return {
      accepted: true,
      reason: 'atomic_unique_insert',
      replay_key: replayKey,
      trust_limit: 'Atomic replay acceptance prevents duplicate use of one derived token identifier. It does not validate token signatures, claims, workflow authorization, deployment success, or evidence truth.'
    }
  }

  if (inserted.length === 0) {
    return { accepted: false, reason: 'token_replay_detected', replay_key: replayKey }
  }

  throw new Error('invalid_insert_result')
}
