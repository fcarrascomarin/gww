# GWW Chile — Cargar cuerpos de agua al mapa (V15)

## Qué contiene el listado
El documento `Caracterización de equipos comunales - Hoja 1.pdf` enumera **34 equipos territoriales**, NO 34 cuerpos de agua ni estaciones. V15 identifica 14 referencias explícitas a cuerpos de agua y humedales; 10 puntos tienen una localización general obtenida de fuentes públicas, 4 quedan pendientes de ubicar. Ninguno equivale a una estación de muestreo de GWW.

## Cargar un nuevo cuerpo de agua
1. Confirma el **nombre** del cuerpo de agua (no el nombre del grupo o comuna solamente).
2. Abre `data/cuerpos-agua-publicos.geojson`; añade un nuevo objeto `Feature` dentro de `features` usando un ID estable sin repetir, `region`, `comuna`, `tipo`, `cuenca` y fuente documental.
3. Si dispones de coordenadas **geográficas públicas verificadas** del cuerpo de agua, ingrésalas como `[longitud, latitud]` en `geometry: {"type":"Point","coordinates":[-72.0,-37.0]}`. **No reutilices coordenadas precisas de estaciones o de integrantes.** Si no hay suficiente respaldo, usa `geometry: null` y `estado_geografico: "pendiente"`.
4. `mostrar_referencia_publica: true` habilita solo la visualización de una referencia geográfica preliminar. **No acredita consentimiento de una agrupación ni mediciones**. Conserva `aprobado_publicacion: false` hasta que se defina un mecanismo de aprobación institucional.
5. Las preocupaciones comunales son contexto del documento, **no necesariamente conclusiones ambientales del cuerpo de agua**. Los métodos permanecen en una lista vacía `[]` hasta contar con registros explícitos autorizados. No añadas nombres de agrupaciones, voluntarios, contactos personales ni certificaciones.
6. Revisa sintaxis y fuentes con `python herramientas/validar_catalogo.py`. Inicia servidor local con `python -m http.server 8000` y navega a `http://localhost:8000/#mapa`.
7. Compara en el mapa las ubicaciones generales con el visor oficial u OSM y el nombre correspondiente. Publica en GitHub solo tras revisión de datos visibles.

## Lo que ya se añadió
- 14 referencias explícitas: Río Biobío, Humedal Los Boldos, Humedal El Culebrón, Lago Llanquihue, Humedal Price, Humedal Vasco da Gama, Laguna La Señoraza, Humedales del río Maullín, Lago Villarrica, Humedal Guairabo, Humedal Bayona del Valle, Humedal Junquillar, Humedal Río Maipo y Humedal Angachilla.
- 10 tienen puntos de ubicación **general**, nunca ubicación de estación.
- Río Biobío, Humedal Price, Humedal Guairabo y Humedal Junquillar permanecen en la lista **sin marcador** por falta de ubicación general suficientemente validada o por su extensión/ambigüedad.
- Existe una carpeta `docs/` con instrucciones y enlaces públicos para verificar ubicación.

## Próxima integración con la plataforma interna
- Registra de manera privada `organizacion` → `cuerpo_agua` → `estacion` → `evento_muestreo` → `medicion` y tablas de `certificacion` / `usuario`.
- La publicación pública se genera como una **vista/resultado revisado** con campos permitidos, no copiando los registros internos al repositorio de GitHub.
- Solo cuando haya consentimiento válido y revisión técnica se podrán publicar mediciones, métodos asociados y series temporales. El identificador público de cuerpo de agua debe ser estable para evitar duplicados.
