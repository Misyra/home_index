from pathlib import Path
from PIL import Image
import json, shutil
root=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home')
dist=root/'dist'
shutil.copyfile(root.parent/'rossi-particle-portrait.png',dist/'rossi-particle-portrait.png')
im=Image.open(dist/'rossi-particle-portrait.png').convert('RGBA')
bbox=im.getchannel('A').getbbox()
im=im.crop(bbox)
im.thumbnail((420,560),Image.Resampling.LANCZOS)
points=[]
for y in range(1,im.height,3):
 for x in range(1,im.width,3):
  r,g,b,a=im.getpixel((x,y))
  if a>95:
   points.append([x,y,r,g,b,a])
(dist/'particle-data.js').write_text('window.ROSSI_PARTICLE_DATA='+json.dumps({'width':im.width,'height':im.height,'points':points},separators=(',',':'))+';\n',encoding='utf-8')
html=(dist/'index.html').read_text(encoding='utf-8')
html=html.replace('<script src="app.js" defer></script>','<script src="app.js" defer></script><script src="welcome.js" defer></script><script src="particle-data.js" defer></script><script src="particles.js" defer></script>')
html=html.replace('</footer></div></section>','</footer><a class="next-screen-link" href="#particles">下一页 · 星雨洛茜 <span aria-hidden="true">↓</span></a></div></section>')
html=html.replace('</main>', '''<section class="particle-screen" id="particles" aria-labelledby="particle-title">
  <div class="particle-topline"><span>RAINY LITTLE HOME / 星雨一刻</span><a href="#home" aria-label="回到首页">回到小屋 ↗</a></div>
  <div class="particle-layout"><div class="particle-copy"><p class="particle-kicker"><span aria-hidden="true">✦</span> 雨滴的另一种模样</p><h2 id="particle-title">洛茜<span>ROSSI</span></h2><p class="particle-poem">让雨滴，变成星星。<br>把小小的快乐，留在这一刻。</p><div class="particle-controls"><button id="particle-scatter">粒子散开 <span aria-hidden="true">✧</span></button><button id="particle-gather">重新聚拢 <span aria-hidden="true">✦</span></button></div><p class="particle-status" id="particle-status" role="status">靠近她，看看星星的回应。</p></div>
  <div class="particle-stage"><span class="particle-halo" aria-hidden="true"></span><img class="particle-fallback" src="rossi-particle-portrait.png" alt="彩色星光粒子组成的Q版洛茜：金色双马尾、金瞳、红色兽耳兜帽与灰蓝长袖裙，微笑挥手"><canvas id="portrait-particles" tabindex="0" role="button" aria-label="洛茜粒子像，点击或按回车让粒子散开" aria-describedby="particle-hint"></canvas><span class="particle-ground" aria-hidden="true"></span></div></div>
  <p class="particle-hint" id="particle-hint">移动指尖，拨动星雨 · 轻点人物，散落一片星光</p>
</section></main><aside class="welcome-toast" id="welcome-toast" hidden aria-label="首次进入欢迎"><span class="welcome-icon" aria-hidden="true">☂</span><div><strong id="welcome-title"></strong><p id="welcome-message" role="status" aria-live="polite"></p></div><button id="welcome-close" aria-label="关闭欢迎提示">×</button><span class="welcome-progress" aria-hidden="true"></span></aside>''')
(dist/'index.html').write_text(html,encoding='utf-8')
js=(dist/'app.js').read_text(encoding='utf-8')
js=js.replace('else context.clearRect(0,0,width,height);}',"else context.clearRect(0,0,width,height);document.dispatchEvent(new Event('rainy-effects-change'));}")
(dist/'app.js').write_text(js,encoding='utf-8')
preview=(root/'preview.mjs').read_text(encoding='utf-8').replace("'app.js',","'app.js','welcome.js','particles.js','particle-data.js','rossi-particle-portrait.png',")
(root/'preview.mjs').write_text(preview,encoding='utf-8')
print('Particle samples:',len(points),'size:',im.size)
