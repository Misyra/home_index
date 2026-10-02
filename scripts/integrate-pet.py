from pathlib import Path
p=Path('src/layouts/Layout.astro');s=p.read_text(encoding='utf-8').replace('<MusicPlayer/><Welcome/>','<MusicPlayer/><Welcome/><CornerPet/>');p.write_text(s,encoding='utf-8')
