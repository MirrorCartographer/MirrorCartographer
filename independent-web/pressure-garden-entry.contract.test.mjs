import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('./index.html',import.meta.url),'utf8');

test('Pressure Garden entry is hidden until the finite score is complete',()=>{
  assert.match(source,/id="garden"[^>]+href="\.\/pressure-garden\/"[^>]+aria-hidden="true"[^>]+tabindex="-1"/);
  assert.match(source,/function revealGarden\(memory\)\{if\(gardenOpen\|\|memory\.count<8\)return;/);
  assert.match(source,/garden\.classList\.add\('revealed'\)/);
  assert.match(source,/garden\.setAttribute\('aria-hidden','false'\)/);
  assert.match(source,/garden\.removeAttribute\('tabindex'\)/);
});

test('completed weather, not ordinary navigation, earns the garden',()=>{
  assert.match(source,/revealGarden\(memory\)/);
  assert.match(source,/score=new WeatherScore\(\{limit:8\}\)/);
  assert.match(source,/the finished weather grew a garden/);
  assert.doesNotMatch(source,/<nav\b/i);
});

test('erase closes every earned chamber and keyboard entry is gated',()=>{
  assert.match(source,/function closeChambers\(\)/);
  assert.match(source,/for\(const chamber of \[afterbell,garden\]\)/);
  assert.match(source,/e\.key\.toLowerCase\(\)==='g'&&gardenOpen/);
});
