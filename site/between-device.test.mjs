import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildResidentMessages, extractGeneratedText, MODEL_ID, RESIDENTS } from './expeditions/between-device-contract.mjs';

const html = readFileSync('site/expeditions/between-device.html','utf8');
const worker = readFileSync('site/expeditions/between-device-worker.mjs','utf8');
const room = readFileSync('site/expeditions/between-device-room.mjs','utf8');
const between = readFileSync('site/expeditions/the-between.html','utf8');
const index = readFileSync('site/expeditions/index.html','utf8');

test('the original station residents are distinct rather than overwritten personalities',()=>{
  assert.deepEqual(Object.keys(RESIDENTS).sort(),['morrow','vesper']);
  const a=buildResidentMessages({resident:'morrow',message:'Why did the sky change?'});
  const b=buildResidentMessages({resident:'vesper',message:'Why did the sky change?'});
  assert.match(a[0].content,/Morrow/);
  assert.match(b[0].content,/Vesper/);
  assert.notEqual(a[0].content,b[0].content);
  assert.equal(a.at(-1).content,'Why did the sky change?');
});
test('consented scene cues cannot be converted into diagnoses or forged visitor properties',()=>{
  const a=buildResidentMessages({resident:'morrow',message:'Hi',scene:'storm'});
  assert.match(a[0].content,/storm/);
  assert.match(a[0].content,/not a reading of the visitor/);
  const b=buildResidentMessages({resident:'morrow',message:'Hi',scene:'panic'});
  assert.match(b[0].content,/still/);
  assert.doesNotMatch(b[0].content,/panic/);
});
test('visitor input and context stay bounded and invalid roles are excluded',()=>{
  const history = Array.from({length:20},(_,i)=>({role:i%3===0?'system':'user',content:'turn '+i}));
  const a=buildResidentMessages({resident:'vesper',message:'  Hello  ',history});
  assert.ok(a.length<=8);
  assert.equal(a.at(-1).content,'Hello');
  assert.equal(a.filter(x=>x.role==='system').length,1);
  assert.throws(()=>buildResidentMessages({resident:'tazar',message:'Hi'}));
  assert.throws(()=>buildResidentMessages({resident:'morrow',message:' '.repeat(601)}));
});
test('real model pipeline chat output is parsed safely, not a prewritten answer',()=>{
  const a=extractGeneratedText([{generated_text:[{role:'user',content:'hello'},{role:'assistant',content:'A question!'}]}]);
  assert.equal(a,'A question!');
  assert.throws(()=>extractGeneratedText([{generated_text:'   '}]));
  assert.equal(extractGeneratedText([{generated_text:'<|assistant|>The door is closed.'}]),'The door is closed.');
});
test('model files are downloaded only when visitor clicks, and responses remain browser-local',()=>{
  assert.match(html,/id="load-model"/);
  assert.match(room,/loadButton\.addEventListener\('click'/);
  assert.match(room,/worker\.postMessage\(\{type:'generate'/);
  assert.match(worker,/pipeline\('text-generation', MODEL_ID/);
  assert.match(worker,/device:'webgpu'/);
  assert.match(worker,/device:'wasm'/);
  assert.match(worker,/await engine\(messages/);
  assert.match(worker,/extractGeneratedText\(result\)/);
  assert.match(worker,/model:MODEL_ID/);
  assert.match(worker,/https:\/\/cdn\.jsdelivr\.net\//);
  assert.match(MODEL_ID,/SmolLM2-135M-Instruct/);
  assert.doesNotMatch(room,/localStorage|sessionStorage|indexedDB|fetch\(/);
  assert.doesNotMatch(worker,/localStorage|sessionStorage|indexedDB|fetch\(/);
});
test('the new room exists within the public atlas rather than a broken private deployment',()=>{
  assert.match(html,/between-device-room\.mjs/);
  assert.match(between,/href="\.\/between-device\.html"/);
  assert.match(index,/href="between-device\.html"/);
  assert.match(readFileSync('site/index.html','utf8'),/expeditions\/between-device\.html/);
});
