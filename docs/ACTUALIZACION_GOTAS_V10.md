# V10 — Sustitución del hero y las gotas

La actualización modifica solo los archivos `index.html`, `app.js`, `README.md` y agrega `hero-v10.css` y `assets/gota-fluida-v10.svg`. No cambia `mapa.js`, `mapa.css`, los JSON ni las secciones institucionales.

## Instalación con GitHub Desktop
1. Abre la carpeta clonada del repositorio.
2. Copia los archivos de este paquete a la **raíz** de esa carpeta, manteniendo las carpetas y sustituyendo las versiones anteriores cuando GitHub Desktop lo solicite. No borres `.git`.
3. Confirma que existen en la raíz `index.html`, `styles.css`, `hero-v10.css`, `app.js`, `mapa.css` y `mapa.js`.
4. Confirma el archivo `assets/gota-fluida-v10.svg`.
5. `Commit to main` → `Push origin`.
6. Abre GitHub Pages y usa Ctrl+F5; en el pie debe leerse `Web externa V10`.
7. Prueba las tres gotas, la apertura y cierre de descripciones, el mapa y el menú móvil.

## Ajustes de diseño
- Tamaño y posición: `.droplet-garden` y `.water-drop--...` en `hero-v10.css`.
- Desenfoque del contorno: `assets/gota-fluida-v10.svg`.
- Fotos: `assets/monitoreo-*.png`, sin cambiar rutas ni nombres.
- Descripciones: objeto `methods` de `app.js`.

La máscara no usa una fotografía generada: recorta las fotos originales proporcionadas, y la forma fue redibujada en SVG como aproximación refinada al motivo de gota de GWW Chile.
