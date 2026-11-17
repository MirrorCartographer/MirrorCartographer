// Carnival of Thought: deliberately synthetic, deterministic fair-coin experiment.
// No network, identifiers, persistence, or claims about human judgment data.
export const CLAIMS = Object.freeze([
  Object.freeze({id:'fair',probability:0.5,label:'The coin is fair (50% heads)'}),
  Object.freeze({id:'leaning',probability:0.65,label:'The coin prefers heads (65%)'}),
  Object.freeze({id:'miracle',probability:0.9,label:'The coin LOVES heads (90%)'})
]);
export const TRIAL_STEP = 40;
export const MAX_TRIALS = 400;
const Z = 1.96;
const SEED = 20261117;

export function initialBooths() {
  return {claimIndex:2,supporters:1,trials:0,heads:0,seed:SEED};
}

export function wilson95(heads,trials) {
  if (!Number.isInteger(trials) || trials <= 0 || !Number.isInteger(heads) || heads<0 || heads>trials) return null;
  const observed=heads/trials, z2=Z*Z, den=1+z2/trials;
  const center=(observed+z2/(2*trials))/den;
  const half=Z*Math.sqrt((observed*(1-observed)+z2/(4*trials))/trials)/den;
  return {low:Math.max(0,center-half),high:Math.min(1,center+half)};
}

export function changeBooth(state,action) {
  const next={...state};
  if(action==='claim') next.claimIndex=(state.claimIndex+1)%CLAIMS.length;
  else if(action==='applause') next.supporters=Math.min(9,state.supporters+2);
  else if(action==='sample') {
    if(state.trials>=MAX_TRIALS) return next;
    const toRun=Math.min(TRIAL_STEP,MAX_TRIALS-state.trials);
    for(let i=0;i<toRun;i++){
      next.seed=(Math.imul(1664525,next.seed)+1013904223)>>>0;
      if(next.seed/4294967296<0.5)next.heads++;
      next.trials++;
    }
    // A fictional committee loses enthusiasm after an adverse sample.
    // The sample itself is calculated independently of committee votes.
    if(evaluateBooths(next).rejected)next.supporters=Math.max(1,next.supporters-1);
  }
  else if(action==='reset')return initialBooths();
  return next;
}

export function evaluateBooths(state) {
  const claim=CLAIMS[state.claimIndex];
  const range=wilson95(state.heads,state.trials);
  const rejected=!!range&&(claim.probability<range.low||claim.probability>range.high);
  const support=Math.min(9,Math.max(1,state.supporters));
  return {
    claim,range,rejected,
    crowdText:support+' of 9 committee chairs are applauding the claim',
    sampleText:state.trials ? state.heads+' heads / '+state.trials+' synthetic flips' : 'No flips conducted',
    rangeText:range ? Math.round(range.low*100)+'%–'+Math.round(range.high*100)+'% (approximate 95% Wilson interval)' : 'No interval without observations',
    verdict:!range
      ? 'No evidence collected. The confidence is decorative.'
      : rejected
        ? 'This synthetic sample is inconsistent with that claim at the approximate 95% interval. The committee is devastated.'
        : 'The claim is not excluded by this sample. That is not the same as proving it. Awkward.'
  };
}
