#!/usr/bin/env node
import fs from 'node:fs'

export function evaluateReplayAdmission({ comparison, reservation } = {}) {
  const reasons = []

  if (!comparison || typeof comparison !== 'object' || Array.isArray(comparison)) {
    reasons.push('comparison_not_object')
  }
  if (comparison?.schema_version !== '1.0.0') reasons.push('comparison_schema_not_supported')
  if (comparison?.accepted !== true) reasons.push('comparison_not_accepted')
  if (comparison?.replay_detected === true) reasons.push('replay_detected')
  if (comparison?.replay_detected !== false) reasons.push('replay_result_not_negative')
  if (comparison?.observation?.comparison_performed !== true) reasons.push('comparison_not_performed')

  if (!reservation || typeof reservation !== 'object' || Array.isArray(reservation)) {
    reasons.push('reservation_not_object')
  }
  if (reservation?.schema_version !== '1.0.0') reasons.push('reservation_schema_not_supported')
  if (reservation?.atomic !== true) reasons.push('reservation_not_atomic')
  if (reservation?.confirmed !== true) reasons.push('reservation_not_confirmed')
  if (typeof reservation?.reservation_id !== 'string' || reservation.reservation_id.length < 8 || reservation.reservation_id.length > 256) {
    reasons.push('reservation_id_missing_or_invalid')
  }

  const uniqueReasons = [...new Set(reasons)]
  return {
    schema_version: '1.0.0',
    admitted: uniqueReasons.length === 0,
    reasons: uniqueReasons,
    observation: {
      comparison_accepted: comparison?.accepted === true,
      replay_detected: comparison?.replay_detected ?? null,
      comparison_performed: comparison?.observation?.comparison_performed === true,
      atomic_reservation_confirmed: reservation?.atomic === true && reservation?.confirmed === true,
      reservation_id_present: typeof reservation?.reservation_id === 'string' && reservation.reservation_id.length >= 8 && reservation.reservation_id.length <= 256
    },
    trust_limit: 'Admission requires both an accepted negative replay comparison and a confirmed atomic reservation. It does not prove ledger completeness, durable reservation persistence, deployment success, identity truth, or scientific claim truth.'
  }
}

function main() {
  const [comparisonPath, reservationPath, outputPath = 'cloudflare-replay-admission.json'] = process.argv.slice(2)
  if (!comparisonPath || !reservationPath) {
    throw new Error('usage: evaluate-replay-admission.mjs <comparison.json> <reservation.json> [output.json]')
  }

  const comparison = JSON.parse(fs.readFileSync(comparisonPath, 'utf8'))
  const reservation = JSON.parse(fs.readFileSync(reservationPath, 'utf8'))
  const result = evaluateReplayAdmission({ comparison, reservation })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 })
  process.stdout.write(`${JSON.stringify({ admitted: result.admitted, reasons: result.reasons, output: outputPath })}\n`)
  if (!result.admitted) process.exitCode = 1
}

if (import.meta.url === `file://${process.argv[1]}`) main()
