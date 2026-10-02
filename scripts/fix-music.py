from pathlib import Path
p=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home\public\scripts\music.js')
s=p.read_text(encoding='utf-8')
line=next(line for line in s.splitlines() if 'if(metingTracks)' in line)
s=s.replace(line,"    if(metingTracks){tracks=metingTracks;loadTrack(0);busy=false;play.disabled=false;status.textContent='已载入 '+tracks.length+' 首歌，点播放开始。';return;}busy=true;play.disabled=prev.disabled=next.disabled=true;status.textContent='正在读取网易云歌单…';let found;")
p.write_text(s,encoding='utf-8')
