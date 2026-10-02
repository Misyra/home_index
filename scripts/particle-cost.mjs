// Count arithmetic calls in the actual renderer. This is a deterministic
// calculation audit, not a browser FPS or device performance benchmark.
import fs from 'node:fs';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const raw=fs.readFileSync('public/scripts/particle-data.js','utf8');
const data=JSON.parse(raw.slice(raw.indexOf('=')+1).trim().replace(/;$/,''));
const git=process.env.GIT_BIN||'C:/Users/Misyra/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const ref=process.argv[2]||'5faf8da0058b5df5aa251db406fa182ba9638e4c';
const before=spawnSync(git,['show',ref+':public/scripts/particles.js'],{encoding:'utf8'});
assert.equal(before.status,0,'Baseline Git revision is unavailable');
function audit(source){
  const calls={sin:0,hypot:0,sqrt:0};const math=Object.create(Math);
  for(const key of Object.keys(calls))math[key]=(...args)=>{calls[key]++;return Math[key](...args);};
  math.random=()=>.5;
  const rectangles=[];let paints=0;
  const ctx={clearRect(){paints++;rectangles.length=0;},setTransform(){},beginPath(){},arc(){},fill(){},fillRect(x,y,w,h){assert.ok([x,y,w,h].every(Number.isFinite));rectangles.push([x,y,w,h]);}};
  class Element extends EventTarget{constructor(){super();this.dataset={};this.classList={add(){},contains(){return false;}};}setAttribute(){}getBoundingClientRect(){return {width:720,height:560,left:0,top:0};}getContext(){return ctx;}}
  const section=new Element(),stage=new Element(),canvas=new Element(),nodes=new Map();
  for(const id of ['particle-scatter','particle-gather','particle-status'])nodes.set('#'+id,new Element());
  section.querySelector=s=>s==='canvas'?canvas:stage;nodes.set('#particles',section);
  const document=new Element();document.querySelector=s=>nodes.get(s);document.body=new Element();document.documentElement={dataset:{theme:'dark'}};
  let rafId=0;const frames=new Map();
  class Observer{constructor(callback){this.callback=callback;}observe(){this.callback([{isIntersecting:true}]);}}
  vm.runInNewContext(source,{window:{ROSSI_PARTICLE_DATA:data},document,Math:math,Float32Array,devicePixelRatio:1,performance:{now:()=>0},matchMedia:()=>({matches:false,addEventListener(){}}),IntersectionObserver:Observer,ResizeObserver:Observer,requestAnimationFrame:fn=>{frames.set(++rafId,fn);return rafId;},cancelAnimationFrame:id=>frames.delete(id),addEventListener(){}});
  function frame(time){for(const key in calls)calls[key]=0;const previous=paints;for(let i=0;i<5&&paints===previous;i++){const [id,fn]=frames.entries().next().value;frames.delete(id);fn(time);}assert.ok(paints>previous,'Frame must actually draw');return {calls:{...calls},pixels:rectangles.map(r=>r.slice())};}
  const idle=frame(33);canvas.dispatchEvent(Object.assign(new Event('pointermove'),{pointerType:'mouse',clientX:360,clientY:280}));const hovered=frame(66);
  assert.equal(idle.pixels.length,data.points.length);
  return {idle,hovered};
}
const old=audit(before.stdout),current=audit(fs.readFileSync('public/scripts/particles.js','utf8'));
for(let i=0;i<old.hovered.pixels.length;i++)for(let axis=0;axis<2;axis++)assert.ok(Math.abs(old.hovered.pixels[i][axis]-current.hovered.pixels[i][axis])<1e-8,'Repulsion must preserve particle positions');
assert.equal(current.idle.calls.hypot,0);assert.ok(current.idle.calls.sin<=50);assert.ok(current.hovered.calls.sqrt<data.points.length);
const report={points:data.points.length,before:{idle:old.idle.calls,hovered:old.hovered.calls},after:{idle:current.idle.calls,hovered:current.hovered.calls},positionCheck:'passed'};
fs.writeFileSync('scripts/particle-cost-result.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
