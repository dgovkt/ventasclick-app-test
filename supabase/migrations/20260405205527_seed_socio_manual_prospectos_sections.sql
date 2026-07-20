/*
  # Seed Socio Manual - Prospectos Section

  1. Content Overview
    - Understanding non-interested prospects
    - Difference between prospects and leads
    - Export functionality
    - Converting prospects to leads
    - Analyzing diagnostic data

  2. Subsections
    - Qué son los Prospectos
    - Exportar a CSV
    - Convertir a Lead
    - Análisis de Diagnóstico
*/

INSERT INTO socio_manual_sections (seccion, subseccion, titulo, contenido, orden) VALUES
('prospectos', 'introduccion', 'Prospectos No Interesados', '<h2>Personas que Dijeron "No Gracias"</h2>
<p>La sección de Prospectos contiene información de personas que completaron tu wizard pero respondieron "No, gracias" a la pregunta final de interés.</p>

<h3>Diferencia entre Prospectos y Leads</h3>
<table class="min-w-full border border-gray-300 my-4">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">Aspecto</th>
      <th class="border border-gray-300 px-4 py-2">Prospectos</th>
      <th class="border border-gray-300 px-4 py-2">Leads</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>Origen</strong></td>
      <td class="border border-gray-300 px-4 py-2">Wizard - "No gracias"</td>
      <td class="border border-gray-300 px-4 py-2">Wizard - "Sí" o Manual</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>Interés</strong></td>
      <td class="border border-gray-300 px-4 py-2">No interesado (por ahora)</td>
      <td class="border border-gray-300 px-4 py-2">Interesado activamente</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>Acción</strong></td>
      <td class="border border-gray-300 px-4 py-2">Analizar, exportar, nutrir</td>
      <td class="border border-gray-300 px-4 py-2">Contactar y cerrar venta</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>Estado</strong></td>
      <td class="border border-gray-300 px-4 py-2">Sin estado (estáticos)</td>
      <td class="border border-gray-300 px-4 py-2">Nuevo, En Seguimiento, etc.</td>
    </tr>
  </tbody>
</table>

<h3>¿Por Qué Capturar Prospectos No Interesados?</h3>
<ul>
  <li><strong>Timing:</strong> Puede que no sea el momento adecuado, pero sí en 3-6 meses</li>
  <li><strong>Educación:</strong> Necesitan entender mejor el valor del producto</li>
  <li><strong>Presupuesto:</strong> Actualmente sin fondos, pero esto puede cambiar</li>
  <li><strong>Referencias:</strong> Aunque no compren, pueden referirte a otros</li>
  <li><strong>Competencia:</strong> Información valiosa sobre el mercado</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Dato de Ventas:</p>
  <p class="text-blue-800">El 80% de las ventas requieren 5 seguimientos después del contacto inicial. Un "no" hoy puede ser un "sí" mañana con la estrategia correcta.</p>
</div>

<h3>Información Capturada</h3>
<p>Cada prospecto incluye:</p>
<ul>
  <li>Nombre y apellidos</li>
  <li>Email de contacto</li>
  <li>Teléfono</li>
  <li>Información de su negocio (qué vende)</li>
  <li>Diagnóstico completo del wizard</li>
  <li>Plan recomendado</li>
  <li>Fecha de captura</li>
</ul>', 210),

('prospectos', 'exportar', 'Exportar Prospectos a CSV', '<h2>Descarga y Gestiona tu Base de Datos</h2>

<h3>Cómo Exportar</h3>
<ol>
  <li>En la página de Prospectos, haz clic en el botón "Exportar CSV"</li>
  <li>El navegador descargará un archivo llamado <code>prospectos-[fecha].csv</code></li>
  <li>Abre el archivo con Excel, Google Sheets, o cualquier programa de hojas de cálculo</li>
</ol>

<h3>Columnas del Archivo CSV</h3>
<p>El archivo exportado contiene las siguientes columnas:</p>
<ul>
  <li><strong>Nombre:</strong> Nombre completo del prospecto</li>
  <li><strong>Apellidos:</strong> Apellidos</li>
  <li><strong>Email:</strong> Correo electrónico</li>
  <li><strong>Teléfono:</strong> Número de contacto</li>
  <li><strong>Qué Vende:</strong> Descripción de su negocio</li>
  <li><strong>Plan Recomendado:</strong> Plan sugerido por el wizard</li>
  <li><strong>Diagnóstico:</strong> Resultado completo del cuestionario</li>
  <li><strong>Fecha:</strong> Cuándo completó el wizard</li>
</ul>

<h3>Usos Recomendados del CSV</h3>

<h4>1. Campañas de Email Marketing</h4>
<p>Importa los emails a plataformas como:</p>
<ul>
  <li>Mailchimp</li>
  <li>SendGrid</li>
  <li>ActiveCampaign</li>
</ul>
<p>Crea secuencias de nurturing con contenido educativo relevante.</p>

<h4>2. Seguimiento Personalizado</h4>
<p>Usa el CSV para:</p>
<ul>
  <li>Identificar patrones en las objeciones</li>
  <li>Agrupar prospectos por industria</li>
  <li>Planear campañas segmentadas</li>
</ul>

<h4>3. Análisis de Mercado</h4>
<p>Estudia el diagnóstico de prospectos para:</p>
<ul>
  <li>Entender por qué dicen "no"</li>
  <li>Identificar puntos de dolor comunes</li>
  <li>Ajustar tu pitch de ventas</li>
  <li>Mejorar el contenido del wizard</li>
</ul>

<h4>4. CRM Externo</h4>
<p>Si usas otro CRM (como Salesforce, HubSpot, Zoho), importa este CSV para:</p>
<ul>
  <li>Integrar con tu pipeline existente</li>
  <li>Programar seguimientos automáticos</li>
  <li>Crear listas de remarketing</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Estrategia de Reactivación:</p>
  <p class="text-green-800">Exporta prospectos mensualmente y crea campañas de reactivación cada 90 días con ofertas especiales o casos de éxito relevantes a su industria.</p>
</div>

<h3>Privacidad y GDPR</h3>
<p>Al exportar y usar estos datos:</p>
<ul>
  <li>Respeta las leyes de protección de datos</li>
  <li>Incluye opción de desuscripción en emails</li>
  <li>No compartas la información con terceros sin consentimiento</li>
  <li>Elimina datos de quien lo solicite</li>
</ul>', 220),

('prospectos', 'convertir', 'Convertir Prospecto a Lead', '<h2>Segunda Oportunidad de Venta</h2>

<h3>Cuándo Convertir un Prospecto</h3>
<p>Considera convertir un prospecto a lead cuando:</p>
<ul>
  <li>Te contacta después de ver tu contenido</li>
  <li>Respondió positivamente a una campaña de email</li>
  <li>Su situación cambió (nuevo presupuesto, crecimiento)</li>
  <li>Mencionó interés en redes sociales o eventos</li>
  <li>Una referencia mutua te lo recomienda</li>
  <li>Completó una acción que indica interés renovado</li>
</ul>

<h3>Proceso de Conversión</h3>
<ol>
  <li>En la tarjeta del prospecto, haz clic en "Convertir a Lead"</li>
  <li>El sistema crea automáticamente un lead con toda la información del prospecto</li>
  <li>El lead se crea con estado "Nuevo"</li>
  <li>Toda la información se transfiere:
    <ul>
      <li>Datos de contacto</li>
      <li>Plan recomendado</li>
      <li>Diagnóstico del wizard (en notas)</li>
    </ul>
  </li>
  <li>El prospecto permanece en la lista de prospectos (no se elimina)</li>
</ol>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">Nota Importante:</p>
  <p class="text-yellow-800">Si el prospecto ya existe como lead (mismo email), el sistema te avisará y no creará un duplicado. En ese caso, simplemente actualiza el lead existente.</p>
</div>

<h3>Qué Hacer Después de Convertir</h3>
<ol>
  <li><strong>Contacto Inmediato:</strong>
    <ul>
      <li>Envía un email o WhatsApp el mismo día</li>
      <li>Referencias el contexto: "Veo que antes revisaste nuestra solución..."</li>
      <li>Pregunta qué cambió o qué les hizo reconsiderar</li>
    </ul>
  </li>
  
  <li><strong>Personaliza el Pitch:</strong>
    <ul>
      <li>Usa la información del diagnóstico guardado</li>
      <li>Aborda específicamente sus objeciones anteriores</li>
      <li>Muestra casos de éxito relevantes a su industria</li>
    </ul>
  </li>
  
  <li><strong>Ofrece Incentivo:</strong>
    <ul>
      <li>Descuento por ser "cliente que regresa"</li>
      <li>Mes gratis de prueba</li>
      <li>Setup gratuito</li>
      <li>Consultoría personalizada</li>
    </ul>
  </li>
</ol>

<h3>Script de Ejemplo</h3>
<div class="bg-gray-100 p-4 rounded my-4">
  <p class="font-semibold">Email de Reconversión:</p>
  <p class="mt-2">Hola [Nombre],</p>
  <p class="mt-2">Hace [X meses] revisaste Ventas Click para tu [tipo de negocio]. Veo que en ese momento no era el timing ideal.</p>
  <p class="mt-2">Desde entonces hemos:</p>
  <ul class="list-disc ml-6 mt-2">
    <li>Lanzado [nueva característica]</li>
    <li>Ayudado a [X empresas similares] a lograr [resultado]</li>
    <li>Mejorado nuestro [aspecto relevante]</li>
  </ul>
  <p class="mt-2">Me encantaría mostrarte cómo esto podría beneficiar específicamente a [su empresa] ahora.</p>
  <p class="mt-2">¿Tienes 15 minutos esta semana para una demo rápida?</p>
</div>

<h3>Tasa de Conversión Esperada</h3>
<p>En promedio:</p>
<ul>
  <li>5-10% de prospectos se convierten naturalmente en leads después de 3-6 meses</li>
  <li>Con nurturing activo, esto puede aumentar a 15-20%</li>
  <li>Los que se convierten tras nurturing tienen 40% más probabilidad de cerrar</li>
</ul>', 230),

('prospectos', 'diagnostico', 'Análisis del Diagnóstico', '<h2>Información Valiosa de Mercado</h2>

<h3>Qué es el Diagnóstico</h3>
<p>El diagnóstico es el resumen completo de todas las respuestas que el prospecto dio en el wizard. Incluye:</p>
<ul>
  <li>Tipo de negocio y giro</li>
  <li>Volumen de ventas actual</li>
  <li>Número de productos</li>
  <li>Canales de venta actuales</li>
  <li>Puntos de dolor identificados</li>
  <li>Prioridades de negocio</li>
  <li>Presupuesto aproximado</li>
</ul>

<h3>Cómo Usar el Diagnóstico</h3>

<h4>1. Para Estrategia Individual</h4>
<p>Lee el diagnóstico de cada prospecto para entender:</p>
<ul>
  <li><strong>Por qué dijeron "no":</strong> Identifica la objeción principal</li>
  <li><strong>Qué valoran más:</strong> Sus prioridades de negocio</li>
  <li><strong>Cuándo volver a contactar:</strong> Timing basado en su situación</li>
  <li><strong>Cómo personalizar el pitch:</strong> Enfócate en sus pain points</li>
</ul>

<h4>2. Para Análisis de Patrones</h4>
<p>Exporta múltiples prospectos y busca tendencias:</p>
<ul>
  <li>¿Qué industrias dicen más "no"?</li>
  <li>¿En qué parte del wizard la gente se desinteresa?</li>
  <li>¿Qué objeciones son más comunes?</li>
  <li>¿Qué rangos de presupuesto rechazan más?</li>
</ul>

<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
  <p class="font-semibold text-purple-900">Insight Estratégico:</p>
  <p class="text-purple-800">Si detectas un patrón de rechazo en cierta industria o tamaño de empresa, comparte este feedback con el equipo. Podría indicar una oportunidad de mejorar el producto o el pitch.</p>
</div>

<h4>3. Para Contenido de Marketing</h4>
<p>Usa los diagnósticos para crear:</p>
<ul>
  <li><strong>Blog posts:</strong> Abordando objeciones comunes</li>
  <li><strong>Casos de estudio:</strong> De industrias que más rechazan</li>
  <li><strong>Webinars:</strong> Sobre temas que les preocupan</li>
  <li><strong>Guías descargables:</strong> Resolviendo sus pain points</li>
</ul>

<h3>Segmentación Inteligente</h3>
<p>Agrupa prospectos por diagnósticos similares:</p>

<table class="min-w-full border border-gray-300 my-4">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">Segmento</th>
      <th class="border border-gray-300 px-4 py-2">Características</th>
      <th class="border border-gray-300 px-4 py-2">Estrategia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>Sin Presupuesto</strong></td>
      <td class="border border-gray-300 px-4 py-2">Interesados pero sin fondos</td>
      <td class="border border-gray-300 px-4 py-2">Follow-up en 6 meses, contenido de ROI</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>Comparando Opciones</strong></td>
      <td class="border border-gray-300 px-4 py-2">Evaluando competencia</td>
      <td class="border border-gray-300 px-4 py-2">Enviar comparativas, casos de éxito</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>No es Momento</strong></td>
      <td class="border border-gray-300 px-4 py-2">Timing incorrecto</td>
      <td class="border border-gray-300 px-4 py-2">Follow-up en 3 meses, mantener relación</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2"><strong>No Entienden Valor</strong></td>
      <td class="border border-gray-300 px-4 py-2">Falta educación del producto</td>
      <td class="border border-gray-300 px-4 py-2">Webinars, demos, contenido educativo</td>
    </tr>
  </tbody>
</table>

<h3>Preguntas Clave para Analizar</h3>
<p>Al revisar cada diagnóstico, pregúntate:</p>
<ol>
  <li>¿Qué necesidad específica expresaron?</li>
  <li>¿Qué les impidió decir "sí"?</li>
  <li>¿Es una objeción superable o un deal-breaker real?</li>
  <li>¿Cuándo podría cambiar su situación?</li>
  <li>¿Hay alguien en su red que sí podría estar interesado?</li>
  <li>¿Qué contenido les ayudaría a tomar una mejor decisión?</li>
</ol>

<h3>Mejora Continua</h3>
<p>Usa el análisis de diagnósticos para:</p>
<ul>
  <li>Sugerir mejoras al wizard</li>
  <li>Identificar features faltantes en el producto</li>
  <li>Proponer nuevos planes o precios</li>
  <li>Mejorar materiales de marketing</li>
  <li>Capacitar mejor a nuevos socios</li>
</ul>', 240);
