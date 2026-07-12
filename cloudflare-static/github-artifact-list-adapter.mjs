export function normalizeGitHubArtifactList(payload, expected) {
  const fail = (reason) => ({ ok: false, classification: 'rejected', reason });
  if (!payload || !expected) return fail('missing-input');
  if (!Number.isInteger(expected.run_id) || expected.run_id <= 0) return fail('invalid-expected-run-id');
  if (!/^[0-9a-f]{40}$/.test(expected.commit_sha ?? '')) return fail('invalid-expected-commit');
  if (!Array.isArray(expected.required_names) || expected.required_names.length === 0) return fail('invalid-required-names');
  if (!Array.isArray(payload.artifacts)) return fail('invalid-artifact-payload');

  const names = new Set();
  const artifacts = [];
  for (const artifact of payload.artifacts) {
    if (!artifact || !Number.isInteger(artifact.id) || artifact.id <= 0) return fail('invalid-artifact-id');
    if (typeof artifact.name !== 'string' || artifact.name.length === 0) return fail('invalid-artifact-name');
    if (names.has(artifact.name)) return fail('duplicate-artifact-name');
    names.add(artifact.name);
    if (artifact.expired === true) return fail('expired-artifact');
    if (artifact.workflow_run?.id !== expected.run_id) return fail('artifact-run-mismatch');
    artifacts.push({
      id: artifact.id,
      name: artifact.name,
      size_in_bytes: Number.isInteger(artifact.size_in_bytes) ? artifact.size_in_bytes : null,
      expired: false,
      workflow_run_id: artifact.workflow_run.id,
      archive_download_url: artifact.archive_download_url ?? null
    });
  }

  for (const required of expected.required_names) {
    if (!names.has(required)) return fail(`missing-required-artifact:${required}`);
  }

  return {
    ok: true,
    classification: 'artifact_list_normalized',
    repository: expected.repository,
    commit_sha: expected.commit_sha,
    workflow_run_id: expected.run_id,
    artifacts: artifacts.map((artifact) => artifact.name),
    artifact_records: artifacts,
    claim_boundary: 'Normalizes and validates GitHub artifact-list metadata for one exact workflow run. It does not prove artifact bytes, workflow success, deployment, DNS, served identity, credentials, authorization, or scientific truth.'
  };
}
