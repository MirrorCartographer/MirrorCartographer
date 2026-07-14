import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256Utf8, validateEnumerationWitness } from '../continuity/validate-queue-update-enumeration-witness.mjs';

const commitA = 'a'.repeat(40);
const commitB = 'b'.repeat(40);
const blob = 'c'.repeat(40);
const path = 'operations/queue-updates/example.json';
const content = '{"ok":true}\n';

function fixture() {
  return {
    witness: {
      schema_version:'1.0.0', repository:'MirrorCartographer/MirrorCartographer',
      base_commit:commitA, inclusive_terminal_commit:commitB,
      path_pattern:'operations/queue-updates/*.json', discovery_complete:true,
      enumeration_method:'authenticated paginated history traversal', claim_state:'observed',
      privacy_class:'public_repository_metadata', falsification_route:'repeat traversal and compare digests',
      discovered_entries:[{path,first_seen_commit:commitA,blob_sha:blob,sha256:sha256Utf8(content),classification:'applied',classification_reason:'valid owned update'}]
    },
    evidence: {
      __eligible_paths:[path], __base_reaches_terminal:true,
      [path]:{content,blob_sha:blob,first_seen_commit:commitA,reachable_from_base:true,no_later_than_terminal:true}
    }
  };
}

test('accepts a fully evidenced witness', () => {
  const {witness,evidence}=fixture();
  assert.deepEqual(validateEnumerationWitness(witness,evidence),{ok:true,errors:[]});
});

test('rejects omitted independently enumerated paths', () => {
  const {witness,evidence}=fixture(); evidence.__eligible_paths.push('operations/queue-updates/omitted.json');
  assert.equal(validateEnumerationWitness(witness,evidence).ok,false);
});

test('rejects digest drift', () => {
  const {witness,evidence}=fixture(); evidence[path].content='changed';
  assert.match(validateEnumerationWitness(witness,evidence).errors.join('\n'),/sha256 mismatch/);
});

test('rejects unproven history horizon', () => {
  const {witness,evidence}=fixture(); evidence.__base_reaches_terminal=false;
  assert.match(validateEnumerationWitness(witness,evidence).errors.join('\n'),/reachability not proven/);
});
