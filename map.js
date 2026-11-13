/**
 * Mapa público de cuerpos de agua.
 * Geometrías admitidas: Point, LineString, MultiLineString, Polygon, MultiPolygon.
 * Los polígonos deben corresponder a fuentes cartográficas verificables y autorizadas.
 */
(() => {
  'use strict';

  const root = document.getElementById('water-map');
  if (!root) return;
  const elements = {
    status: document.getElementById('map-status'),
    count: document.getElementById('map-count'),
    search: document.getElementById('map-search'),
    region: document.getElementById('map-region'),
    kind: document.getElementById('map-type'),
    reset: document.getElementById('map-reset'),
    detail: document.getElementById('map-detail'),
    list: document.getElementById('map-list')
  };
  const centerChile = [-36.0, -71.4];
  const zoomChile = 4;
  let map = null;
  let layerGroup = null;
  let records = [];
  let selectedId = null;
  const layers = new Map();
  const allowedTypes = new Set(['Point', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']);

  const node = (tag, className, value) => {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (value != null) result.textContent = value;
    return result;
  };
  const text = value => typeof value === 'string' && value.trim() ? value.trim() : 'No informado';
  function setStatus(message) {
    elements.status.textContent = message;
    elements.status.hidden = !message;
  }
  function isValidFeature(feature) {
    if (!feature || feature.type !== 'Feature' || typeof feature.id !== 'string' || !feature.properties) return false;
    const p = feature.properties;
    if (!p.nombre || !p.region || !p.tipo) return false;
    if (!feature.geometry) return true;
    if (!allowedTypes.has(feature.geometry.type)) return false;
    // Para publicar un polígono se exige procedencia y control de calidad.
    if (['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
      if (p.calidad_geometria !== 'delimitacion_validada' || !p.fuente_cartografica || !p.fecha_geometria) return false;
    }
    try {
      const shape = L.geoJSON(feature);
      const bounds = shape.getBounds();
      return !!bounds && bounds.isValid();
    } catch {
      return false;
    }
  }
  function fillSelect(control, values) {
    [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b,'es')).forEach(value => {
      const option = node('option','',value);
      option.value = value;
      control.append(option);
    });
  }
  function styleFor(feature) {
    const polygon = ['Polygon','MultiPolygon'].includes(feature.geometry.type);
    return {
      color: selectedId === feature.id ? '#0b5d75' : '#2484bf',
      weight: selectedId === feature.id ? 3 : (polygon ? 2 : 3.5),
      opacity: 0.88,
      fillColor: selectedId === feature.id ? '#3b9b9c' : '#68a5dd',
      fillOpacity: polygon ? (selectedId === feature.id ? 0.33 : 0.19) : 0
    };
  }
  function addField(list, title, value) {
    if (Array.isArray(value)) {
      if (!value.length) return;
      value = value.join('; ');
    }
    if (typeof value !== 'string' || !value.trim() || /^No especificada/.test(value)) return;
    const row = node('div','detail-row');
    row.append(node('dt','',title),node('dd','',value));
    list.append(row);
  }
  function openDetail(feature, focusOnMap = false) {
    selectedId = feature.id;
    const p = feature.properties;
    const panel = elements.detail;
    panel.replaceChildren();
    const close = node('button','detail-close','×');
    close.type = 'button';
    close.setAttribute('aria-label','Cerrar ficha');
    close.addEventListener('click', clearDetail);
    panel.append(close);
    panel.append(node('p','detail-place',[p.comuna,p.region].filter(Boolean).join(' · ')));
    panel.append(node('h3','',text(p.nombre)));
    const fields = node('dl');
    addField(fields,'Tipo',p.tipo);
    addField(fields,'Cuenca',p.cuenca);
    addField(fields,'Contexto ambiental',p.preocupacion_ambiental);
    addField(fields,'Protección e instrumentos mencionados',p.area_protegida);
    addField(fields,'Usos consignados',p.usos_humanos);
    addField(fields,'Métodos difundidos',p.metodos_publicos);
    addField(fields,'Procedencia de la información',p.fuente_documental);
    panel.append(fields);
    if (feature.geometry && ['Polygon','MultiPolygon'].includes(feature.geometry.type)) {
      panel.append(node('p','detail-precision','Delimitación cartográfica documentada; no representa un área de monitoreo GWW.'));
    } else if (feature.geometry) {
      panel.append(node('p','detail-precision','Localización general; no corresponde a una estación de muestreo.'));
    } else {
      panel.append(node('p','detail-precision','Sin geometría pública disponible.'));
    }
    const sourceUrl = p.fuente_cartografica;
    if (typeof sourceUrl === 'string' && /^https:\/\/[^\s]+$/i.test(sourceUrl)) {
      const sourceLink = node('a','video-source-link','Fuente cartográfica ↗');
      sourceLink.href = sourceUrl;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.style.textAlign = 'left';
      panel.append(sourceLink);
    }
    for (const item of elements.list.querySelectorAll('button')) {
      item.setAttribute('aria-current',String(item.dataset.featureId === selectedId));
    }
    if (focusOnMap && feature.geometry) {
      const layer = layers.get(feature.id);
      if (layer && layer.getBounds) {
        const bounds = layer.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.3),{maxZoom:12,animate:true});
      } else if (layer && layer.getLatLng) {
        map.setView(layer.getLatLng(),11,{animate:true});
      }
    }
    refreshStyles();
  }
  function clearDetail() {
    selectedId = null;
    elements.detail.replaceChildren(
      node('h3','','Explora el territorio'),
      node('p','','Selecciona un cuerpo de agua en el mapa o en la lista para conocer sus características.')
    );
    [...elements.list.querySelectorAll('button')].forEach(button => button.removeAttribute('aria-current'));
    refreshStyles();
  }
  function refreshStyles() {
    for (const feature of records) {
      const layer = layers.get(feature.id);
      if (!layer) continue;
      const polygonOrLine = feature.geometry && feature.geometry.type !== 'Point';
      if (polygonOrLine && typeof layer.setStyle === 'function') layer.setStyle(styleFor(feature));
      else if (typeof layer.setStyle === 'function') layer.setStyle({radius:feature.id===selectedId?10:7,color:'#fff',weight:2,fillColor:feature.id===selectedId?'#0a5b73':'#2484bf',fillOpacity:.96});
    }
  }
  function draw() {
    layerGroup.clearLayers();
    layers.clear();
    const query = elements.search.value.trim().toLocaleLowerCase('es');
    const selected = records.filter(feature => {
      const p=feature.properties;
      const haystack=[p.nombre,p.comuna,p.region,p.cuenca].filter(Boolean).join(' ').toLocaleLowerCase('es');
      return (!elements.region.value || p.region===elements.region.value)
        && (!elements.kind.value || p.tipo===elements.kind.value)
        && (!query || haystack.includes(query));
    });
    const located = selected.filter(item => item.geometry);
    const unlocated = selected.length-located.length;
    for (const feature of located) {
      const shape = L.geoJSON(feature,{
        pointToLayer:(item,latlng) => L.circleMarker(latlng,{radius:7,color:'#fff',weight:2,fillColor:'#2484bf',fillOpacity:.96}),
        style:styleFor
      });
      const layer=shape.getLayers()[0];
      if (!layer) continue;
      layer.on('click',() => openDetail(feature));
      layer.bindTooltip(text(feature.properties.nombre),{direction:'top'});
      layerGroup.addLayer(layer);
      layers.set(feature.id,layer);
    }
    elements.list.replaceChildren();
    for (const feature of selected) {
      const item = node('button','map-list-item');
      item.type='button';
      item.dataset.featureId = feature.id;
      item.setAttribute('aria-current',String(selectedId===feature.id));
      item.append(node('span','',text(feature.properties.nombre)));
      item.append(node('small','',feature.geometry ? (['Polygon','MultiPolygon'].includes(feature.geometry.type)?'Área':'Ubicación') : 'Por ubicar'));
      item.addEventListener('click', () => openDetail(feature,true));
      elements.list.append(item);
    }
    elements.count.textContent = `${selected.length} cuerpos de agua · ${located.length} en mapa · ${unlocated} por ubicar`;
    if (selectedId && !selected.some(item => item.id===selectedId)) clearDetail();
  }

  async function initialize() {
    if (!window.L) {
      setStatus('No se pudo cargar el mapa. Comprueba tu conexión.');
      return;
    }
    map = L.map(root,{scrollWheelZoom:false,zoomControl:true,minZoom:3,maxZoom:17}).setView(centerChile,zoomChile);
    const base=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      maxZoom:17
    }).addTo(map);
    let failedTiles=0;
    base.on('tileerror',()=>{if(++failedTiles>=3) setStatus('El mapa se inició, pero no se descargan las imágenes cartográficas.');});
    base.on('load',()=>{failedTiles=0;setStatus('');});
    layerGroup=L.layerGroup().addTo(map);
    try {
      const response = await fetch('data/cuerpos-agua.geojson');
      if (!response.ok) throw new Error('HTTP '+response.status);
      const data=await response.json();
      if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error('Catálogo GeoJSON inválido');
      records=data.features.filter(isValidFeature);
    } catch (error) {
      console.error('Catálogo cartográfico:',error);
      setStatus('No se pudo consultar el catálogo de cuerpos de agua.');
      return;
    }
    fillSelect(elements.region, records.map(item => item.properties.region));
    fillSelect(elements.kind, records.map(item => item.properties.tipo));
    elements.search.addEventListener('input',draw);
    elements.region.addEventListener('change',draw);
    elements.kind.addEventListener('change',draw);
    elements.reset.addEventListener('click',() => {
      elements.search.value='';elements.region.value='';elements.kind.value='';
      clearDetail();draw();map.setView(centerChile,zoomChile,{animate:true});
    });
    draw();
    setStatus('');
    const observer=new IntersectionObserver(entries => {
      if (entries.some(item => item.isIntersecting)) {map.invalidateSize();observer.disconnect();}
    },{threshold:0.1});
    observer.observe(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else void initialize();
})();
