// Hushwood: graph navigation through user-placed lanterns.
// Pure math. No browser APIs, identifiers, persistence, analytics or network calls.
export const MAX_LIGHTS=22;
export const LINK_RADIUS=.29;
const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
const distance=(a,b,aspect)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y);
export const startForest=()=>({lanterns:[],visited:[],at:null,open:false,entered:false});
export function plantLight(state,x,y,aspect=1) {
 const point={x:Number(x),y:Number(y)},a=clamp(Number(aspect)||1,.3,3);
 if(!Number.isFinite(point.x)||!Number.isFinite(point.y)||point.x<.035||point.x>.965||point.y<.33||point.y>.84)return state;
 if(state.lanterns.length>=MAX_LIGHTS||state.lanterns.some(p=>distance(p,point,a)<.055))return state;
 const lanterns=[...state.lanterns,point];
 return {...state,lanterns,at:state.at===null?0:state.at,visited:state.at===null?[0]:state.visited};
}
export function edgesOf(state,aspect=1) {
 const result=[],a=clamp(Number(aspect)||1,.3,3);
 for(let i=0;i<state.lanterns.length;i++){
  for(let j=i+1;j<state.lanterns.length;j++)if(distance(state.lanterns[i],state.lanterns[j],a)<=LINK_RADIUS)result.push([i,j]);
 }
 return result;
}
export function routeTo(state,target,aspect=1) {
 if(!Number.isInteger(target)||target<0||target>=state.lanterns.length||state.at===null)return null;
 const adj=Array.from({length:state.lanterns.length},()=>[]);
 edgesOf(state,aspect).forEach(([i,j])=>{adj[i].push(j);adj[j].push(i)});
 const queue=[state.at],from=new Map([[state.at,-1]]);
 for(let i=0;i<queue.length;i++){
  const node=queue[i];if(node===target)break;
  for(const neighbor of adj[node])if(!from.has(neighbor)){from.set(neighbor,node);queue.push(neighbor)}
 }
 if(!from.has(target))return null;
 const route=[];let node=target;
 while(node!==-1){route.unshift(node);node=from.get(node)}
 return route;
}
export function triadOf(state) {
 let best=null;
 for(let i=0;i<state.visited.length;i++)for(let j=i+1;j<state.visited.length;j++)for(let k=j+1;k<state.visited.length;k++){
  const ids=[state.visited[i],state.visited[j],state.visited[k]],a=state.lanterns[ids[0]],b=state.lanterns[ids[1]],c=state.lanterns[ids[2]];
  const area=Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))*.5;
  if(!best||area>best.area)best={ids,area,center:{x:(a.x+b.x+c.x)/3,y:(a.y+b.y+c.y)/3}};
 }
 return best;
}
export function visitLight(state,index){
 if(!Number.isInteger(index)||index<0||index>=state.lanterns.length)return state;
 const visited=state.visited.includes(index)?state.visited:[...state.visited,index];
 const next={...state,at:index,visited};
 const triad=triadOf(next);
 return {...next,open:state.open||!!triad&&triad.area>=.004};
}
export function portalAt(state){
 if(!state.open)return null;
 const triad=triadOf(state);
 if(!triad)return null;
 return {x:clamp(triad.center.x,.18,.82),y:clamp(triad.center.y-.2,.34,.59)};
}
export function enterTheatre(state){return state.open?{...state,entered:true}:state}
export const clearForest=()=>startForest();
