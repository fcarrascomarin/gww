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
  const indexList = byId('gwwm-index');

  function clearDetail() {
    selected = null;
    detail.replaceChildren(
      el('p', 'gwwm-detail-eyebrow','REFERENCIAS DEL LISTADO'),
      el('h3','', 'Selecciona un cuerpo de agua'),
      el('p','', 'Selecciona un cuerpo de agua en el mapa o en la lista. Los antecedentes son preliminares y no equivalen a estaciones de monitoreo.'),
      el('p','gwwm-note','El mapa no muestra agrupaciones, monitores ni estaciones exactas de muestreo.')
    );
  }
  function openDetail(feature) {
    selected = feature.id;
    const p=feature.properties || {};
    detail.replaceChildren();
    const close=el('button','gwwm-close','Cerrar ficha');close.type='button';close.onclick=clearDetail;detail.append(close);
    detail.append(el('p','gwwm-detail-eyebrow','REFERENCIA TERRITORIAL · EN REVISIÓN'));
    detail.append(el('h3','', label(p.nombre)));
    detail.append(el('p','', [p.comuna,p.region].filter(Boolean).join(' · ')));
    const fields=el('dl','gwwm-fields');
    const add=(name,value)=>{const wrap=el('div');wrap.append(el('dt','',name),el('dd','',Array.isArray(value)?(value.length?value.join(', '):'Sin información pública'):label(value)));fields.append(wrap);};
    add('Tipo',p.tipo);
    add('Cuenca',p.cuenca);
    add('Contexto ambiental comunal declarado',p.preocupacion_ambiental);
    add('Referencias de protección / instrumentos del listado',p.area_protegida);
    add('Usos consignados en la fila comunal',p.usos_humanos);
    add('Métodos GWW confirmados para este cuerpo de agua',p.metodos_publicos);
    add('Estado cartográfico',p.estado_geografico==='referencial'?'Punto geográfico general (no estación de muestreo)':'Pendiente de georreferenciación');
    if (p.precision_publica) add('Precisión cartográfica',p.precision_publica);
    if (p.fuente_publica) add('Fuente documental',p.fuente_publica);
    detail.append(fields);
    detail.append(el('p','gwwm-note','Ficha preliminar construida desde referencias comunales. No acredita una estación GWW, monitoreo activo, calidad del agua ni consentimiento para publicar mediciones.'));
    if (p.fuente_geo && /^https:\/\//.test(p.fuente_geo)) {const link=el('a','gwwm-source-link','Ver fuente geográfica externa ↗');link.href=p.fuente_geo;link.target='_blank';link.rel='noopener noreferrer';detail.append(link);}
  }
  function draw() {
    if (!map) return;
    overlay.clearLayers();
    const query = search.value.trim().toLocaleLowerCase('es');
    filtered = features.filter(f=>{
      const p=f.properties;
      return (!region.value || region.value===p.region)
        && (!kind.value || kind.value===p.tipo)
        && (!query || [p.nombre,p.comuna,p.region,p.cuenca].filter(Boolean).join(' ').toLocaleLowerCase('es').includes(query));
    });
    const located=filtered.filter(f=>f.geometry);
    const unlocated=filtered.length-located.length;
    const layer=L.geoJSON({type:'FeatureCollection',features:located},{
      pointToLayer:(f,latlng)=>L.circleMarker(latlng,{radius:8,color:'#fff',fillColor:'#2484BF',fillOpacity:.96,weight:2}),
      onEachFeature:(f,l)=>{l.bindTooltip(label(f.properties.nombre));l.on('click',()=>openDetail(f));}
    });
    overlay.addLayer(layer);
    count.textContent=`${filtered.length} referencias documentales · ${located.length} en mapa · ${unlocated} por ubicar`;
    if(selected&&!filtered.some(f=>f.id===selected))clearDetail();
    if(indexList){
      indexList.replaceChildren();
      const h=el('p','gwwm-index-title','Cuerpos de agua mencionados'); indexList.append(h);
      if(!filtered.length)indexList.append(el('p','gwwm-empty','No hay resultados con estos filtros.'));
      for(const f of filtered){
        const btn=el('button','gwwm-index-item'); btn.type='button';
        btn.append(el('span','gwwm-index-name',label(f.properties.nombre)));
        btn.append(el('small','',f.geometry?'Ubicación general':'Ubicación pendiente'));
        btn.addEventListener('click',()=>{
          openDetail(f);
          if(f.geometry?.type==='Point'){
            const c=f.geometry.coordinates;
            map.setView([c[1],c[0]],Math.max(map.getZoom(),9),{animate:true});
          }
          if(window.matchMedia('(max-width:900px)').matches)detail.scrollIntoView({behavior:'smooth',block:'nearest'});
        });
        indexList.append(btn);
      }
    }
  }
  function populate(select,values) {
    for (const value of values.filter(Boolean).sort((a,b)=>a.localeCompare(b,'es'))) {
      const option=el('option','',value); option.value=value;select.appendChild(option);
    }
  }
  function validFeature(feature) {
    if (!feature || feature.type!=='Feature' || !feature.properties) return false;
    const p=feature.properties;
    if (p.mostrar_referencia_publica !== true || typeof p.nombre!=='string') return false;
    if(feature.geometry===null) return p.estado_geografico==='pendiente';
    return feature.geometry.type==='Point' && Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length===2;
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
    if(features.length===0)showStatus('Cartografía disponible. No hay referencias documentales aún.');
    else hideStatus();
    setTimeout(()=>map.invalidateSize(),0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
