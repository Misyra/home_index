from pathlib import Path
import re,json,shutil
r=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home');d=r/'dist'
for p in ['src/pages','src/layouts','src/components','src/config','public/scripts','public/assets','public/icons','scripts','assets/originals']:(r/p).mkdir(parents=True,exist_ok=True)
h=(d/'index.html').read_text(encoding='utf-8'); app=(d/'app.js').read_text(encoding='utf-8');css=(d/'style.css').read_text(encoding='utf-8')
for p in d.glob('*.png'):shutil.copyfile(p,r/'assets/originals'/p.name)
shutil.copyfile(r.parent/'rainy-site-icon.png',r/'assets/originals/site-icon.png')
for p in (d/'icons').iterdir():shutil.copyfile(p,r/'public/icons'/p.name)
for n in ['welcome.js','particles.js','particle-data.js']:shutil.copyfile(d/n,r/'public/scripts'/n)
shutil.copyfile(Path(r'E:\website\misyra-blog\public\assets\music\使一颗心免于哀伤-哼唱.mp3'),r/'public/assets/music.mp3');shutil.copyfile(Path(r'E:\website\misyra-blog\public\assets\music\cover\109951169585655912.webp'),r/'public/assets/music-cover.webp')
refs=set(re.findall(r'(?:src|href)="([^"#]+)"',h));baseline={n:(d/n).stat().st_size for n in refs if (d/n).is_file()}
(r/'scripts/baseline.json').write_text(json.dumps({'htmlReferences':baseline,'directBytes':sum(baseline.values())},indent=2),encoding='utf-8')
common=app[app.index('const reducedMotion='):app.index('// 24条原创问候')]
common=common.replace("document.querySelector('#mascot-button').classList.remove('wiggle')","document.querySelector('#mascot-button')?.classList.remove('wiggle')")
common=common.replace("context=canvas.getContext('2d')","context=canvas?.getContext('2d')").replace('function resize(){width=', 'function resize(){if(!context)return;width=').replace('effectsOn&&!reducedMotion.matches&&!document.hidden','context&&effectsOn&&!reducedMotion.matches&&!document.hidden').replace('else context.clearRect','else context?.clearRect')
common=common.replace('devicePixelRatio||1,2','devicePixelRatio||1,1.5').replace('Math.min(90,Math.round(width/14))','Math.min(55,Math.round(width/18))').replace('ripples.length<20','ripples.length<12')
common=common.replace('let width=0,height=0,frame=0,lastTime=0;','let width=0,height=0,frame=0,lastTime=0,lastPaint=0;').replace('function render(time){const dt=', 'function render(time){if(time-lastPaint<32){frame=requestAnimationFrame(render);return;}lastPaint=time;const dt=')
a=common.index('const greeting=');common=common[:a]+"const greeting=document.querySelector('#greeting');let greetingTimer;\nfunction showGreeting(message){if(!greeting)return;greeting.querySelector('.greeting-text').textContent=message;greeting.classList.add('show');clearTimeout(greetingTimer);greetingTimer=setTimeout(()=>greeting.classList.remove('show'),4200);}\n"
theme=app[app.index('// 昼夜主题'):app.index('let audioContext')];uptime=app[app.index('// 页脚配置'):]
(r/'public/scripts/site.js').write_text('(()=>{\n'+common+theme+uptime+"\nwindow.Rainy={reducedMotion,get effectsOn(){return effectsOn},showGreeting};\n})();\n",encoding='utf-8')
home=app[app.index('// 24条原创问候'):app.index('// 昼夜主题')]
home=home.replace('effectsOn','Rainy.effectsOn').replace('reducedMotion','Rainy.reducedMotion').replace('showGreeting(', 'Rainy.showGreeting(')
home=home.replace("const posePreload=new Image();posePreload.src=poses[1].src;","const preload=()=>{const image=new Image();image.src=poses[1].src;};if('requestIdleCallback' in window)requestIdleCallback(preload,{timeout:5000});else setTimeout(preload,3500);")
for n in ['rain-girl','rain-girl-happy','rain-cg-splash','rain-cg-umbrella','rain-cg-boats','rain-cg']:home=home.replace(n+'.png','assets/'+n+'.webp')
home="const navigationObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');navigationObserver.unobserve(entry.target);}},{threshold:.12});navigationObserver.observe(document.querySelector('#navigation'));\n"+home
(r/'public/scripts/home.js').write_text('(()=>{\n'+home+'\n})();',encoding='utf-8')
bookmarks=[{'name':'GitHub','description':'代码、项目与开源灵感','url':'https://github.com/','icon':'icons/github.svg','color':'36,41,47'},{'name':'哔哩哔哩','description':'视频与快乐补给','url':'https://www.bilibili.com/','icon':'icons/bilibili.svg','color':'234,114,154'},{'name':'豆瓣','description':'书、电影与生活记录','url':'https://www.douban.com/','icon':'icons/douban.svg','color':'47,153,83'},{'name':'网易云音乐','description':'给每个雨天配一首歌','url':'https://music.163.com/','icon':'icons/neteasecloudmusic.svg','color':'215,75,83'},{'name':'Notion','description':'笔记、计划与小小想法','url':'https://www.notion.so/','icon':'icons/notion.svg','color':'60,64,69'},{'name':'花瓣','description':'收藏设计与视觉灵感','url':'https://huaban.com/','icon':'icons/huaban.png','color':'222,67,98'},{'name':'星雨洛茜','description':'和星光一起玩一会儿','url':'./particles.html','icon':'assets/favicon-64.png','color':'170,106,136'}]
(r/'src/config/site.ts').write_text('export const bookmarks='+json.dumps(bookmarks,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
nav='''---
import { bookmarks } from '../config/site';
---
<nav class="link-grid" id="link-grid" aria-label="常用网站导航">{bookmarks.map((item,i)=><a class="site-link" href={item.url} target={item.url.startsWith('http')?'_blank':undefined} rel={item.url.startsWith('http')?'noopener noreferrer':undefined} style={`--i:${i};--brand:${item.color}`} aria-label={item.name+(item.url.startsWith('http')?'，在新标签页打开':'')}><span class="link-icon"><img src={item.icon} alt="" width="26" height="26" loading="lazy" decoding="async" /></span><span class="link-copy"><strong>{item.name}</strong><small>{item.description}</small></span></a>)}<button class="site-link" data-open-music style="--i:7;--brand:112,150,173" aria-label="打开雨天音乐"><span class="link-icon" aria-hidden="true">♫</span><span class="link-copy"><strong>雨天音乐</strong><small>给小屋配一首温柔的歌</small></span></button></nav>'''
(r/'src/components/Navigation.astro').write_text(nav,encoding='utf-8')
footer=h[h.index('<footer class="site-footer"'):h.index('</footer>')+9]
footer=footer.replace('<span>HTML</span>','<span>Astro</span>').replace('href="#home"','href="./index.html#home"').replace('href="#navigation"','href="./index.html#navigation"').replace('href="#particles"','href="./particles.html"')
(r/'src/components/Footer.astro').write_text(footer,encoding='utf-8')
welcome=h[h.index('<aside class="welcome-toast"'):h.index('</aside>')+8];(r/'src/components/Welcome.astro').write_text(welcome,encoding='utf-8')
atmosphere=h[h.index('<body>')+6:h.index('<main>')];(r/'src/components/Atmosphere.astro').write_text(atmosphere,encoding='utf-8')
homeMarkup=h[h.index('<section class="portrait-screen"'):h.index('<section class="particle-screen"')]
homeMarkup=homeMarkup.replace('<button id="sound-button" aria-label="播放雨声" aria-pressed="false" title="听听雨声">♫</button>','<button data-open-music aria-label="打开雨天音乐" title="雨天音乐">♫</button>')
homeMarkup=homeMarkup.replace('<nav class="link-grid" id="link-grid" aria-label="常用网站导航"></nav>','<Navigation />').replace('<span id="year"></span>','<span>{new Date().getFullYear()}</span>')
homeMarkup=re.sub(r'<a class="next-screen-link".*?</a>','',homeMarkup)
for n in ['rain-girl','rain-girl-happy']:homeMarkup=homeMarkup.replace(n+'.png','assets/'+n+'.webp')
for n in ['rain-cg-splash','rain-cg-umbrella','rain-cg-boats','rain-cg']:homeMarkup=homeMarkup.replace(n+'.png','assets/'+n+'-thumb.webp')
homeMarkup=homeMarkup.replace('<img id="mascot"','<img width="720" height="720" fetchpriority="high" decoding="async" id="mascot"').replace('<img src="assets/rain-cg','<img width="360" height="240" loading="lazy" decoding="async" src="assets/rain-cg')
greeting='''<div class="greeting" id="greeting" role="status" aria-live="polite"><img src="assets/rain-girl-avatar.webp" width="46" height="46" alt=""/><div><span class="greeting-name">洛茜的小声问候</span><span class="greeting-text"></span></div><span class="greeting-heart" aria-hidden="true">♡</span></div>'''
dialog=h[h.index('<dialog id="cg-dialog"'):h.index('</dialog>')+9];dialog=dialog.replace('src="rain-cg-splash.png"','decoding="async"')
(r/'src/pages/index.astro').write_text('''---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import Atmosphere from '../components/Atmosphere.astro';
---
<Layout><Atmosphere/><main>'''+homeMarkup+'</main>'+greeting+dialog+'<script is:inline src="scripts/home.js" defer></script></Layout>',encoding='utf-8')
particle=h[h.index('<section class="particle-screen"'):h.index('</section></main>')+10]
particle=particle.replace('href="#home"','href="./index.html"').replace('src="rossi-particle-portrait.png"','src="assets/rossi-particle-portrait.webp" width="720" height="960" decoding="async"')
particle=particle.replace('<a href="./index.html" aria-label="回到首页">回到小屋 ↗</a>', '''<div class="particle-header-actions"><a href="./index.html" aria-label="回到首页">回到小屋</a><div class="weather-controls"><button id="theme-button" aria-label="切换到夜间模式" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg></button><button id="rain-switch" aria-label="切换粒子动效" aria-pressed="true">☂</button></div></div>''')
(r/'src/pages/particles.astro').write_text('''---
import Layout from '../layouts/Layout.astro';
---
<Layout particle title="星雨洛茜 · 雨间小屋"><main>'''+particle+'</main><script is:inline src="scripts/particle-data.js" defer></script><script is:inline src="scripts/particles.js" defer></script></Layout>',encoding='utf-8')
partStart=css.index('/* 第三屏');footerStart=css.index('/* 页脚：');dayStart=css.index('/* 星雨日间')
(r/'public/particles.css').write_text(css[partStart:footerStart]+css[dayStart:],encoding='utf-8');(r/'public/style.css').write_text(css[:partStart]+css[footerStart:dayStart],encoding='utf-8')
(r/'src/layouts/Layout.astro').write_text('''---
import Footer from '../components/Footer.astro';
import Welcome from '../components/Welcome.astro';
import MusicPlayer from '../components/MusicPlayer.astro';
const {title='雨间小屋 · 小雨天导航',particle=false}=Astro.props;
---
<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#edf6fb"/><meta name="description" content="雨间小屋，可爱的雨天导航与星雨洛茜。"/><title>{title}</title><link rel="icon" href="assets/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png"/><link rel="apple-touch-icon" href="assets/apple-touch-icon.png"/><script is:inline>try{const t=localStorage.getItem('rainy-home-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch{document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}</script><link rel="stylesheet" href="style.css"/>{particle&&<link rel="stylesheet" href="particles.css"/>}<script is:inline src="scripts/site.js" defer></script><script is:inline src="scripts/welcome.js" defer></script><script is:inline src="scripts/music.js" defer></script></head><body class={particle?'particle-page':'home-page'}><slot/><Footer/><MusicPlayer/><Welcome/></body></html>''',encoding='utf-8')
print('Source migrated; baseline direct bytes:',sum(baseline.values()))
