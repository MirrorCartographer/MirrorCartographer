import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { discoverQueueCorpus, runEffectiveQueueDiscovery } from './discover-effective-queue.mjs';

const sh = (cwd, args) => execFileSync('git', args, { cwd, encoding:'utf8' }).trim();

function repo() {
  const cwd = mkdtempSync(path.join(tmpdir(),'eq-'));
  sh(cwd,['init']);
  sh(cwd,['config','user.email','test@example.com']);
  sh(cwd,['config','user.name','Test']);
  mkdirSync(path.join(cwd,'operations/queue-updates'),{recursive:true});
  writeFileSync(path.join(cwd,'operations/ACTIVE_QUEUE.json'),JSON.stringify({schema_version:'1.0.0',updated_at:'2026-07-11T00:00:00Z',items:[{id:'M-001',owner:'continuity_mining',priority:0,status:'completed',action:'base',dependencies:[]}]}));
  writeFileSync(path.join(cwd,'operations/queue-updates/M-002.json'),JSON.stringify({schema_version:'1.0.0',item_id:'M-002',owner:'continuity_mining',priority:0,status:'completed',updated_at:'2026-07-12T00:00:00Z',action:'next',dependencies:['M-001']}));
  sh(cwd,['add','.']);
  sh(cwd,['commit','-m','fixture']);
  return cwd;
}

test('discovers every committed queue update and binds blobs to one commit',()=>{
  const cwd=repo();
  const c=discoverQueueCorpus({cwd});
  assert.match(c.source_commit,/^[0-9a-f]{40}$/);
  assert.equal(c.discovered_update_paths.length,1);
  assert.match(c.updates[0].blob_sha,/^[0-9a-f]{40}$/);
  assert.equal(runEffectiveQueueDiscovery({cwd}).gate_status,'accepted');
});

test('ignores uncommitted queue files when source commit is HEAD',()=>{
  const cwd=repo();
  writeFileSync(path.join(cwd,'operations/queue-updates/M-003.json'),'{}');
  const c=discoverQueueCorpus({cwd,sourceCommit:'HEAD'});
  assert.deepEqual(c.discovered_update_paths,['operations/queue-updates/M-002.json']);
});

test('historical commit remains stable after later commit',()=>{
  const cwd=repo();
  const first=sh(cwd,['rev-parse','HEAD']);
  writeFileSync(path.join(cwd,'operations/queue-updates/M-003.json'),JSON.stringify({schema_version:'1.0.0',item_id:'M-003',owner:'continuity_mining',priority:0,status:'queued',updated_at:'2026-07-13T00:00:00Z',action:'later',dependencies:['M-002']}));
  sh(cwd,['add','.']);
  sh(cwd,['commit','-m','later']);
  const old=discoverQueueCorpus({cwd,sourceCommit:first});
  const now=discoverQueueCorpus({cwd});
  assert.equal(old.discovered_update_paths.length,1);
  assert.equal(now.discovered_update_paths.length,2);
});
