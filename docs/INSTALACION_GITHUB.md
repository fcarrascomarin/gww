# Sustitución íntegra del sitio en GitHub Pages

1. Conserva fuera de GitHub una copia de respaldo de la versión anterior.
2. Trabaja sobre la carpeta del repositorio clonado con GitHub Desktop.
3. Elimina archivos de versiones antiguas que ya no forman parte del sitio público (incluidos los viejos JSON con detalles de organizaciones o personas). **No borres `.git`.**
4. Copia a la raíz **todo el contenido** del ZIP V9. Deben quedar `index.html`, `styles.css`, `app.js`, `mapa.css`, `mapa.js`, `assets/`, `data/` y `docs/`.
5. Confirma cambios en GitHub Desktop y presiona `Push origin`.
6. En GitHub → `Settings` → `Pages`, verifica que el origen sea `main / (root)`.
7. Abre `https://fcarrascomarin.github.io/gww/`; verifica el footer `Web externa V9`.
8. Verifica que las gotas se abran al clic, los cuatro videos funcionen al clic, la sección `#mapa` tenga un mapa navegable y que el sitio no muestre datos de grupos/voluntarios en fichas públicas.
9. Si la web sigue mostrando la V8, usa `Ctrl + F5` o prueba navegación privada; confirma en GitHub que los archivos de V9 se hayan publicado.

**Nota:** GitHub Pages es adecuado para la **web pública estática**, no para una base de datos interna ni autenticación de usuarios.
