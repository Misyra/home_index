from pathlib import Path
p=Path('scripts/export-pet.py');s=p.read_text(encoding='utf-8').replace("src=root.parent/'rossi-corner-sprite.png'","src=root/'assets/originals/rossi-corner-sprite.png'");p.write_text(s,encoding='utf-8')
p=Path('PERFORMANCE.md');s=p.read_text(encoding='utf-8').replace('约 0.37 MB','约 0.38 MB');p.write_text(s,encoding='utf-8')
