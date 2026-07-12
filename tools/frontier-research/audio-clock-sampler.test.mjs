import test from 'node:test';
import assert from 'node:assert/strict';
import { captureAudioClockSample, sampleAudioClock, gateClockEvidence } from './audio-clock-sampler.mjs';

test('captures standards-shaped timestamp without inventing latency', () => {
  const sample = captureAudioClockSample({ state:'running', currentTime:1.2, getOutputTimestamp(){return {contextTime:1.1,performanceTime:50}} }, { now:()=>55 });
  assert.equal(sample.acquisition, 'available');
  assert.equal(sample.baseLatency, null);
  assert.deepEqual(sample.outputTimestamp, { contextTime:1.1, performanceTime:50 });
});

test('marks unsupported timestamp API explicitly', () => {
  const sample = captureAudioClockSample({ state:'running', currentTime:1 }, { now:()=>10 });
  assert.equal(sample.acquisition, 'timestamp_api_unavailable');
  assert.equal(sample.outputTimestamp, null);
});

test('marks malformed timestamp and fails closed', () => {
  const sample = captureAudioClockSample({ getOutputTimestamp(){return {contextTime:'bad',performanceTime:4}} }, { now:()=>5 });
  assert.equal(sample.acquisition, 'malformed_timestamp');
});

test('sampling is deterministic with injected clocks', async () => {
  let tick=0; const sleeps=[];
  const packet = await sampleAudioClock({ currentTime:0, getOutputTimestamp(){ tick+=1; return {contextTime:tick,performanceTime:tick*10}; } }, { count:2, intervalMs:7, now:()=>tick*10+1, sleep:async(ms)=>sleeps.push(ms) });
  assert.equal(packet.acquisitionStatus, 'available');
  assert.equal(packet.samples.length, 2);
  assert.deepEqual(sleeps, [7]);
});

test('gate bypasses evaluator when acquisition is incomplete', () => {
  let called=false;
  const result=gateClockEvidence({acquisitionStatus:'incomplete',samples:[{}]},()=>{called=true});
  assert.equal(called,false); assert.equal(result.accepted,false);
});

test('gate forwards only consistent evaluation', () => {
  const ok=gateClockEvidence({acquisitionStatus:'available',samples:[{}]},()=>({classification:'consistent'}));
  const no=gateClockEvidence({acquisitionStatus:'available',samples:[{}]},()=>({classification:'contradicted'}));
  assert.equal(ok.accepted,true); assert.equal(no.accepted,false);
});
