// 原创洛茜动画帧；canvas 可暂停，GIF 文件另外提供下载。
(()=>{
const pet=document.querySelector('#corner-pet'),canvas=pet.querySelector('canvas'),ctx=canvas.getContext('2d'),bubble=pet.querySelector('.pet-message');
const sheet=new Image(),durations=[1700,130,130,170,130,130,160,220];let ready=false,timer,messageTimer,current=0,drag,placed=false,moved=false;
const lines=['偷偷陪你躲一会儿雨 ♡','我在这里，雨天也不孤单。','把小小的快乐送给你！','兜帽里藏了一颗晴天。','今天也要照顾好自己呀。','啪嗒，接住这滴好心情！'];let line=0;
function paint(n){current=n;ctx.clearRect(0,0,192,208);ctx.drawImage(sheet,(n%4)*192,Math.floor(n/4)*208,192,208,0,0,192,208);}
function canAnimate(){return ready&&!document.hidden&&Rainy.effectsOn&&!Rainy.reducedMotion.matches&&!document.body.classList.contains('music-open')&&!document.querySelector('#welcome-toast.visible');}
function tick(){clearTimeout(timer);if(!canAnimate()){if(ready)paint(0);return;}timer=setTimeout(()=>{paint((current+1)%8);tick();},durations[current]);}
function sync(){clearTimeout(timer);if(ready){paint(0);tick();}}
sheet.onload=()=>{ready=true;pet.hidden=false;paint(0);tick();};sheet.onerror=()=>{if(sheet.src.endsWith('.avif'))sheet.src='assets/rossi-pet-sheet.png';};sheet.src='assets/rossi-pet-sheet.avif';
document.addEventListener('visibilitychange',sync);document.addEventListener('rainy-effects-change',sync);Rainy.reducedMotion.addEventListener('change',sync);
const observer=new MutationObserver(sync);observer.observe(document.body,{attributes:true,attributeFilter:['class']});observer.observe(document.querySelector('#welcome-toast'),{attributes:true,attributeFilter:['class']});
function clamp(x,y){const px=Math.max(8,Math.min(document.documentElement.clientWidth-pet.offsetWidth-8,x)),py=Math.max(8,Math.min(innerHeight-pet.offsetHeight-8,y));pet.style.left=`${px}px`;pet.style.top=`${py}px`;pet.style.right='auto';pet.style.bottom='auto';pet.classList.toggle('left-edge',px<210);pet.classList.toggle('top-edge',py<150);placed=true;}
pet.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=pet.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top,id:e.pointerId};moved=false;pet.setPointerCapture(e.pointerId);});
pet.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)moved=true;if(moved){pet.classList.add('dragging');clamp(drag.left+dx,drag.top+dy);}});
const release=()=>{drag=null;pet.classList.remove('dragging');};pet.addEventListener('pointerup',release);pet.addEventListener('pointercancel',()=>{moved=true;release();});
pet.addEventListener('click',event=>{if(moved&&event.detail!==0){moved=false;return;}bubble.textContent=lines[line++%lines.length];pet.classList.add('speaking');clearTimeout(messageTimer);messageTimer=setTimeout(()=>pet.classList.remove('speaking'),3000);if(canAnimate()){paint(2);tick();}});
addEventListener('resize',()=>{if(placed){const r=pet.getBoundingClientRect();clamp(r.left,r.top);}});addEventListener('pagehide',()=>{clearTimeout(timer);clearTimeout(messageTimer);});addEventListener('pageshow',sync);
})();
