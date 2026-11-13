# Videos en «Qué hacemos»

Se prepararon cuatro portadas fotográficas documentales en `data/videos.json`. Al pulsar cada una se abre el reproductor de YouTube dentro del sitio (se utiliza el dominio `youtube-nocookie.com`).

## Cómo editar la portada

1. Coloca una fotografía horizontal con autorización en `assets/`, idealmente de 1600 × 900 píxeles, formato JPG o WebP.
2. Abre `data/videos.json`.
3. En el registro correspondiente modifica `poster` con la ruta `assets/nombre-de-tu-foto.webp`.
4. El campo `id` es el identificador de 11 caracteres del video de YouTube; no cambies el formato.
5. Tras verificar el título oficial y créditos del video, sustituye `label` (por ahora neutro) por el nombre real.
6. Sube los cambios a GitHub Pages.

Las portadas actuales son **fotografías ilustrativas tomadas del archivo documental**, no se afirma que sean fotogramas de los videos vinculados. Antes de publicación definitiva confirmar títulos, créditos, permiso de uso de fotografías e inserción de videos.

Para actualizar un video, copia únicamente el texto posterior a `v=` desde su URL pública. Se usa el reproductor oficial incrustado; no se copian ni redistribuyen los archivos originales de video.
