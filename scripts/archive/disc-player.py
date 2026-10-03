from pathlib import Path
p=Path('public/scripts/music.js');s=p.read_text(encoding='utf-8')
s=s.replace("const panel=document.querySelector('#music-panel'),audio=document.querySelector('#music-audio');","const panel=document.querySelector('#music-panel'),audio=document.querySelector('#music-audio'),launcher=document.querySelector('#music-launcher'),launcherCover=document.querySelector('#music-launcher-cover');\n  const openButtons=[...document.querySelectorAll('[data-open-music]')];let expanded=false,closeTimer;")
a=s.index('  function open(){');b=s.index("  cover.addEventListener('error'",a)
s=s[:a]+'''  function setExpanded(value){expanded=value;openButtons.forEach(button=>{button.setAttribute('aria-expanded',String(value));button.setAttribute('aria-controls','music-panel');});launcher.setAttribute('aria-label',value?'收起雨天音乐':'展开雨天音乐');launcher.title=value?'收起雨天音乐':'展开雨天音乐';}
  function open(){clearTimeout(closeTimer);panel.hidden=false;panel.inert=false;panel.classList.remove('closing');setExpanded(true);document.body.classList.add('music-open');if(!cover.hasAttribute('src'))cover.src=cover.dataset.src;}
  function close(){setExpanded(false);document.body.classList.remove('music-open');if(panel.contains(document.activeElement))launcher.focus();panel.inert=true;panel.classList.add('closing');clearTimeout(closeTimer);closeTimer=setTimeout(()=>{panel.hidden=true;panel.classList.remove('closing');},Rainy.reducedMotion.matches||!Rainy.effectsOn?0:180);}
  openButtons.forEach(button=>button.addEventListener('click',()=>{if(expanded)close();else open();}));
  document.querySelector('#music-close').addEventListener('click',close);
  panel.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  launcherCover.addEventListener('error',()=>{if(launcherCover.getAttribute('src')!=='assets/music-cover.webp')launcherCover.src='assets/music-cover.webp';});
''' + s[b:]
s=s.replace("play.textContent=playing?'Ⅱ':'▶';",'''play.innerHTML=playing?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg>';launcher.classList.toggle('playing',playing);''')
s=s.replace("cover.src=track.pic||'assets/music-cover.webp';", "cover.src=track.pic||'assets/music-cover.webp';launcherCover.src=cover.src;")
s=s.replace("progress.value='0';progress.disabled=true;", "progress.value='0';progress.style.setProperty('--progress','0%');progress.disabled=true;")
s=s.replace("volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;", "function paintVolume(){volume.style.setProperty('--progress',volume.value+'%');document.querySelector('#music-volume-value').textContent=volume.value+'%';}paintVolume();\n  volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;paintVolume();")
s=s.replace("audio.currentTime=audio.duration*Number(progress.value)/100;", "{audio.currentTime=audio.duration*Number(progress.value)/100;progress.style.setProperty('--progress',progress.value+'%');}")
s=s.replace("progress.value=String(audio.currentTime/audio.duration*100);", "progress.value=String(audio.currentTime/audio.duration*100);progress.style.setProperty('--progress',progress.value+'%');")
s=s.replace("controller?.abort();audio.pause();});", "controller?.abort();audio.pause();clearTimeout(closeTimer);if(!expanded){panel.hidden=true;panel.classList.remove('closing');}});")
p.write_text(s,encoding='utf-8')
