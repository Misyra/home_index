from pathlib import Path
import struct, shutil, sys
root=Path(sys.argv[1])
out=Path('public/assets/w11-cursors');out.mkdir(parents=True,exist_ok=True)
# Keep original 32px pixels and exact hotspots; omit unused larger entries.
for theme in ['light','dark']:
 for name in ['pointer','link','beam','move','precision','unavailable','help']:
  data=(root/theme/'regular'/'base'/f'{name}.cur').read_bytes()
  entry=list(struct.unpack_from('<BBBBHHII',data,6));length,offset=entry[-2:]
  assert entry[:2]==[32,32]
  entry[-1]=22
  packed=struct.pack('<HHH',0,2,1)+struct.pack('<BBBBHHII',*entry)+data[offset:offset+length]
  (out/f'{theme}-{name}.cur').write_bytes(packed)
  print(theme,name,len(packed),'bytes, hotspot',entry[4:6])
shutil.copyfile(root/'Agreement.txt',out/'Agreement.txt')
(out/'README.txt').write_text('Windows 11 Cursors Concept HD v2.2 by Jepri Creations\nhttps://www.deviantart.com/jepricreations\n\nUser-provided pack. The site owner confirmed separate website distribution permission on 2026-10-03.\nOriginal 32px pixels and hotspots retained; unused larger entries omitted for web delivery.\nOriginal Agreement included for attribution; separate permission is specific to this site.\n',encoding='utf-8')
