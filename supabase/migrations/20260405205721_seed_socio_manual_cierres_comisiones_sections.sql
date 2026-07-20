/*
  # Seed Socio Manual - Cierres and Comisiones Sections

  1. Content Overview - Cierres
    - Registering sales
    - Linking leads to sales
    - Commission calculation
    - Payment status

  2. Content Overview - Comisiones
    - Biweekly payment system
    - Bank configuration
    - Payment request lifecycle
    - Cut-off periods
*/

INSERT INTO socio_manual_sections (seccion, subseccion, titulo, contenido, orden) VALUES
-- CIERRES SECTION
('cierres', 'introduccion', 'Registro de Ventas Cerradas', '<h2>Tu Historial de Éxitos</h2>
<p>La sección "Mis Cierres" es donde registras todas las ventas que has cerrado exitosamente. Cada venta registrada genera automáticamente tu comisión y alimenta tus estadísticas.</p>

<h3>Importancia del Registro Oportuno</h3>
<p>Registra tus ventas inmediatamente después de cerrarlas porque:</p>
<ul>
  <li>Genera tu comisión automáticamente</li>
  <li>Actualiza tus métricas del dashboard</li>
  <li>Documenta el cierre para el área financiera</li>
  <li>Facilita el seguimiento del cliente</li>
  <li>Alimenta reportes de desempeño</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Requisito Importante:</p>
  <p class="text-green-800">Solo puedes registrar ventas de leads que tengas en estado "Cerrado Ganado". Si el lead aún está en otro estado, actualízalo primero desde la sección de Leads.</p>
</div>

<h3>Métricas Principales</h3>
<p>En la parte superior verás 4 tarjetas con estadísticas:</p>
<ul>
  <li><strong>Total Ventas:</strong> Número total de cierres registrados</li>
  <li><strong>Monto Total:</strong> Suma de todas tus ventas en MXN</li>
  <li><strong>Pendientes:</strong> Ventas aún no pagadas por el cliente</li>
  <li><strong>Por Cobrar:</strong> Monto en comisiones que aún no has recibido</li>
</ul>', 310),

('cierres', 'registrar', 'Cómo Registrar una Venta', '<h2>Paso a Paso</h2>

<h3>Prerequisito</h3>
<p>Antes de poder registrar una venta:</p>
<ol>
  <li>Ve a la sección "Leads"</li>
  <li>Busca el lead que cerró</li>
  <li>Edítalo y cambia su estado a "Cerrado Ganado"</li>
  <li>Guarda los cambios</li>
</ol>

<h3>Proceso de Registro</h3>
<ol>
  <li><strong>Abrir Formulario:</strong> Haz clic en "+ Registrar Venta"</li>
  
  <li><strong>Seleccionar Cliente:</strong>
    <ul>
      <li>El dropdown solo muestra leads en estado "Cerrado Ganado"</li>
      <li>Busca tu cliente por nombre</li>
      <li>Se muestra también qué vende para identificarlo fácilmente</li>
    </ul>
  </li>
  
  <li><strong>Seleccionar Plan Vendido:</strong>
    <ul>
      <li>Elige el plan que realmente contrató el cliente</li>
      <li>El precio se llena automáticamente</li>
      <li>Puedes ajustar el monto si fue con descuento especial</li>
    </ul>
  </li>
  
  <li><strong>Especificar Monto:</strong>
    <ul>
      <li>Por defecto se llena con el precio anual del plan</li>
      <li>Ajústalo si negociaste un precio diferente</li>
      <li>Siempre usa el monto anual, no mensual</li>
    </ul>
  </li>
  
  <li><strong>Fecha de Venta:</strong>
    <ul>
      <li>Por defecto es la fecha actual</li>
      <li>Cámbiala si cerraste la venta en otro día</li>
      <li>Importante para reportes mensuales</li>
    </ul>
  </li>
  
  <li><strong>Notas (Opcional):</strong>
    <ul>
      <li>Detalles de la negociación</li>
      <li>Condiciones especiales acordadas</li>
      <li>Fecha de inicio del servicio</li>
      <li>Cualquier compromiso adicional</li>
    </ul>
  </li>
  
  <li><strong>Guardar:</strong> Haz clic en "Registrar Venta"</li>
</ol>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Cálculo Automático:</p>
  <p class="text-blue-800">El sistema calcula automáticamente tu comisión basándose en el porcentaje configurado para ese plan. No necesitas calcularlo manualmente.</p>
</div>

<h3>Qué Pasa Después de Registrar</h3>
<ul>
  <li>La venta aparece en tu lista con estado "Pendiente"</li>
  <li>Tu comisión se calcula y guarda automáticamente</li>
  <li>Se actualiza el contador de "Ventas del Mes"</li>
  <li>Se suma al "Por Cobrar" en tu dashboard</li>
  <li>El lead permanece como "Cerrado Ganado"</li>
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
      <td class="border border-gray-300 px-4 py-2">No aparece cliente</td>
      <td class="border border-gray-300 px-4 py-2">Lead no está en "Cerrado Ganado"</td>
      <td class="border border-gray-300 px-4 py-2">Actualizar estado del lead primero</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Comisión incorrecta</td>
      <td class="border border-gray-300 px-4 py-2">Plan seleccionado equivocado</td>
      <td class="border border-gray-300 px-4 py-2">Verificar plan contratado</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">No se guarda</td>
      <td class="border border-gray-300 px-4 py-2">Faltan campos obligatorios</td>
      <td class="border border-gray-300 px-4 py-2">Revisar todos los campos con *</td>
    </tr>
  </tbody>
</table>', 320),

('cierres', 'estados', 'Estados de Pago', '<h2>Ciclo de Vida de una Venta</h2>

<h3>1. Pendiente (Badge Amarillo)</h3>
<p><strong>Qué significa:</strong> El cliente aún no ha pagado la suscripción.</p>
<p><strong>Tu comisión:</strong> No se incluye en solicitudes de pago hasta que se marque como pagado.</p>
<p><strong>Acciones:</strong></p>
<ul>
  <li>Hacer seguimiento de pago con el cliente</li>
  <li>Verificar que el cliente completó el proceso de pago</li>
  <li>Coordinar con administración si hay issues</li>
</ul>

<h3>2. Pagado (Badge Verde)</h3>
<p><strong>Qué significa:</strong> El cliente pagó su suscripción.</p>
<p><strong>Tu comisión:</strong> Entra automáticamente en la siguiente solicitud de pago catorcenal.</p>
<p><strong>Cuándo cambiar a este estado:</strong></p>
<ul>
  <li>Cuando el cliente completa el pago online</li>
  <li>Cuando administración confirma recepción del pago</li>
  <li>Al verificar el pago en el sistema de facturación</li>
</ul>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">Importante:</p>
  <p class="text-yellow-800">Solo marca ventas como "Pagado" cuando realmente se haya recibido el pago. Las comisiones de ventas no pagadas pueden ser revertidas si el cliente cancela.</p>
</div>

<h3>Marcar Como Pagado</h3>
<p>En cada venta pendiente verás un botón "Marcar como pagado". Al hacer clic:</p>
<ol>
  <li>El estado cambia automáticamente a "Pagado"</li>
  <li>Se registra la fecha de cierre</li>
  <li>La comisión se vuelve elegible para cobro</li>
  <li>Se actualiza en "Comisiones Pendientes"</li>
</ol>

<h3>Filtros de Estado</h3>
<p>Usa los filtros superiores para ver:</p>
<ul>
  <li><strong>Todas:</strong> Todas tus ventas sin filtro</li>
  <li><strong>Pendientes:</strong> Solo ventas sin pagar</li>
  <li><strong>Pagadas:</strong> Solo ventas ya pagadas</li>
</ul>
<p>El número entre paréntesis muestra cuántas ventas hay en cada categoría.</p>', 330),

('cierres', 'tarjetas', 'Entendiendo las Tarjetas de Venta', '<h2>Información en Cada Tarjeta</h2>

<h3>Encabezado</h3>
<ul>
  <li><strong>Nombre del Cliente:</strong> Nombre completo del lead</li>
  <li><strong>Plan:</strong> Nombre del plan contratado</li>
  <li><strong>Badge de Estado:</strong> Pendiente (amarillo) o Pagado (verde)</li>
</ul>

<h3>Sección de Monto</h3>
<p>Destacado en verde con el monto total de la venta en MXN.</p>

<h3>Fechas</h3>
<ul>
  <li><strong>Fecha de venta:</strong> Cuándo registraste la venta</li>
  <li><strong>Cerrado el:</strong> Cuándo se marcó como pagado (solo si aplica)</li>
</ul>

<h3>Tu Comisión</h3>
<p>Tarjeta azul que muestra el monto exacto que ganarás por esta venta.</p>

<h3>Notas</h3>
<p>Si agregaste notas al registrar, aparecen en la parte inferior de la tarjeta.</p>

<h3>Información del Cliente</h3>
<p>Email y teléfono del cliente para contacto directo.</p>

<h3>Botón de Acción</h3>
<p>Si la venta está pendiente, verás el botón verde "Marcar como pagado".</p>

<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
  <p class="font-semibold text-purple-900">Tip de Organización:</p>
  <p class="text-purple-800">Las ventas se ordenan automáticamente por fecha, con las más recientes primero. Esto te ayuda a identificar rápidamente ventas que requieren seguimiento.</p>
</div>', 340),

-- COMISIONES SECTION
('comisiones', 'introduccion', 'Sistema de Comisiones', '<h2>Cómo y Cuándo Cobras</h2>
<p>El sistema de comisiones de Ventas Click funciona con pagos catorcenales (cada 14 días). Tus comisiones se generan automáticamente basándose en las ventas que has cerrado y que ya fueron pagadas por el cliente.</p>

<h3>Cómo se Calculan tus Comisiones</h3>
<p>Cada plan tiene un porcentaje de comisión asignado. Por ejemplo:</p>
<ul>
  <li>Plan Básico: X% del precio anual</li>
  <li>Plan Profesional: Y% del precio anual</li>
  <li>Plan Premium: Z% del precio anual</li>
</ul>
<p>Cuando registras una venta y la marcas como pagada, el sistema calcula automáticamente tu comisión aplicando este porcentaje.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Transparencia Total:</p>
  <p class="text-blue-800">Puedes ver en tiempo real cuánto has ganado, cuánto está pendiente de pago, y cuándo recibirás tu próximo pago.</p>
</div>

<h3>Requisitos para Recibir Comisiones</h3>
<ol>
  <li>La venta debe estar registrada en "Mis Cierres"</li>
  <li>La venta debe estar marcada como "Pagado"</li>
  <li>Debes tener configurados tus datos bancarios</li>
  <li>La venta debe estar dentro del período de corte</li>
</ol>', 410),

('comisiones', 'catorcenas', 'Períodos Catorcenales', '<h2>Calendario de Pagos</h2>

<h3>¿Qué es una Catorcena?</h3>
<p>Una catorcena es un período de 14 días. El mes se divide en dos catorcenas:</p>
<ul>
  <li><strong>Primera catorcena:</strong> Del día 1 al 14 del mes</li>
  <li><strong>Segunda catorcena:</strong> Del día 15 al último día del mes</li>
</ul>

<h3>Fechas de Corte</h3>
<p>El sistema genera automáticamente solicitudes de pago cada:</p>
<ul>
  <li><strong>Miércoles después del día 14:</strong> Para ventas del 1-14</li>
  <li><strong>Miércoles después del último día:</strong> Para ventas del 15-fin de mes</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Ejemplo:</p>
  <p class="text-green-800">Si marcas una venta como pagada el 10 de marzo, esa comisión se incluirá en la solicitud que se genera el miércoles más cercano después del 14 de marzo. El pago se procesa el viernes de esa misma semana.</p>
</div>

<h3>Timeline de Pago</h3>
<table class="min-w-full border border-gray-300 my-4">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">Día</th>
      <th class="border border-gray-300 px-4 py-2">Acción</th>
      <th class="border border-gray-300 px-4 py-2">Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Días 1-14 o 15-fin</td>
      <td class="border border-gray-300 px-4 py-2">Período activo</td>
      <td class="border border-gray-300 px-4 py-2">Ventas pagadas en este rango se incluyen</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Miércoles siguiente</td>
      <td class="border border-gray-300 px-4 py-2">Corte automático</td>
      <td class="border border-gray-300 px-4 py-2">Se genera solicitud de pago</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Jueves</td>
      <td class="border border-gray-300 px-4 py-2">Revisión</td>
      <td class="border border-gray-300 px-4 py-2">Administración revisa y aprueba</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Viernes</td>
      <td class="border border-gray-300 px-4 py-2">Pago</td>
      <td class="border border-gray-300 px-4 py-2">Transferencia a tu cuenta bancaria</td>
    </tr>
  </tbody>
</table>

<h3>Ventas Incluidas vs Excluidas</h3>
<p><strong>Se incluyen:</strong></p>
<ul>
  <li>Ventas marcadas como "Pagado" dentro del período</li>
  <li>Que tengas registradas en "Mis Cierres"</li>
  <li>Que no hayan sido incluidas en pagos anteriores</li>
</ul>

<p><strong>Se excluyen:</strong></p>
<ul>
  <li>Ventas aún en estado "Pendiente"</li>
  <li>Ventas marcadas como pagadas después del corte</li>
  <li>Ventas que ya fueron pagadas en catorcenas anteriores</li>
</ul>', 420),

('comisiones', 'configuracion', 'Configurar Datos Bancarios', '<h2>Setup Inicial Obligatorio</h2>

<h3>¿Por Qué es Necesario?</h3>
<p>Para poder recibir tus pagos de comisiones, debes configurar tu información bancaria una sola vez. Sin estos datos, las solicitudes de pago no se procesarán.</p>

<h3>Cómo Configurar</h3>
<ol>
  <li>Ve a la sección "Mis Comisiones"</li>
  <li>Haz clic en "Configurar Datos de Pago"</li>
  <li>Completa el formulario con tu información bancaria</li>
  <li>Guarda los cambios</li>
</ol>

<h3>Información Requerida</h3>
<p><strong>CLABE Interbancaria (18 dígitos):</strong></p>
<ul>
  <li>Es tu número de cuenta interbancaria estandarizada</li>
  <li>Tiene exactamente 18 dígitos</li>
  <li>La proporciona tu banco</li>
  <li>Diferente de tu número de cuenta tradicional</li>
</ul>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">¿Cómo obtener tu CLABE?</p>
  <p class="text-yellow-800">Puedes encontrarla en:</p>
  <ul class="text-yellow-800 mt-2">
    <li>Tu banca en línea (sección de datos de cuenta)</li>
    <li>App móvil de tu banco</li>
    <li>Estado de cuenta</li>
    <li>Llamando a tu banco</li>
  </ul>
</div>

<p><strong>Nombre del Banco:</strong></p>
<ul>
  <li>Nombre completo de tu institución bancaria</li>
  <li>Ejemplo: BBVA, Santander, Banamex, etc.</li>
</ul>

<p><strong>Nombre del Beneficiario:</strong></p>
<ul>
  <li>Tu nombre completo como aparece en tu cuenta bancaria</li>
  <li>Debe coincidir exactamente para procesar la transferencia</li>
  <li>Incluye segundo nombre y apellidos completos</li>
</ul>

<h3>Verificación de Datos</h3>
<p>Antes de guardar, verifica que:</p>
<ul>
  <li>La CLABE tenga exactamente 18 dígitos</li>
  <li>No haya espacios ni guiones en la CLABE</li>
  <li>El nombre coincida con tu identificación oficial</li>
  <li>El banco sea correcto</li>
</ul>

<h3>Actualizar Datos</h3>
<p>Puedes actualizar tu información bancaria en cualquier momento:</p>
<ol>
  <li>Ve a "Mis Comisiones"</li>
  <li>Haz clic en "Editar Datos de Pago"</li>
  <li>Modifica los campos necesarios</li>
  <li>Guarda los cambios</li>
</ol>

<div class="bg-red-50 border-l-4 border-red-500 p-4 my-4">
  <p class="font-semibold text-red-900">Importante:</p>
  <p class="text-red-800">Si cambias de banco o cuenta, actualiza inmediatamente tus datos. Los pagos a cuentas inválidas serán rechazados y retrasarán tu comisión hasta la siguiente catorcena.</p>
</div>', 430),

('comisiones', 'estados', 'Estados de Solicitudes', '<h2>Ciclo de Vida de una Solicitud de Pago</h2>

<h3>1. Sin Procesar (Badge Gris)</h3>
<p><strong>Qué significa:</strong> Solicitud recién generada, aún no enviada a administración.</p>
<p><strong>Cuándo ocurre:</strong> Automáticamente cada miércoles de corte.</p>
<p><strong>Duración típica:</strong> Unas horas, mientras el sistema consolida todas las solicitudes.</p>
<p><strong>Acción tuya:</strong> Ninguna, es automático.</p>

<h3>2. En Cobro (Badge Amarillo)</h3>
<p><strong>Qué significa:</strong> La solicitud fue enviada al área financiera para revisión.</p>
<p><strong>Cuándo ocurre:</strong> Miércoles o jueves después del corte.</p>
<p><strong>Duración típica:</strong> 1-2 días hábiles.</p>
<p><strong>Qué se revisa:</strong></p>
<ul>
  <li>Que los datos bancarios sean correctos</li>
  <li>Que las ventas estén validadas</li>
  <li>Que no haya duplicados</li>
  <li>Que los montos sean correctos</li>
</ul>

<h3>3. Aprobada (Badge Verde)</h3>
<p><strong>Qué significa:</strong> Tu solicitud fue aprobada y el pago está programado.</p>
<p><strong>Cuándo ocurre:</strong> Jueves tarde o viernes temprano.</p>
<p><strong>Duración típica:</strong> Pocas horas hasta que se procesa la transferencia.</p>
<p><strong>Próximo paso:</strong> Espera la transferencia bancaria.</p>

<h3>4. Pagada (Badge Azul)</h3>
<p><strong>Qué significa:</strong> La transferencia fue procesada exitosamente.</p>
<p><strong>Cuándo ocurre:</strong> Viernes (día de pago oficial).</p>
<p><strong>Cuándo verás el dinero:</strong></p>
<ul>
  <li>Mismo día si es antes de las 3 PM</li>
  <li>Siguiente día hábil si es después de las 3 PM</li>
  <li>Lunes si el pago fue viernes tarde</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Comprobante de Pago:</p>
  <p class="text-blue-800">Una vez marcada como "Pagada", puedes solicitar tu comprobante de transferencia contactando al área administrativa.</p>
</div>

<h3>Estados de Problema</h3>

<h4>Rechazada</h4>
<p>Puede ocurrir si:</p>
<ul>
  <li>Datos bancarios incorrectos</li>
  <li>CLABE inválida</li>
  <li>Nombre de beneficiario no coincide</li>
  <li>Problema con alguna venta incluida</li>
</ul>

<p><strong>Qué hacer:</strong></p>
<ol>
  <li>Revisa el motivo del rechazo (aparece en notas)</li>
  <li>Corrige el problema (usualmente datos bancarios)</li>
  <li>Contacta a administración</li>
  <li>La comisión se incluirá en la siguiente catorcena</li>
</ol>', 440),

('comisiones', 'historial', 'Historial y Seguimiento', '<h2>Consulta tus Pagos Pasados</h2>

<h3>Tabla de Solicitudes</h3>
<p>Verás una tabla con todas tus solicitudes de pago que incluye:</p>
<ul>
  <li><strong>Período:</strong> Rango de fechas de la catorcena</li>
  <li><strong>Monto:</strong> Total a cobrar en MXN</li>
  <li><strong>Ventas Incluidas:</strong> Número de ventas en esta solicitud</li>
  <li><strong>Estado:</strong> Estado actual con badge de color</li>
  <li><strong>Fecha de Solicitud:</strong> Cuándo se generó</li>
  <li><strong>Fecha de Pago:</strong> Cuándo se pagó (si aplica)</li>
</ul>

<h3>Ver Detalles</h3>
<p>Haz clic en cualquier solicitud para ver:</p>
<ul>
  <li>Lista completa de ventas incluidas</li>
  <li>Cliente y plan de cada venta</li>
  <li>Monto individual de cada comisión</li>
  <li>Total acumulado</li>
  <li>Notas administrativas (si existen)</li>
</ul>

<h3>Filtros Útiles</h3>
<p>Usa los filtros para encontrar rápidamente:</p>
<ul>
  <li><strong>Por estado:</strong> Solo pendientes, solo pagadas, etc.</li>
  <li><strong>Por período:</strong> Mes actual, últimos 3 meses, año completo</li>
  <li><strong>Por monto:</strong> Solicitudes mayores a cierta cantidad</li>
</ul>

<h3>Estadísticas de Comisiones</h3>
<p>En la parte superior encontrarás métricas clave:</p>
<ul>
  <li><strong>Total Ganado:</strong> Suma de todas las comisiones pagadas</li>
  <li><strong>Pendiente de Pago:</strong> Comisiones aprobadas pero no transferidas</li>
  <li><strong>En Proceso:</strong> Solicitudes en revisión</li>
  <li><strong>Próximo Pago:</strong> Fecha estimada de tu siguiente pago</li>
</ul>

<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
  <p class="font-semibold text-purple-900">Tip Financiero:</p>
  <p class="text-purple-800">Usa el historial para planear tus finanzas. Los pagos son predecibles y catorcenales, lo que facilita tu presupuesto personal.</p>
</div>

<h3>Exportar Historial</h3>
<p>Puedes exportar tu historial de comisiones para:</p>
<ul>
  <li>Declaraciones fiscales</li>
  <li>Tu contabilidad personal</li>
  <li>Análisis de desempeño</li>
  <li>Proyecciones de ingresos</li>
</ul>

<h3>Resolver Discrepancias</h3>
<p>Si notas algún error en una solicitud:</p>
<ol>
  <li>Toma nota del período y monto</li>
  <li>Identifica qué venta falta o sobra</li>
  <li>Contacta al área administrativa con estos detalles</li>
  <li>Proporciona el ID de la solicitud</li>
</ol>

<p><strong>Información útil para reportar:</strong></p>
<ul>
  <li>ID de la solicitud</li>
  <li>Período afectado</li>
  <li>Monto esperado vs monto real</li>
  <li>IDs de ventas que faltan o sobran</li>
</ul>', 450);
