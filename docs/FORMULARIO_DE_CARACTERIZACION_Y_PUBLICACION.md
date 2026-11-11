# Propuesta: bloque de autorización en el formulario de caracterización

El archivo de Quinchilca contiene identidad de monitores, responsable, región, comuna, cuenca, subcuenca, cuerpo de agua, punto y condiciones del cauce, pero no registra una autorización explícita para divulgación externa. La ausencia de respuesta no supone consentimiento.

## Campos propuestos
1. Agrupación que autoriza y representante habilitado (información privada).
2. Cuerpo de agua y alcance: nombres, cuenca, subcuenca y estaciones comprendidas.
3. ¿Autoriza publicar que existe actividad de monitoreo? Sí / No.
4. ¿Autoriza publicar nombre, tipo y zona general del cuerpo de agua? Sí / No.
5. ¿Autoriza una localización cartográfica generalizada? Sí / No. Nunca coordenadas exactas por defecto.
6. ¿Autoriza publicar mediciones validadas? Sí / No; parámetros, metodología, fecha inicial y final.
7. ¿Autoriza descarga y reutilización por terceros? Sí / No / Solo mediante solicitud, con condiciones de atribución y finalidad.
8. ¿Autoriza identificar públicamente a la agrupación? Por defecto No; consentimiento separado y específico.
9. Fecha, versión, responsable, prueba de autorización, vigencia y procedimiento de revocación.

## Lógica
El mismo cuerpo de agua puede ser monitoreado por varios equipos: cada uno solo autoriza sus propios aportes. No se pueden incluir datos restringidos en series agregadas, incluso si se suprime la identidad. Ninguna observación no validada puede publicarse. La revocación implica regenerar archivos públicos y limpiar caches; las copias descargadas previamente por terceros podrían ser irrecuperables.

## Modelo conceptual
- Cuerpo de agua: identidad compartida, cuenca, subcuenca y zona general.
- Estación: geometría exacta reservada, método y condiciones de observación.
- Evento: fecha/hora, parámetros, unidades, fotos y revisión de calidad.
- Organización: administradores y voluntarios privados.
- Autorización: permisos versionados por agrupación, cuerpo, estación, parámetro, fecha y uso.

Estos campos son una propuesta para aprobación de GWW Chile / Fundación Manzana Verde. No son autorizaciones efectivamente otorgadas.
