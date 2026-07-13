#!/usr/bin/env node
import fs from 'node:fs'
import crypto from 'node:crypto'
import { buildReplayLedgerConsumptionDecision } from './build-replay-ledger-consumption-decision.mjs'

function sha256ReplayKey(value) {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`
}

export function buildReplayComparisonInput({
  ledger,
  authentication,
  candidate,
  nowEpochSeconds = Math.floor(Date.now() / 1000),
  maxLedgerAgeSeconds = 86400
} = {}) {
  const consumption = buildReplayLedgerConsumptionDecision({
    ledger,
    authentication,
    nowEpochSeconds,
    maxLedgerAgeSeconds
  })

  const candidateValid = typeof candidate === 'string' && candidate.length > 0 && candidate.length <= 4096
  const reasons = [...consumption.reasons]
  if (!candidateValid) reasons.push('candidate_missing_or_invalid')

  if (!consumption.accepted || !candidateValid) {
    return {
      schema_version: '1.0.0',
      accepted: false,
      replay_detected: null,
      reasons: [...new Set(reasons)],
      observation: {
        active_entry_count: consumption.observation.active_entry_count,
        comparison_performed: false,
        matching_entry_count: 0
      },
      trust_limit: 'A rejected input cannot influence replay acceptance. This adapter does not prove ledger completeness, atomic insertion, deployment success, or claim truth.'
    }
  }

  const candidateDigest = sha256ReplayKey(candidate)
  const activeEntries = ledger.entries.filter((entry) => entry.expires_at > nowEpochSeconds)
  const matchingEntryCount = activeEntries.reduce(
    (count, entry) => count + (crypto.timingSafeEqual(Buffer.from(entry.replay_key), Buffer.from(candidateDigest)) ? 1 : 0),
    0
  )

  return {
    schema_version: '1.0.0',
    accepted: true,
    replay_detected: matchingEntryCount > 0,
    reasons: [],
    observation: {
      active_entry_count: activeEntries.length,
      comparison_performed: true,
      matching_entry_count: matchingEntryCount
    },
    trust_limit: 'A replay match is evidence that the candidate digest appears in the accepted active ledger. A non-match does not prove global uniqueness or atomic insertion.'
  }
}

function main() {
  const [ledgerPath, authenticationPath, candidatePath, outputPath = 'cloudflare-replay-comparison-input.json'] = process.argv.slice(2)
  if (!ledgerPath || !authenticationPath || !candidatePath) {
    throw new Error('usage: build-replay-comparison-input.mjs <ledger.json> <authentication.json> <candidate.txt> [output.json]')
  }

  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
  const authentication = JSON.parse(fs.readFileSync(authenticationPath, 'utf8'))
  const candidate = fs.readFileSync(candidatePath, 'utf8').trim()
  const result = buildReplayComparisonInput({ ledger, authentication, candidate })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 })
  process.stdout.write(`${JSON.stringify({ accepted: result.accepted, replay_detected: result.replay_detected, reasons: result.reasons, output: outputPath })}\n`)
  if (!result.accepted) process.exitCode = 1
}

if (import.meta.url === `file://${process.argv[1]}`) main()
