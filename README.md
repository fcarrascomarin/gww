# Global Water Watch Chile — sitio público

Sitio estático institucional de Global Water Watch Chile, coordinado por Fundación Manzana Verde. Se publica mediante GitHub Pages.

## Estructura

```text
index.html                Estructura semántica del sitio
styles.css                Única hoja de estilos
js/site.js                Menú, métodos, videos y logos
js/map.js                 Mapa público (Leaflet, OpenStreetMap, GeoJSON)
data/cuerpos-agua.geojson Referencias territoriales públicas
 data/videos.json         Videos incorporados en «Qué hacemos»
 data/logos-red.json      Logos de organizaciones autorizadas
assets/                   Fotografías e identidad gráfica utilizadas
tools/                    Importación y validación de geometrías
docs/                     Manual técnico y política de publicación
```

## Puesta en marcha

El sitio utiliza archivos JSON, por lo que debe abrirse mediante un servidor HTTP (no haciendo doble clic en `index.html`).

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000/` y comprobar los enlaces, el mapa y la reproducción de videos. Se requiere conexión para cargar Leaflet, teselas de OpenStreetMap y contenido YouTube.

Publicar **el contenido de esta carpeta** en la raíz de la rama configurada en GitHub Pages. No subir la carpeta que lo contiene como subdirectorio.

## Modelo de datos

`data/cuerpos-agua.geojson` contiene referencias territoriales documentadas. **No identifica estaciones, organizaciones, personas ni resultados de monitoreo.** Los puntos son localizaciones generales y no implican delimitaciones. Los polígonos solo se muestran cuando su geometría contiene fuente y fecha.

```bash
python tools/validar_catalogo.py
```

Consultar `docs/MAPA_Y_POLIGONOS.md` antes de importar una nueva delimitación y `docs/DEPURACION.md` antes de reemplazar versiones antiguas del repositorio.

## Gobierno de datos

Todo lo que se incorpore a este repositorio público, incluso en JSON, `assets/` o `docs/`, puede ser descargado por terceros. Los registros de la plataforma interna se mantendrán en un sistema separado con autenticación, autorización y exportación controlada hacia la web pública.
