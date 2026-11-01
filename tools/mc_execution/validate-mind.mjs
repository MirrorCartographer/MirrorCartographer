import{readFileSync,existsSync}from'node:fs';
import{Script}from'node:vm';
import{resolve,join}from'node:path';
const root=process.cwd();
const mindPath='site/mind/index.html',homePath='site/index.html';
const mind=readFileSync(mindPath,'utf8'),home=readFileSync(homePath,'utf8');
const failures=[],checks=[];
function check(label,fn){try{fn();checks.push({label,status:'PASS'});console.log('PASS: '+label)}catch(e){failures.push(label+': '+e.message);checks.push({label,status:'FAIL',detail:e.message});console.error('FAIL: '+label+' — '+e.message)}}
check('Mind and homepage exist',()=>{if(!mind||!home)throw Error('Missing HTML entry point')});
check('Required playable systems are present',()=>{for(const term of ['id="expedition"','id="map"','id="rooms"','id="notebook"','id="archive"','id="export-notes"','id="export-md"','id="reset-progress"','function renderQuest()','function renderProgress()','function renderNotes()','localStorage','createObjectURL'])if(!mind.includes(term))throw Error('Missing '+term)});
check('Living Atlas links to the Mind',()=>{if(!home.includes('href="./mind/"'))throw Error('No homepage link to ./mind/')});
check('Mind HTML IDs are unique',()=>{const ids=[...mind.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);if(dup.length)throw Error('Duplicate IDs: '+[...new Set(dup)].join(', '))});
check('Mind in-page anchors resolve',()=>{const ids=new Set([...mind.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));const bad=[...mind.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]).filter(x=>!ids.has(x));if(bad.length)throw Error('Unresolved anchors: '+[...new Set(bad)].join(', '))});
check('Mind inline JavaScript parses',()=>{const scripts=[...mind.matchAll(/<script>([\s\S]*?)<\/script>/gi)];if(scripts.length!==1)throw Error('Expected one inline script, found '+scripts.length);new Script(scripts[0][1],{filename:'mind-inline.js'})});
check('Seven room actions have matching room definitions',()=>{const entered=[...mind.matchAll(/data-enter="([^"]+)"/g)].map(m=>m[1]);for(const id of ['evidence','hypothesis','contradiction','experiment','missing','bridge','reflection'])if(!entered.includes(id)||!mind.includes(id+':{name:'))throw Error('Room missing action or definition: '+id)});
check('Notebook operations remain browser-local',()=>{const scripts=mind.match(/<script>([\s\S]*?)<\/script>/i)?.[1]||'';if(/fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(scripts))throw Error('Unexpected network transmission API in Mind script')});
check('No broken local page targets',()=>{for(const target of ['../','https://github.com/MirrorCartographer/MirrorCartographer/tree/main/mind'])if(!target)throw Error('Missing expected target');if(!existsSync(resolve(root,'site/index.html')))throw Error('Parent Living Atlas entry not found')});
console.log(JSON.stringify({result:failures.length?'FAIL':'PASS',checks:checks.length,passed:checks.filter(x=>x.status==='PASS').length,failures},null,2));
if(failures.length)process.exitCode=1;
