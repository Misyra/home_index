from pathlib import Path
from PIL import Image
import struct
r=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home');out=r/'public/assets';im=Image.open(r/'assets/originals/site-icon.png').convert('RGBA')
im.save(out/'favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48)])
for name,size in [('default',32),('hover',36),('pressed',28)]:
 icon=im.resize((size,size),Image.Resampling.LANCZOS)
 p=out/f'cursor-{name}.cur';icon.save(p,format='ICO',sizes=[(size,size)])
 data=bytearray(p.read_bytes());data[2:4]=struct.pack('<H',2);data[10:12]=struct.pack('<H',size//2);data[12:14]=struct.pack('<H',size//2);p.write_bytes(data)
print('Favicons and cartoon cursor assets created')
