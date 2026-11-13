# Depuración del repositorio público · V15

Esta lista se obtuvo revisando la estructura de `fcarrascomarin/gww` el 12 de noviembre de 2026 y comparando el HTML, JS y CSS de la V15. Haz respaldo antes de borrar. El ZIP V15 ya incluye solamente los archivos requeridos para la web y las guías asociadas.

## Puedes eliminar del repositorio de publicación
- `MAPA_SECCION.html` — era la sección antigua separada; `index.html` ya contiene el mapa actual.
- `hero-v10.css` — sustituido por `hero-v14.css` y `v15-adjustments.css`.
- `data/public-water-bodies.json` — catálogo anterior, no lo lee el mapa.
- `data/public-showcase.json` — muestra antigua que llegó a incluir nombres de personas/equipos. **Retirar prioritariamente**: el repositorio GitHub Pages es público.
- `assets/gota-mascara.svg`, `assets/gota-fluida-v10.svg`, `assets/gota-fisicoquimico-foto.png`, `assets/gota-bacteriologico-foto.png`, `assets/gota-macroinvertebrados-foto.png` — sistema anterior de gotas, no se usa.
- `assets/mapa-junquillar-referencia.png` — referencia ilustrativa antigua, no se usa.
- `assets/gww-p1-265.webp`, `assets/gww-p1-267.webp`, `assets/gww-p1-268.webp`, `assets/gww-p14-92.webp`, `assets/gww-p6-25.webp`, `assets/gww-p6-27.webp`, `assets/gww-p7-42.webp` — imágenes antiguas no referenciadas en el sitio V15.
- `assets/brochure-portada.webp` — sin uso en V15.
- `docs/ASIGNACION_IMAGENES_V4.md`, `docs/ACTUALIZACION_GOTAS_V10.md`, `docs/CORRECCION_VISIBILIDAD_GOTAS_V13.md`, `docs/CAMBIOS_V11.md`, `docs/MUESTRA_PUBLICA_PILOTO.md`, `docs/GUIA_GITHUB_PAGES.md`, `docs/INSTALAR_MAPA.md` — documentación de versiones previas, sustituida por las guías V15.

## Fuera de GitHub Pages, conservar copia de desarrollo
- `scripts/build_public_catalog.py` y `tests/` y `test_publication.py` pueden trasladarse a una carpeta/repo privado de desarrollo si no intervienen en tu despliegue. No son archivos necesarios para que la web se muestre.
- `documentos/Memoria_GWW_Chile_2024.pdf`: el sitio V15 no lo enlaza. Conviene retirarlo de la publicación después de conservar respaldo privado y revisar los permisos sobre fotos, nombres y contenido.

## No eliminar
- `index.html`, `styles.css`, `app.js`, `mapa.css`, `mapa.js`.
- `hero-v14.css`, `v11-sections.css`, `v14-sections.css`, `v15-adjustments.css`.
- `assets/` y `data/` **como carpetas completas**. Conservar únicamente su contenido actual del paquete V15.
- `.nojekyll`, `README.md`, `docs/AGREGAR_CUERPOS_DE_AGUA_V15.md`, `herramientas/validar_catalogo.py`.
- `.gitignore` del repositorio y la carpeta local oculta `.git` (GitHub Desktop la necesita para conservar el historial).

## Cómo ejecutar
1. Descarga el repo o crea una copia de seguridad local.
2. Descomprime V15 y copia los archivos del paquete a la raíz del repositorio de GitHub Desktop, sustituyendo los que coincidan.
3. Elimina los archivos sobrantes listados arriba, **no elimines `.git`**.
4. Comprueba que `index.html` incluye `hero-v14.css?v=15.0`, `v15-adjustments.css?v=15.0`, `mapa.js?v=15.0`.
5. Ejecuta `python herramientas/validar_catalogo.py`.
6. Revisa cambios, confirma (`Commit`) y publica (`Push origin`). Verifica en `https://fcarrascomarin.github.io/gww/` y borra caché con `Ctrl + F5`.

## Protección de datos
Eliminar un archivo de la rama actual **no elimina automáticamente su historial de Git**. Si el antiguo JSON contiene información personal no consentida, revisar además historial, repositorios derivados y copias, y solicitar asesoría técnica para saneamiento de Git si fuera necesario. Nunca subir la base privada o datos de certificaciones a GitHub Pages.
