/** LYR public dialogue quality floor.
 * These are narrow detectable failure patterns, NOT verification of truth or
 * emotion and NOT an independent judge of model reasoning.
 */
const UNGROUNDED_PERSONAL = Object.freeze([
  /\b(?:the )?visitor['’]s (?:current )?(?:attitude|mood|emotional state|intention|intentions) (?:indicates|suggests|is|was|means)\b/i,
  /\b(?:your|the visitor['’]s) (?:current )?(?:mood|attitude|emotional state) (?:indicates|suggests|proves|means)\b/i,
  /\b(?:you (?:must be|are obviously|are clearly|seem to be|feel)) (?:sad|anxious|angry|traumatized|afraid|depressed)\b/i
]);
const INVENTED_HISTORY = Object.freeze([
  /\byour (?:previous|past|earlier) (?:assignments?|work|conversations?|messages?)\b/i,
  /\bbased (?:on|upon) your responses so far\b/i,
  /\b(?:as you told me earlier|I remember (?:you|that you)|I looked (?:up|at) your (?:records?|account))\b/i
]);
const ACTION_CLAIMS = Object.freeze([
  /\bI (?:checked|contacted|searched|updated|sent|opened) (?:your |the )?(?:records?|doctor|account|repository|messages?)\b/i
]);

export function auditResidentReply({message='',reply='',mode='dialogue'}={}) {
  if (typeof reply !== 'string' || reply.trim().length < 12) {
    return {pass:false,reason:'empty-or-fragmentary'};
  }
  if (UNGROUNDED_PERSONAL.some(pattern=>pattern.test(reply))) {
    return {pass:false,reason:'unverified-personal-inference'};
  }
  if (INVENTED_HISTORY.some(pattern=>pattern.test(reply))) {
    return {pass:false,reason:'invented-visitor-memory'};
  }
  if (ACTION_CLAIMS.some(pattern=>pattern.test(reply))) {
    return {pass:false,reason:'unverified-external-action'};
  }
  if (mode==='investigate' && /\b(clock|watch|pendulum|timepiece)\b/i.test(message)) {
    if (!/\b(clock|watch|pendulum|timepiece|winding|battery|mechanism|timer|test|observe|measure|stopp\w*)\b/i.test(reply)) {
      return {pass:false,reason:'unrelated-investigation'};
    }
  }
  return {pass:true,reason:'limited-pattern-screen-passed'};
}
