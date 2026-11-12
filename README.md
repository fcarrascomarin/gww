# GWW Chile — Web pública V14

Sitio estático GitHub Pages, con hero rediseñado, objetos científicos interactivos, fotografía documental y sección de videos, mapa de Leaflet y cartografía OpenStreetMap.

## Estructura visible

Hero, Quiénes somos, Nuestra red, Qué hacemos (videos), Mapa del agua y Cómo sumarse.

## Instrucciones prioritarias

- `docs/CAMBIOS_V14.md`: descripción de las mejoras.
- `docs/INSTALACION_Y_REVISION_V14.md`: cómo reemplazar toda la web sin mezclar versiones.
- `docs/AGREGAR_CUERPOS_DE_AGUA.md`: procedimiento detallado para altas en el mapa.
- `ejemplos/FICHA_PUBLICA_MODELO.json`: ejemplo no publicable, sin coordenadas reales.
- `herramientas/validar_catalogo.py`: validación estructural del catálogo antes de publicarlo.
- `data/cuerpos-agua-publicos.geojson`: única capa de fichas públicas autorizadas; vacía por defecto.
- `data/videos.json`: enlaces y portadas editoriales de los cuatro videos compartidos.
- `data/logos-red.json`: agrupaciones con autorización expresa de uso de logo.

**NUNCA guardar datos internos en GitHub Pages.** El sistema interno de perfiles, certificaciones y mediciones deberá utilizar un backend privado con control de acceso, y exportar solamente las fichas previamente revisadas y autorizadas.

## Publicación

Descomprime la totalidad del paquete en la raíz del repositorio y realiza commit + push mediante GitHub Desktop. Comprueba en el footer que indique `Web externa V14`, y en la página que los objetos, videos y mapa aparezcan según lo previsto.
