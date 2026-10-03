from pathlib import Path
from PIL import Image
r=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home');out=r/'public/assets';im=Image.open(r/'assets/originals/site-icon.png').convert('RGBA')
im.save(out/'favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48)])
print('Favicon created; cursor assets are maintained by scripts/import-mon3tr-cursors.py')
