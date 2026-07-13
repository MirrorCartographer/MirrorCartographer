import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { authorizeGitHubOidcClaims } from './authorize-github-oidc-claims.mjs'

function plainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export function evaluateGitHubOidcEvidence({ verification, receipt, expectedAudience, nowEpochSeconds } = {}) {
  if (!plainObject(verification)) throw new TypeError('verification must be an object')
  if (!plainObject(receipt)) throw new TypeError('receipt must be an object')

  const signatureVerified = verification.accepted === true && verification.reason === 'signature_verified' && plainObject(verification.claims)
  if (!signatureVerified) {
    return {
      schema_version: '1.0.0',
      accepted: false,
      reason: 'oidc_signature_not_verified',
      signature: {
        accepted: verification.accepted === true,
        reason: verification.reason ?? null,
        kid: verification.kid ?? null,
        algorithm: verification.algorithm ?? null
      },
      authorization: null,
      trust_limit: 'A rejected or incomplete signature verification result cannot be upgraded by claim matching. This result does not prove deployment success, evidence truth, or scientific or medical truth.'
    }
  }

  const authorization = authorizeGitHubOidcClaims({
    claims: verification.claims,
    receipt,
    expectedAudience,
    nowEpochSeconds
  })

  return {
    schema_version: '1.0.0',
    accepted: authorization.accepted === true,
    reason: authorization.accepted ? 'oidc_signature_and_claims_authorized' : 'oidc_claim_authorization_rejected',
    signature: {
      accepted: true,
      reason: verification.reason,
      kid: verification.kid ?? null,
      algorithm: verification.algorithm ?? null
    },
    authorization,
    trust_limit: 'Acceptance proves only that a previously verified GitHub OIDC JWT matched the exact invocation receipt and freshness policy. Replay rejection, deployment success, evidence truth, and scientific or medical truth remain separate requirements.'
  }
}

async function main() {
  const [verificationPath, receiptPath, audience, outputPath = 'cloudflare-github-oidc-evidence.json'] = process.argv.slice(2)
  if (!verificationPath || !receiptPath || !audience) {
    throw new Error('usage: node evaluate-github-oidc-evidence.mjs <verification.json> <receipt.json> <audience> [output.json]')
  }
  const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'))
  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'))
  const result = evaluateGitHubOidcEvidence({ verification, receipt, expectedAudience: audience })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`)
  process.stdout.write(`${JSON.stringify({ accepted: result.accepted, reason: result.reason })}\n`)
  if (!result.accepted) process.exitCode = 1
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
