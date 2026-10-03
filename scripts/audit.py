from pathlib import Path
from html.parser import HTMLParser
import json,re
r=Path(r'D:\Misyra\Documents\ChatGPT\导航页\rainy-home');d=r/'dist';baseline=json.loads((r/'scripts/baseline.json').read_text(encoding='utf-8'))
REMOTE=re.compile(r'^(?:https?:|data:|mailto:)')
class Refs(HTMLParser):
 def __init__(self):super().__init__();self.refs=set();self.scripts=[];self.config=[];self.in_config=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for key in ('src','href'):
   n=a.get(key,'').split('#')[0]
   if n and not REMOTE.match(n):self.refs.add(n)
  for part in a.get('srcset','').split(','):
   n=part.strip().split(' ')[0].split('#')[0]
   if n and not REMOTE.match(n):self.refs.add(n)
  if tag=='script' and a.get('src'):self.scripts.append(a['src'])
  if tag=='script' and a.get('id')=='character-config':self.in_config=True
 def handle_data(self,data):
  if self.in_config:self.config.append(data)
 def handle_endtag(self,tag):
  if tag=='script':self.in_config=False
def size(n):return (d/n).stat().st_size
def stat_view(refs):
 avif={n for n in refs if n.endswith('.avif')};fallback={n[:-5]+'.png' for n in avif};modern=compat=0;pairs={}
 for n in sorted(refs):
  if n.endswith('.avif'):
   png=n[:-5]+'.png';assert (d/png).is_file(),('Missing PNG fallback',n)
   pairs[n]=png;modern+=size(n);compat+=size(png)
  elif n not in fallback:
   modern+=size(n);compat+=size(n)
 return modern,compat,pairs
report={}
for name in ['index.html','particles.html']:
 p=Refs();h=(d/name).read_text(encoding='utf-8');p.feed(h)
 missing=[n for n in p.refs if not(d/n).is_file()];assert not missing,(name,missing)
 modern,compat,pairs=stat_view(p.refs)
 report[name]={'directBytes':modern,'compatBytes':compat,'pairs':pairs,'files':{n:size(n) for n in sorted(p.refs)},'scripts':p.scripts}
 if p.config:
  config=json.loads(''.join(p.config));ondemand=set()
  for item in config['poses']:ondemand.add(item['src'])
  for item in config['scenes']:ondemand.update((item['src'],item['thumb']))
  for n in sorted(ondemand):
   assert (d/n).is_file(),('Missing character image',n)
   assert (d/(n[:-5]+'.png')).is_file(),('Missing character PNG fallback',n)
  report[name]['characterAssets']={n:size(n) for n in sorted(ondemand)}
 assert 'sound-button' not in h and 'AudioContext' not in (d/'scripts/site.js').read_text(encoding='utf-8')
 if name=='index.html':assert 'particle-data.js' not in h and 'portrait-particles' not in h and 'rossi-particle-portrait' not in h
for avif in sorted((d/'assets').rglob('*.avif')):assert avif.with_suffix('.png').is_file(),('Orphan AVIF without PNG',avif.name)
font_refs=re.findall(r'url\(["\']?(fonts/[^)"\']+)',(d/'typography.css').read_text(encoding='utf-8'))
assert font_refs and all((d/n).is_file() for n in font_refs),'Missing local font'
report['fontBytes']={n:size(n) for n in font_refs}
assets={p.relative_to(d/'assets').as_posix():p.stat().st_size for p in (d/'assets').rglob('*') if p.is_file()};report['assets']=assets;report['previousDirectBytes']=baseline['directBytes'];report['homeReductionPercent']=round((1-report['index.html']['directBytes']/baseline['directBytes'])*100,2)
(r/'scripts/performance-result.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'previousDirectBytes':baseline['directBytes'],'homeDirectBytes':report['index.html']['directBytes'],'homeCompatBytes':report['index.html']['compatBytes'],'particleDirectBytes':report['particles.html']['directBytes'],'reductionPercent':report['homeReductionPercent'],'avifPngPairs':len(report['index.html']['pairs'])+len(report['particles.html']['pairs']),'homeScripts':report['index.html']['scripts']},ensure_ascii=False))
