import { MODEL_ID, buildResidentMessages, extractGeneratedText, getUsableGpuAdapter } from './between-device-contract.mjs';
import { auditResidentReply } from './lyr-reply-audit.mjs';

// This is an open-weight third-party model running inside the visitor's device,
// not the unvalidated from-scratch LYR research checkpoint and not a hosted chat API.
const LIBRARY = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2';
let engine = null;
let loading = null;
let locked = false;
const report = (type, payload={}) => self.postMessage({type, ...payload});
function describeProgress(progress) {
  if (!progress || typeof progress !== 'object') return;
  const value = typeof progress.progress === 'number' ? Math.round(progress.progress) : null;
  const detail = typeof progress.file === 'string' ? progress.file.split('/').at(-1).slice(0,56) : '';
  report('progress', {status:String(progress.status || 'loading'), percent:value, detail});
}
async function loadModel() {
  if (engine) return engine;
  if (loading) return loading;
  loading = (async () => {
    report('status', {message:'Loading the local model runtime…'});
    const { pipeline } = await import(LIBRARY);
    const options = {progress_callback:describeProgress};
    // Feature presence is not enough: headless Chrome and some mobile browsers
    // expose navigator.gpu while denying GPU adapter access. Probe BEFORE loading
    // any WebGPU backend, which could otherwise make WASM fallback unusable.
    const gpuAdapter = await getUsableGpuAdapter(self.navigator);
    if (gpuAdapter) {
      try {
        report('status', {message:'Hardware GPU is available. Loading on-device graphics mode…'});
        engine = await pipeline('text-generation', MODEL_ID, {
          ...options, device:'webgpu', dtype:'q4f16'
        });
      } catch {
        report('status', {message:'Graphics initialization failed; attempting local CPU…'});
      }
    }
    if (!engine) {
      report('status', {message:'Loading local CPU/WASM model. GPU is not required.'});
      engine = await pipeline('text-generation', MODEL_ID, {
        ...options, device:'wasm', dtype:'q8'
      });
    }
    report('ready', {model:MODEL_ID, location:'on-device'});
    return engine;
  })();
  try { return await loading; }
  catch (error) {
    engine = null;
    report('error', {stage:'load', message:'Could not initialize a local model on this device. '+String(error?.message||'') .slice(0,180)});
    throw error;
  } finally { loading = null; }
}

self.onmessage = async (event) => {
  const data = event.data || {};
  if (data.type === 'load') {
    try { await loadModel(); } catch { /* error was reported */ }
    return;
  }
  if (data.type !== 'generate') return;
  if (locked) {
    report('error', {stage:'generate',id:data.id,message:'Previous response is still generating.'});
    return;
  }
  if (!engine) {
    report('error', {stage:'generate',id:data.id,message:'Load the on-device model first.'});
    return;
  }
  locked = true;
  const id = data.id;
  try {
    const messages = buildResidentMessages({
      resident:data.resident, message:data.message, history:data.history, scene:data.scene, mode:data.mode
    });
    report('thinking',{id});
    let reply=null;
    let screening=null;
    // One bounded correction attempt. Never pass rejected text as evidence.
    for (let attempt=0; attempt<2; attempt++) {
      const result = await engine(messages, {
        max_new_tokens:112,
        do_sample:true,
        temperature:attempt===0 ? 0.45 : 0.20,
        top_p:attempt===0 ? 0.85 : 0.75,
        repetition_penalty:1.08
      });
      reply = extractGeneratedText(result);
      screening = auditResidentReply({message:data.message,reply,mode:data.mode});
      if (screening.pass) break;
      if (attempt===0) {
        report('status',{message:'The draft failed a basic evidence check. Attempting a correction on-device…'});
        messages.splice(1,0,{role:'system',content:
          'Correction: Answer the MOST RECENT visitor question directly and only. '+
          'Never claim to know their mood, attitude, personal history, or any real-world event. '+
          'No invented source or unrelated example.'});
      }
    }
    if (!screening?.pass) {
      throw new Error('The local model could not pass the basic evidence screen ('+screening?.reason+'). No reply was presented.');
    }
    report('reply',{id,reply,model:MODEL_ID,source:'on-device-open-weights',
                    screening:'limited-pattern-screen-passed'});
  } catch (error) {
    report('error',{stage:'generate',id,message:String(error?.message||'The local model failed.').slice(0,220)});
  } finally { locked=false; }
};
