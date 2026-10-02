(()=>{
const navigationObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');navigationObserver.unobserve(entry.target);}},{threshold:.12});navigationObserver.observe(document.querySelector('#navigation'));
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
const poses=[{src:'assets/rain-girl.webp',alt:'Q版洛茜撑着蓝色小雨伞，微笑挥手'},{src:'assets/rain-girl-happy.webp',alt:'Q版洛茜撑着蓝色小雨伞，闭眼笑着比耶，轻轻抬起一条腿'}];
let poseIndex=0,poseChanging=false;const mascotImage=document.querySelector('#mascot'),mascotButton=document.querySelector('#mascot-button');
const preload=()=>{const image=new Image();image.src=poses[1].src;};if('requestIdleCallback' in window)requestIdleCallback(preload,{timeout:5000});else setTimeout(preload,3500);
mascotButton.addEventListener('click',()=>{if(poseChanging)return;poseChanging=true;const next=(poseIndex+1)%poses.length;const image=new Image();image.onload=()=>{mascotButton.classList.add('pose-changing');setTimeout(()=>{poseIndex=next;mascotImage.src=poses[next].src;mascotImage.alt=poses[next].alt;mascotButton.classList.remove('pose-changing');if(Rainy.effectsOn&&!Rainy.reducedMotion.matches){mascotButton.classList.remove('wiggle');void mascotButton.offsetWidth;mascotButton.classList.add('wiggle');}Rainy.showGreeting(nextCharacterMessage());poseChanging=false;},Rainy.effectsOn&&!Rainy.reducedMotion.matches?130:0);};image.onerror=()=>{poseChanging=false;Rainy.showGreeting('图片加载慢了一点，再试一次吧');};image.src=poses[next].src;});
mascotButton.addEventListener('animationend',event=>{if(event.animationName==='wiggle')mascotButton.classList.remove('wiggle');});
const cgDialog=document.querySelector('#cg-dialog');
const cgScenes=[
{src:'assets/rain-cg-splash.webp',title:'一起踩水花',caption:'啪嗒！把小水洼踩成快乐的形状。',alt:'Q版洛茜和蓝色鱼尾女孩在雨中开心地踩水花'},
{src:'assets/rain-cg-umbrella.webp',title:'共撑一把伞',caption:'伞下的位置，刚好够我们两个。',alt:'Q版洛茜和蓝色鱼尾女孩共撑一把蓝色雨伞，在绣球花小路上散步'},
{src:'assets/rain-cg-boats.webp',title:'纸船漂呀漂',caption:'把小小的愿望，交给雨水和纸船。',alt:'Q版洛茜和蓝色鱼尾女孩蹲在浅浅的雨水边，一起放纸船'},
{src:'assets/rain-cg.webp',title:'窗边的热茶',caption:'窗外滴答滴答，杯里是暖暖的茶。',alt:'Q版洛茜坐在雨天窗边捧着一杯热茶'}];
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{const scene=cgScenes[Number(button.dataset.scene)],image=cgDialog.querySelector('.cg-full-image');image.src=scene.src;image.alt=scene.alt;document.querySelector('#cg-title').textContent=scene.title;document.querySelector('#cg-caption').textContent=scene.caption;cgDialog.showModal();}));
document.querySelector('#close-cg').addEventListener('click',()=>cgDialog.close());cgDialog.addEventListener('click',event=>{const rect=cgDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)cgDialog.close();});

})();