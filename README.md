# Global Water Watch Chile — Web pública V9

**Preparada para GitHub Pages.** Sitio público del programa Global Water Watch Chile, en coordinación con Fundación Manzana Verde.

## Qué incluye

- Hero fotográfico con transición suave entre paisaje y trabajo comunitario, título breve centrado y tres gotas interactivas.
- Indicadores históricos de la memoria 2024 fuera del hero, sobre fotografía documental.
- «Quiénes somos» y «Ciencia para cuidar» con fotografías del brochure.
- «Mapa del agua» como sección **propia** con Leaflet/OpenStreetMap real, búsqueda y ficha lateral.
- «Nuestra red»: logos institucionales presentes y mecanismo para añadir logos de agrupaciones autorizados.
- «Memoria viva»: cuatro videos enlazados por el usuario, presentados en un reproductor que solo se carga tras clic.
- «Contacto»: solo para organizaciones territoriales que buscan conocer o proteger cuerpos de agua. No contiene formulario de inscripción individual, oferta comercial o venta de certificaciones.

## Publicar en GitHub Pages

1. Descarga y descomprime este ZIP; **no subas el ZIP como si fuera la web**.
2. En el repositorio `fcarrascomarin/gww`, reemplaza los archivos anteriores del sitio por **el contenido** de la carpeta del ZIP. Mantén el repositorio Git o utiliza GitHub Desktop para registrar y subir los cambios; no borres `.git`.
3. Comprueba que `index.html`, `styles.css`, `app.js`, `mapa.css`, `mapa.js`, `assets/` y `data/` estén directamente en la raíz.
4. En GitHub → Settings → Pages, selecciona `Deploy from a branch`, `main`, `/(root)`.
5. Comprueba el sitio en `https://fcarrascomarin.github.io/gww/` y el pie **«Web externa V9»**. Fuerza recarga con `Ctrl + F5` si ves archivos antiguos.
6. Para confirmar el mapa, abre `#mapa`: debes poder **arrastrar y hacer zoom sobre un mapa geográfico real de Chile**. Si aparece un mensaje de error, revisa la red y los bloqueadores; hay dependencia de la biblioteca Leaflet y las teselas OSM.

## Importante sobre el mapa

`data/cuerpos-agua-publicos.geojson` **está vacío intencionalmente**. La cartografía real funciona, pero no hay cuerpos de agua marcados hasta contar con geometrías y fichas autorizadas. Nunca atribuyas ubicaciones comunales a estaciones reales sin validación. No hay mediciones numéricas ni datos de agrupaciones/voluntarios en el mapa público.

## Configuración editable

- `data/logos-red.json` — logos de agrupaciones autorizadas (inicialmente vacío).
- `data/videos.json` — cuatro videos del usuario; títulos provisionales hasta verificación.
- `data/cuerpos-agua-publicos.geojson` — solo información validada y autorizada.
- `assets/` — fotos, logo, silueta de gota y portadas.
- `styles.css` — tamaños, paleta y composición.

Consulta la carpeta `docs/` para reglas de edición, permisos y datos.

**Titularidad y mantenimiento:** los activos y cuentas de publicación deben permanecer bajo control institucional de GWW Chile/Fundación Manzana Verde. Los archivos de terceros tienen sus propios derechos y se utilizan sujetos a las autorizaciones correspondientes.
