/**
 * Mapa público de cuerpos de agua.
 * Fuente: data/cuerpos-agua.geojson (GeoJSON WGS84).
 * No contiene información personal, estaciones de muestreo ni mediciones privadas.
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
    type: document.getElementById('map-type'),
    reset: document.getElementById('map-reset'),
    detail: document.getElementById('map-detail'),
    list: document.getElementById('map-list'),
    toggle: document.getElementById('map-explore-toggle'),
    sidebar: document.getElementById('map-sidebar'),
    closeSidebar: document.getElementById('map-sidebar-close')
  };

  // Vista geográfica aproximada del Chile continental, de Arica a Cabo de Hornos.
  // fitBounds ajusta el acercamiento al tamaño real de la ventana, sin privilegiar Biobío.
  const nationalBounds = [[-56.4, -76.5], [-17.3, -66.0]];
  const colors = {point: '#2484BF', fill: '#68A5DD', boundary: '#66824F'};
  const permittedGeometries = new Set(['Point', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']);

  let map = null;
  let features = [];
  let visible = [];
  let overlays = null;
  let currentFeatureId = null;
  const featureLayers = new Map();

  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const valueText = value => {
    if (Array.isArray(value)) return value.length ? value.join('; ') : 'Sin información disponible';
    return typeof value === 'string' && value.trim() ? value.trim() : 'Sin información disponible';
  };
  const text = (element, value) => { if (element) element.textContent = value; };
  const status = message => {
    if (!elements.status) return;
    elements.status.hidden = !message;
    if (message) elements.status.textContent = message;
  };

  function isValidFeature(feature) {
    if (!feature || feature.type !== 'Feature' || !feature.properties) return false;
    const props = feature.properties;
    if (typeof feature.id !== 'string' || typeof props.nombre !== 'string' || !props.nombre.trim()) return false;
    const geometry = feature.geometry;
    if (geometry === null) return true;  // Fichas del catálogo sin ubicación pública definida.
    if (!geometry || !permittedGeometries.has(geometry.type) || !Array.isArray(geometry.coordinates)) return false;
    if (geometry.type === 'Point') {
      const [lon, lat] = geometry.coordinates;
      return Number.isFinite(lon) && Number.isFinite(lat) && Math.abs(lon) <= 180 && Math.abs(lat) <= 90;
    }
    if (['Polygon', 'MultiPolygon'].includes(geometry.type)) {
      // No dibujar delimitaciones sin trazabilidad cartográfica.
      return props.calidad_geometria === 'delimitacion_validada'
        && Boolean(props.fuente_cartografica)
        && /^\d{4}-\d{2}-\d{2}$/.test(props.fecha_geometria || '');
    }
    return true;
  }

  function resetDetail() {
    currentFeatureId = null;
    elements.detail.hidden = true;
    elements.detail.replaceChildren();
    elements.list.querySelectorAll('.map-list-item').forEach(button => button.removeAttribute('aria-current'));
  }

  function field(list, title, content) {
    const row = node('div', 'detail-row');
    row.append(node('dt', '', title), node('dd', '', valueText(content)));
    list.append(row);
  }

  function showDetail(feature) {
    currentFeatureId = feature.id;
    const props = feature.properties;
    elements.detail.hidden = false;
    elements.detail.replaceChildren();
    elements.detail.scrollTop = 0;
    const close = node('button', 'detail-close', '×');
    close.setAttribute('aria-label', 'Cerrar caracterización');
    close.type = 'button';
    close.addEventListener('click', resetDetail);
    const heading = node('div', 'map-detail-header');
    heading.append(close);
    heading.append(node('p', 'detail-place', [props.comuna, props.region].filter(Boolean).join(' · ')));
    heading.append(node('h3', '', props.nombre));
    elements.detail.append(heading);
    const fields = node('dl', 'detail-fields');
    field(fields, 'Tipo', props.tipo);
    if (props.cuenca && !props.cuenca.startsWith('No especificada')) field(fields, 'Cuenca', props.cuenca);
    if (Array.isArray(props.preocupacion_ambiental) && props.preocupacion_ambiental.length) field(fields, 'Contexto ambiental', props.preocupacion_ambiental);
    if (Array.isArray(props.area_protegida) && props.area_protegida.length) field(fields, 'Protección territorial', props.area_protegida);
    if (Array.isArray(props.usos_humanos) && props.usos_humanos.length) field(fields, 'Usos del agua y entorno', props.usos_humanos);
    if (Array.isArray(props.metodos_publicos) && props.metodos_publicos.length) field(fields, 'Métodos documentados', props.metodos_publicos);
    elements.detail.append(fields);

    elements.detail.append(node('p', 'map-disclaimer',
      'La ficha reúne antecedentes públicos de carácter territorial. No representa resultados de monitoreo ni una certificación del estado del cuerpo de agua.'));
    if (typeof props.fuente_cartografica === 'string' && /^https:\/\//i.test(props.fuente_cartografica)) {
      const link = node('a', 'map-source', 'Consultar fuente cartográfica ↗');
      link.href = props.fuente_cartografica;
      link.rel = 'noopener noreferrer';
      link.target = '_blank';
      elements.detail.append(link);
    }

    elements.list.querySelectorAll('.map-list-item').forEach(button => {
      if (button.dataset.featureId === feature.id) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function zoomToFeature(feature) {
    if (!map || !feature.geometry) return;
    if (feature.geometry.type === 'Point') {
      const [lon, lat] = feature.geometry.coordinates;
      map.setView([lat, lon], Math.max(map.getZoom(), 10), {animate: true});
    } else {
      const layer = featureLayers.get(feature.id);
      if (layer?.getBounds) {
        const bounds = layer.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, {padding: [28, 28], maxZoom: 13});
      }
    }
  }

  function selectFeature(feature) {
    showDetail(feature);
    zoomToFeature(feature);

  }

  function populateOptions(select, items) {
    const values = [...new Set(items.map(item => item?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    for (const value of values) {
      const option = node('option', '', value);
      option.value = value;
      select.append(option);
    }
  }

  function refreshList() {
    elements.list.replaceChildren();
    if (!visible.length) {
      elements.list.append(node('p', 'map-empty', 'No se encontraron cuerpos de agua.'));
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const feature of visible) {
      const button = node('button', 'map-list-item');
      button.type = 'button';
      button.dataset.featureId = feature.id;
      const place = node('span', '', feature.properties.nombre);
      const state = node('small', '', [feature.properties.comuna, feature.properties.region].filter(Boolean).join(' · ') || valueText(feature.properties.tipo));
      button.append(place, state);
      if (currentFeatureId === feature.id) button.setAttribute('aria-current', 'true');
      button.addEventListener('click', () => selectFeature(feature));
      fragment.append(button);
    }
    elements.list.append(fragment);
  }

  function redraw() {
    const searchText = elements.search.value.trim().toLocaleLowerCase('es');
    visible = features.filter(feature => {
      const props = feature.properties;
      const searchValues = [props.nombre, props.comuna, props.region, props.cuenca].filter(Boolean).join(' ').toLocaleLowerCase('es');
      return (!elements.region.value || props.region === elements.region.value)
        && (!elements.type.value || props.tipo === elements.type.value)
        && (!searchText || searchValues.includes(searchText));
    });
    if (map && overlays) {
      overlays.clearLayers();
      featureLayers.clear();
      const located = visible.filter(feature => Boolean(feature.geometry));
      if (located.length) {
        const layer = L.geoJSON({type: 'FeatureCollection', features: located}, {
          style: () => ({color: colors.boundary, weight: 2.5, fillColor: colors.fill, fillOpacity: 0.25}),
          pointToLayer: (_feature, latlng) => L.marker(latlng, {
            icon: L.divIcon({
              className: 'gww-marker-wrap',
              html: '<div class="gww-marker"><span>GWW</span></div>',
              iconSize: [44, 44],
              iconAnchor: [15, 37],
              popupAnchor: [0, -30]
            })
          }),
          onEachFeature: (feature, itemLayer) => {
            featureLayers.set(feature.id, itemLayer);
            const tooltip = node('span', '', feature.properties.nombre);
            itemLayer.bindTooltip(tooltip);
            itemLayer.on('click', () => selectFeature(feature));
          }
        });
        overlays.addLayer(layer);
      }
    }
    text(elements.count, `${visible.length} cuerpos de agua en esta vista`);
    if (currentFeatureId && !visible.some(feature => feature.id === currentFeatureId)) resetDetail();
    refreshList();
  }

  function initializeMap() {
    if (!window.L) {
      status('No se pudo cargar la cartografía. Comprueba tu conexión y que Leaflet no esté bloqueado.');
      return;
    }
    try {
      map = L.map(root, {scrollWheelZoom: true, wheelDebounceTime: 55, wheelPxPerZoomLevel: 90, zoomControl: true});
      map.fitBounds(nationalBounds, {padding: [27, 27], maxZoom: 5, animate: false});
      L.DomEvent.disableScrollPropagation(elements.detail);
      L.DomEvent.disableClickPropagation(elements.detail);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3, maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
      }).addTo(map);
      overlays = L.featureGroup().addTo(map);
      status('');
      // Recalcular el tamaño cuando el mapa comienza fuera del área visible.
      requestAnimationFrame(() => map.invalidateSize());
    } catch (error) {
      console.error('Mapa GWW: fallo al crear el mapa', error);
      status('No se pudo inicializar el mapa. Consulta la consola del navegador.');
    }
  }

  function setSidebar(open, returnFocus = false) {
    if (!elements.sidebar || !elements.toggle) return;
    elements.sidebar.hidden = !open;
    elements.toggle.setAttribute('aria-expanded', String(open));
    elements.toggle.setAttribute('aria-label', open ? 'Cerrar explorador de cuerpos de agua' : 'Abrir explorador de cuerpos de agua');
    if (open) elements.search?.focus();
    else if (returnFocus) elements.toggle.focus();
  }

  elements.toggle?.addEventListener('click', () => setSidebar(elements.sidebar.hidden));
  elements.closeSidebar?.addEventListener('click', () => setSidebar(false, true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && elements.sidebar && !elements.sidebar.hidden) setSidebar(false, true);
  });

  async function start() {
    try {
      const response = await fetch('data/cuerpos-agua.geojson', {cache: 'no-cache'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const catalog = await response.json();
      if (catalog.type !== 'FeatureCollection' || !Array.isArray(catalog.features)) {
        throw new Error('Se requiere un GeoJSON FeatureCollection');
      }
      features = catalog.features.filter(isValidFeature);
      populateOptions(elements.region, features.map(feature => feature.properties.region));
      populateOptions(elements.type, features.map(feature => feature.properties.tipo));
      elements.search.addEventListener('input', redraw);
      elements.region.addEventListener('change', redraw);
      elements.type.addEventListener('change', redraw);
      elements.reset.addEventListener('click', () => {
        elements.search.value = '';
        elements.region.value = '';
        elements.type.value = '';
        resetDetail();
        redraw();
        if (map) map.fitBounds(nationalBounds, {padding: [27, 27], maxZoom: 5, animate: true});
      });
      initializeMap();
      redraw();
      if (!features.length) status('No hay cuerpos de agua públicos disponibles en el catálogo.');
    } catch (error) {
      console.error('Mapa GWW: error al cargar el catálogo', error);
      status('No se pudo leer data/cuerpos-agua.geojson. Comprueba que el archivo esté publicado junto al sitio.');
      text(elements.count, 'Catálogo no disponible');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else void start();
})();
