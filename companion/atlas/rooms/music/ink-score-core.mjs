/* Scratch-score grammar: drawing becomes original notes, not a personality test.
 * No network, model, or browser dependency. The visitor authors every stroke. */
export const SCALE = Object.freeze([110,130.81,146.83,164.81,196,220,261.63,293.66,329.63,392,440,523.25]);
const limit=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
export function cleanStroke(points){
 if(!Array.isArray(points))return [];
 const output=[];
 for(const p of points.slice(0,400)){
  if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;
  const x=limit(p.x,0,1),y=limit(p.y,0,1);
  if(output.length&&Math.hypot(output[output.length-1].x-x,output[output.length-1].y-y)<.007)continue;
  output.push({x:+x.toFixed(4),y:+y.toFixed(4)});
  if(output.length>=180)break;
 }
 return output;
}
export function strokeToEvents(points){
 const line=cleanStroke(points);if(!line.length)return [];
 // Each visited horizontal time cell can contain a distinct note, including
 // a stationary vertical gesture that sings a column of two registers.
 const groups=new Map();
 for(let i=0;i<line.length;i++){
  const p=line[i],beat=Math.min(15,Math.floor(p.x*16));
  const arr=groups.get(beat)||[];arr.push(p);groups.set(beat,arr);
 }
 const events=[];
 for(const [beat,arr] of groups){
  const meanY=arr.reduce((a,p)=>a+p.y,0)/arr.length;
  const register=limit(Math.round((1-meanY)*(SCALE.length-1)),0,SCALE.length-1);
  const wiggle=arr.slice(1).reduce((sum,p,i)=>sum+Math.abs(p.y-arr[i].y),0);
  const intensity=limit(.34+wiggle*.5+Math.log2(1+arr.length)*.07,.3,.85);
  events.push({beat,register,frequency:SCALE[register],velocity:+intensity.toFixed(3),duration:+limit(.14+arr.length*.018,.14,.6).toFixed(3)});
 }
 return events.sort((a,b)=>a.beat-b.beat).slice(0,16);
}
export function composeScore(strokes){
 if(!Array.isArray(strokes))return [];
 const scored=strokes.slice(-12).flatMap((stroke,i)=>strokeToEvents(stroke).map(e=>({...e,layer:i})));
 scored.sort((a,b)=>a.beat-b.beat||a.layer-b.layer);
 const byBeat=new Map(),result=[];
 for(const event of scored){const count=byBeat.get(event.beat)||0;if(count>=3)continue;result.push(event);byBeat.set(event.beat,count+1)}
 return result.slice(0,48);
}
export function validateSavedScore(obj){
 if(!obj||obj.schema!=='mc.ink-score.v1'||!Array.isArray(obj.strokes)||obj.strokes.length>12||!Number.isInteger(obj.tempo)||obj.tempo<48||obj.tempo>180)return null;
 const strokes=[];
 for(const raw of obj.strokes){if(!Array.isArray(raw)||raw.length>400)return null;const clean=cleanStroke(raw);if(!clean.length||raw.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>1||p.y<0||p.y>1))return null;strokes.push(clean)}
 return {schema:'mc.ink-score.v1',tempo:obj.tempo,strokes};
}