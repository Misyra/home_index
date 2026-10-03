from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
out = root / 'public/assets'
out.mkdir(parents=True, exist_ok=True)
image = Image.open(root / 'assets/originals/rossi-site-icon.png').convert('RGBA')
if image.width != image.height:
    raise ValueError('The Rossi icon source must have a 1:1 aspect ratio')

for size in (16, 32, 64, 180, 192, 512):
    image.resize((size, size), Image.Resampling.LANCZOS).save(out / f'rossi-icon-{size}.png', optimize=True)
image.save(out / 'rossi-icon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
(out / 'rossi-apple-touch-icon.png').write_bytes((out / 'rossi-icon-180.png').read_bytes())
print('Rossi PNG/ICO icons created; cursor assets are maintained by scripts/import-mon3tr-cursors.py')
