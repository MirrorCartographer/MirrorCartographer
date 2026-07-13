import crypto from 'node:crypto'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

const REQUIRED_FIELDS = [
  'repository','repository_id','repository_owner_id','workflow_ref','workflow_sha','ref','event_name','environment','run_id','run_attempt','run_number','actor_id','triggering_actor','source_sha'
]

function clean(value) { return typeof value === 'string' ? value.trim() : '' }
function assertObject(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be an object`) }
function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`
  return JSON.stringify(value)
}

export function buildWorkflowInvocationReceipt({ context, policy, generatedAt }) {
  assertObject(context, 'context'); assertObject(policy, 'policy')
  const missing = REQUIRED_FIELDS.filter((field) => clean(context[field]) === '')
  const runAttempt = Number(context.run_attempt); const runNumber = Number(context.run_number)
  const numericIdentity = Number.isInteger(runAttempt) && runAttempt > 0 && Number.isInteger(runNumber) && runNumber > 0
  const exactFields = ['repository','repository_id','repository_owner_id','workflow_ref','ref','event_name','environment'].map((field) => ({
    field, expected: clean(policy[field]), actual: clean(context[field]), accepted: clean(policy[field]) !== '' && clean(context[field]) === clean(policy[field])
  }))
  const workflowShaAccepted = /^[0-9a-f]{40}$/.test(clean(context.workflow_sha))
  const sourceShaAccepted = /^[0-9a-f]{40}$/.test(clean(context.source_sha))
  const actorAccepted = clean(context.actor_id) !== '' && clean(context.triggering_actor) !== ''
  const accepted = policy.enabled === true && missing.length === 0 && numericIdentity && exactFields.every((entry) => entry.accepted) && workflowShaAccepted && sourceShaAccepted && actorAccepted
  const invocation = {
    repository: clean(context.repository), repository_id: clean(context.repository_id), repository_owner_id: clean(context.repository_owner_id),
    workflow_ref: clean(context.workflow_ref), workflow_sha: clean(context.workflow_sha), ref: clean(context.ref), event_name: clean(context.event_name),
    environment: clean(context.environment), run_id: clean(context.run_id), run_attempt: runAttempt, run_number: runNumber,
    actor_id: clean(context.actor_id), triggering_actor: clean(context.triggering_actor), source_sha: clean(context.source_sha)
  }
  const replayKey = accepted ? crypto.createHash('sha256').update(canonicalize({ repository_id: invocation.repository_id, workflow_sha: invocation.workflow_sha, run_id: invocation.run_id, run_attempt: invocation.run_attempt, source_sha: invocation.source_sha })).digest('hex') : null
  return {
    schema_version:'1.0.0', generated_at:generatedAt, accepted, reason:accepted?'workflow_context_bound':'workflow_context_rejected', missing_fields:missing,
    exact_fields:exactFields, structural_checks:{numeric_run_identity:numericIdentity,workflow_sha:workflowShaAccepted,source_sha:sourceShaAccepted,actor_identity:actorAccepted},
    invocation, replay_key_sha256:replayKey, source_status:'github_actions_context_unverified_by_oidc',
    trust_limit:'This receipt binds GitHub Actions context values and creates a deterministic replay key. It does not verify an OIDC JWT signature, prove that the context originated from GitHub, prove deployment success, or establish scientific or medical truth.'
  }
}

export function contextFromEnvironment(env) {
  return { repository:env.GITHUB_REPOSITORY, repository_id:env.GITHUB_REPOSITORY_ID, repository_owner_id:env.GITHUB_REPOSITORY_OWNER_ID,
    workflow_ref:env.GITHUB_WORKFLOW_REF, workflow_sha:env.GITHUB_WORKFLOW_SHA, ref:env.GITHUB_REF, event_name:env.GITHUB_EVENT_NAME,
    environment:env.CLOUDFLARE_DEPLOYMENT_ENVIRONMENT, run_id:env.GITHUB_RUN_ID, run_attempt:env.GITHUB_RUN_ATTEMPT,
    run_number:env.GITHUB_RUN_NUMBER, actor_id:env.GITHUB_ACTOR_ID, triggering_actor:env.GITHUB_TRIGGERING_ACTOR, source_sha:env.GITHUB_SHA }
}

export function policyFromEnvironment(env) {
  return { enabled:true, repository:'MirrorCartographer/MirrorCartographer', repository_id:'1014575224', repository_owner_id:'216780403',
    workflow_ref:`MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@${env.GITHUB_REF}`,
    ref:'refs/heads/main', event_name:'workflow_dispatch', environment:'cloudflare-research' }
}

async function main() {
  const outputPath = process.argv[2] || 'cloudflare-workflow-invocation-receipt.json'
  const receipt = buildWorkflowInvocationReceipt({ context:contextFromEnvironment(process.env), policy:policyFromEnvironment(process.env), generatedAt:new Date().toISOString() })
  fs.writeFileSync(outputPath, `${JSON.stringify(receipt,null,2)}\n`)
  process.stdout.write(`${JSON.stringify({accepted:receipt.accepted,reason:receipt.reason,replay_key_sha256:receipt.replay_key_sha256})}\n`)
  if (!receipt.accepted) process.exitCode = 1
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
