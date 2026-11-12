# Dónde poner fotos, logos y videos

## Fotos del hero y métodos

| Archivo en `assets/` | Uso |
|---|---|
| `hero-rio-comunidad.jpg` | Fondo de río, lado izquierdo del hero |
| `gww-p5-21.webp` | Monitoreo de campo, fusionado al lado derecho del hero |
| `monitoreo-fisicoquimico.png` | Gota de fisicoquímica y expansión |
| `monitoreo-bacteriologico.png` | Gota bacteriológica y expansión |
| `monitoreo-macroinvertebrados.png` | Gota de macroinvertebrados y expansión |
| `gota-mascara.svg` | Silueta compartida de las gotas, editable con SVG |
| `logo-gww-chile.png` | Logotipo en la navegación y pie |
| `logo-manzana-verde.png` | Logo de coordinación en «Nuestra red» |

## Fotos editoriales del brochure

- `brochure-equipo.webp` — cifras y «Nuestra red».
- `brochure-que-es.webp` — «Quiénes somos».
- `brochure-datos.webp`, `brochure-decisiones.webp`, `brochure-aprendizaje.webp` — «Ciencia para cuidar».
- `brochure-contacto.webp` — fondo de contacto.
- `gww-p11-80.webp` — memoria audiovisual.

Para reemplazar una foto, sustituye el archivo manteniendo su nombre y formato, o cambia su ruta en `index.html`/`styles.css`.

## Logos de agrupaciones

1. Guarda archivos de logos en `assets/logos-red/`, con nombres sin espacios, por ejemplo `agrupacion-ejemplo.webp`.
2. Abre `data/logos-red.json` y añade una entrada como la siguiente **solo después de contar con autorización**:

```json
[
  {"nombre":"Nombre autorizado", "archivo":"assets/logos-red/agrupacion-ejemplo.webp", "autorizado":true}
]
```

3. Sube la imagen y el JSON a GitHub. La sección mostrará exclusivamente los registros con `autorizado: true`.
4. No se muestran datos de esa agrupación en el mapa; su logo es solo reconocimiento de participación en la red.

## Videos

`data/videos.json` contiene los cuatro enlaces que compartiste. Cada tarjeta utiliza una foto editorial local de portada y abre el video al hacer clic. **Los títulos siguen provisionales** hasta validar el tema real de cada video, su fecha y permiso de inserción. Cambia `label` y `poster` si corresponde; conserva el `id` de YouTube.
