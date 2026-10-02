(()=>{
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');let effectsOn=true;try{effectsOn=localStorage.getItem('rainy-home-rain')!=='off';}catch{}
const rainButton=document.querySelector('#rain-switch'),canvas=document.querySelector('#rain-canvas'),context=canvas?.getContext('2d');let width=0,height=0,frame=0,lastTime=0,lastPaint=0;const drops=[],ripples=[];
function resize(){if(!context)return;width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=width*ratio;canvas.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);drops.length=0;ripples.length=0;for(let i=0;i<Math.min(55,Math.round(width/18));i++){const depth=i%3;drops.push({x:Math.random()*width,y:Math.random()*height,depth,speed:60+depth*55+Math.random()*40,length:5+depth*5+Math.random()*4});}}
function render(time){if(time-lastPaint<32){frame=requestAnimationFrame(render);return;}lastPaint=time;const dt=Math.min((time-lastTime)/1000,.04);lastTime=time;context.clearRect(0,0,width,height);context.lineCap='round';const dark=document.documentElement.dataset.theme==='dark',rgb=dark?'171,207,236':'124,171,201';
for(const drop of drops){drop.y+=drop.speed*dt;drop.x-=drop.speed*dt*.1;if(drop.y>height){if(ripples.length<12&&drop.depth>0)ripples.push({x:drop.x,y:height*(.74+Math.random()*.23),age:0,size:.7+Math.random()*.6});drop.y=-20;drop.x=Math.random()*width;}context.lineWidth=.65+drop.depth*.4;context.strokeStyle=`rgba(${rgb},${.1+drop.depth*.065})`;context.beginPath();context.moveTo(drop.x,drop.y);context.lineTo(drop.x-1-drop.depth,drop.y+drop.length);context.stroke();if(drop.depth===2){context.fillStyle=`rgba(${rgb},.2)`;context.beginPath();context.arc(drop.x-3,drop.y+drop.length,1.2,0,Math.PI*2);context.fill();}}
for(let i=ripples.length-1;i>=0;i--){const ripple=ripples[i];ripple.age+=dt;context.lineWidth=1;for(let ring=0;ring<2;ring++){const age=ripple.age-ring*.18;if(age<0)continue;context.strokeStyle=`rgba(${rgb},${Math.max(0,.19-age*.12)*(ring?.55:1)})`;context.beginPath();context.ellipse(ripple.x,ripple.y,(4+age*24)*ripple.size,(1+age*5)*ripple.size,0,0,Math.PI*2);context.stroke();}if(ripple.age>1.65)ripples.splice(i,1);}frame=requestAnimationFrame(render);}
function syncEffects(){document.body.classList.toggle('page-hidden',document.hidden);if(!effectsOn||reducedMotion.matches)document.querySelector('#mascot-button')?.classList.remove('wiggle');document.body.classList.toggle('effects-paused',!effectsOn);rainButton.setAttribute('aria-pressed',String(effectsOn));cancelAnimationFrame(frame);frame=0;if(context&&effectsOn&&!reducedMotion.matches&&!document.hidden){lastTime=performance.now();frame=requestAnimationFrame(render);}else context?.clearRect(0,0,width,height);document.dispatchEvent(new Event('rainy-effects-change'));}
resize();syncEffects();addEventListener('resize',resize);document.addEventListener('visibilitychange',syncEffects);reducedMotion.addEventListener('change',syncEffects);
rainButton.addEventListener('click',()=>{effectsOn=!effectsOn;syncEffects();try{localStorage.setItem('rainy-home-rain',effectsOn?'on':'off');}catch{}});
// 点击涟漪、弹起的小水珠和星星，关闭动效时一并停用。
let lastBurst=0;
function clickBurst(x,y){if(!effectsOn||reducedMotion.matches)return;const host=document.querySelector('dialog[open]')||document.body;const now=performance.now();if(now-lastBurst<55)return;lastBurst=now;
function particle(className,setup){const node=document.createElement('span');node.className=className;node.setAttribute('aria-hidden','true');node.style.left=`${x}px`;node.style.top=`${y}px`;setup?.(node);host.append(node);setTimeout(()=>node.remove(),1100);}
for(let i=0;i<2;i++)particle('click-ripple',node=>node.style.setProperty('--delay',`${i*100}ms`));
for(let i=0;i<6;i++){const angle=Math.PI*2*i/6;particle('click-droplet',node=>{node.style.setProperty('--dx',`${Math.cos(angle)*(24+Math.random()*18)}px`);node.style.setProperty('--dy',`${Math.sin(angle)*26-22}px`);node.style.setProperty('--turn',`${angle}rad`);});}
for(let i=0;i<2;i++)particle('click-spark',node=>{node.textContent=i?'✧':'♡';node.style.setProperty('--dx',`${i?27:-25}px`);node.style.setProperty('--dy',`${-48-i*15}px`);});}
document.addEventListener('pointerdown',event=>{if(event.isPrimary&&event.button===0)clickBurst(event.clientX,event.clientY);});
document.addEventListener('click',event=>{if(event.detail===0&&event.target instanceof Element){const target=event.target.closest('button,a');if(target){const rect=target.getBoundingClientRect();clickBurst(rect.x+rect.width/2,rect.y+rect.height/2);}}});
const greeting=document.querySelector('#greeting');let greetingTimer;
function showGreeting(message){if(!greeting)return;greeting.querySelector('.greeting-text').textContent=message;greeting.classList.add('show');clearTimeout(greetingTimer);greetingTimer=setTimeout(()=>greeting.classList.remove('show'),4200);}
// 昼夜主题：优先采用保存的选择，否则跟随系统。
const themeButton=document.querySelector('#theme-button'),systemTheme=matchMedia('(prefers-color-scheme: dark)');let themePreference=null;try{const saved=localStorage.getItem('rainy-home-theme');if(saved==='dark'||saved==='light')themePreference=saved;}catch{}
const moonIcon='<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>';
const sunIcon='<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
function applyTheme(theme){const dark=theme==='dark';document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]').content=dark?'#18263b':'#edf6fb';themeButton.setAttribute('aria-pressed',String(dark));themeButton.setAttribute('aria-label',dark?'切换到日间模式':'切换到夜间模式');themeButton.title=dark?'日间模式':'夜间模式';themeButton.querySelector('svg').innerHTML=dark?sunIcon:moonIcon;document.dispatchEvent(new Event('rainy-theme-change'));}
applyTheme(themePreference||(systemTheme.matches?'dark':'light'));
themeButton.addEventListener('click',()=>{themePreference=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(themePreference);try{localStorage.setItem('rainy-home-theme',themePreference);}catch{}if(effectsOn&&!reducedMotion.matches){themeButton.classList.remove('theme-twirl');void themeButton.offsetWidth;themeButton.classList.add('theme-twirl');}});
themeButton.addEventListener('animationend',()=>themeButton.classList.remove('theme-twirl'));systemTheme.addEventListener('change',event=>{if(!themePreference)applyTheme(event.matches?'dark':'light');});
// 页脚配置：站点真实创建时间；修改这一处即可调整起点。
(()=>{
  const siteStartDate='2026-10-02T14:20:43.468504Z';
  const counter=document.querySelector('#site-uptime');
  document.querySelector('#footer-year').textContent=String(new Date().getFullYear());
  const started=Date.parse(siteStartDate);let uptimeTimer;
  function update(){const elapsed=Math.max(0,Math.floor((Date.now()-started)/1000));const days=Math.floor(elapsed/86400),hours=Math.floor(elapsed%86400/3600),minutes=Math.floor(elapsed%3600/60),seconds=elapsed%60;counter.textContent=`${days} 天 ${String(hours).padStart(2,'0')} 小时 ${String(minutes).padStart(2,'0')} 分 ${String(seconds).padStart(2,'0')} 秒`;}
  function sync(){clearInterval(uptimeTimer);if(!document.hidden){update();uptimeTimer=setInterval(update,1000);}}
  document.addEventListener('visibilitychange',sync);addEventListener('pagehide',()=>clearInterval(uptimeTimer));addEventListener('pageshow',sync);sync();
})();

window.Rainy={reducedMotion,get effectsOn(){return effectsOn},showGreeting};
})();

