#!/usr/bin/env node
import crypto from 'node:crypto'
import fs from 'node:fs'

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export function digestReplayLedger(ledger) {
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) {
    throw new TypeError('ledger must be an object')
  }
  return crypto.createHash('sha256').update(stableJson(ledger)).digest('hex')
}

export function authenticateReplayLedger({
  ledger,
  verification,
  expectedRepository = 'MirrorCartographer/MirrorCartographer',
  expectedWorkflowRef = 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main'
} = {}) {
  const digest = digestReplayLedger(ledger)
  const reasons = []

  if (!verification || verification.status !== 'verified') reasons.push('signature_not_verified')
  if (verification?.subject_digest !== digest) reasons.push('ledger_digest_mismatch')
  if (verification?.repository !== expectedRepository) reasons.push('repository_not_trusted')
  if (verification?.workflow_ref !== expectedWorkflowRef) reasons.push('workflow_not_trusted')
  if (verification?.predicate_type !== 'https://slsa.dev/provenance/v1') reasons.push('predicate_type_not_trusted')

  return {
    schema_version: '1.0.0',
    authenticated: reasons.length === 0,
    digest: { algorithm: 'sha256', value: digest },
    reasons,
    trust_limit: 'Authentication binds exact replay-ledger bytes to an independently verified GitHub attestation and trusted repository/workflow identity. It does not prove ledger completeness, freshness, Cloudflare deployment success, or claim truth.'
  }
}

function main() {
  const [ledgerPath, verificationPath, outputPath = 'cloudflare-replay-ledger-authentication.json'] = process.argv.slice(2)
  if (!ledgerPath || !verificationPath) throw new Error('usage: authenticate-replay-ledger.mjs <ledger.json> <verification.json> [output.json]')
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
  const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'))
  const result = authenticateReplayLedger({ ledger, verification })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 })
  process.stdout.write(`${JSON.stringify({ authenticated: result.authenticated, reasons: result.reasons, output: outputPath })}\n`)
  if (!result.authenticated) process.exitCode = 1
}

if (import.meta.url === `file://${process.argv[1]}`) main()
