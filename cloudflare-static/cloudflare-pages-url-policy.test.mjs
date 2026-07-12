import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCloudflarePagesUrlPolicy } from './cloudflare-pages-url-policy.mjs';

test('accepts immutable deployment and production alias', () => {
  const r = evaluateCloudflarePagesUrlPolicy({deployment_url:'https://a1b2c3d4.mirror-cartographer-research.pages.dev',alias_url:'https://mirror-cartographer-research.pages.dev'});
  assert.equal(r.valid,true); assert.equal(r.deployment_kind,'immutable_preview'); assert.equal(r.alias_kind,'production_alias');
});

test('accepts branch alias', () => {
  const r = evaluateCloudflarePagesUrlPolicy({deployment_url:'https://0123456789abcdef.mirror-cartographer-research.pages.dev',alias_url:'https://main.mirror-cartographer-research.pages.dev'});
  assert.equal(r.valid,true); assert.equal(r.alias_kind,'branch_alias');
});

test('rejects lookalike host', () => {
  const r = evaluateCloudflarePagesUrlPolicy({deployment_url:'https://a1b2c3d4.mirror-cartographer-research.pages.dev.evil.example'});
  assert.equal(r.valid,false); assert.ok(r.errors.includes('deployment_url:project_host_mismatch'));
});

test('rejects mutable deployment alias as deployment proof', () => {
  const r = evaluateCloudflarePagesUrlPolicy({deployment_url:'https://main.mirror-cartographer-research.pages.dev'});
  assert.equal(r.valid,false); assert.ok(r.errors.includes('deployment_url:immutable_hash_label_required'));
});

test('rejects path query fragment credentials and port', () => {
  const r = evaluateCloudflarePagesUrlPolicy({deployment_url:'https://u:p@a1b2c3d4.mirror-cartographer-research.pages.dev:444/x?q=1#f'});
  assert.equal(r.valid,false);
  for (const e of ['deployment_url:credentials_forbidden','deployment_url:port_forbidden','deployment_url:origin_only_required']) assert.ok(r.errors.includes(e));
});
