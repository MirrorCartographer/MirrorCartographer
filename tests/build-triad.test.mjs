import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkDecision,run} from '../tools/verify-build-triad.mjs';
const original=JSON.parse(readFileSync(new URL('../docs/decision-records/2026-11-16-crooked-score.json',import.meta.url)));
test('source, interpretation and idea are distinct mandatory versioned lanes',()=>{
 const result=run(new URL('..',import.meta.url).pathname);assert.equal(result.records,1);assert.equal(result.semanticMeaningMachineVerified,false);
});
test('cannot convert a hypothesis into a fact or erase the alternative',()=>{
 const changed=structuredClone(original);changed.interpretation.status='verified';assert.ok(checkDecision(changed,new URL('..',import.meta.url).pathname).length>0);
});
test('private exact source cannot become website copy in this ledger',()=>{
 const changed=structuredClone(original);changed.exact_copy.literal_source_public=true;assert.ok(checkDecision(changed,new URL('..',import.meta.url).pathname).length>0);
});
test('a description without working implementation paths is not a passed build',()=>{
 const changed=structuredClone(original);changed.idea.source_paths=['site/fictional-museum.html'];assert.ok(checkDecision(changed,new URL('..',import.meta.url).pathname).length>0);
});