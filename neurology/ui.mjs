import {addRecord,auditLedger,exportLedger,importLedger,searchLedger,lineage,effectiveStatus} from './engine.mjs';
const KEY='mc-neurology-provenance-v1';let ledger=[];
const el=id=>document.getElementById(id);
const say=(message,bad=false)=>{el('ev-status-line').textContent=message;el('ev-status-line').classList.toggle('error',bad)};
try{const raw=localStorage.getItem(KEY);if(raw)ledger=importLedger(raw)}catch(error){say('Stored ledger could not be loaded: '+error.message,true)}
function render(){
 const audit=auditLedger(ledger);
 el('ev-count').textContent=ledger.length;
 el('ev-errors').textContent=audit.errors.length;
 el('ev-audit').textContent=audit.valid?'Integrity passed. '+audit.warnings.length+' warning(s). '+Object.entries(audit.counts).filter(([,n])=>n).map(([k,n])=>k+': '+n).join(' · '):audit.errors.join(' | ');
 const records=searchLedger(ledger,el('ev-search').value);
 el('ev-records').replaceChildren();
 for(const record of records){
  const item=document.createElement('div');item.className='evidence';
  const body=document.createElement('span');
  const strong=document.createElement('strong');strong.textContent=record.id+' · '+record.type+' · '+effectiveStatus(ledger,record.id);
  const small=document.createElement('small');small.textContent=record.text+' | origin/authorship: '+record.origin+'/'+record.authorship+' | source: '+record.source.join(', ')+' | method: '+(record.method||'not recorded')+' | population: '+(record.population||'not recorded')+' | tags: '+(record.tags||[]).join(', ')+' | decision: '+(record.decision_link||'none')+' | uncertainty: '+record.uncertainty;
  body.append(strong,small);
  const badge=document.createElement('span');badge.className='status '+(record.type==='observation'?'obs':'hyp');badge.textContent='Lineage';
  const detail=document.createElement('small');const graph=lineage(ledger,record.id);
  detail.textContent='Incoming: '+graph.incoming.map(link=>link.relation+' ← '+link.id).join('; ')+' · Outgoing: '+graph.outgoing.map(link=>link.relation+' → '+link.id).join('; ')+' · Effective status: '+effectiveStatus(ledger,record.id);
  item.append(body,badge,detail);el('ev-records').append(item);
 }
}
function persist(){localStorage.setItem(KEY,JSON.stringify(ledger));render()}
el('ev-origin').addEventListener('change',()=>{const origin=el('ev-origin').value;if(origin==='assistant-generated')el('ev-authorship').value='assistant-generated';else if(origin==='user-authored')el('ev-authorship').value='user-authored';else el('ev-authorship').value='unverified'});
el('ev-add').addEventListener('click',()=>{
 try{
  const value=id=>el(id).value.trim();const confidence=value('ev-confidence');
  ledger=addRecord(ledger,{id:value('ev-id'),type:value('ev-type'),status:value('ev-status'),text:value('ev-text'),origin:value('ev-origin'),authorship:value('ev-authorship'),source:[...value('ev-source').split(';').map(item=>item.trim()).filter(Boolean),value('ev-source-preset')].filter(Boolean),confidence:confidence===''?null:Number(confidence),uncertainty:value('ev-uncertainty'),method:value('ev-method')||null,population:value('ev-population')||null,tags:value('ev-tags').split(',').map(item=>item.trim()).filter(Boolean),decision_link:value('ev-decision')||null,contradicts:value('ev-contradicts')?[value('ev-contradicts')]:[],supersedes:value('ev-supersedes')?[value('ev-supersedes')]:[]});
  persist();say('Record added. Its source and uncertainty remain attached.');
 }catch(error){say(error.message,true)}
});
el('ev-search').addEventListener('input',render);
el('ev-export').addEventListener('click',()=>{
 try{const blob=new Blob([exportLedger(ledger)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='mc-neurology-provenance.json';a.click();URL.revokeObjectURL(url);say('Ledger exported.')}
 catch(error){say(error.message,true)}
});
el('ev-import').addEventListener('change',async event=>{
 const file=event.target.files?.[0];if(!file)return;
 try{ledger=importLedger(await file.text());persist();say('Imported '+ledger.length+' validated record(s).')}
 catch(error){say('Import rejected: '+error.message,true)}
 event.target.value='';
});
el('ev-clear').addEventListener('click',()=>{
 if(!confirm('Clear this browser’s local neurological research ledger? Export first if you need a copy.'))return;
 ledger=[];localStorage.removeItem(KEY);render();say('Local ledger cleared.');
});
render();
