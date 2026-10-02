// 将下方常用网站替换成你自己的博客、社交主页和收藏。
const bookmarks = [
  {name:'GitHub',description:'代码与奇妙的想法',url:'https://github.com/',icon:'⌘',color:'#667588',background:'#eef1f4'},
  {name:'Notion',description:'整理生活的小本子',url:'https://www.notion.so/',icon:'N',color:'#59616c',background:'#f2f2f1'},
  {name:'哔哩哔哩',description:'快乐补给站',url:'https://www.bilibili.com/',icon:'▣',color:'#80aec9',background:'#edf5fb'},
  {name:'网易云音乐',description:'给雨天配一首歌',url:'https://music.163.com/',icon:'♪',color:'#c88f91',background:'#fbefee'},
  {name:'豆瓣',description:'书影音里的小宇宙',url:'https://www.douban.com/',icon:'豆',color:'#8aa885',background:'#eff5eb'},
  {name:'花瓣',description:'把灵感一点点收藏',url:'https://huaban.com/',icon:'✿',color:'#bc9bb1',background:'#f6eff5'}
];
const linkGrid = document.querySelector('#link-grid');
for (const item of bookmarks) {
  const link = document.createElement('a');
  link.className='site-link'; link.href=item.url; link.target='_blank'; link.rel='noopener noreferrer';
  link.setAttribute('aria-label',`${item.name}，在新标签页打开`);
  const icon=document.createElement('span'); icon.className='link-icon';icon.textContent=item.icon;icon.style.color=item.color;icon.style.background=item.background;icon.setAttribute('aria-hidden','true');
  const copy=document.createElement('span');copy.className='link-copy';
  const title=document.createElement('strong');title.textContent=item.name;
  const description=document.createElement('small');description.textContent=item.description;
  copy.append(title,description);
  const arrow=document.createElement('span');arrow.className='link-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
  link.append(icon,copy,arrow);linkGrid.append(link);
}
const now=new Date();
document.querySelector('#today').textContent=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now);
document.querySelector('#today').dateTime=now.toISOString();
document.querySelector('#year').textContent=new Intl.DateTimeFormat('en',{timeZone:'Asia/Shanghai',year:'numeric'}).format(now);
const rainLayer=document.querySelector('.rain-layer');
for(let i=0;i<30;i++){const drop=document.createElement('i');drop.className='rain-drop';drop.style.left=`${Math.random()*110}%`;drop.style.animationDuration=`${2.5+Math.random()*3}s`;drop.style.animationDelay=`${-Math.random()*6}s`;rainLayer.append(drop);}
let rainOn=true;
try{rainOn=localStorage.getItem('rainy-home-rain')!=='off';}catch{}
function setRain(){document.body.classList.toggle('rain-paused',!rainOn);document.querySelector('#rain-switch').setAttribute('aria-pressed',String(rainOn));}
setRain();
document.querySelector('#rain-switch').addEventListener('click',()=>{rainOn=!rainOn;setRain();try{localStorage.setItem('rainy-home-rain',rainOn?'on':'off');}catch{}});
const dialog=document.querySelector('#detail-dialog');
const pages={
  journal:{category:'雨天手记',html:'<span class="demo-label">示例手记 · 可以换成你的故事</span><h2 class="dialog-heading">把一个雨天，过得慢一点</h2><div class="dialog-body"><p>雨从午后开始下。窗外的叶子被洗得很绿，路过的人撑着伞，像一朵朵慢慢移动的小花。</p><p>给自己泡了一杯热茶，把没读完的书翻开。原来不必每一天都很特别，一个安静的下午，也值得被好好记住。</p><p>如果你也刚好路过这里，希望这间小屋能让你歇一歇。等雨小一点，再出发吧。</p></div><p class="dialog-caption">这是小屋的示例内容。你可以将手记入口链接到自己的博客。</p>'},
  album:{category:'光影相册',html:'<h2 class="dialog-heading">雨天的一点可爱</h2><img class="dialog-image" src="rain-cat.png" alt="一只小白猫撑着绿色雨伞，在小水洼中散步"><p class="dialog-caption">小屋主题插画 · 愿每一场雨，都有可爱的陪伴。</p>'},
  about:{category:'关于小屋',html:'<h2 class="dialog-heading">很高兴，在这里遇见你 ☂</h2><div class="dialog-body"><p>雨间小屋是一张小小的个人导航页，装着日常、喜欢的音乐、偶然遇见的灵感，还有通往其他地方的小路。</p><p>你可以在这里翻翻手记，去常用网站逛逛，或者按下「听听雨声」，给自己留一会儿安静的时间。</p><p>现在展示的是示例介绍和手记。把它们换成你的名字、你的故事，再放上自己的博客链接，这间小屋就属于你啦。</p></div>'}
};
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{const page=pages[button.dataset.open];document.querySelector('#dialog-category').textContent=page.category;document.querySelector('#dialog-content').innerHTML=page.html;dialog.showModal();}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
let audioContext,noiseSource,rainGain,soundOn=false;
const soundButton=document.querySelector('#sound-button');
soundButton.addEventListener('click',async()=>{
  try{
    if(!audioContext){
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;
      if(!AudioContextClass)throw new Error('audio unsupported');
      audioContext=new AudioContextClass();
      const buffer=audioContext.createBuffer(1,audioContext.sampleRate*4,audioContext.sampleRate);
      const data=buffer.getChannelData(0);let previous=0;
      for(let i=0;i<data.length;i++){const white=Math.random()*2-1;previous=(previous+.02*white)/1.02;data[i]=previous*3.5;}
      noiseSource=audioContext.createBufferSource();noiseSource.buffer=buffer;noiseSource.loop=true;
      const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1400;
      rainGain=audioContext.createGain();rainGain.gain.value=0;noiseSource.connect(filter);filter.connect(rainGain);rainGain.connect(audioContext.destination);noiseSource.start();
    }
    await audioContext.resume();soundOn=!soundOn;rainGain.gain.setTargetAtTime(soundOn?.32:0,audioContext.currentTime,.4);
    soundButton.setAttribute('aria-pressed',String(soundOn));soundButton.querySelector('.sound-label').textContent=soundOn?'雨声播放中':'听听雨声';
  }catch{soundButton.querySelector('.sound-label').textContent='当前浏览器暂不支持雨声';}
});
document.addEventListener('visibilitychange',()=>{if(audioContext&&soundOn){if(document.hidden)audioContext.suspend();else audioContext.resume().catch(()=>{});}});
