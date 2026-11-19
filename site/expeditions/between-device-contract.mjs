/** The Between's device-only dialogue adapter. No server APIs or persistence. */
export const MODEL_ID = 'HuggingFaceTB/SmolLM2-135M-Instruct';
export const RESIDENTS = Object.freeze({
  morrow: {
    name: 'Morrow',
    identity: 'a moth-like keeper of a peculiar night station, observant and dryly funny; keeps the keys and admits when the records do not explain an event'
  },
  vesper: {
    name: 'Vesper',
    identity: 'a suspicious station cat with a sharp sense of humor; notices small concrete details, despises overconfident explanations and does not pretend to be a human'
  }
});
const SCENES = new Set(['still', 'wind', 'storm']);
export function buildResidentMessages({resident, message, history=[], scene='still'}={}) {
  const character = RESIDENTS[resident];
  if (!character) throw new TypeError('Unknown station resident');
  if (typeof message !== 'string' || !message.trim() || message.length > 600) {
    throw new RangeError('Enter a message under 600 characters');
  }
  const limitedHistory = (Array.isArray(history) ? history : [])
    .filter(x => x && (x.role === 'user' || x.role === 'assistant')
                 && typeof x.content === 'string')
    .slice(-6).map(x => ({role:x.role, content:x.content.slice(0,600)}));
  const observedScene = SCENES.has(scene) ? scene : 'still';
  return [
    {role:'system',content:
      'Write a short fictional dialogue response for '+character.name+', '+character.identity+'. '+
      'Be responsive to the actual visitor question, specific, surprising and concise. '+
      'The room weather was explicitly selected as '+observedScene+'; this is a scene control, not a reading of the visitor. '+
      'Distinguish observations from interpretations. Admit uncertainty and never invent sources, private memory, '+
      'real-world actions or working services. No diagnosis, claims of consciousness, or coercive attachment. '+
      'Do not claim this small on-device language model is LYR or trained by Mirror Cartographer.'},
    ...limitedHistory,
    {role:'user',content:message.trim()}
  ];
}
export function extractGeneratedText(result) {
  const value = result?.[0]?.generated_text;
  const response = Array.isArray(value) ? value.filter(x => x && x.role === 'assistant').at(-1)?.content
    : typeof value === 'string' ? value : null;
  if (typeof response !== 'string') throw new TypeError('No assistant text returned by model');
  const text = response.replace(/<\|[^>]+\|>/g,'').trim().slice(0,1400);
  if (!text) throw new TypeError('The model returned an empty response');
  return text;
}

/** A navigator.gpu object alone is not evidence that WebGPU is available. */
export async function getUsableGpuAdapter(navigatorLike) {
  if (typeof navigatorLike?.gpu?.requestAdapter !== 'function') return null;
  try { return (await navigatorLike.gpu.requestAdapter()) || null; }
  catch { return null; }
}
