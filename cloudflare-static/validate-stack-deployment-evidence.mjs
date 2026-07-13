#!/usr/bin/env node
import fs from 'node:fs'

const COMMIT_RE = /^[a-f0-9]{40}$/

function parseHttpsUrl(value) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

function isCloudflareWorkerHostname(hostname) {
  return hostname.endsWith('.workers.dev')
}

function isCloudflarePagesHostname(hostname) {
  return hostname.endsWith('.pages.dev')
}

export function validateStackDeploymentEvidence(evidence, { expectedCommit } = {}) {
  const reasons = []
  if (!evidence || typeof evidence !== 'object') reasons.push('evidence-object-required')
  if (!COMMIT_RE.test(evidence?.source_commit ?? '')) reasons.push('source-commit-invalid')
  if (expectedCommit && evidence?.source_commit !== expectedCommit) reasons.push('source-commit-mismatch')
  if (evidence?.worker?.verification?.ok !== true) reasons.push('worker-identity-proof-missing-or-failed')
  if (evidence?.worker?.concurrency_proof?.accepted !== true || evidence?.worker?.concurrency_proof?.evaluation?.valid !== true) reasons.push('worker-atomicity-proof-missing-or-failed')
  if (evidence?.worker?.redeployment_persistence_proof?.accepted !== true || evidence?.worker?.redeployment_persistence_proof?.evaluation?.valid !== true) reasons.push('worker-redeployment-proof-missing-or-failed')

  const workerUrl = parseHttpsUrl(evidence?.worker?.url)
  const redeployedWorkerUrl = parseHttpsUrl(evidence?.worker?.redeployed_url)
  const pagesUrl = parseHttpsUrl(evidence?.pages?.url)

  if (!workerUrl) reasons.push('worker-url-invalid')
  else if (!isCloudflareWorkerHostname(workerUrl.hostname)) reasons.push('worker-hostname-not-cloudflare')

  if (!redeployedWorkerUrl) reasons.push('redeployed-worker-url-invalid')
  else if (!isCloudflareWorkerHostname(redeployedWorkerUrl.hostname)) reasons.push('redeployed-worker-hostname-not-cloudflare')

  if (!pagesUrl) reasons.push('pages-url-invalid')
  else if (!isCloudflarePagesHostname(pagesUrl.hostname)) reasons.push('pages-hostname-not-cloudflare')

  if (evidence?.pages?.proof_recorded !== true) reasons.push('pages-proof-not-recorded')
  if (evidence?.ordering_invariant !== 'worker-deployed-health-verified-live-atomicity-verified-reservation-created-worker-redeployed-persistence-verified-before-pages-deploy') reasons.push('ordering-invariant-invalid')
  return Object.freeze({ accepted: reasons.length === 0, reasons: Object.freeze(reasons), source_commit: evidence?.source_commit ?? null })
}

function main() {
  const [inputPath = 'cloudflare-stack-deployment-evidence.json', outputPath = 'cloudflare-stack-deployment-evidence-validation.json'] = process.argv.slice(2)
  const evidence = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  const result = validateStackDeploymentEvidence(evidence, { expectedCommit: process.env.GITHUB_SHA })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`)
  if (!result.accepted) {
    console.error(JSON.stringify(result))
    process.exitCode = 2
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main()
