// 打开播放器时读取网易云歌单（主、备接口依次尝试）；失败时回退小屋单曲。媒体与歌单均在用户操作后加载。
(()=>{
  const panel=document.querySelector('#music-panel'),audio=document.querySelector('#music-audio'),launcher=document.querySelector('#music-launcher'),launcherCover=document.querySelector('#music-launcher-cover');
  const openButtons=[...document.querySelectorAll('[data-open-music]')];let expanded=false,closeTimer;
  const title=document.querySelector('#music-title'),artist=document.querySelector('#music-artist'),cover=document.querySelector('#music-cover');
  const play=document.querySelector('#music-play'),prev=document.querySelector('#music-prev'),next=document.querySelector('#music-next');
  const progress=document.querySelector('#music-progress'),volume=document.querySelector('#music-volume'),status=document.querySelector('#music-status');
  const list=document.querySelector('#music-list'),listTitle=document.querySelector('#music-list-title'),listCount=document.querySelector('#music-list-count');
  const config=JSON.parse(panel.dataset.config),local=config.local,apis=config.apis;
  volume.value=String(Math.round(config.volume*100));
  let metingTracks,tracks=[],index=0,loadId=0,controller,busy=false,pendingPlay=false,lastPaint=0,listPromise;
  try{const saved=Number(localStorage.getItem('rainy-home-volume'));if(localStorage.getItem('rainy-home-volume')!==null&&Number.isFinite(saved))volume.value=String(Math.max(0,Math.min(100,saved)));}catch{}
  audio.volume=Number(volume.value)/100;
  const format=s=>{if(!Number.isFinite(s))return'0:00';return`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;};
  function setExpanded(value){expanded=value;openButtons.forEach(button=>{button.setAttribute('aria-expanded',String(value));button.setAttribute('aria-controls','music-panel');});launcher.setAttribute('aria-label',value?'收起雨天音乐':'展开雨天音乐');launcher.title=value?'收起雨天音乐':'展开雨天音乐';}
  function open(){clearTimeout(closeTimer);panel.hidden=false;panel.inert=false;panel.classList.remove('closing');setExpanded(true);document.body.classList.add('music-open');if(!cover.hasAttribute('src'))cover.src=cover.dataset.src;ensurePlaylist();}
  function close(){setExpanded(false);document.body.classList.remove('music-open');if(panel.contains(document.activeElement))launcher.focus();panel.inert=true;panel.classList.add('closing');clearTimeout(closeTimer);closeTimer=setTimeout(()=>{panel.hidden=true;panel.classList.remove('closing');},Rainy.reducedMotion.matches||!Rainy.effectsOn?0:180);}
  openButtons.forEach(button=>button.addEventListener('click',()=>{if(expanded)close();else open();}));
  document.querySelector('#music-close').addEventListener('click',close);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded&&!document.querySelector('dialog[open]'))close();});
  const localCover='assets/music-cover.avif',localCoverPng='assets/music-cover.png',coverPng=src=>src.replace(/\.avif$/,'.png');
  function coverFallback(img,drop){img.addEventListener('error',()=>{const src=img.getAttribute('src')||'';if(src.endsWith('.avif')){img.src=coverPng(src);return;}if(src!==localCoverPng&&src!==localCover){img.src=localCover;return;}if(drop)img.removeAttribute('src');});}
  coverFallback(launcherCover,false);
  coverFallback(cover,true);
  function syncPlay(){const playing=!audio.paused&&!audio.ended;play.innerHTML=playing?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg>';launcher.classList.toggle('playing',playing);play.setAttribute('aria-label',playing?'暂停音乐':'播放音乐');panel.classList.toggle('playing',playing);}
  function highlight(){const items=list.querySelectorAll('.music-item');items.forEach((button,i)=>{const current=i===index;button.classList.toggle('current',current);button.setAttribute('aria-current',current?'true':'false');});const node=items[index];if(node&&node.scrollIntoView)node.scrollIntoView({block:'nearest'});}
  function renderList(){list.replaceChildren();tracks.forEach((track,i)=>{const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='music-item';const name=document.createElement('span');name.className='music-item-name';name.textContent=track.name;const who=document.createElement('span');who.className='music-item-artist';who.textContent=track.artist;button.append(name,who);button.addEventListener('click',()=>playTrack(i));item.append(button);list.append(item);});listCount.textContent=tracks.length+' 首';highlight();}
  function loadTrack(i){index=(i+tracks.length)%tracks.length;audio.pause();const track=tracks[index];audio.src=track.url;title.textContent=track.name;artist.textContent=track.artist;cover.src=track.pic||localCover;launcherCover.src=cover.src;prev.disabled=next.disabled=tracks.length<2;progress.value='0';progress.style.setProperty('--progress','0%');progress.disabled=true;document.querySelector('#music-current').textContent='0:00';document.querySelector('#music-duration').textContent='0:00';highlight();syncPlay();}
  function ensurePlaylist(){
    if(metingTracks)return Promise.resolve(true);
    if(listPromise)return listPromise;
    busy=true;if(!pendingPlay)play.disabled=true;prev.disabled=next.disabled=true;status.textContent='正在读取网易云歌单…';
    listPromise=(async()=>{
      let found;
      for(const url of apis){controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),6500);try{const response=await fetch(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('HTTP');const data=await response.json();if(!Array.isArray(data))throw Error('Invalid playlist');const safeUrl=u=>typeof u==='string'&&/^https?:\/\//.test(u);found=data.filter(item=>safeUrl(item.url)).slice(0,100).map(item=>({name:String(item.title||item.name||'未命名歌曲'),artist:String(item.author||item.artist||'未知歌手'),url:item.url,pic:safeUrl(item.pic||item.cover)?(item.pic||item.cover):''}));if(found.length)break;}catch{}finally{clearTimeout(timeout);}}
      const hasCurrent=!!audio.getAttribute('src');
      if(found?.length){metingTracks=found;tracks=found;listTitle.textContent='网易云歌单';status.textContent='已载入 '+tracks.length+' 首歌，点一首开始。';}
      else{tracks=local;listTitle.textContent='小屋单曲';status.textContent='歌单暂时没连上，先用小屋单曲。';}
      if(hasCurrent){index=Math.max(0,tracks.findIndex(track=>track.url===audio.getAttribute('src')));renderList();prev.disabled=next.disabled=tracks.length<2;}
      else{renderList();loadTrack(0);}
      return !!(found?.length);
    })().finally(()=>{busy=false;if(!pendingPlay)play.disabled=false;if(!metingTracks)listPromise=null;});
    return listPromise;
  }
  async function start(){if(busy||pendingPlay)return;pendingPlay=true;play.disabled=true;const ver=loadId;try{if(!tracks.length)await ensurePlaylist();if(ver!==loadId)return;if(!audio.getAttribute('src'))loadTrack(index);status.textContent='正在准备音乐…';await audio.play();if(ver===loadId)status.textContent='正在播放，愿这首歌陪你一会儿。';}catch(e){if(ver===loadId&&e.name!=='AbortError')status.textContent=e.name==='NotAllowedError'?'请再点一次播放。':'这首歌暂时不能播放，换一首试试。';}finally{if(ver===loadId){pendingPlay=false;play.disabled=false;syncPlay();}}}
  play.addEventListener('click',()=>{if(audio.paused)start();else{audio.pause();status.textContent='音乐暂停了，随时可以继续。';}});
  function playTrack(i){if(!tracks.length||busy)return;loadId++;pendingPlay=false;loadTrack(i);start();}
  function changeTrack(delta){playTrack(index+delta);}
  prev.addEventListener('click',()=>changeTrack(-1));next.addEventListener('click',()=>changeTrack(1));
  function paintVolume(){volume.style.setProperty('--progress',volume.value+'%');document.querySelector('#music-volume-value').textContent=volume.value+'%';}paintVolume();
  volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;paintVolume();try{localStorage.setItem('rainy-home-volume',volume.value);}catch{}});
  progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=audio.duration*Number(progress.value)/100;progress.style.setProperty('--progress',progress.value+'%');}});
  function updateTime(){if(!Number.isFinite(audio.duration)||audio.duration<=0)return;progress.disabled=false;progress.value=String(audio.currentTime/audio.duration*100);progress.style.setProperty('--progress',progress.value+'%');document.querySelector('#music-current').textContent=format(audio.currentTime);document.querySelector('#music-duration').textContent=format(audio.duration);}
  audio.addEventListener('timeupdate',()=>{const now=performance.now();if(now-lastPaint<250)return;lastPaint=now;updateTime();});
  audio.addEventListener('loadedmetadata',updateTime);audio.addEventListener('play',syncPlay);audio.addEventListener('pause',syncPlay);
  audio.addEventListener('ended',()=>{updateTime();if(tracks.length>1)changeTrack(1);else{syncPlay();status.textContent='这首歌播完啦，再听一次也很好。';}});
  audio.addEventListener('error',()=>{if(audio.getAttribute('src'))status.textContent='这首歌暂时不能播放，换一首试试吧。';syncPlay();});
  addEventListener('pagehide',()=>{controller?.abort();audio.pause();clearTimeout(closeTimer);if(!expanded){panel.hidden=true;panel.classList.remove('closing');}});
})();
