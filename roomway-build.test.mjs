import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildRoomway } from './build-roomway.mjs';

test('public Roomway builds all 61 reviewed doors and injects every companion page',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'mc-public-roomway-'));
  const companion=path.join(root,'companion');
  const atlas=path.join(companion,'atlas');
  const rooms=path.join(atlas,'rooms');
  try{
    fs.mkdirSync(rooms,{recursive:true});
    fs.writeFileSync(path.join(atlas,'roomway.js'),'/* runtime fixture */');
    const identities={
      count:40,
      rooms:Array.from({length:40},(_,i)=>({
        id:String(i+1).padStart(3,'0'),
        name:i===39?'Character Atelier':'Room '+(i+1),
        kind:'environment',
        path:'experiments/room-'+(i+1)+'/',
        visual:'Visual grammar '+(i+1),
        interaction:'Interaction grammar '+(i+1),
        implementation_status:'published'
      }))
    };
    fs.writeFileSync(path.join(rooms,'room-identities.json'),JSON.stringify(identities));
    const annexCards=Array.from({length:21},(_,i)=>'<a class="door" href="./annex-'+(i+1)+'.html"><small>EXHIBIT</small><h2>Annex '+(i+1)+'</h2><p>Description '+(i+1)+'</p></a>').join('\n');
    fs.writeFileSync(path.join(rooms,'annexes.html'),'<html><body>'+annexCards+'</body></html>');
    fs.writeFileSync(path.join(companion,'index.html'),'<html><body>Companion</body></html>');
    fs.writeFileSync(path.join(atlas,'index.html'),'<html><body>Atlas</body></html>');
    fs.writeFileSync(path.join(rooms,'index.html'),'<html><body>Rooms</body></html>');
    fs.mkdirSync(path.join(rooms,'nested'),{recursive:true});
    fs.writeFileSync(path.join(rooms,'nested','index.html'),'<html><body>Nested room</body></html>');

    const result=buildRoomway(companion);
    assert.deepEqual(result,{rooms:40,annexes:21,totalDoors:61,htmlPages:5,injected:5});
    const manifest=JSON.parse(fs.readFileSync(path.join(atlas,'roomway-manifest.json'),'utf8'));
    assert.equal(manifest.counts.totalDoors,61);
    assert.equal(manifest.rooms.length,40);
    assert.equal(manifest.annexes.length,21);
    assert.equal(manifest.rooms[39].name,'Character Atelier');
    assert.equal(manifest.rooms[0].href,'./atlas/rooms/experiments/room-1/');
    assert.equal(manifest.annexes[0].href,'./atlas/rooms/annex-1.html');
    assert.match(fs.readFileSync(path.join(companion,'index.html'),'utf8'),/src="\.\/atlas\/roomway\.js"/);
    assert.match(fs.readFileSync(path.join(atlas,'index.html'),'utf8'),/src="\.\/roomway\.js"/);
    assert.match(fs.readFileSync(path.join(rooms,'index.html'),'utf8'),/src="\.\.\/roomway\.js"/);
    assert.match(fs.readFileSync(path.join(rooms,'annexes.html'),'utf8'),/src="\.\.\/roomway\.js"/);
    assert.match(fs.readFileSync(path.join(rooms,'nested','index.html'),'utf8'),/src="\.\.\/\.\.\/roomway\.js"/);
    const again=buildRoomway(companion);
    assert.equal(again.injected,0);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
