# GWW Chile — Web externa V11

Versión integral del sitio basada en V10, reorganizada por la secuencia acordada:

1. Hero (incluye tres gotas interactivas)
2. Quiénes somos (incluye cifras históricas 2024, sin título propio para las cifras)
3. Nuestra red (logos institucionales y agrupaciones expresamente autorizadas)
4. Qué hacemos (tres resultados del programa, imágenes documentales y cuatro videos)
5. Mapa del agua (mapa geográfico real, sección propia, únicamente cuerpos de agua autorizados)
6. Cómo sumarse (contacto solo para organizaciones territoriales interesadas en cuerpos de agua)

No hay sección separada de «Trayectoria» ni «Memoria viva». La información se integra a «Quiénes somos» y «Qué hacemos» para evitar repetición de títulos.

## Instalación

1. Descarga el ZIP y extrae **su contenido** (no la carpeta contenedora ni el ZIP) en la raíz de tu repositorio `fcarrascomarin/gww`.
2. Reemplaza los antiguos archivos del sitio; conserva `.git` si usas GitHub Desktop.
3. Deben quedar directamente en la raíz `index.html`, `styles.css`, `hero-v10.css`, `v11-sections.css`, `app.js`, `mapa.css`, `mapa.js`, `assets/` y `data/`.
4. Publica en GitHub Pages desde la rama `main` y la carpeta `/(root)`.
5. Comprueba que el pie diga `Web externa V11` y refresca con Ctrl+F5.

## Precauciones de datos

`data/cuerpos-agua-publicos.geojson` comienza vacío; solo debe recibir cuerpos de agua con geometría y campos de publicación autorizados. Los logos de agrupaciones se incorporan a `assets/logos-red/` y `data/logos-red.json` cuando haya autorización institucional expresa. No subir listados internos de agrupaciones, monitores, estaciones sensibles o certificaciones personales al repositorio público.

## Edición

- `index.html`: estructura del contenido y orden de secciones.
- `v11-sections.css`: estilos de la arquitectura compacta de V11.
- `hero-v10.css`: gotas orgánicas y composición de hero.
- `styles.css`: estilos generales.
- `data/videos.json`: metadatos de los cuatro enlaces audiovisuales; validar títulos.
- `data/logos-red.json`: logos autorizados.
- `data/cuerpos-agua-publicos.geojson`: datos aprobados del mapa público.
