import{readFileSync,existsSync,statSync}from'node:fs';
const path='site/catalog.json';
if(!existsSync(path))throw Error('Catalog generation did not produce site/catalog.json');
const raw=readFileSync(path,'utf8');
const c=JSON.parse(raw);
if(!Array.isArray(c.items)||!c.items.length)throw Error('Catalog must contain a non-empty items array');
const required=['path','title','category','repository','url'];
const seen=new Set(),bad=[],blocked=[];
for(const [i,x]of c.items.entries()){
 for(const k of required)if(typeof x[k]!=='string'||!x[k].trim())bad.push('item '+i+' missing '+k);
 if(typeof x.path==='string'){
  if(seen.has(x.repository+':'+x.path))bad.push('duplicate '+x.repository+':'+x.path);
  seen.add(x.repository+':'+x.path);
  if(/(^|\\/)(private|secrets?|credentials?|personal-records?|raw-private)(\\/|$)|(^|\\/)\\.env($|\\.)|(^|\\/)(node_modules|\\.git)(\\/|$)/i.test(x.path))blocked.push(x.path);
 }
 if(typeof x.url==='string'&&!/^https:\/\/github\.com\/MirrorCartographer\/(MirrorCartographer|mirror-cartographer-ui)\/blob\/main\//.test(x.url))bad.push('unexpected source URL at item '+i);
}
if(bad.length)throw Error('Catalog schema checks failed:\n'+bad.slice(0,30).join('\n'));
if(blocked.length)throw Error('Sensitive/private paths must not be indexed:\n'+blocked.slice(0,30).join('\n'));
if(c.file_count!==c.items.length)throw Error('file_count does not match item count');
console.log(JSON.stringify({result:'PASS',fileCount:c.items.length,repositories:c.repositories,categories:c.categories,bytes:statSync(path).size,uniquePaths:seen.size,privatePathLeaks:0},null,2));
