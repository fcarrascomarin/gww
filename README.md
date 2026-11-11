# Global Water Watch Chile — Web pública (versión de trabajo V3)

Sitio estático para GitHub Pages. Basado en los materiales aportados de GWW Chile y Fundación Manzana Verde. **No es la plataforma privada de monitoreo.**

## Cómo verlo en GitHub Pages

1. Extrae este ZIP en tu computador. **No subas el ZIP como archivo al repositorio.**
2. Abre la carpeta extraída y sube **su contenido** a la raíz del repositorio `fcarrascomarin/gww`. El archivo `index.html` debe aparecer junto a este `README.md`, no dentro de otra carpeta.
3. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**.
4. El sitio quedará disponible, después del despliegue correcto, en `https://fcarrascomarin.github.io/gww/`.
5. Haz cambios en `index.html`, `styles.css` o `app.js`, y usa **Commit changes** / **Push origin**.

Consulta la guía detallada en [`docs/GUIA_GITHUB_PAGES.md`](docs/GUIA_GITHUB_PAGES.md).

## Personalización

- `index.html` — secciones, textos y enlaces.
- `styles.css` — diseño; la **paleta aprobada** está al inicio, dentro de `:root`.
- `app.js` — catálogo histórico filtrable, menús y pestañas.
- `assets/` — imágenes documentales de las memorias.
- `documentos/Memoria_GWW_Chile_2024.pdf` — memoria histórica de referencia (verificar autorización para publicación web).
- `data/public-water-bodies.json` — vacío intencionalmente: ningún dato científico está aprobado para publicación.
- `docs/` — trazabilidad y autorización de datos.
- `scripts/` — utilidades experimentales para construir catálogos públicos, **no ejecutarlas con registros reales sin auditoría y validación**.
- `tests/` — pruebas de las reglas de exportación.

## Restricciones y estado del prototipo

- La sección territorial contiene referencias históricas citadas en la Memoria GWW 2024, **no mediciones georreferenciadas vigentes**.
- El mapa es una representación conceptual sin ubicaciones reales.
- No hay datos científicos individuales publicados ni sistema privado de cuentas.
- Fotografías, marca y documento PDF deben contar con permiso de reproducción antes de hacer público el sitio. Se incluyen solo para la revisión de la maqueta.
- Los permisos de difusión de las agrupaciones se deberán establecer en los formularios y verificarse antes de generar exportaciones públicas.
- Este repositorio deberá quedar bajo control institucional de Fundación Manzana Verde / GWW Chile y mantenerse con respaldo y documentación.

**Paleta oficial**: `#68A5DD`, `#2484BF`, `#DB5720`, `#F2EBD5`, `#66824F` (archivo recibido «Paleta de colores Web GWW.pdf»).


## Novedades V4
- Hero rediseñado con imagen principal de río y tres tarjetas de monitoreo superpuestas.
- Segunda sección territorial rediseñada con mapa de referencia de estética orgánica.
- Incorporación de logos de Fundación Manzana Verde y Global Water Watch Chile.
- Guía de nombres y ubicación de imágenes en `docs/ASIGNACION_IMAGENES_V4.md`.
