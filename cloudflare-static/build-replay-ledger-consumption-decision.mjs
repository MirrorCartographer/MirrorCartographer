#!/usr/bin/env node
import fs from 'node:fs'

const SHA256_REPLAY_KEY = /^sha256:[a-f0-9]{64}$/

export function buildReplayLedgerConsumptionDecision({
  ledger,
  authentication,
  nowEpochSeconds = Math.floor(Date.now() / 1000),
  maxLedgerAgeSeconds = 86400
} = {}) {
  const reasons = []

  if (!authentication || authentication.authenticated !== true) {
    reasons.push('ledger_not_authenticated')
  }

  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) {
    reasons.push('ledger_not_object')
  }

  if (ledger?.schema_version !== '1.0.0') {
    reasons.push('schema_version_not_supported')
  }

  if (!Number.isInteger(ledger?.generated_at_epoch_seconds)) {
    reasons.push('generated_at_missing_or_invalid')
  } else {
    const age = nowEpochSeconds - ledger.generated_at_epoch_seconds
    if (age < 0) reasons.push('ledger_from_future')
    if (age > maxLedgerAgeSeconds) reasons.push('ledger_stale')
  }

  if (!Array.isArray(ledger?.entries)) {
    reasons.push('entries_not_array')
  }

  const entries = Array.isArray(ledger?.entries) ? ledger.entries : []
  const malformedEntries = entries.filter((entry) => {
    return !entry || typeof entry !== 'object' || Array.isArray(entry)
      || !SHA256_REPLAY_KEY.test(entry.replay_key ?? '')
      || !Number.isInteger(entry.expires_at)
  })

  if (malformedEntries.length > 0) reasons.push('malformed_entries_present')

  const activeEntries = malformedEntries.length === 0
    ? entries.filter((entry) => entry.expires_at > nowEpochSeconds)
    : []

  return {
    schema_version: '1.0.0',
    accepted: reasons.length === 0,
    reasons,
    observation: {
      total_entry_count: entries.length,
      active_entry_count: activeEntries.length,
      expired_entry_count: malformedEntries.length === 0 ? entries.length - activeEntries.length : 0,
      ledger_age_seconds: Number.isInteger(ledger?.generated_at_epoch_seconds)
        ? nowEpochSeconds - ledger.generated_at_epoch_seconds
        : null
    },
    trust_limit: 'Acceptance authorizes a structurally valid, authenticated, sufficiently fresh ledger for replay comparison. It does not prove completeness, deployment success, identity claim truth, or atomic replay insertion.'
  }
}

function main() {
  const [ledgerPath, authenticationPath, outputPath = 'cloudflare-replay-ledger-consumption-decision.json'] = process.argv.slice(2)
  if (!ledgerPath || !authenticationPath) {
    throw new Error('usage: build-replay-ledger-consumption-decision.mjs <ledger.json> <authentication.json> [output.json]')
  }

  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
  const authentication = JSON.parse(fs.readFileSync(authenticationPath, 'utf8'))
  const decision = buildReplayLedgerConsumptionDecision({ ledger, authentication })
  fs.writeFileSync(outputPath, `${JSON.stringify(decision, null, 2)}\n`, { mode: 0o600 })
  process.stdout.write(`${JSON.stringify({ accepted: decision.accepted, reasons: decision.reasons, output: outputPath })}\n`)
  if (!decision.accepted) process.exitCode = 1
}

if (import.meta.url === `file://${process.argv[1]}`) main()
