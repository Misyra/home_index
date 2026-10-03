from pathlib import Path
root=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home\dist')
p=root/'app.js'
s=p.read_text(encoding='utf-8')
s=s.replace('themeButton.querySelector(\'svg\').innerHTML=dark?sunIcon:moonIcon;}', 'themeButton.querySelector(\'svg\').innerHTML=dark?sunIcon:moonIcon;document.dispatchEvent(new Event(\'rainy-theme-change\'));}')
p.write_text(s,encoding='utf-8')
p=root/'particles.js'
s=p.read_text(encoding='utf-8')
s=s.replace('size:Math.max(.8,scale*', 'lightColor:`rgba(${Math.round(r*.76+4)},${Math.round(g*.73+4)},${Math.round(b*.69+4)},${(.78+a/255*.22).toFixed(2)})`,size:Math.max(.8,scale*')
s=s.replace('ctx.clearRect(0,0,w,h);const t=time/1000;', "ctx.clearRect(0,0,w,h);const t=time/1000,dark=document.documentElement.dataset.theme==='dark';")
s=s.replace('`rgba(191,209,242,${animate?', '`rgba(${dark?\'191,209,242\':\'106,135,164\'},${animate?')
s=s.replace('ctx.fillStyle=p.color;', 'ctx.fillStyle=dark?p.color:p.lightColor;')
s=s.replace("document.addEventListener('visibilitychange',sync);", "document.addEventListener('rainy-theme-change',()=>draw(performance.now(),enabled()&&visible&&!document.hidden));\n  document.addEventListener('visibilitychange',sync);")
p.write_text(s,encoding='utf-8')
