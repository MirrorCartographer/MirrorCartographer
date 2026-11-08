import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toPosix = value => value.split(path.sep).join('/');
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : entry.isFile() ? [full] : [];
  });
}
const decode = value => String(value || '').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');

export function buildRoomway(siteRoot = path.resolve('site/companion')) {
  const atlasRoot = path.join(siteRoot,'atlas');
  const roomsRoot = path.join(atlasRoot,'rooms');
  const runtimePath = path.join(atlasRoot,'roomway.js');
  const identityPath = path.join(roomsRoot,'room-identities.json');
  const annexPath = path.join(roomsRoot,'annexes.html');
  for (const required of [runtimePath,identityPath,annexPath]) {
    if (!fs.existsSync(required)) throw new Error('Roomway source artifact is missing: '+required);
  }
  const identity = JSON.parse(fs.readFileSync(identityPath,'utf8'));
  if (identity.count !== 40 || !Array.isArray(identity.rooms) || identity.rooms.length !== 40) {
    throw new Error('The public companion must publish the canonical 40-room identity manifest.');
  }
  const annexHtml = fs.readFileSync(annexPath,'utf8');
  const annexes = [...annexHtml.matchAll(/<a class="door" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match,index) => {
    const card = match[2];
    const name = decode(card.match(/<h2>([\s\S]*?)<\/h2>/)?.[1]?.trim());
    const kind = decode(card.match(/<small>([\s\S]*?)<\/small>/)?.[1]?.trim()).toLowerCase();
    const description = decode(card.match(/<p>([\s\S]*?)<\/p>/)?.[1]?.trim());
    if (!name || !match[1]) throw new Error('An annex card is missing its name or destination.');
    return {
      id:'annex-'+String(index+1).padStart(2,'0'),
      name, kind, description,
      href:'./atlas/rooms/'+match[1].replace(/^\.\//,'')
    };
  });
  if (annexes.length !== 21) throw new Error('The public companion must publish exactly 21 annexes; found '+annexes.length+'.');
  const manifest = {
    schema:'mirror-cartographer.roomway.v1',
    counts:{rooms:40,annexes:21,totalDoors:61},
    rooms:identity.rooms.map(room => ({
      id:room.id,name:room.name,kind:room.kind,
      href:'./atlas/rooms/'+String(room.path).replace(/^\.\//,''),
      visual:room.visual || '',interaction:room.interaction || '',
      status:room.implementation_status || 'published destination',
      implementation_status:room.implementation_status || 'published destination'
    })),
    annexes
  };
  fs.writeFileSync(path.join(atlasRoot,'roomway-manifest.json'),JSON.stringify(manifest,null,2)+'\n');

  const htmlFiles=walk(siteRoot).filter(file=>path.extname(file).toLowerCase()==='.html');
  let injected=0;
  for(const file of htmlFiles){
    let html=fs.readFileSync(file,'utf8');
    if(/data-mc-roomway/.test(html))continue;
    let relativeScript=toPosix(path.relative(path.dirname(file),runtimePath));
    if(!relativeScript.startsWith('.'))relativeScript='./'+relativeScript;
    const tag='<script defer src="'+relativeScript+'" data-mc-roomway></script>';
    if(/<\/body\s*>/i.test(html))html=html.replace(/<\/body\s*>/i,tag+'\n</body>');
    else html+='\n'+tag+'\n';
    fs.writeFileSync(file,html);
    injected+=1;
  }
  return Object.freeze({rooms:40,annexes:21,totalDoors:61,htmlPages:htmlFiles.length,injected});
}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked)process.stdout.write(JSON.stringify(buildRoomway())+'\n');
