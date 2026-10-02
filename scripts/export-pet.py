from PIL import Image
from pathlib import Path
root=Path.cwd(); src=root/'assets/originals/rossi-corner-sprite.png'; im=Image.open(src).convert('RGBA')
# 将生成的八格动画帧统一到 192×208，保留透明背景、共同脚底基线和留白。
frames=[]
for row in range(2):
 for col in range(4):
  cell=im.crop((col*426,0 if row==0 else 456,(col+1)*426,456 if row==0 else 923))
  bbox=cell.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox()
  cell=cell.crop(bbox);scale=min(176/cell.width,188/cell.height);cell=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.LANCZOS)
  frame=Image.new('RGBA',(192,208));frame.alpha_composite(cell,((192-cell.width)//2,198-cell.height));frames.append(frame)
sheet=Image.new('RGBA',(768,416))
for i,frame in enumerate(frames):sheet.alpha_composite(frame,((i%4)*192,(i//4)*208))
out=root/'public/assets';sheet.save(out/'rossi-pet-sheet.webp',quality=88,method=6);frames[0].save(out/'rossi-pet-still.webp',quality=88,method=6)
palette=sheet.convert('RGB').quantize(colors=255,method=Image.Quantize.MEDIANCUT)
gifs=[]
for frame in frames:
 p=frame.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE);mask=frame.getchannel('A').point(lambda a:255 if a<100 else 0);p.paste(255,mask=mask);p.info['transparency']=255;gifs.append(p)
gifs[0].save(out/'rossi-corner.gif',save_all=True,append_images=gifs[1:],duration=[1700,130,130,170,130,130,160,220],loop=0,disposal=2,transparency=255,optimize=False)
check=Image.open(out/'rossi-corner.gif');assert check.n_frames==8 and check.size==(192,208)
for file in ['rossi-pet-sheet.webp','rossi-corner.gif']:print(file,(out/file).stat().st_size)
