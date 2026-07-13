import test from 'node:test'
import assert from 'node:assert/strict'
import { generateKeyPairSync, sign } from 'node:crypto'
import { runGitHubOidcEvidence, DEFAULT_AUDIENCE } from './run-github-oidc-evidence.mjs'

const now = 1_800_000_000
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const jwk = publicKey.export({ format: 'jwk' })
Object.assign(jwk, { kid: 'test-key', alg: 'RS256', use: 'sig', key_ops: ['verify'] })

function encode(value) { return Buffer.from(JSON.stringify(value)).toString('base64url') }
function jwt(claims) {
  const header = encode({ alg: 'RS256', typ: 'JWT', kid: 'test-key' })
  const payload = encode(claims)
  const signature = sign('RSA-SHA256', Buffer.from(`${header}.${payload}`), privateKey).toString('base64url')
  return `${header}.${payload}.${signature}`
}

const env = {
  ACTIONS_ID_TOKEN_REQUEST_URL: 'https://actions.example.test/token',
  ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'request-secret',
  GITHUB_REPOSITORY: 'MirrorCartographer/MirrorCartographer',
  GITHUB_REPOSITORY_ID: '123',
  GITHUB_REPOSITORY_OWNER_ID: '456',
  GITHUB_WORKFLOW_REF: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  GITHUB_WORKFLOW_SHA: 'a'.repeat(40),
  GITHUB_SHA: 'b'.repeat(40),
  GITHUB_REF: 'refs/heads/main',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_ENVIRONMENT: 'cloudflare-research',
  GITHUB_RUN_ID: '789',
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_ACTOR_ID: '999'
}

const claims = {
  iss: 'https://token.actions.githubusercontent.com',
  jti: 'oidc-token-identifier-001',
  aud: DEFAULT_AUDIENCE,
  sub: 'repo:MirrorCartographer/MirrorCartographer:environment:cloudflare-research',
  repository: env.GITHUB_REPOSITORY,
  repository_id: env.GITHUB_REPOSITORY_ID,
  repository_owner_id: env.GITHUB_REPOSITORY_OWNER_ID,
  workflow_ref: env.GITHUB_WORKFLOW_REF,
  workflow_sha: env.GITHUB_WORKFLOW_SHA,
  ref: env.GITHUB_REF,
  event_name: env.GITHUB_EVENT_NAME,
  environment: env.GITHUB_ENVIRONMENT,
  run_id: env.GITHUB_RUN_ID,
  run_attempt: env.GITHUB_RUN_ATTEMPT,
  actor_id: env.GITHUB_ACTOR_ID,
  sha: env.GITHUB_SHA,
  iat: now - 5,
  nbf: now - 5,
  exp: now + 300
}

function response(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'max-age=60', date: new Date(now * 1000).toUTCString() }
  })
}

function fetchFor(tokenClaims) {
  return async (url, options) => {
    const href = String(url)
    if (href.startsWith('https://actions.example.test/token')) {
      assert.equal(options.headers.authorization, 'Bearer request-secret')
      assert.equal(new URL(href).searchParams.get('audience'), DEFAULT_AUDIENCE)
      return response({ value: jwt(tokenClaims) })
    }
    if (href.endsWith('/.well-known/openid-configuration')) {
      return response({ issuer: 'https://token.actions.githubusercontent.com', jwks_uri: 'https://token.actions.githubusercontent.com/.well-known/jwks', id_token_signing_alg_values_supported: ['RS256'] })
    }
    if (href.endsWith('/.well-known/jwks')) return response({ keys: [jwk] })
    throw new Error(`unexpected fetch ${href}`)
  }
}

test('accepts exact signed identity with a fresh JWT ID and emits only a replay digest', async () => {
  const result = await runGitHubOidcEvidence({ env, fetchImpl: fetchFor(claims), nowEpochSeconds: now })
  assert.equal(result.accepted, true)
  assert.equal(result.decision.reason, 'oidc_signature_and_claims_authorized')
  assert.equal(result.replay.reason, 'fresh_token_identifier')
  assert.equal(result.replay.ledger.entries.length, 1)
  assert.equal(JSON.stringify(result).includes(claims.jti), false)
  assert.deepEqual(result.secret_handling, { token_persisted: false, request_token_persisted: false, raw_jti_persisted: false })
  assert.equal(JSON.stringify(result).includes('request-secret'), false)
})

test('rejects the same issuer and JWT ID when it is already live in the supplied ledger', async () => {
  const first = await runGitHubOidcEvidence({ env, fetchImpl: fetchFor(claims), nowEpochSeconds: now })
  const replayed = await runGitHubOidcEvidence({
    env,
    fetchImpl: fetchFor(claims),
    nowEpochSeconds: now + 1,
    priorReplayLedger: first.replay.ledger
  })
  assert.equal(replayed.accepted, false)
  assert.equal(replayed.decision.accepted, true)
  assert.equal(replayed.replay.reason, 'token_replay_detected')
})

test('rejects a signed token when source identity differs before replay acceptance', async () => {
  const badClaims = { ...claims, jti: 'oidc-token-identifier-002', sha: 'c'.repeat(40) }
  const result = await runGitHubOidcEvidence({ env, fetchImpl: fetchFor(badClaims), nowEpochSeconds: now })
  assert.equal(result.accepted, false)
  assert.equal(result.decision.reason, 'oidc_claim_authorization_rejected')
  assert.equal(result.replay.reason, 'identity_not_accepted')
})
