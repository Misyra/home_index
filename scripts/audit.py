from pathlib import Path
from html.parser import HTMLParser
import json,re
r=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home');d=r/'dist';baseline=json.loads((r/'scripts/baseline.json').read_text(encoding='utf-8'))
class Refs(HTMLParser):
 def __init__(self):super().__init__();self.refs=set();self.scripts=[];self.config=[];self.in_config=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for key in ('src','href'):
   n=a.get(key,'');n=n.split('#')[0]
   if n and not re.match(r'^(?:https?:|data:|mailto:)',n):self.refs.add(n)
  if tag=='script' and a.get('src'):self.scripts.append(a['src'])
  if tag=='script' and a.get('id')=='character-config':self.in_config=True
 def handle_data(self,data):
  if self.in_config:self.config.append(data)
 def handle_endtag(self,tag):
  if tag=='script':self.in_config=False
report={}
for name in ['index.html','particles.html']:
 p=Refs();h=(d/name).read_text(encoding='utf-8');p.feed(h);missing=[n for n in p.refs if not(d/n).is_file()];assert not missing,(name,missing)
 files={n:(d/n).stat().st_size for n in sorted(p.refs) if (d/n).is_file()}
 report[name]={'directBytes':sum(files.values()),'files':files,'scripts':p.scripts}
 if p.config:
  config=json.loads(''.join(p.config));ondemand={item['src'] for item in config['poses']+config['scenes']};assert all((d/n).is_file() for n in ondemand),'Missing character image';report[name]['characterAssets']={n:(d/n).stat().st_size for n in sorted(ondemand)}
 assert 'sound-button' not in h and 'AudioContext' not in (d/'scripts/site.js').read_text(encoding='utf-8')
 if name=='index.html':assert 'particle-data.js' not in h and 'portrait-particles' not in h and 'rossi-particle-portrait' not in h
assets={p.name:p.stat().st_size for p in (d/'assets').glob('*')};report['assets']=assets;report['previousDirectBytes']=baseline['directBytes'];report['homeReductionPercent']=round((1-report['index.html']['directBytes']/baseline['directBytes'])*100,2)
(r/'scripts/performance-result.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'previousDirectBytes':baseline['directBytes'],'homeDirectBytes':report['index.html']['directBytes'],'particleDirectBytes':report['particles.html']['directBytes'],'reductionPercent':report['homeReductionPercent'],'homeScripts':report['index.html']['scripts'],'assetBytes':assets},ensure_ascii=False))
