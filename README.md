# Global Water Watch Chile · Sitio público

Sitio estático institucional, con HTML, CSS y JavaScript. Compatible con GitHub Pages y Cloudflare Pages.

## Estructura
- `index.html`: estructura semántica y navegación.
- `styles.css`: estilos adaptables a escritorio y móvil.
- `js/site.js`: navegación móvil, material audiovisual y logos autorizados.
- `js/map.js`: visor Leaflet, filtros y fichas.
- `data/cuerpos-agua.geojson`: datos territoriales aprobados para exposición pública.
- `data/logos-red.json`: agrupaciones autorizadas para aparecer con su logo.
- `data/videos.json`: videos y portadas.
- `assets/`: fotografías institucionales y marcas.
- `docs/`: instrucciones de instalación y arquitectura.

## Publicación
1. Respaldar el repositorio. Copiar el **contenido** de esta carpeta a la raíz del proyecto GitHub Pages (`index.html` debe quedar allí).
2. Commit y Push; comprobar en escritorio y móvil. Recargar con `Ctrl+Shift+R` si hay CSS en caché.
3. No copiar en el repositorio público la plataforma interna ni sus archivos privados.

## Datos del mapa
Los cuerpos de agua mostrados constituyen referencias territoriales. Los sitios de muestreo, la posición exacta de las estaciones, las evidencias documentales, los voluntarios y las mediciones no se publican por defecto. La aprobación de una agrupación y la validación de GWW Chile son independientes.

## Limitaciones
Se requieren delimitaciones cartográficas oficiales para representar humedales mediante Polygon/MultiPolygon; los puntos generales no constituyen sus límites. Las cifras 285 monitoras/es certificados, 15 jornadas de certificación y 106 organizaciones certificadas se presentan como datos históricos de la Memoria GWW Chile 2024, no como cifras vigentes en 2026.

## Guía técnica de despliegue y integración

Ver `docs/INSTALACION_Y_ARQUITECTURA.md` para instrucciones de publicación, paleta, mapa, límites de datos y las opciones para alojar la aplicación interna.

## Ajustes visuales del 15-11-2026
- Encabezados: Plus Jakarta Sans. Cuerpo y controles: Inter (Google Fonts; fuentes de sistema como respaldo sin conexión).
- Hero centrado con dos accesos directos, sin fichas de métodos.
- Qué hacemos amplía historia, procesos y métodos a partir de la Memoria 2024.
- Mapa inicia sin filtros ni fichas abiertos, encuadrado en Chile; el explorador se abre mediante el botón superior derecho.
- No se modificaron los registros del GeoJSON ni los IDs de los videos.

Para previsualizar sin errores de `fetch`, abrir desde un servidor HTTP local (por ejemplo `python -m http.server 8000`) y visitar `http://localhost:8000`. No abrir el archivo como `file://`.
