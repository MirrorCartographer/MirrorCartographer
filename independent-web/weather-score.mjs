const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,Number(value)||0));

export class WeatherScore {
  constructor({limit=8}={}){
    if(!Number.isInteger(limit)||limit<2||limit>32)throw new RangeError('limit must be an integer from 2 to 32');
    this.limit=limit;
    this.events=[];
  }

  add({x,y,force,at=Date.now()}){
    const event=Object.freeze({
      x:clamp(x),
      y:clamp(y),
      force:clamp(force),
      at:Number.isFinite(Number(at))?Number(at):Date.now()
    });
    this.events.push(event);
    if(this.events.length>this.limit)this.events.splice(0,this.events.length-this.limit);
    return event;
  }

  clear(){this.events.length=0}

  snapshot(){
    if(!this.events.length)return Object.freeze({count:0,centroid:{x:.5,y:.5},meanForce:0,span:0,interval:0,temperament:'unwritten'});
    const totalWeight=this.events.reduce((sum,event)=>sum+.15+event.force,0);
    const centroid=this.events.reduce((point,event)=>({
      x:point.x+event.x*(.15+event.force)/totalWeight,
      y:point.y+event.y*(.15+event.force)/totalWeight
    }),{x:0,y:0});
    const meanForce=this.events.reduce((sum,event)=>sum+event.force,0)/this.events.length;
    const span=this.events.length<2?0:Math.max(...this.events.map(event=>event.at))-Math.min(...this.events.map(event=>event.at));
    const interval=this.events.length<2?0:Math.round((this.events.at(-1).x-this.events.at(-2).x)*7+(this.events.at(-2).y-this.events.at(-1).y)*5);
    const temperament=meanForce>.72?'thunder-written':meanForce>.38?'weathering':'hushed';
    return Object.freeze({count:this.events.length,centroid,meanForce,span,interval,temperament});
  }

  points(){return this.events.map(event=>({...event}))}
}

export function scoreFrequency(baseHz,snapshot){
  const base=Math.max(40,Number(baseHz)||220);
  const steps=Math.max(-12,Math.min(12,Number(snapshot?.interval)||0));
  return base*Math.pow(2,steps/12);
}
