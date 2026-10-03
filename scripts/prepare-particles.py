"""由粒子像原稿生成 public/scripts/particle-data.js（需要 Pillow）。

用法：python scripts/prepare-particles.py
不改变原始 PNG；仅在调整粒子像插画后需要重新运行。
"""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
src=root/'assets/originals/rossi-particle-portrait.png'
im=Image.open(src).convert('RGBA')
bbox=im.getchannel('A').getbbox()
im=im.crop(bbox)
im.thumbnail((420,560),Image.Resampling.LANCZOS)
points=[]
for y in range(1,im.height,3):
 for x in range(1,im.width,3):
  r,g,b,a=im.getpixel((x,y))
  if a>95:
   points.append([x,y,r,g,b,a])
out=root/'public/scripts/particle-data.js'
out.write_text('window.ROSSI_PARTICLE_DATA='+json.dumps({'width':im.width,'height':im.height,'points':points},separators=(',',':'))+';\n',encoding='utf-8')
print('Particle samples:',len(points),'size:',im.size,'->',out.relative_to(root))
