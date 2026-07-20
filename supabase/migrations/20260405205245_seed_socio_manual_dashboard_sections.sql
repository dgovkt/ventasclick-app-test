/*
  # Seed Socio Manual - Dashboard Section

  1. Content Overview
    - Introduction to the Socio Dashboard
    - Explanation of key metrics and statistics
    - How to generate and share the wizard link
    - Understanding the success banner

  2. Subsections
    - Vista General
    - Métricas Principales
    - Generador de Wizard
    - Banner de Ventas
*/

INSERT INTO socio_manual_sections (seccion, subseccion, titulo, contenido, orden) VALUES
('dashboard', 'introduccion', 'Bienvenido al Panel del Socio', '<h2>Tu Centro de Control de Ventas</h2>
<p>El Dashboard es tu pantalla principal donde puedes ver en tiempo real el estado de tu negocio. Aquí encontrarás las métricas más importantes de un vistazo y acceso rápido a todas las funcionalidades del sistema.</p>
<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Consejo:</p>
  <p class="text-blue-800">Visita el Dashboard cada mañana para revisar tus pendientes y planear tu día de ventas.</p>
</div>
<p>El Dashboard se actualiza automáticamente con la información más reciente de tus leads, ventas y comisiones.</p>', 10),

('dashboard', 'metricas', 'Entendiendo tus Métricas', '<h2>Las 4 Métricas Principales</h2>
<p>En la parte superior del Dashboard verás 4 tarjetas con información clave:</p>

<h3>1. Leads Activos</h3>
<p>Muestra el número total de leads que tienes actualmente en seguimiento. Estos son leads que están en estados:</p>
<ul>
  <li><strong>Nuevo:</strong> Recién llegados del wizard o creados manualmente</li>
  <li><strong>En Seguimiento:</strong> Leads con los que ya iniciaste contacto</li>
</ul>
<p><em>No incluye leads cerrados (ganados o perdidos).</em></p>

<h3>2. Ventas del Mes</h3>
<p>Cantidad de ventas que has cerrado en el mes actual. Esta métrica te ayuda a:</p>
<ul>
  <li>Monitorear tu desempeño mensual</li>
  <li>Comparar con tus objetivos de ventas</li>
  <li>Identificar tendencias de crecimiento</li>
</ul>

<h3>3. Comisiones Pendientes</h3>
<p>Monto total en MXN de comisiones que aún no has cobrado. Este número representa:</p>
<ul>
  <li>Ventas registradas pero no pagadas por el cliente</li>
  <li>Solicitudes de pago en proceso</li>
</ul>
<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
  <p class="font-semibold text-yellow-900">Importante:</p>
  <p class="text-yellow-800">Las comisiones se generan automáticamente cada catorcena cuando las ventas se marcan como pagadas.</p>
</div>

<h3>4. En Seguimiento</h3>
<p>Número de leads que marcaste específicamente con el estado "En Seguimiento". Estos requieren tu atención activa.</p>

<h2>Códigos de Color</h2>
<p>Cada métrica tiene un color distintivo para facilitar su identificación:</p>
<ul>
  <li><strong>Verde:</strong> Leads Activos</li>
  <li><strong>Azul:</strong> Ventas del Mes</li>
  <li><strong>Amarillo:</strong> Comisiones Pendientes</li>
  <li><strong>Morado:</strong> En Seguimiento</li>
</ul>', 20),

('dashboard', 'wizard', 'Generador de Links del Wizard', '<h2>Comparte tu Wizard de Ventas</h2>
<p>La tarjeta "Comparte tu Wizard" es tu herramienta principal para generar nuevos leads. Contiene un enlace único y personalizado que solo funciona para ti.</p>

<h3>¿Qué es el Wizard?</h3>
<p>El Wizard es un cuestionario inteligente que:</p>
<ul>
  <li>Califica automáticamente a tus prospectos</li>
  <li>Recomienda el plan ideal según sus necesidades</li>
  <li>Captura su información de contacto</li>
  <li>Les permite comprar directamente online</li>
</ul>

<h3>3 Formas de Compartir</h3>

<h4>1. Código QR</h4>
<p>Al hacer clic en el botón de QR, se genera un código escaneable perfecto para:</p>
<ul>
  <li>Eventos presenciales</li>
  <li>Material impreso (tarjetas, flyers)</li>
  <li>Stands en ferias comerciales</li>
</ul>
<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
  <p class="font-semibold text-green-900">Tip Pro:</p>
  <p class="text-green-800">Descarga el QR en alta resolución y añádelo a tu firma de correo electrónico.</p>
</div>

<h4>2. Copiar Link</h4>
<p>Copia el link al portapapeles para compartirlo por:</p>
<ul>
  <li>WhatsApp</li>
  <li>Email</li>
  <li>Redes sociales</li>
  <li>Mensajería instantánea</li>
</ul>

<h4>3. Abrir Wizard</h4>
<p>Abre el wizard en una nueva pestaña para:</p>
<ul>
  <li>Hacer una demo en vivo</li>
  <li>Probar cambios en el contenido</li>
  <li>Ver la experiencia del cliente</li>
</ul>

<h3>Seguimiento Automático</h3>
<p>Cada persona que complete el wizard automáticamente aparecerá en tu panel de Leads o Prospectos, dependiendo de su respuesta final.</p>', 30),

('dashboard', 'banner', 'Banner de Venta Exitosa', '<h2>Notificación de Compras Online</h2>
<p>Cuando un prospecto completa una compra directamente a través del wizard, verás un banner verde en la parte superior del Dashboard con el mensaje "Venta exitosa realizada".</p>

<h3>¿Qué Significa?</h3>
<p>Este banner indica que:</p>
<ul>
  <li>Un cliente completó el pago en línea</li>
  <li>La venta ya está registrada en "Mis Cierres"</li>
  <li>Tu comisión se calculó automáticamente</li>
  <li>El lead cambió a estado "Cerrado Ganado"</li>
</ul>

<h3>Acciones a Tomar</h3>
<ol>
  <li><strong>Revisar la Venta:</strong> Haz clic en "Ver detalles" para ver la información completa</li>
  <li><strong>Contactar al Cliente:</strong> Aunque la compra fue automática, es excelente práctica:
    <ul>
      <li>Enviar un email de bienvenida</li>
      <li>Confirmar los datos de acceso</li>
      <li>Ofrecer asistencia en la configuración</li>
    </ul>
  </li>
  <li><strong>Solicitar Review:</strong> Es el momento perfecto para pedirle que deje una reseña</li>
</ol>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <p class="font-semibold text-blue-900">Estrategia de Ventas:</p>
  <p class="text-blue-800">Los primeros 24 horas después de la compra son cruciales para establecer una relación positiva. Un mensaje personalizado puede aumentar significativamente la satisfacción del cliente.</p>
</div>

<h3>Cerrar el Banner</h3>
<p>Puedes cerrar el banner haciendo clic en la "X" una vez que hayas revisado la venta. El banner solo se muestra para ventas muy recientes.</p>', 40),

('dashboard', 'navegacion', 'Navegación Rápida', '<h2>Accesos Directos</h2>
<p>El Dashboard incluye enlaces rápidos a las secciones más utilizadas:</p>

<h3>Menú Lateral</h3>
<p>Usa el menú de navegación izquierdo para acceder a:</p>
<ul>
  <li><strong>Leads:</strong> Gestiona tus contactos activos</li>
  <li><strong>Prospectos:</strong> Personas que aún no están interesadas</li>
  <li><strong>Mis Cierres:</strong> Registra y consulta tus ventas</li>
  <li><strong>Mis Comisiones:</strong> Revisa tus pagos</li>
  <li><strong>Knowledge Base:</strong> Consulta información del producto</li>
  <li><strong>Casos de Éxito:</strong> Comparte historias de clientes</li>
  <li><strong>Reviews:</strong> Gestiona reseñas de clientes</li>
  <li><strong>Simulador:</strong> Calcula comisiones potenciales</li>
</ul>

<h3>Botones de Acción</h3>
<p>En cada sección encontrarás botones de acción principales como:</p>
<ul>
  <li>"+ Nuevo Lead" en la sección de Leads</li>
  <li>"Registrar Venta" en Mis Cierres</li>
  <li>"Enviar Caso de Éxito" en Casos de Éxito</li>
</ul>

<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
  <p class="font-semibold text-purple-900">Atajo de Teclado:</p>
  <p class="text-purple-800">En la mayoría de las secciones, puedes usar Ctrl/Cmd + K para abrir el formulario de creación rápida.</p>
</div>', 50);
