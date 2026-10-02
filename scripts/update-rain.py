from pathlib import Path
p=Path('public/scripts/site.js')
s=p.read_text(encoding='utf-8')
a=s.index('const rainButton='); b=s.index('function syncEffects()')
s=s[:a]+'''const rainButton=document.querySelector('#rain-switch'),canvas=document.querySelector('#rain-canvas'),context=canvas?.getContext('2d');
let width=0,height=0,frame=0,lastTime=0,lastPaint=0;const drops=[],ripples=[];
const layers=[{speed:310,length:9,alpha:.12,weight:.55},{speed:540,length:17,alpha:.19,weight:.8},{speed:800,length:26,alpha:.28,weight:1.1}];
function spawn(drop,initial=false){const layer=layers[drop.depth];drop.x=Math.random()*(width+100)-70;drop.ground=height*(.86+Math.random()*.14);drop.y=initial?Math.random()*drop.ground:-40-Math.random()*height*.15;drop.speed=layer.speed*(.8+Math.random()*.4);drop.length=layer.length*(.8+Math.random()*.4);}
function resize(){if(!context)return;width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);drops.length=0;ripples.length=0;for(let i=0;i<Math.min(110,Math.round(width/12));i++){const drop={depth:i%5===0?2:i%2};spawn(drop,true);drops.push(drop);}}
function render(time){if(time-lastPaint<32){frame=requestAnimationFrame(render);return;}lastPaint=time;const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;context.clearRect(0,0,width,height);context.lineCap='butt';const dark=document.documentElement.dataset.theme==='dark',rgb=dark?'184,219,244':'72,125,159',wind=.13+Math.sin(time/7500)*.025;
for(const drop of drops){const layer=layers[drop.depth];drop.y+=drop.speed*dt;drop.x+=drop.speed*wind*dt;
if(drop.y>=drop.ground){if(ripples.length<18&&drop.depth>0&&drop.x>0&&drop.x<width)ripples.push({x:drop.x,y:drop.ground,age:0,scale:drop.depth===2?1:.65});spawn(drop);continue;}
context.lineWidth=layer.weight;context.strokeStyle=`rgba(${rgb},${layer.alpha*.45})`;context.beginPath();context.moveTo(drop.x-drop.length*wind,drop.y-drop.length);context.lineTo(drop.x,drop.y);context.stroke();
context.strokeStyle=`rgba(${rgb},${layer.alpha})`;context.beginPath();context.moveTo(drop.x-drop.length*wind*.35,drop.y-drop.length*.35);context.lineTo(drop.x,drop.y);context.stroke();}
for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];r.age+=dt;const fade=Math.max(0,1-r.age/.65);context.strokeStyle=`rgba(${rgb},${fade*.22})`;context.lineWidth=.7;context.beginPath();context.ellipse(r.x,r.y,(2+r.age*28)*r.scale,(.6+r.age*5)*r.scale,0,0,Math.PI*2);context.stroke();
if(r.age<.22){context.strokeStyle=`rgba(${rgb},${(1-r.age/.22)*.3})`;context.beginPath();for(let j=0;j<3;j++){const dx=(j-1)*(2+r.age*18)*r.scale,dy=-Math.sin(r.age/.22*Math.PI)*(3+j%2*3)*r.scale;context.moveTo(r.x+dx,r.y+dy);context.lineTo(r.x+dx*.85,r.y+dy+1.5);}context.stroke();}
if(r.age>.65)ripples.splice(i,1);}
frame=requestAnimationFrame(render);}
''' + s[b:]
p.write_text(s,encoding='utf-8')
