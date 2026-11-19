/** LYR epistemic protocol v0.1 — first-party software, not neural weights.
 * No user emotion, identity, diagnosis, or real-world cause is inferred.
 * All records are ephemeral; consumers must not persist without a distinct opt-in.
 */
export const PROTOCOL_VERSION = 'lyr-evidence-procedure/0.1';
export const VALID_MODES = Object.freeze(['dialogue', 'investigate']);
export const VALID_WEATHER = Object.freeze(['still', 'wind', 'storm']);

export function makeEvidenceFrame({scene = 'still', mode = 'dialogue', message = ''} = {}) {
  const weather = VALID_WEATHER.includes(scene) ? scene : 'still';
  const task = VALID_MODES.includes(mode) ? mode : 'dialogue';
  if (typeof message !== 'string' || !message.trim() || message.length > 600) {
    throw new RangeError('A bounded visitor message is required.');
  }
  return {
    version: PROTOCOL_VERSION,
    mode: task,
    observations: [{
      source: 'rendered-ui-scene-state',
      assertion: 'The rendered scene weather control currently reads '+weather+'.',
      limits: 'Scene control cannot reveal a visitor’s emotions, the cause of actual weather, or any outside-world event.'
    }],
    visitor_message: {
      source: 'visitor-authored-text',
      status: 'question-or-report-not-independent-evidence',
      limits: 'Do not assume claims in the message were verified.'
    },
    generated_reply: {
      source: 'open-weight-language-model',
      status: 'interpretation-not-observation',
      limits: 'Generated language alone is not evidence of an external fact.'
    }
  };
}
export function procedureInstructions(frame) {
  if (!frame || frame.version !== PROTOCOL_VERSION) throw new TypeError('Unknown evidence procedure.');
  const common =
    'LYR EVIDENCE PROCEDURE (first-party Mirror Cartographer software; NOT its independently trained research model). '+
    'Known directly: '+frame.observations[0].assertion+' '+frame.observations[0].limits+' '+
    'The visitor’s message is a question or unverified report, not an independently verified event. '+
    'Your generated reply is a proposal or interpretation, never a new observed fact. '+
    'Do not fabricate sensory observations, memories, documents, real-world actions or causal certainty. ';
  if (frame.mode === 'investigate') {
    return common+
      'INVESTIGATE instead of merely mirroring: state the key unknown; propose two distinguishable explanations where justified; '+
      'offer one concrete observation or test that could distinguish them. '+
      'If the evidence cannot support two meaningful explanations, say what evidence is missing. Stay concise and in character.';
  }
  return common+
    'DIALOGUE naturally: answer the actual question with character and imagination, do not mechanically paraphrase it. '+
    'Distinguish a known fact from a guess when that distinction matters.';
}
