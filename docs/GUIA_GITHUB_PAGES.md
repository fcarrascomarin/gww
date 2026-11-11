# Publicar y editar GWW Chile desde GitHub

Esta es una guía para que **tú controles los archivos**. No necesitas conceder acceso a terceros.

## 1. Extraer el ZIP

En Windows, haz clic derecho en el ZIP y elige **Extraer todo**. Abre la carpeta `GWW_Chile_GitHub_Pages_V3`.

Comprueba que dentro aparecen directamente `index.html`, `styles.css`, `app.js`, `README.md`, `assets`, `data` y `documentos`.

## 2. Actualizar el repositorio existente

Ingresa a https://github.com/fcarrascomarin/gww y abre la rama **main**.

### Método rápido: navegador

- Pulsa **Add file → Upload files**.
- Arrastra el **contenido de la carpeta**, no el ZIP; según el navegador, arrastra las carpetas y archivos desde el explorador de Windows.
- Antes de confirmar, revisa que GitHub muestre **index.html en la raíz** y rutas como `assets/…` y `documentos/…`.
- Confirma con **Commit changes**.
- Si GitHub rechaza una subida o no conserva carpetas, usa el método GitHub Desktop.

### Método recomendado: GitHub Desktop

- Instala https://desktop.github.com/ e inicia sesión.
- **File → Clone Repository** y selecciona `fcarrascomarin/gww`.
- Abre la carpeta local clonada y copia allí los archivos y carpetas **desde dentro** de `GWW_Chile_GitHub_Pages_V3`.
- En GitHub Desktop: revisa cambios → **Commit to main** → **Push origin**.
- No borres el `.git` oculto de la carpeta clonada; GitHub Desktop lo necesita.

El archivo previo `GWW_Chile_V2_Vista_Previa.html` puede quedar como copia histórica; Pages usará `index.html` como inicio. No necesitas renombrar ni cargar el HTML antiguo de 6,9 MB.

## 3. Activar GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment**. Selecciona **Deploy from a branch** con rama **main** y carpeta **/(root)**. Presiona **Save**.

Cuando GitHub confirme el despliegue, abre: https://fcarrascomarin.github.io/gww/

> Esa URL **no se activa por el solo hecho de subir los archivos**; Pages debe estar habilitado y el despliegue haber terminado correctamente.

## 4. Editar desde tu computador

- Instala https://code.visualstudio.com/.
- En **File → Open Folder**, abre la carpeta que clonaste con GitHub Desktop.
- Modifica `index.html` para editar textos y secciones.
- Modifica `styles.css` para colores, espacios, tipografía y presentación. Al comienzo están las variables `--blue`, `--blue2`, `--orange`, `--cream` y `--green`.
- Modifica `app.js` para búsquedas y navegación.
- Conserva rutas **relativas** (`assets/foto.webp`), pues la web estará publicada bajo `/gww/`.
- Guarda, realiza commit y push con GitHub Desktop.

Para vista local simple, abre `index.html` con doble clic. Para probar funciones que consulten archivos JSON, inicia un servidor local desde esa carpeta: `python -m http.server 8000` y entra a `http://localhost:8000/`. Alternativamente usa la extensión Live Server de VS Code.

## 5. Si GitHub Pages no muestra la web

- **404:** verifica `index.html` en la raíz y la configuración **main / (root)**.
- **Se ve el repositorio, no la página:** estás en `github.com`, no en `fcarrascomarin.github.io/gww/`.
- **Sin fotografías/estilos:** confirma que hayas cargado las carpetas `assets/` y el archivo `styles.css` a la raíz sin alterar sus nombres o mayúsculas.
- **Cambios antiguos:** verifica que hayas hecho **Push origin**, revisa **Actions** y vuelve a cargar la página sin caché (`Ctrl+F5`).
- **Se muestra la web pero faltan datos:** es normal; el catálogo de mediciones reales está vacío a propósito.

## 6. Conectar gww.cl más adelante

Cuando la fundación apruebe la publicación, se podrá configurar **Settings → Pages → Custom domain** y después los DNS del dominio controlado por la organización. No modifiques DNS antes de validar la página de GitHub Pages.

## 7. Seguridad y uso institucional

**No subas Excel, formularios, listados de monitores, coordenadas exactas, datos privados ni credenciales al repositorio público.** GitHub Pages publica todo su contenido. Los archivos de este ZIP son para diseño y pruebas; revisa licencias de imágenes, PDFs y marcas antes de lanzar el sitio.
