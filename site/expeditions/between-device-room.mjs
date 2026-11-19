import {RESIDENTS, MODEL_ID} from './between-device-contract.mjs';

const byId = id => document.getElementById(id);
const stage = byId('station'), log = byId('dialogue'), status = byId('status');
const loadButton = byId('load-model'), sendButton = byId('send');
const input = byId('message');
const names = {morrow:'MORROW',vesper:'VESPER'};
const initial = {
  morrow:'The station has a new visitor. The keys are already arguing.',
  vesper:'I have counted four mysterious noises. Three were probably me.'
};
const chats = {morrow:[],vesper:[]};
const weather = ['still','wind','storm'];
let scene = 'still', selected = 'morrow', worker = null, loading = false;
let ready = false, busy = false, sequence = 0, pending = null;
function note(message) { status.textContent = message; }
function controls() {
  sendButton.disabled = !ready || busy || !input.value.trim();
  loadButton.disabled = loading || ready;
  loadButton.textContent = ready ? 'MODEL AWAKE' : loading ? 'WAKING…' : 'WAKE LOCAL MODEL';
  byId('clear').disabled = busy;
}
function addLine(role, content, name) {
  const p = document.createElement('p');
  p.className = 'utterance '+(role === 'user' ? 'user' : 'resident');
  const b = document.createElement('b');
  b.textContent = role === 'user' ? 'VISITOR' : name;
  p.append(b, document.createTextNode(content));
  log.append(p);
}
function renderChat() {
  byId('conversation-heading').textContent = RESIDENTS[selected].name + ' is at the counter.';
  byId('choose-morrow').setAttribute('aria-pressed',String(selected === 'morrow'));
  byId('choose-vesper').setAttribute('aria-pressed',String(selected === 'vesper'));
  input.setAttribute('aria-label','Message to '+RESIDENTS[selected].name);
  log.replaceChildren();
  if (!chats[selected].length) addLine('assistant',initial[selected],names[selected]+' · WRITTEN GREETING');
  for (const turn of chats[selected]) addLine(turn.role,turn.content,names[selected]+' · ON-DEVICE MODEL');
  log.scrollTop = log.scrollHeight;
}
function changeResident(next) {
  if (!RESIDENTS[next]) return;
  selected = next;
  renderChat();
  note(ready ? RESIDENTS[next].name+' is listening. Replies are generated on this device.' :
    'Choose WAKE LOCAL MODEL to begin genuine text generation.');
}
byId('choose-morrow').addEventListener('click',()=>changeResident('morrow'));
byId('choose-vesper').addEventListener('click',()=>changeResident('vesper'));
byId('sky').addEventListener('click',()=>{
  scene = weather[(weather.indexOf(scene)+1)%weather.length];
  stage.dataset.weather = scene;
  byId('weather-label').textContent = 'SKY: '+scene.toUpperCase()+' · TAP TO SHIFT';
  byId('sky').setAttribute('aria-label','Change the station weather; currently '+scene);
  note('Scene changed to '+scene+'. That is a direct control, not a mood diagnosis.');
});
function startWorker() {
  if (worker) return;
  worker = new Worker('./between-device-worker.mjs',{type:'module'});
  worker.addEventListener('message',event=>{
    const item = event.data || {};
    if (item.type === 'status' && typeof item.message === 'string') note(item.message);
    if (item.type === 'progress') {
      const pct = typeof item.percent === 'number' ? Math.max(0,Math.min(100,item.percent)) : 0;
      byId('progress-bar').style.width = pct+'%';
      note('Preparing local inference · '+String(item.status||'loading')+
           (typeof item.percent === 'number'?' '+pct+'%':'')+
           (item.detail?' · '+item.detail:''));
    }
    if (item.type === 'ready') {
      loading = false; ready = true;
      byId('progress-bar').style.width='100%';
      note('LOCAL MODEL READY · '+MODEL_ID+'. This is not the LYR research checkpoint.');
      controls();
    }
    if (item.type === 'thinking' && pending?.id === item.id) {
      note(names[pending.resident]+' is generating new text on your device…');
    }
    if (item.type === 'reply' && pending?.id === item.id) {
      const {resident,message} = pending;
      chats[resident].push({role:'assistant',content:item.reply});
      chats[resident] = chats[resident].slice(-12);
      pending = null; busy = false;
      if (selected === resident) renderChat();
      note('Generated on this device using '+MODEL_ID+'. Verify factual claims.');
      controls();
    }
    if (item.type === 'error') {
      if (item.stage === 'load') {
        loading = false; ready = false;
        byId('progress-bar').style.width='0%';
        note(item.message || 'This device cannot load the selected model.');
      } else if (pending?.id === item.id) {
        pending = null; busy = false;
        note('No fabricated reply: '+(item.message || 'Local model failed.'));
      }
      controls();
    }
  });
  worker.addEventListener('error',()=>{
    loading = false; ready = false; busy = false; pending = null;
    note('The browser blocked the local model worker. No dialogue was generated.');
    worker.terminate(); worker = null;
    controls();
  });
}
loadButton.addEventListener('click',()=>{
  if (loading || ready) return;
  if (!('Worker' in window)) {
    note('This browser does not support the local inference worker.');
    return;
  }
  loading = true;
  controls();
  note('Downloading local model components; keep this page open.');
  startWorker();
  worker.postMessage({type:'load'});
});
byId('ask-form').addEventListener('submit',event=>{
  event.preventDefault();
  const message=input.value.trim();
  if (!message || message.length>600 || !ready || busy) return;
  const resident = selected, id = ++sequence;
  // In-memory only. Nothing is saved to localStorage or sent to our server.
  const history = chats[resident].slice(-6).map(x=>({role:x.role,content:x.content}));
  chats[resident].push({role:'user',content:message});
  pending = {id,resident,message};
  input.value = '';
  busy = true; controls(); renderChat();
  worker.postMessage({type:'generate',id,resident,message,history,scene});
  note('Asking '+RESIDENTS[resident].name+' through the device model…');
});
input.addEventListener('input',controls);
byId('clear').addEventListener('click',()=>{
  if (busy) return;
  chats.morrow.length=0;
  chats.vesper.length=0;
  renderChat();
  note('Conversation erased from this page. Cached model weights are not chat memory.');
  controls();
});
window.addEventListener('pagehide',()=>{worker?.terminate();worker=null;});
controls();
renderChat();
