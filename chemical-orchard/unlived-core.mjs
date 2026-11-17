/* Counterfactual twin. Both worlds begin from identical seed and parameters.
   Interventions enter only the lived branch. Neither branch describes a person. */
import {RECIPES,createField,seedField,advance,inoculate} from './reaction-core.mjs';
import {distillFields} from '../world-imprint.mjs';
export function createTwins(w,h,seed){return {lived:seedField(createField(w,h),seed),unlived:seedField(createField(w,h),seed),interventions:0};}
export function intervene(t,x,y,r=5,amount=.9){inoculate(t.lived,x,y,r,amount);t.interventions++;return t;}
export function advanceTwins(t,recipe=RECIPES[0],steps=1){advance(t.lived,recipe,steps);advance(t.unlived,recipe,steps);return t;}
export function divergence(t){let total=0;const a=t.lived.b,b=t.unlived.b;for(let i=0;i<a.length;i++)total+=Math.abs(a[i]-b[i]);return total/a.length;}
export function distillTwins(t,recipe){return distillFields(t.lived.b,t.unlived.b,t.lived.width,t.lived.height,recipe.id,t.lived.ticks);}