# GWW Chile — Web externa V13

Versión integral del sitio basada en V10, reorganizada por la secuencia acordada:

1. Hero (incluye tres gotas interactivas)
2. Quiénes somos (incluye cifras históricas 2024, sin título propio para las cifras)
3. Nuestra red (logos institucionales y agrupaciones expresamente autorizadas)
4. Qué hacemos (tres resultados del programa, imágenes documentales y cuatro videos)
5. Mapa del agua (mapa geográfico real, sección propia, únicamente cuerpos de agua autorizados)
6. Cómo sumarse (contacto solo para organizaciones territoriales interesadas en cuerpos de agua)


## Precauciones de datos

`data/cuerpos-agua-publicos.geojson` comienza vacío; solo debe recibir cuerpos de agua con geometría y campos de publicación autorizados. Los logos de agrupaciones se incorporan a `assets/logos-red/` y `data/logos-red.json` cuando haya autorización institucional expresa. No subir listados internos de agrupaciones, monitores, estaciones sensibles o certificaciones personales al repositorio público.

## Edición

- `index.html`: estructura del contenido y orden de secciones.
- `v11-sections.css`: estilos de la arquitectura compacta de V13.
- `hero-v10.css`: gotas orgánicas y composición de hero.
- `styles.css`: estilos generales.
- `data/videos.json`: metadatos de los cuatro enlaces audiovisuales; validar títulos.
- `data/logos-red.json`: logos autorizados.
- `data/cuerpos-agua-publicos.geojson`: datos aprobados del mapa público.


