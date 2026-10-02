"""Create the local Chinese WOFF2 subset; no site text is sent over the network.

Install fonttools[woff] before rerunning. The adjacent workspace font-tools
directory is supported when dependencies are installed there instead.
"""
from pathlib import Path
import re, sys

root = Path(__file__).resolve().parents[1]
local_tools = root.parent / 'font-tools'
if local_tools.is_dir():
    sys.path.insert(0, str(local_tools))
from fontTools import subset
from fontTools.ttLib import TTFont

sources = list((root / 'src').rglob('*.astro')) + list((root / 'src').rglob('*.ts')) + list((root / 'public/scripts').glob('*.js'))
text = ''.join(p.read_text(encoding='utf-8') for p in sources)
chars = set(re.findall(r'[\u3000-\u303f\u3400-\u9fff\uff00-\uffef]', text))
font = TTFont(root / 'assets/fonts/NotoSansSC.ttf')
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=''.join(sorted(chars)))
subsetter.subset(font)
font.flavor = 'woff2'
output = root / 'public/fonts/noto-sans-sc-site.woff2'
font.save(output)
coverage = set(font.getBestCmap())
assert all(ord(c) in coverage for c in chars), 'Missing site glyphs'
print(f'Chinese glyphs: {len(chars)}; WOFF2: {output.stat().st_size} bytes')
