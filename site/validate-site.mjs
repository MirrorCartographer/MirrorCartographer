import{readFileSync}from'node:fs';import{Script}from'node:vm';
const house=readFileSync('site/index.html','utf8');
const atlas=readFileSync('site/living-atlas.html','utf8');
const atlasRequired=['<title>Mirror Cartographer — The Living Atlas</title>','id="atlas"','id="worlds"','id="research"','id="library"','id="repositories"','id="search"','id="category"','id="results"','href="./chatgpt/"','href="./mind/"','href="./companion/atlas/rooms/"'];
const missingAtlas=atlasRequired.filter(x=>!atlas.includes(x));if(missingAtlas.length)throw Error('Preserved Living Atlas is incomplete: '+missingAtlas.join(', '));
if(atlas.includes('https://github.com/MirrorCartographer/mirror-cartographer-ui')||atlas.includes('mirrorcartographer.github.io/mirror-cartographer-ui'))throw Error('Public Atlas must not link to the private companion repository or its disabled Pages URL.');
const houseRequired=['<title>The House That Remembers</title>','THE HOUSE','THAT <em>REMEMBERS.</em>','THE SMALL HEARTS','THE CARNIVAL','THE WEST WINDOW','id="rooms"','id="small-hearts"','id="door"','./living-atlas.html'];
const missingHouse=houseRequired.filter(x=>!house.includes(x));if(missingHouse.length)throw Error('House front door is incomplete: '+missingHouse.join(', '));
function validateDocument(html,label){
 const ids=[...html.matchAll(/\\bid="([^"]+)"/g)].map(m=>m[1]);const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);if(duplicates.length)throw Error(label+' has duplicate HTML IDs: '+[...new Set(duplicates)].join(', '));
 const known=new Set(ids);const broken=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]).filter(x=>x&&!known.has(x));if(broken.length)throw Error(label+' has broken in-page links: '+[...new Set(broken)].join(', '));
 const scripts=[...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/gi)].map(m=>m[1]);if(scripts.length!==1)throw Error(label+' expected one inline application script; found '+scripts.length);new Script(scripts[0],{filename:label+'-inline-app.js'});
 return {uniqueIds:ids.length,internalLinks:'PASS',inlineScriptSyntax:'PASS'};
}
const houseResult=validateDocument(house,'House');const atlasResult=validateDocument(atlas,'Living Atlas');
console.log(JSON.stringify({result:'PASS',house:houseResult,preservedLivingAtlas:atlasResult,atlasRequirements:atlasRequired.length,houseRequirements:houseRequired.length},null,2));