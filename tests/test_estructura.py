from pathlib import Path
import json,re,sys
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=[];self.links=[];self.images=[];self.h2=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  if tag=='img':self.images.append(d.get('src',''))
  if tag=='a':self.links.append(d.get('href',''))
html=(root/'index.html').read_text()
p=Parser();p.feed(html)
assert len(p.ids)==len(set(p.ids)), 'IDs duplicados'
assert 'id="mapa"' in html and 'id="gwwm-map"' in html, 'Sección de mapa no integrada'
assert 'id="contacto"' in html and 'id="participar"' not in html
assert 'GWW Chile' in html
assert len(re.findall('class="drop-button"',html))==3
for f in ['index.html','styles.css','app.js','mapa.css','mapa.js','data/cuerpos-agua-publicos.geojson','data/videos.json','data/logos-red.json']:
 assert (root/f).is_file(),f'Falta archivo {f}'
for link in p.images:
 if link.startswith('assets/'): assert (root/link).is_file(),f'No existe {link}'
vids=json.loads((root/'data/videos.json').read_text())
assert len(vids)==4
assert all(re.fullmatch(r'[A-Za-z0-9_-]{11}',v['id']) for v in vids)
logos=json.loads((root/'data/logos-red.json').read_text());assert logos==[]
data=json.loads((root/'data/cuerpos-agua-publicos.geojson').read_text())
assert data['type']=='FeatureCollection' and data['features']==[], 'Solo fichas autorizadas en el mapa'
assert not (root/'documentos').exists(), 'No subir PDFs históricos sin revisar'
assert not (root/'data/public-showcase.json').exists(), 'Archivo antiguo privado excluido'
print('8 verificaciones documentales y de privacidad: OK')
