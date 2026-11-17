import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CLAIMS,TRIAL_STEP,MAX_TRIALS,initialBooths,changeBooth,evaluateBooths,wilson95} from '../site/companion/atlas/rooms/experiments/004-carnival-of-thought/booth-model.mjs';

test('committee applause cannot change evidence or statistical interval',()=>{
  const s=changeBooth(initialBooths(),'sample'), applause=changeBooth(s,'applause');
  assert.equal(applause.heads,s.heads);
  assert.equal(applause.trials,s.trials);
  assert.deepEqual(wilson95(applause.heads,applause.trials),wilson95(s.heads,s.trials));
  assert.equal(applause.supporters,s.supporters+2);
});
test('simulation uses reproducible fair-coin trials with a hard cap',()=>{
  let a=initialBooths(),b=initialBooths();
  for(let i=0;i<25;i++){a=changeBooth(a,'sample');b=changeBooth(b,'sample');}
  assert.deepEqual(a,b);
  assert.equal(a.trials,MAX_TRIALS);
  assert.ok(a.heads>=0&&a.heads<=a.trials);
  assert.equal(changeBooth(a,'sample').trials,MAX_TRIALS);
});
test('every claim can be selected and evaluated against the same observed sample',()=>{
  let s=changeBooth(initialBooths(),'sample');
  const record={heads:s.heads,trials:s.trials};
  const labels=new Set();
  for(let i=0;i<CLAIMS.length;i++){
    labels.add(evaluateBooths(s).claim.id);
    s=changeBooth(s,'claim');
    assert.equal(s.heads,record.heads);
    assert.equal(s.trials,record.trials);
  }
  assert.equal(labels.size,CLAIMS.length);
});
test('model states an uncertainty boundary instead of equating non-rejection with proof',()=>{
  const x=evaluateBooths(initialBooths());
  assert.equal(x.rejected,false);
  assert.match(x.verdict,/No evidence/);
  assert.match(evaluateBooths(changeBooth(initialBooths(),'sample')).verdict,/synthetic sample|not excluded/);
  assert.equal(TRIAL_STEP,40);
});
test('reset discards all session data and the interval is well formed',()=>{
  let s=changeBooth(changeBooth(initialBooths(),'applause'),'sample');
  assert.deepEqual(changeBooth(s,'reset'),initialBooths());
  const interval=wilson95(20,40);
  assert.ok(interval.low<0.5&&interval.high>0.5);
  assert.equal(wilson95(0,0),null);
  assert.equal(wilson95(6,5),null);
});

test('Carnival page loads the canvas engine and booth module as separate executable scripts',()=>{
 const html=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/index.html','utf8');
 assert.match(html,/<script src="\.\.\/engine\.js"><\/script><script type="module">/);
 assert.doesNotMatch(html,/<script src=\.\.\/engine\.js><script/);
 assert.doesNotMatch(html,/<\/script><\/script>/);
 for(const action of ['claim','applause','sample','reset']) assert.ok(html.includes('data-booth="'+action+'"'));
 assert.ok(html.includes("from './booth-model.mjs'"));
});
