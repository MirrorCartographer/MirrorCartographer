const SHA40 = /^[a-f0-9]{40}$/;
const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${label} must be a non-empty string`);
  return value.trim();
}

export function buildGhAttestationVerifyArgs({
  artifactPath,
  repository,
  signerWorkflow,
  sourceDigest,
  predicateType = 'https://slsa.dev/provenance/v1',
  denySelfHostedRunners = true,
}) {
  const artifact = requireString(artifactPath, 'artifactPath');
  const repo = requireString(repository, 'repository');
  const workflow = requireString(signerWorkflow, 'signerWorkflow');
  const digest = requireString(sourceDigest, 'sourceDigest').toLowerCase();
  const predicate = requireString(predicateType, 'predicateType');

  if (!REPO.test(repo)) throw new TypeError('repository must use owner/name form');
  if (!workflow.includes(repo) || !workflow.includes('/.github/workflows/')) {
    throw new Error('signerWorkflow must identify an exact workflow path in repository');
  }
  if (!SHA40.test(digest)) throw new TypeError('sourceDigest must be a lowercase 40-character git commit SHA');

  const args = [
    'attestation', 'verify', artifact,
    '--repo', repo,
    '--signer-workflow', workflow,
    '--source-digest', digest,
    '--predicate-type', predicate,
    '--format', 'json',
  ];
  if (denySelfHostedRunners) args.push('--deny-self-hosted-runners');
  return Object.freeze(args);
}

export function assessGhAttestationVerifyArgs(args) {
  if (!Array.isArray(args)) throw new TypeError('args must be an array');
  const required = ['--repo', '--signer-workflow', '--source-digest', '--predicate-type', '--format'];
  const missing = required.filter((flag) => !args.includes(flag));
  const formatIndex = args.indexOf('--format');
  if (formatIndex === -1 || args[formatIndex + 1] !== 'json') missing.push('--format=json');
  const sourceIndex = args.indexOf('--source-digest');
  const sourceDigest = sourceIndex >= 0 ? args[sourceIndex + 1] : null;
  const exactSource = typeof sourceDigest === 'string' && SHA40.test(sourceDigest);
  const denySelfHosted = args.includes('--deny-self-hosted-runners');
  return {
    accepted: missing.length === 0 && exactSource && denySelfHosted,
    missing: [...new Set(missing)],
    exactSource,
    denySelfHosted,
    trustLimit: 'Command policy constrains verifier inputs; it does not establish that workflow-controlled predicate claims or downstream deployment/scientific claims are true.',
  };
}
