# Instalación — sección independiente «Mapa del agua»

**La sección forma parte de `index.html`; NO va dentro del hero, y NO crea una página distinta.**

## 1. Conservar copia del proyecto

Haz una copia del repositorio local antes de editar. No borres el hero, archivos visuales ni las secciones que ya funcionan.

## 2. Preparar los archivos

Copiar a la raíz del repositorio:

- `mapa.css`
- `mapa.js`

Crear o reemplazar únicamente el archivo público:

- `data/cuerpos-agua-publicos.geojson`

No subir Excel históricos, formularios originales, nombres de agrupaciones, voluntarios o coordenadas de estaciones a GitHub Pages.

## 3. En `index.html`: incluir la biblioteca Leaflet y el CSS del módulo

Dentro de `<head>`, después del enlace al `styles.css` existente, agregar:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<link rel="stylesheet" href="mapa.css">
<script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script defer src="mapa.js"></script>
```

Si la versión existente ya incluye Leaflet, conserva una sola copia de sus enlaces JS/CSS. Evita duplicados.

## 4. Insertar una única sección del mapa

Abre `MAPA_SECCION.html`, copia todo el bloque `<section id="mapa">` y pégalo en el `index.html` **fuera del hero** (`</section>` del hero ya cerrado), idealmente después de «Ciencia para cuidar» y antes de «Nuestra red».

**Si ya existe `<section id="mapa">`, reemplázalo completo por este bloque.** No dejes dos elementos con `id="mapa"` ni dos mapas simultáneos.

En la navegación principal agrega el enlace `<a href="#mapa">Mapa del agua</a>`.

## 5. Comprobar una instalación limpia

Prueba con un servidor HTTP local o GitHub Pages (abrir el archivo mediante `file://` impide `fetch`). Con la colección vacía verás un **mapa real de Chile sin puntos** y un mensaje transparente indicando que aún no hay registros autorizados. Debes poder hacer zoom y mover el mapa.

## 6. Incorporar cuerpos de agua autorizados

Cada registro debe haber sido validado y autorizado, incluida su geometría geográfica pública. Dentro de `features` agrega elementos GeoJSON con `id` estable, `geometry` autorizada y `properties` solo públicas.

Ejemplo de **esquema ficticio, no publicable como dato real**:

```json
{
  "type":"Feature",
  "id":"ejemplo-ficticio",
  "geometry":{"type":"Point","coordinates":[-72.0,-37.0]},
  "properties":{
    "aprobado_publicacion":true,
    "nombre":"Cuerpo de agua de ejemplo",
    "tipo":"Río",
    "comuna":"Comuna de ejemplo",
    "region":"Región de ejemplo",
    "cuenca":null,
    "preocupacion_ambiental":null,
    "area_protegida":null,
    "usos_humanos":null,
    "metodos_publicos":[]
  }
}
```

**No incluir este ejemplo en producción.** Coordenadas GeoJSON se escriben como `[longitud, latitud]`, no al revés.

El indicador `aprobado_publicacion` protege la visualización, pero **no protege el archivo JSON si alguien lo descarga**. Solo exporta registros aprobados; los demás no deben existir en el archivo público.

## 7. Publicación en GitHub Pages

Sube los archivos mediante GitHub Desktop/Push, comprueba Pages configurado en `main` y `/(root)`, abre `https://fcarrascomarin.github.io/gww/#mapa`. Si ves una sección sin mosaicos, revisa consola del navegador (F12), pestaña Network y que no haya bloqueo de `tile.openstreetmap.org`.

## 8. Verificación mínima

1. Hero intacto; mapa en sección independiente.
2. Mapas reales (calles, costas, relieve según estilo OSM), zoom y movimiento.
3. Títulos centrados y concisos.
4. Al no haber autorizaciones no aparecen marcadores ficticios.
5. Si se aprueba una geometría, al seleccionarla aparece la ficha lateral.
6. Ni HTML, JS, JSON ni PDF públicos incluyen datos personales o de organización.

Fuente técnica: https://leafletjs.com/examples-v1/quick-start/ y https://operations.osmfoundation.org/policies/tiles/
