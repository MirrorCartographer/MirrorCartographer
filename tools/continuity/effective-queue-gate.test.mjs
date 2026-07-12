import assert from 'node:assert/strict';
import test from 'node:test';
import { buildEffectiveQueue } from './effective-queue-gate.mjs';

const sha = (c) => c.repeat(40);
const canonical = { schema_version:'1.0.0', updated_at:'2026-07-11T16:51:00-04:00', items:[{id:'M-001',owner:'continuity_mining',priority:0,status:'completed',action:'baseline',dependencies:[]}] };
const makeUpdate = () => ({ schema_version:'1.0.0', item_id:'M-010', owner:'continuity_mining', priority:0, status:'completed', updated_at:'2026-07-12T01:48:00-04:00', action:'implement gate', dependencies:['M-009'] });
function validInput(){ return { source_commit:sha('a'), canonical_queue_blob_sha:sha('b'), canonical_queue:structuredClone(canonical), discovered_update_paths:['operations/queue-updates/M-010.json'], updates:[{path:'operations/queue-updates/M-010.json',blob_sha:sha('c'),record:makeUpdate()}] }; }

test('accepts complete commit-bound corpus',()=>{ const out=buildEffectiveQueue(validInput()); assert.equal(out.gate_status,'accepted'); assert.equal(out.discovered_update_count,1); assert.equal(out.effective_items.some(i=>i.id==='M-010'),true); });
test('rejects omitted parsed update',()=>{ const input=validInput(); input.updates=[]; const out=buildEffectiveQueue(input); assert.equal(out.gate_status,'rejected'); assert.equal(out.rejected_records.some(r=>r.code==='EQG-004'),true); });
test('rejects mutable or malformed source identity',()=>{ const input=validInput(); input.source_commit='main'; const out=buildEffectiveQueue(input); assert.equal(out.gate_status,'rejected'); assert.equal(out.rejected_records.some(r=>r.code==='EQG-001'),true); });
test('rejects unsupported update schema',()=>{ const input=validInput(); input.updates[0].record.schema_version='9.0.0'; const out=buildEffectiveQueue(input); assert.equal(out.gate_status,'rejected'); assert.equal(out.rejected_records.some(r=>r.code==='EQG-003'),true); });
test('rejects ambiguous same-item precedence',()=>{ const input=validInput(); input.discovered_update_paths.push('operations/queue-updates/M-010-conflict.json'); input.updates.push({path:'operations/queue-updates/M-010-conflict.json',blob_sha:sha('d'),record:{...makeUpdate(),status:'active',action:'conflicting state'}}); const out=buildEffectiveQueue(input); assert.equal(out.gate_status,'rejected'); assert.equal(out.contradictions[0].code,'EQG-006'); assert.equal(out.effective_items.length,0); });
test('rejects parsed path absent from discovery',()=>{ const input=validInput(); input.updates[0].path='operations/queue-updates/other.json'; const out=buildEffectiveQueue(input); assert.equal(out.gate_status,'rejected'); assert.equal(out.rejected_records.some(r=>r.code==='EQG-004'),true); });
