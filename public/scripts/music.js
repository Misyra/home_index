// 复用 misyra-blog 的本地歌曲与 Meting 配置；媒体和歌单均在用户操作后加载。
(()=>{
  const panel=document.querySelector('#music-panel'),audio=document.querySelector('#music-audio'),launcher=document.querySelector('#music-launcher'),launcherCover=document.querySelector('#music-launcher-cover');
  const openButtons=[...document.querySelectorAll('[data-open-music]')];let expanded=false,closeTimer;
  const title=document.querySelector('#music-title'),artist=document.querySelector('#music-artist'),cover=document.querySelector('#music-cover');
  const play=document.querySelector('#music-play'),prev=document.querySelector('#music-prev'),next=document.querySelector('#music-next'),source=document.querySelector('#music-source');
  const progress=document.querySelector('#music-progress'),volume=document.querySelector('#music-volume'),status=document.querySelector('#music-status');
  const config=JSON.parse(panel.dataset.config),local=config.local,apis=config.apis;
  volume.value=String(Math.round(config.volume*100));
  let metingTracks,tracks=local,index=0,loadId=0,controller,busy=false,pendingPlay=false,lastPaint=0;
  try{const saved=Number(localStorage.getItem('rainy-home-volume'));if(localStorage.getItem('rainy-home-volume')!==null&&Number.isFinite(saved))volume.value=String(Math.max(0,Math.min(100,saved)));}catch{}
  audio.volume=Number(volume.value)/100;
  const format=s=>{if(!Number.isFinite(s))return'0:00';return`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;};
  function setExpanded(value){expanded=value;openButtons.forEach(button=>{button.setAttribute('aria-expanded',String(value));button.setAttribute('aria-controls','music-panel');});launcher.setAttribute('aria-label',value?'收起雨天音乐':'展开雨天音乐');launcher.title=value?'收起雨天音乐':'展开雨天音乐';}
  function open(){clearTimeout(closeTimer);panel.hidden=false;panel.inert=false;panel.classList.remove('closing');setExpanded(true);document.body.classList.add('music-open');if(!cover.hasAttribute('src'))cover.src=cover.dataset.src;}
  function close(){setExpanded(false);document.body.classList.remove('music-open');if(panel.contains(document.activeElement))launcher.focus();panel.inert=true;panel.classList.add('closing');clearTimeout(closeTimer);closeTimer=setTimeout(()=>{panel.hidden=true;panel.classList.remove('closing');},Rainy.reducedMotion.matches||!Rainy.effectsOn?0:180);}
  openButtons.forEach(button=>button.addEventListener('click',()=>{if(expanded)close();else open();}));
  document.querySelector('#music-close').addEventListener('click',close);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded&&!document.querySelector('dialog[open]'))close();});
  const localCover='assets/music-cover.avif',localCoverPng='assets/music-cover.png',coverPng=src=>src.replace(/\.avif$/,'.png');
  function coverFallback(img,drop){img.addEventListener('error',()=>{const src=img.getAttribute('src')||'';if(src.endsWith('.avif')){img.src=coverPng(src);return;}if(src!==localCoverPng&&src!==localCover){img.src=localCover;return;}if(drop)img.removeAttribute('src');});}
  coverFallback(launcherCover,false);
  coverFallback(cover,true);
  function syncPlay(){const playing=!audio.paused&&!audio.ended;play.innerHTML=playing?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg>';launcher.classList.toggle('playing',playing);play.setAttribute('aria-label',playing?'暂停音乐':'播放音乐');panel.classList.toggle('playing',playing);}
  function loadTrack(i){index=(i+tracks.length)%tracks.length;audio.pause();const track=tracks[index];audio.src=track.url;title.textContent=track.name;artist.textContent=track.artist;cover.src=track.pic||localCover;launcherCover.src=cover.src;prev.disabled=next.disabled=tracks.length<2;progress.value='0';progress.style.setProperty('--progress','0%');progress.disabled=true;document.querySelector('#music-current').textContent='0:00';document.querySelector('#music-duration').textContent='0:00';syncPlay();}
  async function start(){if(busy||pendingPlay)return;pendingPlay=true;play.disabled=true;const ver=loadId;if(!audio.getAttribute('src'))loadTrack(index);status.textContent='正在准备音乐…';try{await audio.play();if(ver===loadId)status.textContent='正在播放，愿这首歌陪你一会儿。';}catch(e){if(ver===loadId&&e.name!=='AbortError')status.textContent=e.name==='NotAllowedError'?'请再点一次播放。':'这首歌暂时不能播放，可以换个来源试试。';}finally{if(ver===loadId){pendingPlay=false;play.disabled=busy;syncPlay();}}}
  play.addEventListener('click',()=>{if(audio.paused)start();else{audio.pause();status.textContent='音乐暂停了，随时可以继续。';}});
  function changeTrack(delta){if(!tracks.length||busy)return;loadId++;pendingPlay=false;loadTrack(index+delta);start();}
  prev.addEventListener('click',()=>changeTrack(-1));next.addEventListener('click',()=>changeTrack(1));
  source.addEventListener('change',async()=>{
    const ver=++loadId;controller?.abort();audio.pause();pendingPlay=false;audio.removeAttribute('src');audio.load();syncPlay();
    if(source.value==='local'){busy=false;play.disabled=false;tracks=local;loadTrack(0);status.textContent='已切回小屋单曲，点播放开始。';return;}
    if(metingTracks){tracks=metingTracks;loadTrack(0);busy=false;play.disabled=false;status.textContent='已载入 '+tracks.length+' 首歌，点播放开始。';return;}busy=true;play.disabled=prev.disabled=next.disabled=true;status.textContent='正在读取网易云歌单…';let found;
    for(const url of apis){if(ver!==loadId)return;controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),6500);try{const response=await fetch(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('HTTP');const list=await response.json();if(!Array.isArray(list))throw Error('Invalid playlist');const safeUrl=u=>typeof u==='string'&&/^https?:\/\//.test(u);found=list.filter(item=>safeUrl(item.url)).slice(0,100).map(item=>({name:String(item.title||item.name||'未命名歌曲'),artist:String(item.author||item.artist||'未知歌手'),url:item.url,pic:safeUrl(item.pic||item.cover)?(item.pic||item.cover):''}));if(found.length)break;}catch{}finally{clearTimeout(timeout);}}
    if(ver!==loadId)return;busy=false;play.disabled=false;
    if(found?.length){metingTracks=found;tracks=found;loadTrack(0);status.textContent=`已载入 ${tracks.length} 首歌，点播放开始。`;}
    else{tracks=local;source.value='local';loadTrack(0);status.textContent='歌单暂时没连上，已切回博客同款单曲。';}
  });
  function paintVolume(){volume.style.setProperty('--progress',volume.value+'%');document.querySelector('#music-volume-value').textContent=volume.value+'%';}paintVolume();
  volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;paintVolume();try{localStorage.setItem('rainy-home-volume',volume.value);}catch{}});
  progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=audio.duration*Number(progress.value)/100;progress.style.setProperty('--progress',progress.value+'%');}});
  function updateTime(){if(!Number.isFinite(audio.duration)||audio.duration<=0)return;progress.disabled=false;progress.value=String(audio.currentTime/audio.duration*100);progress.style.setProperty('--progress',progress.value+'%');document.querySelector('#music-current').textContent=format(audio.currentTime);document.querySelector('#music-duration').textContent=format(audio.duration);}
  audio.addEventListener('timeupdate',()=>{const now=performance.now();if(now-lastPaint<250)return;lastPaint=now;updateTime();});
  audio.addEventListener('loadedmetadata',updateTime);audio.addEventListener('play',syncPlay);audio.addEventListener('pause',syncPlay);
  audio.addEventListener('ended',()=>{updateTime();if(tracks.length>1)changeTrack(1);else{syncPlay();status.textContent='这首歌播完啦，再听一次也很好。';}});
  audio.addEventListener('error',()=>{if(audio.getAttribute('src'))status.textContent='这首歌暂时不能播放，换一首或切回小屋单曲吧。';syncPlay();});
  addEventListener('pagehide',()=>{controller?.abort();audio.pause();clearTimeout(closeTimer);if(!expanded){panel.hidden=true;panel.classList.remove('closing');}});
})();

