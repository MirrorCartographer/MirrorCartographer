import{readFileSync}from'node:fs';import{Script}from'node:vm';
const house=readFileSync('site/legacy-entrance/index.html','utf8');
const labyrinth=readFileSync('site/index.html','utf8');
const atlas=readFileSync('site/living-atlas.html','utf8');
const atlasRequired=['<title>Mirror Cartographer — The Living Atlas</title>','id="atlas"','id="worlds"','id="research"','id="library"','id="repositories"','id="search"','id="category"','id="results"','href="./chatgpt/"','href="./mind/"','href="./companion/atlas/rooms/"'];
const missingAtlas=atlasRequired.filter(x=>!atlas.includes(x));if(missingAtlas.length)throw Error('Preserved Living Atlas is incomplete: '+missingAtlas.join(', '));
if(atlas.includes('https://github.com/MirrorCartographer/mirror-cartographer-ui')||atlas.includes('mirrorcartographer.github.io/mirror-cartographer-ui'))throw Error('Public Atlas must not link to the private companion repository or its disabled Pages URL.');
const houseRequired=['<title>Mirror Cartographer — The Unfinished Country</title>','aria-label="An intricate hand-drawn night landscape','data-title="The light left on"','data-title="The impossible greenhouse"','data-title="The crooked carnival"','data-title="A boat with no timetable"','id="reveal"','id="closeReveal"','../living-atlas.html'];
const missingHouse=houseRequired.filter(x=>!house.includes(x));if(missingHouse.length)throw Error('House front door is incomplete: '+missingHouse.join(', '));
function validateDocument(html,label){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);if(duplicates.length)throw Error(label+' has duplicate HTML IDs: '+[...new Set(duplicates)].join(', '));
 const known=new Set(ids);const broken=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]).filter(x=>x&&!known.has(x));if(broken.length)throw Error(label+' has broken in-page links: '+[...new Set(broken)].join(', '));
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);if(scripts.length!==1)throw Error(label+' expected one inline application script; found '+scripts.length);new Script(scripts[0],{filename:label+'-inline-app.js'});
 return {uniqueIds:ids.length,internalLinks:'PASS',inlineScriptSyntax:'PASS'};
}
const houseResult=validateDocument(house,'Preserved Original House');const atlasResult=validateDocument(atlas,'Living Atlas');
const labyrinthRequired=['<title>CHARITY — the country has teeth</title>','id="terrain"','id="map-sheet"','id="trace"','id="door-index"','./maze.css','./maze-engine.js','./tactile-dimensions.js'];
const missingLabyrinth=labyrinthRequired.filter(x=>!labyrinth.includes(x));if(missingLabyrinth.length)throw Error('Living labyrinth entrance is incomplete: '+missingLabyrinth.join(', '));
const tactileSource=readFileSync('site/tactile-dimensions.js','utf8');new Script(tactileSource,{filename:'tactile-dimensions.js'});
if(!tactileSource.includes("switchInput.setAttribute('switch', '')")) throw Error('Native tactile input missing');
const mazeSource=readFileSync('site/maze-engine.js','utf8');new Script(mazeSource,{filename:'maze-engine.js'});
const mazeStyle=readFileSync('site/maze.css','utf8');if(!mazeStyle.includes('prefers-reduced-motion'))throw Error('Labyrinth must preserve reduced-motion mode');
const mazeIds=[...labyrinth.matchAll(/\\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(mazeIds).size!==mazeIds.length)throw Error('Living labyrinth contains duplicate IDs');
console.log(JSON.stringify({result:'PASS',house:houseResult,labyrinth:{uniqueIds:mazeIds.length,engineSyntax:'PASS'},preservedLivingAtlas:atlasResult,atlasRequirements:atlasRequired.length,houseRequirements:houseRequired.length},null,2));