/*
  # Seed Socio Manual - KB, Casos de Éxito and Reviews Sections

  1. Knowledge Base - How to use articles for sales
  2. Casos de Éxito - Submitting success stories
  3. Reviews - Managing customer reviews and NPS
*/

INSERT INTO socio_manual_sections (seccion, subseccion, titulo, contenido, orden) VALUES
-- KNOWLEDGE BASE SECTION
('kb', 'introduccion', 'Base de Conocimientos', '<h2>Tu Biblioteca de Ventas</h2>
<p>La Knowledge Base es una colección de artículos sobre el producto, características, precios, y mejores prácticas que te ayudan a responder preguntas de clientes y cerrar ventas más efectivamente.</p>

<h3>Para Qué Usar la KB</h3>
<ul>
  <li>Responder dudas técnicas de prospectos</li>
  <li>Prepararte antes de demos y presentaciones</li>
  <li>Enviar enlaces a clientes para que lean más</li>
  <li>Capacitarte en nuevas características</li>
  <li>Comparar planes y funcionalidades</li>
</ul>

<h3>Categorías Disponibles</h3>
<ul>
  <li><strong>Onboarding:</strong> Guías de inicio y configuración</li>
  <li><strong>Ventas:</strong> Tips y estrategias de venta</li>
  <li><strong>Soporte:</strong> Solución a problemas comunes</li>
  <li><strong>Comisiones:</strong> Todo sobre pagos y comisiones</li>
  <li><strong>Producto:</strong> Características y funcionalidades</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Recomendación:</p>
  <p class="text-green-800">Dedica 15 minutos diarios a leer artículos de la KB. Mientras más conozcas el producto, más confianza transmitirás en tus ventas.</p>
</div>', 510),

('kb', 'buscar', 'Buscar y Filtrar Artículos', '<h2>Encuentra Información Rápidamente</h2>

<h3>Barra de Búsqueda</h3>
<p>Escribe palabras clave relacionadas con tu duda. El sistema busca en:</p>
<ul>
  <li>Títulos de artículos</li>
  <li>Contenido completo</li>
  <li>Categorías y etiquetas</li>
</ul>

<h3>Filtros por Categoría</h3>
<p>Haz clic en los botones de categoría para ver solo artículos de ese tema. Útil cuando:</p>
<ul>
  <li>Buscas información sobre un tema específico</li>
  <li>Quieres explorar todo el contenido de una categoría</li>
  <li>Necesitas materiales para una presentación temática</li>
</ul>

<h3>Artículos Destacados</h3>
<p>Los artículos más importantes aparecen primero o con una etiqueta de "Destacado". Típicamente incluyen:</p>
<ul>
  <li>Guías de inicio rápido</li>
  <li>FAQs más comunes</li>
  <li>Nuevas funcionalidades</li>
  <li>Cambios importantes de producto</li>
</ul>', 520),

('kb', 'leer', 'Leer y Compartir Artículos', '<h2>Maximiza el Uso del Contenido</h2>

<h3>Vista de Artículo</h3>
<p>Cada artículo incluye:</p>
<ul>
  <li>Título y descripción</li>
  <li>Contenido formateado con imágenes</li>
  <li>Fecha de última actualización</li>
  <li>Categoría y etiquetas</li>
</ul>

<h3>Compartir con Clientes</h3>
<p>Puedes compartir artículos de KB con prospectos para:</p>
<ul>
  <li>Responder preguntas específicas</li>
  <li>Explicar características técnicas</li>
  <li>Mostrar casos de uso</li>
  <li>Educar sobre el producto</li>
</ul>

<p><strong>Cómo compartir:</strong></p>
<ol>
  <li>Copia la URL del artículo</li>
  <li>Pégala en tu email o WhatsApp</li>
  <li>Añade contexto personalizado</li>
</ol>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Tip de Ventas:</p>
  <p class="text-blue-800">No solo envíes el link. Añade un mensaje como: "Basado en lo que me comentaste sobre [X], este artículo te explicará exactamente cómo podemos resolver eso para ti."</p>
</div>', 530),

-- CASOS DE ÉXITO SECTION
('casos', 'introduccion', 'Casos de Éxito', '<h2>Comparte Historias de Clientes Satisfechos</h2>
<p>Los casos de éxito son historias reales de clientes que han obtenido resultados positivos con Ventas Click. Son herramientas poderosas de marketing y ventas.</p>

<h3>Por Qué Son Importantes</h3>
<ul>
  <li><strong>Prueba social:</strong> Demuestran que el producto funciona</li>
  <li><strong>Credibilidad:</strong> Testimonios reales de empresas reales</li>
  <li><strong>Identificación:</strong> Prospectos ven empresas similares a la suya</li>
  <li><strong>Resultados tangibles:</strong> Números y métricas concretas</li>
  <li><strong>Objeciones:</strong> Responden dudas comunes con ejemplos</li>
</ul>

<div class="bg-primary-light border-l-4 border-primary p-4 my-4">
  <p class="font-semibold text-primary-dark">Dato de Ventas:</p>
  <p class="text-gray-800">Los prospectos que leen un caso de éxito relevante tienen 3 veces más probabilidad de cerrar que los que no lo hacen.</p>
</div>

<h3>Qué Incluir en un Caso</h3>
<ul>
  <li><strong>Nombre del cliente:</strong> Empresa o persona (con permiso)</li>
  <li><strong>Industria:</strong> A qué se dedica</li>
  <li><strong>Situación inicial:</strong> El problema que tenían</li>
  <li><strong>Solución implementada:</strong> Qué plan contrató y cómo lo usó</li>
  <li><strong>Resultados:</strong> Métricas concretas de mejora</li>
  <li><strong>Testimonio:</strong> Cita directa del cliente (opcional)</li>
</ul>', 610),

('casos', 'enviar', 'Cómo Enviar un Caso de Éxito', '<h2>Proceso de Envío</h2>

<h3>Prerequisito Importante</h3>
<p><strong>SIEMPRE obtén permiso del cliente antes de enviar su caso de éxito.</strong></p>
<ul>
  <li>Explica que su historia puede aparecer en materiales de marketing</li>
  <li>Pide autorización para usar su nombre/empresa</li>
  <li>Ofrece la opción de anonimizar si prefieren</li>
  <li>Muéstrales el borrador antes de publicarlo</li>
</ul>

<h3>Paso a Paso</h3>
<ol>
  <li>En la sección "Casos de Éxito", haz clic en "+ Nuevo Caso"</li>
  <li><strong>Nombre del Cliente:</strong> Empresa o persona</li>
  <li><strong>Industria:</strong> Giro o sector (ej: E-commerce, Restaurantes, etc.)</li>
  <li><strong>Situación Inicial:</strong> Describe el problema o necesidad que tenían antes de Ventas Click</li>
  <li><strong>Solución:</strong> Qué plan contrataron y cómo lo implementaron</li>
  <li><strong>Resultados:</strong> Métricas concretas:
    <ul>
      <li>Aumento en ventas (porcentaje o monto)</li>
      <li>Tiempo ahorrado</li>
      <li>Mejora en procesos</li>
      <li>ROI obtenido</li>
    </ul>
  </li>
  <li><strong>Testimonio (opcional):</strong> Cita textual del cliente</li>
  <li>Haz clic en "Enviar para Aprobación"</li>
</ol>

<h3>Proceso de Moderación</h3>
<p>Todos los casos pasan por moderación administrativa para:</p>
<ul>
  <li>Verificar la información</li>
  <li>Revisar gramática y ortografía</li>
  <li>Asegurar que cumple con políticas</li>
  <li>Confirmar permiso del cliente</li>
</ul>

<h3>Estados del Caso</h3>
<ul>
  <li><strong>Pendiente:</strong> En espera de revisión</li>
  <li><strong>Aprobado:</strong> Publicado y visible para todos</li>
  <li><strong>Rechazado:</strong> No cumplió criterios (verás el motivo)</li>
</ul>', 620),

('casos', 'plantilla', 'Plantilla y Ejemplo', '<h2>Formato Recomendado</h2>

<h3>Plantilla de Caso de Éxito</h3>
<div class="bg-gray-100 p-4 rounded my-4">
<p><strong>Cliente:</strong> [Nombre de la empresa/persona]</p>
<p><strong>Industria:</strong> [Sector o giro]</p>

<p><strong>El Reto:</strong></p>
<p>[Empresa/Cliente] enfrentaba [problema específico]. Esto resultaba en [consecuencias negativas como pérdidas, ineficiencia, etc.]</p>

<p><strong>La Solución:</strong></p>
<p>Implementaron el [Plan contratado] de Ventas Click, enfocándose en [características clave usadas]. El proceso de implementación tomó [tiempo] y se enfocaron en [áreas específicas].</p>

<p><strong>Los Resultados:</strong></p>
<ul>
  <li>Aumento de [X]% en ventas</li>
  <li>Reducción de [Y]% en tiempo de gestión</li>
  <li>Mejora de [Z]% en conversión</li>
  <li>ROI de [N]x en [período]</li>
</ul>

<p><strong>Testimonio:</strong></p>
<p>"[Cita textual del cliente sobre su experiencia]" - [Nombre], [Cargo] en [Empresa]</p>
</div>

<h3>Ejemplo Real</h3>
<div class="bg-white border border-gray-300 p-4 rounded my-4">
<p><strong>Cliente:</strong> Boutique Fashion México</p>
<p><strong>Industria:</strong> Moda y Retail</p>

<p><strong>El Reto:</strong></p>
<p>Boutique Fashion México manejaba su inventario de 500+ productos en Excel y procesaba pedidos manualmente por WhatsApp. Esto resultaba en errores frecuentes, pedidos duplicados, y hasta 4 horas diarias perdidas en gestión administrativa.</p>

<p><strong>La Solución:</strong></p>
<p>Implementaron el Plan Profesional de Ventas Click, integrando su catálogo completo y automatizando el flujo de pedidos. El setup tomó 2 días y se enfocaron en la integración con sus redes sociales.</p>

<p><strong>Los Resultados:</strong></p>
<ul>
  <li>Aumento de 45% en ventas online en 3 meses</li>
  <li>Reducción de 90% en errores de pedido</li>
  <li>Ahorro de 3.5 horas diarias en gestión</li>
  <li>ROI de 8x en el primer trimestre</li>
</ul>

<p><strong>Testimonio:</strong></p>
<p>"Ventas Click transformó completamente nuestra operación. Lo que antes me tomaba toda la tarde ahora se hace automáticamente. Puedo enfocarme en crecer el negocio en lugar de peleando con Excel." - Ana Martínez, Fundadora de Boutique Fashion México</p>
</div>', 630),

-- REVIEWS SECTION
('reviews', 'introduccion', 'Reviews de Clientes', '<h2>Sistema de Reputación y NPS</h2>
<p>El sistema de reviews te permite recolectar feedback de tus clientes de manera profesional y usar esas reseñas para cerrar más ventas.</p>

<h3>¿Qué es NPS?</h3>
<p>Net Promoter Score (NPS) es una métrica estándar de satisfacción del cliente basada en una pregunta simple:</p>
<p><em>"En una escala de 0 a 10, ¿qué tan probable es que recomiendes Ventas Click a un colega?"</em></p>

<h3>Categorías de NPS</h3>
<ul>
  <li><strong>Promotores (9-10):</strong> Clientes muy satisfechos que te referirán</li>
  <li><strong>Pasivos (7-8):</strong> Satisfechos pero no entusiastas</li>
  <li><strong>Detractores (0-6):</strong> Insatisfechos, pueden dañar tu reputación</li>
</ul>

<h3>Tu NPS Score</h3>
<p>El sistema calcula tu NPS automáticamente:</p>
<p><strong>NPS = ((Promotores - Detractores) / Total Reviews) × 100</strong></p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Interpretación:</p>
  <ul class="text-blue-800 mt-2">
    <li>NPS mayor a 50: Excelente</li>
    <li>NPS entre 0-50: Bueno</li>
    <li>NPS negativo: Requiere mejora urgente</li>
  </ul>
</div>', 710),

('reviews', 'link', 'Tu Link Personalizado de Reviews', '<h2>Cómo Recolectar Reviews</h2>

<h3>Tu Enlace Único</h3>
<p>En la parte superior de la sección Reviews encontrarás tu link personalizado. Este link:</p>
<ul>
  <li>Es único para ti</li>
  <li>Dirige a un formulario de review</li>
  <li>Asocia automáticamente las reviews a tu perfil</li>
  <li>Funciona indefinidamente</li>
</ul>

<h3>Cómo Compartirlo</h3>

<h4>1. Botón "Copiar Link"</h4>
<p>Copia el link para pegarlo en:</p>
<ul>
  <li>WhatsApp después de cerrar una venta</li>
  <li>Email de seguimiento post-venta</li>
  <li>Firma de correo electrónico</li>
  <li>Mensajes de redes sociales</li>
</ul>

<h4>2. En Comunicaciones</h4>
<p><strong>Ejemplo de mensaje por WhatsApp:</strong></p>
<div class="bg-gray-100 p-4 rounded my-4">
<p>Hola [Nombre], me da mucho gusto que estés usando Ventas Click. ¿Podrías tomarte 2 minutos para compartir tu experiencia?</p>
<p>Tu opinión me ayuda a mejorar mi servicio y ayudar a más empresas como la tuya:</p>
<p>[TU-LINK-AQUI]</p>
<p>¡Muchas gracias! 😊</p>
</div>

<h3>Cuándo Solicitar Reviews</h3>
<p>El mejor momento es:</p>
<ul>
  <li><strong>1-2 semanas después de la venta:</strong> Ya usaron el producto</li>
  <li><strong>Después de una win rápida:</strong> Cuando logran un resultado positivo</li>
  <li><strong>Post-soporte exitoso:</strong> Después de resolver un problema</li>
  <li><strong>En renovación:</strong> Si deciden continuar</li>
</ul>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">Evita Pedir Reviews:</p>
  <ul class="text-yellow-800 mt-2">
    <li>Inmediatamente después de la venta (muy pronto)</li>
    <li>Cuando el cliente tiene un problema activo</li>
    <li>De manera insistente o repetitiva</li>
  </ul>
</div>', 720),

('reviews', 'gestionar', 'Gestionar tus Reviews', '<h2>Panel de Control de Reputación</h2>

<h3>Estadísticas Principales</h3>
<p>En la parte superior verás 5 métricas:</p>
<ul>
  <li><strong>Total Reviews:</strong> Cantidad total de reseñas recibidas</li>
  <li><strong>NPS Score:</strong> Tu calificación NPS</li>
  <li><strong>Promotores:</strong> Clientes que te dieron 9-10</li>
  <li><strong>Pasivos:</strong> Clientes que te dieron 7-8</li>
  <li><strong>Detractores:</strong> Clientes que te dieron 0-6</li>
</ul>

<h3>Estados de Reviews</h3>

<h4>Pendiente (Reloj Amarillo)</h4>
<p>Review recién recibida, en espera de moderación. El cliente ya la envió pero aún no es pública.</p>

<h4>Aprobado (Check Verde)</h4>
<p>Review moderada y publicada. Visible para otros socios y puede usarse en materiales de marketing.</p>

<h4>Rechazado (X Roja)</h4>
<p>Review que no cumplió políticas. Motivos comunes:</p>
<ul>
  <li>Lenguaje inapropiado</li>
  <li>Información falsa</li>
  <li>Spam o contenido irrelevante</li>
  <li>Violación de privacidad</li>
</ul>

<h3>Información en Cada Review</h3>
<ul>
  <li><strong>Nombre del cliente</strong></li>
  <li><strong>Score NPS (0-10)</strong></li>
  <li><strong>Categoría:</strong> Promotor, Pasivo o Detractor</li>
  <li><strong>Comentario:</strong> Feedback escrito</li>
  <li><strong>Contacto (opcional):</strong> Email o teléfono</li>
  <li><strong>Fecha:</strong> Cuándo se recibió</li>
  <li><strong>Estado de moderación</strong></li>
</ul>', 730),

('reviews', 'usar', 'Usar Reviews en Ventas', '<h2>Convierte Reviews en Cierres</h2>

<h3>1. En Presentaciones</h3>
<p>Muestra tus reviews aprobadas durante demos para:</p>
<ul>
  <li>Generar confianza</li>
  <li>Mostrar prueba social</li>
  <li>Responder objeciones</li>
  <li>Destacar beneficios específicos</li>
</ul>

<h3>2. En Propuestas</h3>
<p>Incluye 2-3 reviews relevantes en tus propuestas escritas, especialmente:</p>
<ul>
  <li>De clientes de la misma industria</li>
  <li>Que mencionan beneficios que el prospecto busca</li>
  <li>Con resultados cuantificables</li>
</ul>

<h3>3. Para Manejar Objeciones</h3>
<table class="min-w-full border border-gray-300 my-4">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">Objeción</th>
      <th class="border border-gray-300 px-4 py-2">Review Relevante</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">"Es muy caro"</td>
      <td class="border border-gray-300 px-4 py-2">Review que mencione ROI o ahorro</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">"Es complicado"</td>
      <td class="border border-gray-300 px-4 py-2">Review sobre facilidad de uso</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">"No sé si funciona"</td>
      <td class="border border-gray-300 px-4 py-2">Review con resultados específicos</td>
    </tr>
  </tbody>
</table>

<h3>4. Seguimiento con Detractores</h3>
<p>Si recibes un score bajo (0-6):</p>
<ol>
  <li><strong>Contacta inmediatamente</strong> al cliente</li>
  <li><strong>Escucha</strong> su frustración sin defenderte</li>
  <li><strong>Disculpate</strong> sinceramente por su mala experiencia</li>
  <li><strong>Pregunta</strong> qué puedes hacer para resolver</li>
  <li><strong>Actúa</strong> rápidamente en su solución</li>
  <li><strong>Haz seguimiento</strong> después de resolver</li>
</ol>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Oportunidad de Oro:</p>
  <p class="text-green-800">Un detractor al que le resuelves su problema puede convertirse en tu mejor promotor. La manera en que manejas quejas define tu reputación.</p>
</div>

<h3>5. Pedir Referencias</h3>
<p>Cuando recibes una review de 9-10:</p>
<ul>
  <li>Agradece personalmente al cliente</li>
  <li>Pregunta si conoce a alguien que pueda beneficiarse</li>
  <li>Ofrece un incentivo por referencia exitosa</li>
</ul>

<h3>Meta de Reviews</h3>
<p>Establece metas claras:</p>
<ul>
  <li><strong>Cantidad:</strong> Mínimo 1 review por cada 3 ventas</li>
  <li><strong>NPS Target:</strong> Mantener NPS arriba de 50</li>
  <li><strong>Respuesta:</strong> Contactar a todos los detractores en 24 horas</li>
</ul>', 740);
