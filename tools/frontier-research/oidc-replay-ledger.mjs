import crypto from 'node:crypto'

function requiredString(value, label) {
  const cleaned = typeof value === 'string' ? value.trim() : ''
  if (!cleaned) throw new Error(`missing_${label}`)
  return cleaned
}

function requiredEpoch(value, label) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`invalid_${label}`)
  return value
}

function normalizeLedger(ledger) {
  if (ledger == null) return { schema_version: '1.0.0', entries: [] }
  if (ledger?.schema_version !== '1.0.0' || !Array.isArray(ledger.entries)) {
    throw new Error('invalid_replay_ledger')
  }
  return ledger
}

export function replayKey({ issuer, jti }) {
  const material = `${requiredString(issuer, 'issuer')}\n${requiredString(jti, 'jti')}`
  return crypto.createHash('sha256').update(material).digest('hex')
}

export function evaluateOidcReplay({
  claims,
  priorLedger,
  nowEpochSeconds = Math.floor(Date.now() / 1000),
  acceptedIdentity = false,
  maxEntries = 1024
} = {}) {
  if (acceptedIdentity !== true) {
    return { accepted: false, reason: 'identity_not_accepted', ledger: normalizeLedger(priorLedger) }
  }
  if (!Number.isInteger(nowEpochSeconds) || nowEpochSeconds <= 0) throw new Error('invalid_now')
  if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new Error('invalid_max_entries')

  const issuer = requiredString(claims?.iss, 'issuer')
  const jti = requiredString(claims?.jti, 'jti')
  const expiresAt = requiredEpoch(claims?.exp, 'exp')
  const runId = requiredString(claims?.run_id, 'run_id')
  const runAttempt = requiredString(String(claims?.run_attempt ?? ''), 'run_attempt')
  const key = replayKey({ issuer, jti })
  const ledger = normalizeLedger(priorLedger)
  const liveEntries = ledger.entries.filter((entry) => Number.isInteger(entry?.expires_at) && entry.expires_at >= nowEpochSeconds)

  if (expiresAt < nowEpochSeconds) {
    return {
      accepted: false,
      reason: 'token_expired',
      replay_key: key,
      ledger: { schema_version: '1.0.0', entries: liveEntries }
    }
  }

  if (liveEntries.some((entry) => entry.replay_key === key)) {
    return {
      accepted: false,
      reason: 'token_replay_detected',
      replay_key: key,
      ledger: { schema_version: '1.0.0', entries: liveEntries }
    }
  }

  const entry = {
    replay_key: key,
    issuer,
    expires_at: expiresAt,
    accepted_at: nowEpochSeconds,
    run_id: runId,
    run_attempt: runAttempt
  }
  const entries = [...liveEntries, entry]
    .sort((a, b) => a.expires_at - b.expires_at || a.replay_key.localeCompare(b.replay_key))
    .slice(-maxEntries)

  return {
    accepted: true,
    reason: 'fresh_token_identifier',
    replay_key: key,
    ledger: { schema_version: '1.0.0', entries },
    trust_limit: 'This stateful check rejects reuse of the same issuer and JWT ID while retained. It does not replace signature, issuer, audience, subject, time, workflow, source, or evidence-truth validation.'
  }
}
