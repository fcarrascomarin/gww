# Global Water Watch Chile — Web externa V15

Sitio estático para revisión institucional de Fundación Manzana Verde y GWW Chile.

## Cambios de V15
- **Mapa real en sección propia** con 14 referencias a cuerpos de agua explícitamente nombrados en el listado territorial, 10 con ubicaciones generales y 4 pendientes; NO son estaciones de monitoreo.
- **Hero** con tubo, tarjeta y lupa; los tres títulos alineados en la misma línea inferior, sin modificar el bloque de descripción al lado opuesto.
- **Red** con fotografía protagonista y franja de logos autorizados.
- **Qué hacemos** con cuatro carátulas que abren videos aportados.
- **Protección de datos:** no se incluyen nombres de agrupaciones, voluntarios, certificaciones, contactos personales ni mediciones en el mapa.

## Archivos clave
- `index.html`, `styles.css`, `hero-v14.css`, `v15-adjustments.css`, `app.js`
- `mapa.js`, `mapa.css`, `data/cuerpos-agua-publicos.geojson`
- `docs/AGREGAR_CUERPOS_DE_AGUA_V15.md` para nuevas fichas
- `docs/DEPURACION_REPOSITORIO_V15.md` para eliminar archivos heredados
- `herramientas/validar_catalogo.py` para validar datos

La fuente comunal contiene 34 equipos, no 34 cuerpos de agua. La capa del mapa es **preliminar**, no un registro acreditado de estaciones ni resultados. Ninguna autorización para publicar mediciones puede inferirse del documento. Los puntos son ubicaciones generales de cuerpos de agua, no lugares de muestreo.

Para ejecutar localmente: `python -m http.server 8000`, después abre `http://localhost:8000/`. El mapa usa Leaflet/OpenStreetMap y requiere conexión para descargar las teselas.
