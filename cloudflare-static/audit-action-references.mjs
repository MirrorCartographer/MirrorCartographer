#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const SHA40 = /^[0-9a-f]{40}$/i;
const LOCAL_ACTION = /^(\.\/|docker:\/\/)/;

export function auditActionReferences(workflows) {
  const inputs = Array.isArray(workflows) ? workflows : [];
  const records = [];
  for (const item of inputs) {
    const file = String(item?.file || 'unknown');
    const text = typeof item?.text === 'string' ? item.text : '';
    for (const match of text.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)\s*$/gm)) {
      const ref = match[1];
      if (LOCAL_ACTION.test(ref)) {
        records.push({ file, ref, kind: 'local_or_container', pinned: true, reason: 'not_remote_git_ref' });
        continue;
      }
      const at = ref.lastIndexOf('@');
      const action = at > 0 ? ref.slice(0, at) : ref;
      const version = at > 0 ? ref.slice(at + 1) : '';
      const pinned = SHA40.test(version);
      records.push({
        file,
        ref,
        action,
        version,
        kind: 'remote_action',
        pinned,
        reason: pinned ? 'immutable_commit_sha' : (version ? 'mutable_or_unresolved_ref' : 'missing_ref')
      });
    }
  }
  const remote = records.filter((r) => r.kind === 'remote_action');
  const unpinned = remote.filter((r) => !r.pinned);
  return {
    schema_version: '1.0.0',
    status: unpinned.length === 0 ? 'all_remote_actions_immutable' : 'immutable_pins_required',
    counts: { workflows: inputs.length, references: records.length, remote: remote.length, unpinned: unpinned.length },
    references: records,
    required_resolution: unpinned.map((r) => ({
      file: r.file,
      ref: r.ref,
      action: r.action,
      current_version: r.version,
      requirement: 'Resolve the intended upstream release to an exact 40-character commit SHA, review that commit, then replace the mutable ref.'
    })),
    evidence_strength: 'static_source_observation',
    limits: [
      'A 40-character SHA makes the selected action revision immutable but does not establish that the action is safe.',
      'This audit does not resolve tags, inspect upstream source, verify signatures, or prove workflow execution.',
      'Local and docker action references require separate trust controls.'
    ]
  };
}

function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const output = outputIndex >= 0 ? args[outputIndex + 1] : 'cloudflare-action-reference-audit.json';
  const files = args.filter((_, i) => i !== outputIndex && i !== outputIndex + 1);
  if (!files.length) throw new Error('at least one workflow path is required');
  const result = auditActionReferences(files.map((file) => ({ file, text: fs.readFileSync(file, 'utf8') })));
  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: result.status, unpinned: result.counts.unpinned, output })}\n`);
  process.exitCode = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
