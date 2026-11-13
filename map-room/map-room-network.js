(()=>{'use strict';
const API_ORIGIN='https://mirror-cartographer-ui.pages.dev';
const API_URL=API_ORIGIN+'/api';
const LOCAL='mc-maproom-v1';
const TOKEN='mc-maproom-network-session-v1';
const KEY='mc-maproom-encryption-key-v1';
const TOMBSTONES='mc-maproom-tombstones-v1';
const VAULT_ID='map-room-encrypted-vault-v1';
const $=id=>document.getElementById(id);
const status=(id,message)=>{const el=$(id);if(el)el.textContent=message};
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const b64u=bytes=>{let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const unb64u=value=>Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const token=()=>localStorage.getItem(TOKEN)||'';
const keyValue=()=>localStorage.getItem(KEY)||'';
const maps=()=>read(LOCAL,[]);
const tombstones=()=>read(TOMBSTONES,[]);
function button(label,fn){const b=document.createElement('button');b.className='action';b.type='button';b.textContent=label;b.addEventListener('click',fn);return b}
function el(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n}
async function api(action,options={}){
 const url=new URL(API_URL);url.searchParams.set('action',action);
 if(options.query)Object.entries(options.query).forEach(([k,v])=>url.searchParams.set(k,String(v)));
 const headers={'accept':'application/json'};
 if(options.body)headers['content-type']='application/json';
 if(options.auth!==false&&token())headers.authorization='Bearer '+token();
 let response;
 try{response=await fetch(url,{method:options.body?'POST':'GET',headers,body:options.body?JSON.stringify(options.body):undefined,cache:'no-store'})}
 catch(e){throw new Error('The Network API could not be reached. Your local maps are still available.')}
 const payload=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(payload.error||('Network API returned HTTP '+response.status));
 return payload;
}
async function health(){
 try{const r=await api('health',{auth:false});status('networkStatus','NETWORK ONLINE · '+r.persistence+' · '+r.authentication);return true}
 catch(e){status('networkStatus','NETWORK NOT REACHABLE · '+e.message);return false}
}
function showRecovery(code){
 const box=$('recoveryReveal'),value=$('recoveryCode');
 if(!box||!value)return;
 value.textContent=code||'';
 box.classList.remove('hidden');
 status('networkAccountStatus','SAVE THIS ONE-TIME RECOVERY CODE SOMEWHERE PRIVATE. It will not be shown again.');
}
function setSignedIn(user){
 const label=$('networkIdentity');
 if(label)label.textContent=user?'SIGNED IN · '+(user.email||'account'):'NOT SIGNED IN';
 const out=$('networkSignOut');if(out)out.classList.toggle('hidden',!user);
 const sync=$('networkSync');if(sync)sync.disabled=!user;
}
async function validateSession(){
 if(!token()){setSignedIn(null);return null}
 try{const r=await api('auth.me');setSignedIn(r.user);return r.user}
 catch(e){localStorage.removeItem(TOKEN);setSignedIn(null);status('networkAccountStatus','Previous session expired or unavailable. Sign in again.');return null}
}
async function register(){
 const email=$('networkEmail').value.trim(),password=$('networkPassword').value;
 if(password.length<12){status('networkAccountStatus','Use at least 12 characters for the account password.');return}
 try{
  const r=await api('auth.register',{auth:false,body:{email,password}});
  localStorage.setItem(TOKEN,r.token);setSignedIn(r.user);showRecovery(r.recovery_code);
  status('networkAccountStatus','ACCOUNT CREATED. Your recovery code is shown above; store it offline.');
 }catch(e){status('networkAccountStatus',e.message)}
}
async function login(){
 const email=$('networkEmail').value.trim(),password=$('networkPassword').value;
 try{const r=await api('auth.login',{auth:false,body:{email,password}});localStorage.setItem(TOKEN,r.token);setSignedIn(r.user);status('networkAccountStatus','SIGNED IN. Your encrypted vault is ready to sync.')}
 catch(e){status('networkAccountStatus',e.message)}
}
async function recover(){
 const email=$('networkEmail').value.trim(),password=$('networkNewPassword').value,code=$('networkRecoveryInput').value.trim();
 if(password.length<12){status('networkAccountStatus','New password must be at least 12 characters.');return}
 try{const r=await api('auth.recover',{auth:false,body:{email,password,recovery_code:code}});localStorage.setItem(TOKEN,r.token);setSignedIn(r.user);showRecovery(r.recovery_code);status('networkAccountStatus','PASSWORD RESET. Save your new one-time recovery code. Your previous sessions were revoked.')}
 catch(e){status('networkAccountStatus',e.message)}
}
async function logout(){
 try{await api('auth.logout',{body:{}})}catch{}
 localStorage.removeItem(TOKEN);setSignedIn(null);status('networkAccountStatus','SIGNED OUT. Local maps remain on this device.');
}
function download(name,content,type){
 const blob=new Blob([content],{type:type||'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportRecoveryKey(){
 const key=keyValue();if(!key){status('keyStatus','No encryption key exists yet. Sign in and sync a new vault first.');return}
 download('mirror-cartographer-map-room-key.json',JSON.stringify({schema:'mirror-cartographer-map-room-key/v1',algorithm:'AES-256-GCM',key,warning:'Keep this file private. It unlocks your encrypted Map Room vault.'},null,2));
 status('keyStatus','KEY BACKUP EXPORTED. Keep it somewhere private and separate from your account password.');
}
async function importKey(){
 const raw=$('keyImport').value.trim();let value=raw;
 try{if(raw.startsWith('{'))value=JSON.parse(raw).key||''}catch{}
 try{
  const bytes=unb64u(value);if(bytes.length!==32)throw new Error('The key must decode to 32 bytes.');
  await crypto.subtle.importKey('raw',bytes,{name:'AES-GCM'},false,['encrypt','decrypt']);
  localStorage.setItem(KEY,value);$('keyImport').value='';status('keyStatus','ENCRYPTION KEY IMPORTED ON THIS DEVICE. You can now decrypt your vault.');
 }catch(e){status('keyStatus','KEY NOT IMPORTED · '+e.message)}
}
async function ensureKey(remoteExists){
 if(keyValue())return keyValue();
 if(remoteExists)throw new Error('An encrypted vault already exists. Import its recovery-key file before syncing; do not generate a replacement key.');
 const raw=crypto.getRandomValues(new Uint8Array(32)),value=b64u(raw);
 await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt']);
 localStorage.setItem(KEY,value);status('keyStatus','A new encryption key was created on this device. Download its backup before using the vault on another device.');
 return value;
}
async function encryptVault(vault,keyString){
 const key=await crypto.subtle.importKey('raw',unb64u(keyString),{name:'AES-GCM'},false,['encrypt']);
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const plaintext=new TextEncoder().encode(JSON.stringify(vault));
 const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,plaintext);
 return {format:'mc-map-room-e2ee-v1',algorithm:'AES-256-GCM',iv:b64u(iv),ciphertext:b64u(new Uint8Array(cipher))};
}
async function decryptVault(envelope,keyString){
 if(!envelope||envelope.format!=='mc-map-room-e2ee-v1')throw new Error('The remote vault has an unsupported format.');
 const key=await crypto.subtle.importKey('raw',unb64u(keyString),{name:'AES-GCM'},false,['decrypt']);
 const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64u(envelope.iv)},key,unb64u(envelope.ciphertext));
 const value=JSON.parse(new TextDecoder().decode(clear));
 if(value.schema!=='mirror-cartographer.encrypted-vault.v1'||!Array.isArray(value.observations)||!Array.isArray(value.tombstones))throw new Error('The decrypted vault failed its schema check.');
 return value;
}
function mergeVault(local,remote){
 const deleted=new Set([...(local.tombstones||[]),...(remote.tombstones||[])]);
 const byId=new Map();
 [...(remote.observations||[]),...(local.observations||[])].forEach(item=>{
  if(!item||!item.id||deleted.has(item.id))return;
  const previous=byId.get(item.id);
  if(!previous||String(item.createdAt||'')>=String(previous.createdAt||''))byId.set(item.id,item);
 });
 return {schema:'mirror-cartographer.encrypted-vault.v1',updatedAt:new Date().toISOString(),observations:[...byId.values()].sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))),tombstones:[...deleted]};
}
async function syncVault(){
 const btn=$('networkSync');if(btn)btn.disabled=true;
 status('networkSyncStatus','CHECKING ACCOUNT AND ENCRYPTED VAULT…');
 try{
  if(!token())throw new Error('Sign in before syncing.');
  const [localRows,remoteRows]=await Promise.all([Promise.resolve(maps()),api('records.list',{query:{collection:'symbols'}})]);
  const remoteRecord=(remoteRows.records||[]).find(r=>r.id===VAULT_ID);
  const key=await ensureKey(Boolean(remoteRecord));
  let remote={schema:'mirror-cartographer.encrypted-vault.v1',observations:[],tombstones:[]};
  if(remoteRecord)remote=await decryptVault(remoteRecord.content,key);
  const local={schema:'mirror-cartographer.encrypted-vault.v1',observations:localRows,tombstones:tombstones()};
  const merged=mergeVault(local,remote);
  const envelope=await encryptVault(merged,key);
  await api('records.upsert',{body:{collection:'symbols',record:{id:VAULT_ID,title:'Encrypted Map Room vault',content:envelope,privacy:'private',source:'map-room-encrypted-vault',tags:['encrypted-vault']}}});
  write(LOCAL,merged.observations);write(TOMBSTONES,merged.tombstones);
  status('networkSyncStatus','SYNC COMPLETE · '+merged.observations.length+' MAPS · ENCRYPTED BEFORE UPLOAD. Reloading the atlas…');
  setTimeout(()=>location.reload(),900);
 }catch(e){status('networkSyncStatus','SYNC NOT COMPLETED · '+e.message)}
 finally{if(btn)btn.disabled=false}
}
function listCounts(rows,key){
 const counts=new Map();rows.forEach(r=>(Array.isArray(r[key])?r[key]:[]).forEach(v=>counts.set(v,(counts.get(v)||0)+1)));
 return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4);
}
function summaryLine(label,entries){
 const line=el('div');line.append(el('strong',label+' / '));
 line.append(el('span',entries.length?entries.map(x=>x[0]+' ('+x[1]+')').join(' · '):'—','muted'));
 return line;
}
function drawTrend(rows){
 const svg=$('intensityTrend');if(!svg)return;svg.replaceChildren();
 const ns='http://www.w3.org/2000/svg',make=(tag,attrs)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));svg.append(n);return n};
 [0,5,10].forEach(v=>{const y=184-v*15;make('line',{x1:24,y1:y,x2:306,y2:y,stroke:'#6c6070','stroke-dasharray':'3 5','stroke-width':'1'});const t=make('text',{x:4,y:y+4,fill:'#c2b5b0','font-size':'9'});t.textContent=String(v)});
 const usable=rows.filter(x=>Number.isFinite(Number(x.intensity))).slice(-20);
 if(!usable.length){const t=make('text',{x:160,y:105,'text-anchor':'middle',fill:'#c2b5b0','font-size':'11'});t.textContent='Save a few maps to see a timeline';return}
 const pts=usable.map((r,i)=>({x:24+(usable.length===1?141:i*282/(usable.length-1)),y:184-Number(r.intensity)*15}));
 make('polyline',{points:pts.map(p=>p.x+','+p.y).join(' '),fill:'none',stroke:'#c8f238','stroke-width':'2.5','stroke-linecap':'round','stroke-linejoin':'round'});
 pts.forEach((p,i)=>{make('circle',{cx:p.x,cy:p.y,r:4,fill:'#ff6b9c',stroke:'#f4eadc','stroke-width':'1'});if(i===0||i===pts.length-1){const t=make('text',{x:p.x,y:205,'text-anchor':i===0?'start':'end',fill:'#c2b5b0','font-size':'8'});t.textContent=new Date(usable[i].createdAt).toLocaleDateString()}})
}
function fillSelect(select,rows){
 if(!select)return;const prior=select.value;select.replaceChildren();
 rows.forEach(r=>{const o=el('option',new Date(r.createdAt).toLocaleString()+' · '+(r.title||'Untitled'));o.value=r.id;select.append(o)});
 if(rows.some(r=>r.id===prior))select.value=prior;
}
function compareMaps(rows){
 const a=rows.find(r=>r.id===$('compareA')?.value),b=rows.find(r=>r.id===$('compareB')?.value),out=$('compareOutput');
 if(!out)return;out.replaceChildren();
 if(!a||!b){out.textContent='Choose two saved maps to compare.';return}
 if(a.id===b.id){out.textContent='Choose two different maps.';return}
 const earlier=String(a.createdAt)<String(b.createdAt)?a:b,later=earlier===a?b:a;
 out.append(el('p','EARLIER · '+new Date(earlier.createdAt).toLocaleString(),'muted'),el('strong',earlier.title||'Untitled'));
 out.append(el('p','LATER · '+new Date(later.createdAt).toLocaleString(),'muted'),el('strong',later.title||'Untitled'));
 [['colors','Colors'],['shapes','Shapes'],['textures','Textures'],['bodyLocations','Body areas'],['movement','Movement']].forEach(([k,label])=>{
  const x=new Set(earlier[k]||[]),y=new Set(later[k]||[]),added=[...y].filter(v=>!x.has(v)),removed=[...x].filter(v=>!y.has(v)),same=[...x].filter(v=>y.has(v));
  const line=el('p');line.append(el('b',label+': '),el('span','continued '+(same.join(', ')||'none')+' · appeared '+(added.join(', ')||'none')+' · absent '+(removed.join(', ')||'none')));out.append(line);
 });
 const delta=Number(later.intensity)-Number(earlier.intensity);
 out.append(el('p',"Intensity change: "+(delta>0?'+':'')+delta+" / 10. This is a change in the user's selected scale, not a clinical measure."));
 if(earlier.temperature!==later.temperature)out.append(el('p','Temperature changed from '+(earlier.temperature||'unspecified')+' to '+(later.temperature||'unspecified')+'.'));
}
function refreshHistory(){
 const rows=maps().slice().sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));
 status('historyCount',rows.length+' MAPS · '+(rows.length?new Date(rows[0].createdAt).toLocaleDateString()+' → '+new Date(rows[rows.length-1].createdAt).toLocaleDateString():'NO OBSERVATIONS YET'));
 const patterns=$('patternSummary');if(patterns){patterns.replaceChildren();patterns.append(summaryLine('COLORS',listCounts(rows,'colors')),summaryLine('SHAPES',listCounts(rows,'shapes')),summaryLine('TEXTURES',listCounts(rows,'textures')),summaryLine('BODY AREAS',listCounts(rows,'bodyLocations')),summaryLine('MOVEMENT',listCounts(rows,'movement')))}
 drawTrend(rows);
 const a=$('compareA'),b=$('compareB'),priorA=a?.value||'',priorB=b?.value||'';fillSelect(a,rows.slice().reverse());fillSelect(b,rows.slice().reverse());
 if(rows.length){if(!priorA)a.value=rows[rows.length-1].id;if(rows.length>1&&!priorB)b.value=rows[rows.length-2].id}
 compareMaps(rows);
 const timeline=$('mapTimeline');if(timeline){timeline.replaceChildren();rows.slice().reverse().slice(0,30).forEach(r=>{const item=el('div',undefined,'saved-item');const details=el('div');details.append(el('strong',r.title||'Untitled map'),el('small',new Date(r.createdAt).toLocaleString()+' · intensity '+r.intensity+'/10'));item.append(details);timeline.append(item)});if(!rows.length)timeline.append(el('p','Your saved maps will appear here.','muted'))}
}
function buildPanels(){
 const aside=document.querySelector('.layout aside');if(!aside||$('historyPanel'))return;
 const history=document.createElement('section');history.className='panel';history.id='historyPanel';
 history.innerHTML='<div class="step">OVER TIME / THE LIVING ATLAS</div><h2>Your patterns.</h2><p class="intro">A view of what you have recorded across time. Counts describe your entries; they do not infer a diagnosis or a hidden emotional truth.</p><div id="historyCount" class="status"></div><svg id="intensityTrend" viewBox="0 0 320 218" role="img" aria-label="Timeline of user-selected intensity values" style="width:100%;height:auto;background:#17151d;border:1px solid #ffffff22;margin:12px 0"></svg><div id="patternSummary" class="preview-meta"></div><div class="field"><label for="compareA">Compare observation A</label><select id="compareA" class="input"></select></div><div class="field"><label for="compareB">With observation B</label><select id="compareB" class="input"></select></div><div id="compareOutput" class="preview-meta" aria-live="polite"></div><div class="step" style="margin-top:20px">RECENT / MAP TIMELINE</div><div id="mapTimeline"></div>';
 const network=document.createElement('section');network.className='panel';network.id='networkPanel';
 network.innerHTML='<div class="step">THE NETWORK / YOUR PRIVATE VAULT</div><h2>Connect your atlas.</h2><p class="intro">Your Map Room can use the project-owned Mirror Cartographer Network API. Account access is separate from this device\'s local maps. Registration does not require email verification. Account passwords must be at least 12 characters.</p><div id="networkStatus" class="status">CHECKING NETWORK…</div><div id="networkIdentity" class="preview-meta">NOT SIGNED IN</div><div class="field"><label for="networkEmail">Email</label><input class="input" id="networkEmail" type="email" autocomplete="username" placeholder="you@example.com"></div><div class="field"><label for="networkPassword">Account password</label><input class="input" id="networkPassword" type="password" autocomplete="current-password" minlength="12" placeholder="At least 12 characters"></div><div class="actions" id="networkActions"></div><div id="networkAccountStatus" class="status" aria-live="polite"></div><div id="recoveryReveal" class="hidden"><p class="intro">ONE-TIME RECOVERY CODE — save it offline. The server stores only a hash; this code cannot be shown again.</p><div id="recoveryCode" class="promptbox"></div><div id="recoveryActions" class="actions"></div></div><details style="margin-top:12px"><summary class="muted">Recover an account</summary><div class="field"><label for="networkRecoveryInput">One-time recovery code</label><input class="input" id="networkRecoveryInput" autocomplete="off"></div><div class="field"><label for="networkNewPassword">New password (12+ characters)</label><input class="input" id="networkNewPassword" type="password" autocomplete="new-password"></div><button class="action" id="networkRecover">RESET PASSWORD</button></details><div class="divider" style="border-top:1px solid #ffffff22;margin:18px 0"></div><div class="step">ENCRYPTION / DEVICE KEY</div><p class="intro">Map contents are encrypted in this browser with AES-256-GCM before upload. The key is not sent to the API. Export the key to move your vault to another device. If you lose the key, the server cannot recover the encrypted maps.</p><div class="actions" id="keyActions"></div><div class="field"><label for="keyImport">Import a key backup (paste its JSON or key)</label><textarea id="keyImport" placeholder="Paste the contents of your Map Room key backup file"></textarea><button class="action" id="keyImportButton" style="margin-top:8px">IMPORT KEY</button></div><div id="keyStatus" class="status" aria-live="polite"></div><div class="actions"><button class="action primary" id="networkSync" disabled>SYNC ENCRYPTED VAULT</button><button class="action hidden" id="networkSignOut">SIGN OUT</button></div><div id="networkSyncStatus" class="status" aria-live="polite"></div><p class="intro">The server receives an encrypted vault record, not your colors, body locations, sensations, metaphors, or journal text. The encryption key is stored in this browser&#39;s local storage; device compromise or malicious same-origin script could expose it. This is browser-side encryption, not a formal security certification.</p>';
 aside.insertBefore(history,aside.querySelector('.saved-panel')||null);aside.insertBefore(network,aside.querySelector('.saved-panel')||null);
 const actions=$('networkActions');actions.append(button('CREATE ACCOUNT',register),button('SIGN IN',login));
 $('networkRecover').addEventListener('click',recover);
 $('networkSignOut').addEventListener('click',logout);
 $('networkSync').addEventListener('click',syncVault);
 $('keyActions').append(button('DOWNLOAD KEY BACKUP',exportRecoveryKey));
 $('keyImportButton').addEventListener('click',importKey);
 $('recoveryActions').append(button('COPY RECOVERY CODE',async()=>{try{await navigator.clipboard.writeText($('recoveryCode').textContent);status('networkAccountStatus','RECOVERY CODE COPIED. Store it offline.')}catch{status('networkAccountStatus','Select and copy the recovery code manually.')}}));
 $('compareA').addEventListener('change',()=>compareMaps(maps()));
 $('compareB').addEventListener('change',()=>compareMaps(maps()));
}
function install(){
 buildPanels();refreshHistory();health();validateSession();
 const save=$('save');if(save)save.addEventListener('click',()=>setTimeout(refreshHistory,0));
 const list=$('savedList');if(list){list.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.textContent!=='DELETE')return;const row=b.closest('.saved-item');const id=row?.dataset.mapId;if(id&&!maps().some(map=>map.id===id)){const t=new Set(tombstones());t.add(id);write(TOMBSTONES,[...t])}},false);new MutationObserver(refreshHistory).observe(list,{childList:true,subtree:true})}
 window.addEventListener('storage',e=>{if([LOCAL,TOMBSTONES].includes(e.key))refreshHistory()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();