/* GWW Chile — Mapa público, módulo independiente del hero.
   IMPORTANTE: GitHub Pages expone todos los archivos de data/. No depositar datos privados. */
(() => {
  'use strict';
  const root = document.getElementById('gwwm-map');
  if (!root) return;
  const byId = (id) => document.getElementById(id);
  const status = byId('gwwm-status');
  const detail = byId('gwwm-detail');
  const count = byId('gwwm-count');
  const search = byId('gwwm-search');
  const region = byId('gwwm-region');
  const kind = byId('gwwm-kind');
  const reset = byId('gwwm-reset');
  const defaultView = {center: [-35.6, -71.3], zoom: 4};
  const label = (v) => typeof v === 'string' && v.trim() ? v.trim() : 'Sin información pública';
  const showStatus = (message) => {status.hidden = false;status.textContent = message;};
  const hideStatus = () => {status.hidden = true;};
  const el = (tag, cls, value) => { const node = document.createElement(tag); if(cls) node.className=cls; if(value!==undefined) node.textContent=value;return node; };
  let map, overlay, features = [], filtered = [], selected = null;

  function clearDetail() {
    selected = null;
    detail.replaceChildren(
      el('p', 'gwwm-detail-eyebrow','INFORMACIÓN TERRITORIAL'),
      el('h3','', 'Selecciona un cuerpo de agua'),
      el('p','', 'Haz clic en una geometría del mapa para conocer los antecedentes aprobados para difusión.'),
      el('p','gwwm-note','El mapa no muestra agrupaciones, monitores ni estaciones exactas de muestreo.')
    );
  }
  function openDetail(feature) {
    selected = feature.id;
    const p=feature.properties || {};
    detail.replaceChildren();
    const close=el('button','gwwm-close','Cerrar ficha');close.type='button';close.onclick=clearDetail;detail.append(close);
    detail.append(el('p','gwwm-detail-eyebrow','FICHA DE CUERPO DE AGUA'));
    detail.append(el('h3','', label(p.nombre)));
    detail.append(el('p','', [p.comuna,p.region].filter(Boolean).join(' · ')));
    const fields=el('dl','gwwm-fields');
    const add=(name,value)=>{const wrap=el('div');wrap.append(el('dt','',name),el('dd','',Array.isArray(value)?(value.length?value.join(', '):'Sin información pública'):label(value)));fields.append(wrap);};
    add('Tipo',p.tipo);
    add('Cuenca',p.cuenca);
    add('Preocupaciones ambientales documentadas',p.preocupacion_ambiental);
    add('Áreas protegidas relacionadas',p.area_protegida);
    add('Usos humanos',p.usos_humanos);
    add('Métodos autorizados para difusión',p.metodos_publicos);
    detail.append(fields);
    detail.append(el('p','gwwm-note','La presencia en el mapa no equivale a una conclusión sobre la calidad del agua.'));
  }
  function draw() {
    if (!map) return;
    overlay.clearLayers();
    filtered = features.filter((f)=>{
      const p=f.properties;
      const q=search.value.trim().toLocaleLowerCase('es');
      return (!region.value || region.value===p.region)
        && (!kind.value || kind.value===p.tipo)
        && (!q || [p.nombre,p.comuna,p.region,p.cuenca].filter(Boolean).join(' ').toLocaleLowerCase('es').includes(q));
    });
    const layer=L.geoJSON({type:'FeatureCollection',features:filtered},{
      style:{color:'#2484BF',weight:4,fillColor:'#68A5DD',fillOpacity:.3},
      pointToLayer:(f, latlng)=>L.circleMarker(latlng,{radius:8,color:'#1B658C',fillColor:'#DB5720',fillOpacity:.9,weight:2}),
      onEachFeature:(f, l)=>{
        l.bindTooltip(label(f.properties.nombre));
        l.on('click',()=>openDetail(f));
      }
    });
    overlay.addLayer(layer);
    count.textContent=`${filtered.length} ${filtered.length===1?'cuerpo de agua':'cuerpos de agua'} en esta vista`;
    if (selected && !filtered.some(f=>f.id===selected)) clearDetail();
  }
  function populate(select,values) {
    for (const value of values.filter(Boolean).sort((a,b)=>a.localeCompare(b,'es'))) {
      const option=el('option','',value); option.value=value;select.appendChild(option);
    }
  }
  function validFeature(feature) {
    if (!feature || feature.type!=='Feature' || !feature.geometry || !feature.properties) return false;
    const p=feature.properties;
    if (p.aprobado_publicacion !== true || typeof p.nombre!=='string') return false;
    return true;
  }
  async function start() {
    if (!window.L) {
      showStatus('No se cargó la biblioteca cartográfica Leaflet. Comprueba la conexión y los enlaces del HTML.');
      return;
    }
    map = L.map(root,{scrollWheelZoom:false,zoomControl:true}).setView(defaultView.center,defaultView.zoom);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
      maxZoom:18,
      minZoom:3
    }).addTo(map);
    let tileErrors=0;
    tiles.on('tileerror',()=>{if(++tileErrors>=3)showStatus('El mapa se inició, pero no se descargan los mosaicos. Comprueba red, bloqueadores y servicio de cartografía.');});
    tiles.once('load',()=>{tileErrors=0;if(features.length>0)hideStatus();});
    overlay=L.featureGroup().addTo(map);
    try {
      const response=await fetch('data/cuerpos-agua-publicos.geojson');
      if(!response.ok) throw new Error('HTTP '+response.status);
      const geojson=await response.json();
      if(geojson.type!=='FeatureCollection' || !Array.isArray(geojson.features))throw new Error('GeoJSON inválido');
      features=geojson.features.filter(validFeature);
    } catch(err) {
      showStatus('El mapa funciona, pero no se ha podido cargar el catálogo público. Revisa la ruta data/cuerpos-agua-publicos.geojson.');
      console.error('GWW mapa público:',err);
      return;
    }
    populate(region,[...new Set(features.map(f=>f.properties.region))]);
    populate(kind,[...new Set(features.map(f=>f.properties.tipo))]);
    for(const control of [search,region,kind])control.addEventListener(control===search?'input':'change',draw);
    reset.addEventListener('click',()=>{search.value='';region.value='';kind.value='';clearDetail();map.setView(defaultView.center,defaultView.zoom);draw();});
    draw();
    if(features.length===0)showStatus('Cartografía real disponible. No hay cuerpos de agua con información autorizada para publicar todavía.');
    else hideStatus();
    setTimeout(()=>map.invalidateSize(),0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
