import fs from 'node:fs';

export function verifyPreflightReleasePacket({ manifest, verdict, decision, expected }) {
  const fail = (reason) => ({ ok: false, classification: 'rejected', reason });
  if (!manifest || !verdict || !decision || !expected) return fail('missing-input');
  const sha = expected.commit_sha;
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) return fail('invalid-expected-commit');
  if (manifest.repository !== expected.repository || manifest.commit_sha !== sha) return fail('manifest-source-mismatch');
  if (verdict.ok !== true || verdict.classification !== 'repository_declarations_verified') return fail('verdict-not-verified');
  if (verdict.source?.repository !== expected.repository || verdict.source?.commit_sha !== sha) return fail('verdict-source-mismatch');
  if (decision.allowed !== true || decision.classification !== 'dispatch_ready') return fail('decision-not-ready');
  if (decision.target?.repository !== expected.repository || decision.target?.commit_sha !== sha || decision.target?.ref !== sha) return fail('decision-target-mismatch');
  if (decision.target?.workflow !== '.github/workflows/cloudflare-pages-research.yml') return fail('decision-workflow-mismatch');
  if (decision.preflight?.classification !== verdict.classification) return fail('decision-verdict-mismatch');
  const required = ['cloudflare-environment-preflight-run.json','cloudflare-environment-preflight-verdict.json','cloudflare-dispatch-decision.json'];
  if (!required.every((name) => manifest.artifacts?.includes(name))) return fail('manifest-artifact-set-incomplete');
  return {
    ok: true,
    classification: 'release_packet_verified',
    source: { repository: expected.repository, commit_sha: sha },
    target: decision.target,
    claim_boundary: 'Proves internal coherence of committed preflight evidence and exact-commit dispatch intent only; does not prove credentials, authorization, dispatch execution, deployment, DNS, served identity, or scientific truth.'
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [manifestPath, verdictPath, decisionPath, repository, commitSha, outputPath] = process.argv.slice(2);
  if (![manifestPath, verdictPath, decisionPath, repository, commitSha, outputPath].every(Boolean)) {
    console.error('usage: verify-preflight-release-packet <manifest> <verdict> <decision> <repository> <commit-sha> <output>');
    process.exit(2);
  }
  const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
  const result = verifyPreflightReleasePacket({ manifest: read(manifestPath), verdict: read(verdictPath), decision: read(decisionPath), expected: { repository, commit_sha: commitSha } });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exit(1);
}
