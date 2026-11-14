# Global Water Watch Chile · Sitio público

Sitio estático institucional, con HTML, CSS y JavaScript. Compatible con GitHub Pages y Cloudflare Pages.

## Estructura
- `index.html`: estructura semántica y navegación.
- `styles.css`: estilos adaptables a escritorio y móvil.
- `js/site.js`: interacción de métodos y audiovisuales; logos autorizados.
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
Se requieren delimitaciones cartográficas oficiales para representar humedales mediante Polygon/MultiPolygon; los puntos generales no constituyen sus límites. Los valores históricos de la red deben contrastarse con la memoria correspondiente antes de uso institucional final.

## Guía técnica de despliegue y integración

Ver `docs/INSTALACION_Y_ARQUITECTURA.md` para instrucciones de publicación, paleta, mapa, límites de datos y las opciones para alojar la aplicación interna.
