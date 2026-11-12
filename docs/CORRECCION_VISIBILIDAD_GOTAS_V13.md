# Corrección de gotas — V13

## Qué ocurría
Las etiquetas se renderizaban pero las imágenes no, porque la máscara SVG externa aplicada mediante `mask` / `-webkit-mask` no funcionaba correctamente en la versión desplegada. Incrementar brillo u opacidad no corregía el problema.

## Solución
Se generaron tres PNG transparentes con la forma de gota incorporada: `gota-fisicoquimico-foto.png`, `gota-bacteriologico-foto.png`, `gota-macroinvertebrados-foto.png`. Se reemplazaron sus fuentes en `index.html`, y el CSS dejó de aplicar una máscara externa.

## Cómo publicar
Subir **todos** los archivos extraídos del ZIP sobre el repositorio, sin modificar `.git` en el directorio de trabajo. Comprobar que el HTML cargue `hero-v10.css?v=13.0`. Verificar que el pie diga `Web externa V13`, después recargar con Ctrl + F5.

## Importante
El ZIP previo `gww-main.zip` encontrado entre adjuntos es una copia antigua de solo dos archivos. Esta versión fue corregida sobre la V12 completa que corresponde a las capturas recientes.
