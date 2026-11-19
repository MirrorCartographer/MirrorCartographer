import { MODEL_ID, buildResidentMessages, extractGeneratedText } from './between-device-contract.mjs';

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
    if (self.navigator?.gpu) {
      try {
        report('status', {message:'Trying the local graphics processor…'});
        engine = await pipeline('text-generation', MODEL_ID, {
          ...options, device:'webgpu', dtype:'q4f16'
        });
      } catch (error) {
        report('status', {message:'Graphics mode unavailable. Trying local CPU…'});
      }
    }
    if (!engine) {
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
      resident:data.resident, message:data.message, history:data.history, scene:data.scene
    });
    report('thinking',{id});
    const result = await engine(messages, {
      max_new_tokens:112,
      do_sample:true,
      temperature:0.72,
      top_p:0.9,
      repetition_penalty:1.13
    });
    const reply = extractGeneratedText(result);
    report('reply',{id,reply,model:MODEL_ID,source:'on-device-open-weights'});
  } catch (error) {
    report('error',{stage:'generate',id,message:String(error?.message||'The local model failed.').slice(0,220)});
  } finally { locked=false; }
};
