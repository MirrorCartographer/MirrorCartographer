// Carnival After Hours: a small reversible game state, no persistence or personal data.
export const STATIONS=['mirror','wheel','gallery','radio','weather'];
export const GATE_STAMPS=4;
const bound=(n,a,b)=>Math.max(a,Math.min(b,n));
export const initialGame=()=>({
 stamps:[],galleryHits:0,galleryShots:0,mirrorAngle:0.12,
 frequency:89.3,weatherPressure:0,weather:'dry',
 wheelSpins:0,afterHours:false
});
export function collect(state,station){
 if(!STATIONS.includes(station)||state.stamps.includes(station))return state;
 return {...state,stamps:[...state.stamps,station]};
}
export const gateReady=state=>state.stamps.length>=GATE_STAMPS;
export function advance(state,event,value){
 switch(event){
  case 'mirror':{
   const angle=bound(Number(value)||0,0,1);
   const next={...state,mirrorAngle:angle};
   return Math.abs(angle-0.72)<=0.048?collect(next,'mirror'):next;
  }
  case 'wheel':return collect({...state,wheelSpins:state.wheelSpins+1},'wheel');
  case 'shot':{
   if(state.galleryShots>=6||state.galleryHits>=3)return state;
   const hits=state.galleryHits+(value==='evidence'?1:0);
   const next={...state,galleryShots:state.galleryShots+1,galleryHits:hits};
   return hits>=3?collect(next,'gallery'):next;
  }
  case 'reload':return {...state,galleryShots:0,galleryHits:0};
  case 'radio':{
   const next={...state,frequency:bound(Number(value)||87,87,108)};
   return Math.abs(next.frequency-94.6)<0.28?collect(next,'radio'):next;
  }
  case 'pressure':{
   const n=bound(Number(value)||0,0,1.25),weather=n>=1?'storm':n>.5?'rain':n>.12?'wind':'dry';
   const next={...state,weatherPressure:n,weather};
   return n>=1?collect(next,'weather'):next;
  }
  case 'gate':return gateReady(state)?{...state,afterHours:true}:state;
  case 'reset':return initialGame();
  default:return state;
 }
}
export function statusOf(state){
 return {
  stamps:state.stamps.length,need:Math.max(0,GATE_STAMPS-state.stamps.length),
  unlocked:gateReady(state),afterHours:state.afterHours,
  galleryRemain:Math.max(0,6-state.galleryShots)
 };
}
