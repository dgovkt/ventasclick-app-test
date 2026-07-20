/*
  # Seed Socio Manual - Leads Section

  1. Content Overview
    - Introduction to lead management
    - Understanding lead sources
    - Lead states and lifecycle
    - Creating and editing leads
    - Best practices for follow-up

  2. Subsections
    - Introducción a Leads
    - Estados de Leads
    - Crear Lead Manual
    - Editar Leads
    - Plan Recomendado
*/

INSERT INTO socio_manual_sections (seccion, subseccion, titulo, contenido, orden) VALUES
('leads', 'introduccion', 'Gestión de Leads', '<h2>Tu Pipeline de Ventas</h2>
<p>La sección de Leads es donde gestionas todos tus contactos comerciales activos. Un lead es cualquier persona o empresa que ha mostrado interés en los servicios de Ventas Click.</p>

<h3>Dos Fuentes de Leads</h3>

<h4>1. Leads del Wizard (Automáticos)</h4>
<p>Cuando alguien completa tu wizard y responde "Sí, me interesa", se crea automáticamente un lead con:</p>
<ul>
  <li>Toda la información capturada en el wizard</li>
  <li>El plan recomendado según sus respuestas</li>
  <li>El diagnóstico completo de sus necesidades</li>
  <li>Estado inicial: "Nuevo"</li>
</ul>

<h4>2. Leads Manuales</h4>
<p>Leads que tú creas directamente en el sistema, útiles para:</p>
<ul>
  <li>Contactos que conociste en eventos</li>
  <li>Referencias de otros clientes</li>
  <li>Prospectos que contactaste por otros medios</li>
  <li>Clientes potenciales de tu red personal</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Ventaja del Sistema:</p>
  <p class="text-green-800">Todos tus leads en un solo lugar, sin importar su origen. Centraliza tu gestión y nunca pierdas un seguimiento.</p>
</div>', 110),

('leads', 'estados', 'Ciclo de Vida del Lead', '<h2>Los 4 Estados de un Lead</h2>
<p>Cada lead pasa por diferentes estados según el avance de tu proceso de ventas:</p>

<h3>1. Nuevo (Badge Azul)</h3>
<p><strong>Qué significa:</strong> Lead recién ingresado al sistema que aún no has contactado.</p>
<p><strong>Acciones recomendadas:</strong></p>
<ul>
  <li>Revisar toda su información</li>
  <li>Leer el diagnóstico del wizard (si aplica)</li>
  <li>Contactar en las primeras 24 horas</li>
  <li>Enviar email de presentación</li>
</ul>
<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Dato Importante:</p>
  <p class="text-blue-800">Los leads que se contactan en las primeras 24 horas tienen 7 veces más probabilidad de cerrar que los que se contactan después de 48 horas.</p>
</div>

<h3>2. En Seguimiento (Badge Amarillo)</h3>
<p><strong>Qué significa:</strong> Ya iniciaste contacto y estás en proceso de negociación.</p>
<p><strong>Acciones recomendadas:</strong></p>
<ul>
  <li>Programar llamadas de seguimiento</li>
  <li>Enviar propuesta personalizada</li>
  <li>Responder dudas sobre el servicio</li>
  <li>Hacer demos del producto</li>
  <li>Actualizar notas después de cada interacción</li>
</ul>
<p><strong>Tip:</strong> Usa el campo de notas para registrar la fecha de tu próximo contacto.</p>

<h3>3. Cerrado Ganado (Badge Verde)</h3>
<p><strong>Qué significa:</strong> El lead se convirtió en cliente y realizó la compra.</p>
<p><strong>Acciones automáticas:</strong></p>
<ul>
  <li>El lead aparece disponible para registrar la venta</li>
  <li>Se genera la comisión al crear la venta</li>
  <li>El lead deja de aparecer en "Leads Activos"</li>
</ul>
<p><strong>Acciones recomendadas:</strong></p>
<ul>
  <li>Registrar la venta en "Mis Cierres"</li>
  <li>Enviar material de onboarding</li>
  <li>Solicitar review después de 1 semana</li>
  <li>Pedir referencias de otros posibles clientes</li>
</ul>

<h3>4. Cerrado Perdido (Badge Rojo)</h3>
<p><strong>Qué significa:</strong> El lead decidió no contratar el servicio.</p>
<p><strong>Cuándo usarlo:</strong></p>
<ul>
  <li>El prospecto contrató a la competencia</li>
  <li>No tiene presupuesto y no lo tendrá pronto</li>
  <li>Ya no responde después de múltiples intentos</li>
  <li>El proyecto se canceló o pospuso indefinidamente</li>
</ul>
<p><strong>Acciones recomendadas:</strong></p>
<ul>
  <li>Registrar el motivo en las notas</li>
  <li>Programar follow-up en 3-6 meses (en tu CRM personal)</li>
  <li>Mantener la relación cordial para futuras oportunidades</li>
</ul>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">Importante:</p>
  <p class="text-yellow-800">No elimines leads cerrados perdidos. La data histórica te ayuda a identificar patrones y mejorar tu estrategia de ventas.</p>
</div>', 120),

('leads', 'crear', 'Crear Lead Manual', '<h2>Paso a Paso para Agregar un Nuevo Lead</h2>

<h3>1. Acceder al Formulario</h3>
<p>En la página de Leads, haz clic en el botón "+ Nuevo Lead" en la esquina superior derecha.</p>

<h3>2. Completar Información Básica</h3>
<p><strong>Campos obligatorios (*):</strong></p>
<ul>
  <li><strong>Nombre:</strong> Nombre de la persona contacto</li>
  <li><strong>Apellidos:</strong> Apellidos completos</li>
  <li><strong>Email:</strong> Correo electrónico (se valida formato)</li>
  <li><strong>Teléfono:</strong> Número de contacto con código de área</li>
  <li><strong>¿Qué vende?:</strong> Descripción breve de su giro o productos</li>
</ul>

<h3>3. Seleccionar Plan Recomendado</h3>
<p>Elige el plan que mejor se ajuste a las necesidades del prospecto:</p>
<ul>
  <li><strong>Básico:</strong> Negocios pequeños, bajo volumen de ventas</li>
  <li><strong>Profesional:</strong> Empresas en crecimiento</li>
  <li><strong>Premium:</strong> Empresas establecidas con alto volumen</li>
  <li><strong>Enterprise:</strong> Corporativos con necesidades especiales</li>
</ul>

<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
  <p class="font-semibold text-purple-900">Consejo de Ventas:</p>
  <p class="text-purple-800">No siempre recomiendes el plan más caro. Un cliente satisfecho con el plan correcto te traerá más referencias que un cliente frustrado con un plan inadecuado.</p>
</div>

<h3>4. Agregar Notas (Opcional pero Recomendado)</h3>
<p>Usa este campo para registrar:</p>
<ul>
  <li>Dónde conociste al prospecto</li>
  <li>Qué le interesó inicialmente</li>
  <li>Fecha y hora del primer contacto</li>
  <li>Objeciones o dudas mencionadas</li>
  <li>Fecha planeada para el próximo seguimiento</li>
</ul>

<h3>5. Guardar el Lead</h3>
<p>Haz clic en "Crear Lead". El sistema:</p>
<ul>
  <li>Valida que no exista un lead duplicado con ese email</li>
  <li>Lo crea con estado "Nuevo" automáticamente</li>
  <li>Te regresa a la lista de leads</li>
  <li>Actualiza el contador de "Leads Activos"</li>
</ul>

<h3>Errores Comunes</h3>
<table class="min-w-full border border-gray-300 my-4">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">Error</th>
      <th class="border border-gray-300 px-4 py-2">Causa</th>
      <th class="border border-gray-300 px-4 py-2">Solución</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Email inválido</td>
      <td class="border border-gray-300 px-4 py-2">Formato incorrecto</td>
      <td class="border border-gray-300 px-4 py-2">Verificar @ y dominio</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Lead ya existe</td>
      <td class="border border-gray-300 px-4 py-2">Email duplicado</td>
      <td class="border border-gray-300 px-4 py-2">Buscar y editar el existente</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">No se guarda</td>
      <td class="border border-gray-300 px-4 py-2">Faltan campos obligatorios</td>
      <td class="border border-gray-300 px-4 py-2">Revisar campos marcados con *</td>
    </tr>
  </tbody>
</table>', 130),

('leads', 'editar', 'Editar y Actualizar Leads', '<h2>Mantén tu Información Actualizada</h2>

<h3>Cómo Editar un Lead</h3>
<ol>
  <li>En la lista de leads, haz clic en el botón "Editar" (ícono de lápiz) en la tarjeta del lead</li>
  <li>Se abrirá el mismo formulario de creación, pre-llenado con los datos actuales</li>
  <li>Modifica los campos necesarios</li>
  <li>Haz clic en "Actualizar Lead"</li>
</ol>

<h3>Campos que Puedes Actualizar</h3>
<ul>
  <li><strong>Información de contacto:</strong> Email, teléfono, nombre</li>
  <li><strong>Estado:</strong> Cambia el estado según el avance de la venta</li>
  <li><strong>Plan recomendado:</strong> Ajusta si cambió su perfil</li>
  <li><strong>Notas:</strong> Añade información de cada interacción</li>
</ul>

<h3>Cambiar el Estado del Lead</h3>
<p>El cambio de estado es la acción más común. Úsalo para:</p>

<p><strong>De "Nuevo" a "En Seguimiento":</strong></p>
<ul>
  <li>Después del primer contacto</li>
  <li>Cuando el prospecto mostró interés</li>
  <li>Al programar una demo o llamada</li>
</ul>

<p><strong>De "En Seguimiento" a "Cerrado Ganado":</strong></p>
<ul>
  <li>Cuando aceptó comprar</li>
  <li>Al firmar el contrato</li>
  <li>Después de procesar el pago</li>
</ul>

<p><strong>De cualquier estado a "Cerrado Perdido":</strong></p>
<ul>
  <li>Cuando rechazó la oferta final</li>
  <li>Si no responde después de 5+ intentos</li>
  <li>Al contratar a la competencia</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Mejores Prácticas:</p>
  <ul class="text-green-800 mt-2">
    <li>Actualiza el estado inmediatamente después de cada interacción</li>
    <li>Añade notas en cada actualización con fecha y resumen</li>
    <li>Si cambias el plan recomendado, explica por qué en las notas</li>
  </ul>
</div>

<h3>Actualizar Notas Efectivamente</h3>
<p>Formato recomendado para notas:</p>
<pre class="bg-gray-100 p-4 rounded my-4">
[DD/MM/YYYY] - Resumen de interacción
- Qué se discutió
- Objeciones mencionadas
- Próximo paso acordado
- Fecha de siguiente contacto
</pre>

<p><strong>Ejemplo:</strong></p>
<pre class="bg-gray-100 p-4 rounded my-4">
[15/03/2024] - Llamada de seguimiento
- Le gustó la demo del producto
- Objeción: precio vs competencia
- Envié comparativa detallada
- Próxima llamada: 22/03/2024 10:00 AM
</pre>', 140),

('leads', 'plan', 'Plan Recomendado y su Importancia', '<h2>Por Qué es Crucial el Plan Recomendado</h2>

<h3>Impacto en tu Comisión</h3>
<p>El plan recomendado determina directamente tu comisión porque:</p>
<ul>
  <li>Cada plan tiene un precio diferente</li>
  <li>Tu comisión es un porcentaje del precio anual</li>
  <li>Planes superiores = Comisiones más altas</li>
</ul>

<h3>Cómo Elegir el Plan Correcto</h3>

<h4>Factores a Considerar:</h4>
<ol>
  <li><strong>Tamaño del negocio:</strong>
    <ul>
      <li>Emprendedores / Freelancers → Básico</li>
      <li>Pequeñas empresas (5-20 empleados) → Profesional</li>
      <li>Medianas empresas (20-100 empleados) → Premium</li>
      <li>Grandes empresas (100+ empleados) → Enterprise</li>
    </ul>
  </li>
  
  <li><strong>Volumen de ventas mensual:</strong>
    <ul>
      <li>Menos de $50K MXN → Básico</li>
      <li>$50K - $200K MXN → Profesional</li>
      <li>$200K - $1M MXN → Premium</li>
      <li>Más de $1M MXN → Enterprise</li>
    </ul>
  </li>
  
  <li><strong>Número de productos/SKUs:</strong>
    <ul>
      <li>Menos de 50 → Básico</li>
      <li>50-200 → Profesional</li>
      <li>200-1000 → Premium</li>
      <li>Más de 1000 → Enterprise</li>
    </ul>
  </li>
  
  <li><strong>Necesidades especiales:</strong>
    <ul>
      <li>Integraciones personalizadas → Premium o Enterprise</li>
      <li>Multitienda → Premium o Enterprise</li>
      <li>API customizada → Enterprise</li>
    </ul>
  </li>
</ol>

<h3>Estrategia de Upselling</h3>
<p>Siempre presenta el plan inmediato superior como alternativa:</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Técnica de Ventas:</p>
  <p class="text-blue-800">"Basado en tu volumen actual, el plan Profesional es ideal. Sin embargo, si planeas crecer un 30% este año, el plan Premium te evitará tener que actualizarlo en unos meses y te sale más económico a largo plazo."</p>
</div>

<h3>Cambiar Plan Durante Negociación</h3>
<p>Es normal ajustar el plan recomendado si:</p>
<ul>
  <li>El prospecto compartió más información sobre su negocio</li>
  <li>Sus necesidades son diferentes a lo que inicialmente pensaste</li>
  <li>Encontraste que un plan diferente le da mejor ROI</li>
  <li>El prospecto expresó limitaciones de presupuesto claras</li>
</ul>

<h3>Tabla de Comisiones por Plan</h3>
<p>Consulta la sección "Mis Comisiones" o el "Simulador" para ver las comisiones exactas de cada plan actualizado en tiempo real.</p>', 150),

('leads', 'filtros', 'Filtros y Búsqueda de Leads', '<h2>Encuentra Leads Rápidamente</h2>

<h3>Filtros por Estado</h3>
<p>En la parte superior de la lista de leads encontrarás botones de filtro:</p>
<ul>
  <li><strong>Todos:</strong> Muestra todos los leads sin excepción</li>
  <li><strong>Nuevos:</strong> Solo leads que aún no has contactado</li>
  <li><strong>En Seguimiento:</strong> Leads en proceso de negociación</li>
  <li><strong>Cerrado Ganado:</strong> Leads convertidos en clientes</li>
  <li><strong>Cerrado Perdido:</strong> Oportunidades no concretadas</li>
</ul>

<p>El número entre paréntesis indica cuántos leads hay en cada categoría.</p>

<h3>Visualización en Tarjetas</h3>
<p>Cada lead se muestra en una tarjeta que incluye:</p>
<ul>
  <li>Nombre completo en encabezado</li>
  <li>Badge de estado con color distintivo</li>
  <li>Información de contacto (email y teléfono)</li>
  <li>Qué vende o giro del negocio</li>
  <li>Plan recomendado</li>
  <li>Notas (si existen)</li>
  <li>Botones de "Editar" y "Eliminar"</li>
</ul>

<h3>Organización Automática</h3>
<p>Los leads se ordenan automáticamente por:</p>
<ol>
  <li>Fecha de creación (más recientes primero)</li>
  <li>Estado (Nuevos tienen prioridad)</li>
</ol>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">Pro Tip:</p>
  <p class="text-yellow-800">Revisa diariamente el filtro "Nuevos" para asegurarte de contactar leads frescos lo antes posible.</p>
</div>

<h3>Eliminar un Lead</h3>
<p>Puedes eliminar un lead haciendo clic en el botón de eliminar (ícono de basura). Esto:</p>
<ul>
  <li>Borra permanentemente el lead del sistema</li>
  <li>No se puede deshacer</li>
  <li>No afecta ventas ya registradas asociadas al lead</li>
</ul>

<p><strong>Cuándo eliminar:</strong></p>
<ul>
  <li>Duplicados accidentales</li>
  <li>Información errónea o de prueba</li>
  <li>Leads spam o falsos</li>
</ul>

<p><strong>Cuándo NO eliminar:</strong></p>
<ul>
  <li>Leads cerrados perdidos (usar cambio de estado en su lugar)</li>
  <li>Leads antiguos sin respuesta (pueden reactivarse)</li>
  <li>Leads con ventas registradas</li>
</ul>', 160);
