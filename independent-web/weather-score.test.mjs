import test from 'node:test';
import assert from 'node:assert/strict';
import {WeatherScore,scoreFrequency} from './weather-score.mjs';

test('keeps only the newest bounded events',()=>{
  const score=new WeatherScore({limit:3});
  for(let i=0;i<5;i++)score.add({x:i/4,y:.5,force:.4,at:i});
  assert.equal(score.points().length,3);
  assert.deepEqual(score.points().map(event=>event.at),[2,3,4]);
});

test('clamps unsafe coordinates and force',()=>{
  const score=new WeatherScore();
  assert.deepEqual(score.add({x:-2,y:4,force:9,at:1}),{x:0,y:1,force:1,at:1});
});

test('produces deterministic weighted weather state',()=>{
  const score=new WeatherScore();
  score.add({x:.1,y:.8,force:.2,at:100});
  score.add({x:.9,y:.2,force:.8,at:700});
  const snapshot=score.snapshot();
  assert.equal(snapshot.count,2);
  assert.equal(snapshot.span,600);
  assert.equal(snapshot.temperament,'weathering');
  assert.ok(snapshot.centroid.x>.65);
  assert.ok(snapshot.centroid.y<.4);
});

test('derives bounded equal-tempered pitch movement',()=>{
  assert.equal(scoreFrequency(220,{interval:12}),440);
  assert.equal(scoreFrequency(220,{interval:99}),440);
  assert.equal(scoreFrequency(220,{interval:-12}),110);
});

test('clear returns the score to an unwritten state',()=>{
  const score=new WeatherScore();
  score.add({x:.5,y:.5,force:1,at:1});
  score.clear();
  assert.deepEqual(score.snapshot(),{count:0,centroid:{x:.5,y:.5},meanForce:0,span:0,interval:0,temperament:'unwritten'});
});
