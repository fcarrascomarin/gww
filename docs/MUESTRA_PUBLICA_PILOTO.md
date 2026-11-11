# Muestra pública piloto — extracción de campos

Se creó el archivo `data/public-showcase.json` a partir de la información visible en:

1. `Caracterización de equipos comunales - Hoja 1.pdf`
2. `Quinchilca.xlsx - Características Generales.pdf`

## Campos incluidos
- ciudad
- región
- cuenca
- cuerpo_agua
- preocupación_ambiental
- área_protegida
- usos_humanos
- tipo_voluntarios
- monitoreo
- fuente

## Observación metodológica
No todas las filas del documento comunal contienen todos los campos solicitados. En esos casos se conservó el dato disponible y se completó con:
- referencias explícitas del mismo documento,
- o la expresión “No informada en la caracterización comunal” cuando el campo no estaba visible.

## Próximo paso recomendado
Convertir la caracterización comunal a una planilla estructurada para poblar automáticamente el JSON y evitar completar manualmente campos faltantes.
