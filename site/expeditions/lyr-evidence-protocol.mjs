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
    'LYR evidence: '+frame.observations[0].assertion+
    ' This is an interface state, not a real-world measurement. '+
    'The visitor may report a claim; it is unverified. Your response is not evidence. '+
    'No invented memories, documents or outside actions. ';
  if (frame.mode === 'investigate') {
    return common+'INVESTIGATE: Answer the last question. State the unknown. '+
      'Give two distinguishable explanations if justified and one observation or test to separate them. '+
      'Stay specific, short and in character.';
  }
  return common+'DIALOGUE naturally: Answer the last question directly with one useful new thought. '+
    'Separate what is known from what is guessed when it matters.';
}
