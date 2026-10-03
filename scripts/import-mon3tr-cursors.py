"""把 mon3tr 动画光标包静态化：取 .ani 首帧（原像素、原热点）导出为网页 .cur。

用法：python scripts/import-mon3tr-cursors.py
源文件在 assets/originals/mon3tr-cursors/（用户提供的同人免费素材，禁止转售）。
CSS 光标不支持 .ani 动画，这里取每组首帧；热点来自帧内 CUR 头。
"""
from pathlib import Path
import struct

root = Path(__file__).resolve().parents[1]
src = root / 'assets/originals/mon3tr-cursors'
out = root / 'public/assets/mon3tr-cursors'
out.mkdir(parents=True, exist_ok=True)

# 网页角色 → 光标包文件（映射见包内 install.inf）
ROLES = {
    'pointer': 'Normal',
    'link': 'Link',
    'text': 'Text',
    'precision': 'Precision',
    'move': 'Move',
    'unavailable': 'Unavailable',
    'help': 'Help',
}

def first_cur(path: Path) -> bytes:
    data = path.read_bytes()
    assert data[:4] == b'RIFF' and data[8:12] == b'ACON', path.name
    pos = 12
    while pos + 8 <= len(data):
        cid = data[pos:pos+4]
        size = struct.unpack_from('<I', data, pos + 4)[0]
        chunk = data[pos+8:pos+8+size]
        if cid == b'LIST':
            q = 4
            while q + 8 <= len(chunk):
                sid = chunk[q:q+4]
                ssz = struct.unpack_from('<I', chunk, q+4)[0]
                if sid == b'icon':
                    frame = chunk[q+8:q+8+ssz]
                    assert struct.unpack_from('<H', frame, 2)[0] == 2, 'frame is not CUR: ' + path.name
                    return frame
                q += 8 + ssz + (ssz & 1)
        pos += 8 + size + (size & 1)
    raise AssertionError('no frames: ' + path.name)

for role, name in ROLES.items():
    frame = first_cur(src / (name + '.ani'))
    w, h, cc, res, hx, hy, sz, off = struct.unpack_from('<BBBBHHII', frame, 6)
    (out / (role + '.cur')).write_bytes(frame)
    print('%-12s %dx%d hotspot(%d,%d) %d bytes' % (role, w or 256, h or 256, hx, hy, len(frame)))
(out / 'README.txt').write_text(
    'mon3tr 光标（同人免费素材，用户提供；请勿转售）。\n'
    '源包为 .ani 动画；CSS 光标不支持动画，这里取每组首帧导出为静态 .cur（原像素与原热点）。\n'
    '原稿与安装说明见 assets/originals/mon3tr-cursors/。\n', encoding='utf-8')
print('Static cursors written to', out.relative_to(root))
