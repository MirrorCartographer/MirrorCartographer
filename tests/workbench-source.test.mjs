import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {Script} from 'node:vm';
const html=readFileSync('site/workbench.html','utf8');
test('public workbench includes a published-page escape hatch, not only an isolated HTML mock',()=>{
 assert.match(html,/id="publishedLink"/);
 assert.match(html,/function publicUrl\(path\)/);
 assert.match(html,/kind:'published artifact'/);
 assert.match(html,/kind:'repository source'/);
 assert.match(html,/For real module\/audio behavior, use Visit real page/);
});
test('existing HTML editor and isolation remain intact',()=>{
 for(const id of ['source','preview','load','run','reset','download','pop'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"/);
 const m=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(m.length,1);
 assert.doesNotThrow(()=>new Script(m[0][1]));
});