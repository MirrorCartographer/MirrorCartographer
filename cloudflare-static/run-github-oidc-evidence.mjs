import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { verifyGitHubOidcJwtWithNetwork } from '../tools/frontier-research/github-oidc-metadata-client.mjs'
import { evaluateOidcReplay } from '../tools/frontier-research/oidc-replay-ledger.mjs'
import { evaluateGitHubOidcEvidence } from './evaluate-github-oidc-evidence.mjs'

export const DEFAULT_AUDIENCE = 'mirror-cartographer-cloudflare-research'

function required(value, label) {
  const cleaned = typeof value === 'string' ? value.trim() : ''
  if (!cleaned) throw new Error(`missing_${label}`)
  return cleaned
}

export function buildInvocationReceipt(env = process.env) {
  const repository = required(env.GITHUB_REPOSITORY, 'github_repository')
  const workflowRef = required(env.GITHUB_WORKFLOW_REF, 'github_workflow_ref')
  const workflowSha = required(env.GITHUB_WORKFLOW_SHA, 'github_workflow_sha')
  const sourceSha = required(env.GITHUB_SHA, 'github_sha')
  const environment = required(env.GITHUB_ENVIRONMENT || 'cloudflare-research', 'github_environment')

  return {
    schema_version: '1.0.0',
    accepted: true,
    invocation: {
      repository,
      repository_id: required(env.GITHUB_REPOSITORY_ID, 'github_repository_id'),
      repository_owner_id: required(env.GITHUB_REPOSITORY_OWNER_ID, 'github_repository_owner_id'),
      workflow_ref: workflowRef,
      workflow_sha: workflowSha,
      ref: required(env.GITHUB_REF, 'github_ref'),
      event_name: required(env.GITHUB_EVENT_NAME, 'github_event_name'),
      environment,
      run_id: required(env.GITHUB_RUN_ID, 'github_run_id'),
      run_attempt: Number(required(env.GITHUB_RUN_ATTEMPT, 'github_run_attempt')),
      actor_id: required(env.GITHUB_ACTOR_ID, 'github_actor_id'),
      source_sha: sourceSha
    },
    trust_limit: 'This receipt records workflow context supplied by GitHub Actions. It is accepted only when a signed GitHub OIDC token independently matches every recorded field.'
  }
}

export async function requestGitHubOidcToken({ audience = DEFAULT_AUDIENCE, env = process.env, fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function')
  const requestUrl = new URL(required(env.ACTIONS_ID_TOKEN_REQUEST_URL, 'actions_id_token_request_url'))
  requestUrl.searchParams.set('audience', required(audience, 'audience'))
  const requestToken = required(env.ACTIONS_ID_TOKEN_REQUEST_TOKEN, 'actions_id_token_request_token')
  const response = await fetchImpl(requestUrl, {
    method: 'GET',
    redirect: 'error',
    headers: { authorization: `Bearer ${requestToken}`, accept: 'application/json' }
  })
  if (!response.ok) throw new Error(`oidc_token_request_failed_${response.status}`)
  const body = await response.json()
  return required(body?.value, 'oidc_token_value')
}

export async function runGitHubOidcEvidence({
  audience = DEFAULT_AUDIENCE,
  env = process.env,
  fetchImpl = globalThis.fetch,
  nowEpochSeconds,
  priorReplayLedger = null
} = {}) {
  const receipt = buildInvocationReceipt(env)
  const token = await requestGitHubOidcToken({ audience, env, fetchImpl })
  const verification = await verifyGitHubOidcJwtWithNetwork({ token, fetchImpl })
  const decision = evaluateGitHubOidcEvidence({ verification, receipt, expectedAudience: audience, nowEpochSeconds })
  const replay = evaluateOidcReplay({
    claims: verification.claims,
    priorLedger: priorReplayLedger,
    nowEpochSeconds,
    acceptedIdentity: decision.accepted === true
  })
  const accepted = decision.accepted === true && replay.accepted === true

  return {
    schema_version: '1.1.0',
    accepted,
    audience,
    receipt,
    verification: {
      accepted: verification.accepted === true,
      reason: verification.reason ?? null,
      stage: verification.stage ?? null,
      algorithm: verification.algorithm ?? null,
      kid: verification.kid ?? null,
      refresh_count: verification.refresh_count ?? null
    },
    decision,
    replay: {
      accepted: replay.accepted,
      reason: replay.reason,
      replay_key: replay.replay_key ?? null,
      ledger: replay.ledger,
      trust_limit: replay.trust_limit ?? null
    },
    secret_handling: {
      token_persisted: false,
      request_token_persisted: false,
      raw_jti_persisted: false
    },
    trust_limit: 'Acceptance proves a signed, fresh GitHub Actions identity matched this invocation and its issuer/JWT-ID pair was not already present in the supplied live replay ledger. Durable cross-run replay rejection still depends on authenticated retention and retrieval of the prior ledger. Cloudflare deployment success, evidence truth, and scientific or medical truth remain separate.'
  }
}

async function main() {
  const [outputPath = 'cloudflare-github-oidc-evidence.json', audience = DEFAULT_AUDIENCE, priorLedgerPath = ''] = process.argv.slice(2)
  const priorReplayLedger = priorLedgerPath ? JSON.parse(fs.readFileSync(priorLedgerPath, 'utf8')) : null
  const result = await runGitHubOidcEvidence({ audience, priorReplayLedger })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 })
  process.stdout.write(`${JSON.stringify({ accepted: result.accepted, identity_reason: result.decision.reason, replay_reason: result.replay.reason, output: outputPath })}\n`)
  if (!result.accepted) process.exitCode = 1
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
