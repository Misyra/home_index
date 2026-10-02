// 修改这个数组即可换成自己的博客、主页和常用链接。
const bookmarks=[
{name:'GitHub',description:'代码、项目与开源灵感',url:'https://github.com/',icon:'icons/github.svg',color:'36,41,47'},
{name:'哔哩哔哩',description:'视频与快乐补给',url:'https://www.bilibili.com/',icon:'icons/bilibili.svg',color:'234,114,154'},
{name:'豆瓣',description:'书、电影与生活记录',url:'https://www.douban.com/',icon:'icons/douban.svg',color:'47,153,83'},
{name:'网易云音乐',description:'给每个雨天配一首歌',url:'https://music.163.com/',icon:'icons/neteasecloudmusic.svg',color:'215,75,83'},
{name:'Notion',description:'笔记、计划与小小想法',url:'https://www.notion.so/',icon:'icons/notion.svg',color:'60,64,69'},
{name:'花瓣',description:'收藏设计与视觉灵感',url:'https://huaban.com/',icon:'icons/huaban.png',color:'222,67,98'}];
const grid=document.querySelector('#link-grid');
bookmarks.forEach((item,i)=>{const link=document.createElement('a');link.className='site-link';link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.style.setProperty('--i',i);link.style.setProperty('--brand',item.color);link.setAttribute('aria-label',`${item.name}，在新标签页打开`);const icon=document.createElement('span');icon.className='link-icon';const image=document.createElement('img');image.src=item.icon;image.alt='';image.width=26;image.height=26;icon.append(image);const copy=document.createElement('span');copy.className='link-copy';const title=document.createElement('strong');title.textContent=item.name;const caption=document.createElement('small');caption.textContent=item.description;copy.append(title,caption);const arrow=document.createElement('span');arrow.className='link-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(icon,copy,arrow);grid.append(link);});
const navigationObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');navigationObserver.unobserve(entry.target);}},{threshold:.12});navigationObserver.observe(document.querySelector('#navigation'));
document.querySelector('#year').textContent=new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Asia/Shanghai'}).format(new Date());
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');let effectsOn=true;try{effectsOn=localStorage.getItem('rainy-home-rain')!=='off';}catch{}
const rainButton=document.querySelector('#rain-switch'),canvas=document.querySelector('#rain-canvas'),context=canvas.getContext('2d');let width=0,height=0,frame=0,lastTime=0;const drops=[],ripples=[];
function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);drops.length=0;ripples.length=0;for(let i=0;i<Math.min(90,Math.round(width/14));i++){const depth=i%3;drops.push({x:Math.random()*width,y:Math.random()*height,depth,speed:60+depth*55+Math.random()*40,length:5+depth*5+Math.random()*4});}}
function render(time){const dt=Math.min((time-lastTime)/1000,.04);lastTime=time;context.clearRect(0,0,width,height);context.lineCap='round';const dark=document.documentElement.dataset.theme==='dark',rgb=dark?'171,207,236':'124,171,201';
for(const drop of drops){drop.y+=drop.speed*dt;drop.x-=drop.speed*dt*.1;if(drop.y>height){if(ripples.length<20&&drop.depth>0)ripples.push({x:drop.x,y:height*(.74+Math.random()*.23),age:0,size:.7+Math.random()*.6});drop.y=-20;drop.x=Math.random()*width;}context.lineWidth=.65+drop.depth*.4;context.strokeStyle=`rgba(${rgb},${.1+drop.depth*.065})`;context.beginPath();context.moveTo(drop.x,drop.y);context.lineTo(drop.x-1-drop.depth,drop.y+drop.length);context.stroke();if(drop.depth===2){context.fillStyle=`rgba(${rgb},.2)`;context.beginPath();context.arc(drop.x-3,drop.y+drop.length,1.2,0,Math.PI*2);context.fill();}}
for(let i=ripples.length-1;i>=0;i--){const ripple=ripples[i];ripple.age+=dt;context.lineWidth=1;for(let ring=0;ring<2;ring++){const age=ripple.age-ring*.18;if(age<0)continue;context.strokeStyle=`rgba(${rgb},${Math.max(0,.19-age*.12)*(ring?.55:1)})`;context.beginPath();context.ellipse(ripple.x,ripple.y,(4+age*24)*ripple.size,(1+age*5)*ripple.size,0,0,Math.PI*2);context.stroke();}if(ripple.age>1.65)ripples.splice(i,1);}frame=requestAnimationFrame(render);}
function syncEffects(){if(!effectsOn||reducedMotion.matches)document.querySelector('#mascot-button').classList.remove('wiggle');document.body.classList.toggle('effects-paused',!effectsOn);rainButton.setAttribute('aria-pressed',String(effectsOn));cancelAnimationFrame(frame);frame=0;if(effectsOn&&!reducedMotion.matches&&!document.hidden){lastTime=performance.now();frame=requestAnimationFrame(render);}else context.clearRect(0,0,width,height);}
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
function showGreeting(message){greeting.textContent=message;greeting.classList.add('show');clearTimeout(greetingTimer);greetingTimer=setTimeout(()=>greeting.classList.remove('show'),2400);}
// 24条原创问候，打乱后逐条播放，一轮内不重复。
const characterMessages=[
'今天也要开心呀 ♡',
'送你一朵不会淋湿的云 ☁',
'滴答！很高兴遇见你 ♡',
'雨声这么好听，再待一会儿吧。',
'嘿！这把伞也有你的位置。',
'今天的快乐，偷偷装进口袋啦。',
'大肥鱼说，这个水洼归她啦！',
'要不要和我们一起放纸船？',
'啪嗒！刚才的水花像小星星。',
'雨停之前，先收下一个好心情。',
'别急，慢慢来就好。',
'今天也辛苦啦，来躲一会儿雨。',
'云朵正在帮我们把天空洗干净。',
'这次踩水花，我一定不会输！',
'暖暖的茶已经准备好啦。',
'嘘，听见雨滴打招呼了吗？',
'我的兜帽很暖，雨伞也很大。',
'这只纸船，载着一个小愿望。',
'再点一下？还有话想和你说。',
'星星躲在云后，也在偷偷看你。',
'能遇见你，今天的雨都变甜了。',
'跟着滴答滴答，给心情放个假。',
'大肥鱼的尾巴，又溅起水花啦！',
'把烦恼放进纸船，送它漂远一点。'];
let messageBag=[],lastMessage=-1;
function nextCharacterMessage(){if(!messageBag.length){messageBag=characterMessages.map((_,i)=>i);for(let i=messageBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[messageBag[i],messageBag[j]]=[messageBag[j],messageBag[i]];}if(messageBag.at(-1)===lastMessage)[messageBag[0],messageBag[messageBag.length-1]]=[messageBag[messageBag.length-1],messageBag[0]];}lastMessage=messageBag.pop();return characterMessages[lastMessage];}
const poses=[{src:'rain-girl.png',alt:'Q版洛茜撑着蓝色小雨伞，微笑挥手'},{src:'rain-girl-happy.png',alt:'Q版洛茜撑着蓝色小雨伞，闭眼笑着比耶，轻轻抬起一条腿'}];
let poseIndex=0,poseChanging=false;const mascotImage=document.querySelector('#mascot'),mascotButton=document.querySelector('#mascot-button');
const posePreload=new Image();posePreload.src=poses[1].src;
mascotButton.addEventListener('click',()=>{if(poseChanging)return;poseChanging=true;const next=(poseIndex+1)%poses.length;const image=new Image();image.onload=()=>{mascotButton.classList.add('pose-changing');setTimeout(()=>{poseIndex=next;mascotImage.src=poses[next].src;mascotImage.alt=poses[next].alt;mascotButton.classList.remove('pose-changing');if(effectsOn&&!reducedMotion.matches){mascotButton.classList.remove('wiggle');void mascotButton.offsetWidth;mascotButton.classList.add('wiggle');}showGreeting(nextCharacterMessage());poseChanging=false;},effectsOn&&!reducedMotion.matches?130:0);};image.onerror=()=>{poseChanging=false;showGreeting('图片加载慢了一点，再试一次吧');};image.src=poses[next].src;});
mascotButton.addEventListener('animationend',event=>{if(event.animationName==='wiggle')mascotButton.classList.remove('wiggle');});
const cgDialog=document.querySelector('#cg-dialog');
const cgScenes=[
{src:'rain-cg-splash.png',title:'一起踩水花',caption:'啪嗒！把小水洼踩成快乐的形状。',alt:'Q版洛茜和蓝色鱼尾女孩在雨中开心地踩水花'},
{src:'rain-cg-umbrella.png',title:'共撑一把伞',caption:'伞下的位置，刚好够我们两个。',alt:'Q版洛茜和蓝色鱼尾女孩共撑一把蓝色雨伞，在绣球花小路上散步'},
{src:'rain-cg-boats.png',title:'纸船漂呀漂',caption:'把小小的愿望，交给雨水和纸船。',alt:'Q版洛茜和蓝色鱼尾女孩蹲在浅浅的雨水边，一起放纸船'},
{src:'rain-cg.png',title:'窗边的热茶',caption:'窗外滴答滴答，杯里是暖暖的茶。',alt:'Q版洛茜坐在雨天窗边捧着一杯热茶'}];
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{const scene=cgScenes[Number(button.dataset.scene)],image=cgDialog.querySelector('.cg-full-image');image.src=scene.src;image.alt=scene.alt;document.querySelector('#cg-title').textContent=scene.title;document.querySelector('#cg-caption').textContent=scene.caption;cgDialog.showModal();}));
document.querySelector('#close-cg').addEventListener('click',()=>cgDialog.close());cgDialog.addEventListener('click',event=>{const rect=cgDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)cgDialog.close();});
// 昼夜主题：优先采用保存的选择，否则跟随系统。
const themeButton=document.querySelector('#theme-button'),systemTheme=matchMedia('(prefers-color-scheme: dark)');let themePreference=null;try{const saved=localStorage.getItem('rainy-home-theme');if(saved==='dark'||saved==='light')themePreference=saved;}catch{}
const moonIcon='<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>';
const sunIcon='<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
function applyTheme(theme){const dark=theme==='dark';document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]').content=dark?'#18263b':'#edf6fb';themeButton.setAttribute('aria-pressed',String(dark));themeButton.setAttribute('aria-label',dark?'切换到日间模式':'切换到夜间模式');themeButton.title=dark?'日间模式':'夜间模式';themeButton.querySelector('svg').innerHTML=dark?sunIcon:moonIcon;}
applyTheme(themePreference||(systemTheme.matches?'dark':'light'));
themeButton.addEventListener('click',()=>{themePreference=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(themePreference);try{localStorage.setItem('rainy-home-theme',themePreference);}catch{}if(effectsOn&&!reducedMotion.matches){themeButton.classList.remove('theme-twirl');void themeButton.offsetWidth;themeButton.classList.add('theme-twirl');}});
themeButton.addEventListener('animationend',()=>themeButton.classList.remove('theme-twirl'));systemTheme.addEventListener('change',event=>{if(!themePreference)applyTheme(event.matches?'dark':'light');});
let audioContext,rainGain,soundOn=false;const soundButton=document.querySelector('#sound-button');
soundButton.addEventListener('click',async()=>{try{if(!audioContext){const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)throw Error('Audio unavailable');audioContext=new AudioContextClass();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*4,audioContext.sampleRate),data=buffer.getChannelData(0);let previous=0;for(let i=0;i<data.length;i++){previous=(previous+.02*(Math.random()*2-1))/1.02;data[i]=previous*3.5;}const source=audioContext.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1400;rainGain=audioContext.createGain();rainGain.gain.value=0;source.connect(filter);filter.connect(rainGain);rainGain.connect(audioContext.destination);source.start();}await audioContext.resume();soundOn=!soundOn;rainGain.gain.setTargetAtTime(soundOn?.32:0,audioContext.currentTime,.3);soundButton.setAttribute('aria-pressed',String(soundOn));soundButton.setAttribute('aria-label',soundOn?'暂停雨声':'播放雨声');soundButton.title=soundOn?'暂停雨声':'听听雨声';}catch{greeting.textContent='这个浏览器暂时不能播放雨声';greeting.classList.add('show');clearTimeout(greetingTimer);greetingTimer=setTimeout(()=>greeting.classList.remove('show'),2500);}});
document.addEventListener('visibilitychange',()=>{if(audioContext&&soundOn){if(document.hidden)audioContext.suspend();else audioContext.resume().catch(()=>{});}});
