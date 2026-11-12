# Mapa del agua: instrucciones para poblarlo sin exponer información interna

El sitio tiene **una sección real de Leaflet**, con su propio título, filtros y panel de ficha. La base cartográfica depende de Internet; no es un mapa pintado, un JPG ni un mockup.

## Estado inicial

La cartografía abre sobre Chile. `data/cuerpos-agua-publicos.geojson` contiene un `FeatureCollection` vacío. Esto es deliberado: aún no hay geometrías de cuerpos de agua aprobadas para difundir. Por tanto, al navegar no hay marcadores.

## Pasos institucionales

1. Identificar un cuerpo de agua en el catálogo científico privado.
2. Revisar sus características y el contenido de la futura ficha pública.
3. Verificar que la información se refiere **al cuerpo de agua concreto**, no simplemente a un dato común de la comuna.
4. Obtener autorización y alcance de difusión de quienes controlan el conjunto de datos.
5. Identificar geometría o punto público no sensible; usar geometrías hidrográficas verificadas si están disponibles.
6. Generar el archivo GeoJSON exclusivamente con los campos públicos permitidos.
7. Revisar que no contenga información de agrupaciones, voluntarios, estaciones exactas restringidas, identificadores privados ni datos no autorizados.
8. Subir el archivo validado al repositorio y verificar el mapa en GitHub Pages.

## Esquema referencial (NO usar este ejemplo como dato real)

```json
{
  "type":"FeatureCollection",
  "features":[{
    "type":"Feature",
    "id":"ejemplo-cuerpo-agua",
    "geometry":{"type":"Point","coordinates":[-71.0,-35.0]},
    "properties":{
      "nombre":"CUERPO DE AGUA DE EJEMPLO",
      "tipo":"Río",
      "comuna":"Ejemplo",
      "region":"Ejemplo",
      "cuenca":"Ejemplo",
      "preocupacion_ambiental":[],
      "area_protegida":[],
      "usos_humanos":[],
      "metodos_publicos":[],
      "aprobado_publicacion":true
    }
  }]
}
```

**No copiar las coordenadas ni el nombre inventados del ejemplo al archivo productivo.**

## Consulta

- Búsqueda libre por nombre/comuna/cuenca.
- Filtros por región y tipo de cuerpo de agua.
- Selección de una geometría: ficha lateral con contenido público.
- El conteo indica cuántas fichas autorizadas contiene el catálogo.

## Protección de datos

GitHub Pages publica los archivos íntegros de la carpeta web. **Nunca subas** Excel históricos completos, fichas internas originales, contactos, listas de voluntarios, datos de certificación o coordenadas de estaciones reservadas, aunque el frontend tenga botones para ocultarlos.

El siguiente avance, cuando exista la plataforma privada, será crear una exportación auditada y autorizada del catálogo público; no consultar directamente la base interna desde el navegador.
