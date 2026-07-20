/*
  # Seed Manual - Remaining Sections

  Creates comprehensive content for:
  - Bills and Leads Management
  - Sales and Closures
  - Commissions
  - Plans
  - Reviews and Success Cases
  - Content Management
  - Knowledge Base
  - Reports and Analytics
  - FAQs
*/

INSERT INTO user_manual_sections (title, slug, content, category, icon_name, order_index, visible)
VALUES
-- BILLS AND LEADS MANAGEMENT
(
  'Gestión de Bills (Leads)',
  'gestion-bills-leads',
  '<h2>Sistema de Gestión de Bills</h2>
  <p>Los Bills (también llamados Leads) son prospectos potenciales que pueden convertirse en ventas. Como Super Admin, tienes visibilidad total.</p>

  <h3>Estados de un Bill</h3>
  <ul>
    <li><strong>Nuevo:</strong> Bill recién creado, sin contacto inicial</li>
    <li><strong>En Seguimiento:</strong> Socio está en proceso de comunicación</li>
    <li><strong>Cerrado Ganado:</strong> Se concretó la venta</li>
    <li><strong>Cerrado Perdido:</strong> No se concretó, razón documentada</li>
  </ul>

  <h3>Ver Todos los Bills</h3>
  <ol>
    <li>Ve a <strong>Bills</strong> en el menú</li>
    <li>Verás tabla con: Nombre, Email, Teléfono, Socio Asignado, Estado, Plan Recomendado</li>
    <li>Usa filtros para: Estado, Socio, Origen (wizard/manual)</li>
    <li>Busca por nombre, email o teléfono</li>
  </ol>

  <div class="alert-tip">
    <strong>TIP:</strong> Bills del wizard incluyen resultados del diagnóstico y plan recomendado automáticamente.
  </div>

  <h3>Asignar Bill a Socio</h3>
  <ol>
    <li>Haz clic en el bill a asignar</li>
    <li>Selecciona socio del dropdown</li>
    <li>El socio recibe notificación automática</li>
    <li>El bill aparece en su dashboard</li>
  </ol>

  <h3>Gestionar Prospectos del Wizard</h3>
  <p>Los prospectos del wizard público son leads que dejaron sus datos pero no compraron:</p>
  <ul>
    <li>Accede desde <strong>Bills</strong> > Filtro "Origen: Wizard"</li>
    <li>Tienen diagnóstico y plan recomendado pre-cargado</li>
    <li>Asígnalos a socios para seguimiento personalizado</li>
  </ul>',
  'gestion_bills_leads',
  'Users',
  1,
  true
),

-- SALES AND CLOSURES
(
  'Gestión de Cierres y Ventas',
  'gestion-cierres-ventas',
  '<h2>Registro y Seguimiento de Ventas</h2>
  <p>Los cierres son ventas completadas que generan comisiones para los socios.</p>

  <h3>Ver Todos los Cierres</h3>
  <ol>
    <li>Ve a <strong>Cierres</strong> en el menú</li>
    <li>Tabla muestra: Socio, Cliente, Plan, Monto, Estado de Pago, Fecha</li>
    <li>Filtra por: Socio, Plan, Estado de Pago, Rango de Fechas</li>
  </ol>

  <h3>Estados de Pago</h3>
  <ul>
    <li><strong>Pendiente:</strong> Venta registrada, esperando pago del cliente</li>
    <li><strong>Pagado:</strong> Cliente pagó, comisión lista para procesarse</li>
    <li><strong>Completado:</strong> Venta completada y comisión procesada</li>
  </ul>

  <h3>Confirmar Ventas Pendientes</h3>
  <ol>
    <li>Revisa evidencias subidas por el socio (screenshots, confirmaciones)</li>
    <li>Verifica en Chargebee que el pago se procesó</li>
    <li>Cambia estado a <strong>"Pagado"</strong></li>
    <li>La comisión se calcula automáticamente</li>
  </ol>

  <div class="alert-warning">
    <strong>IMPORTANTE:</strong> Solo marca como Pagado cuando el dinero esté realmente en cuenta de la empresa.
  </div>

  <h3>Registrar Cierre Manual</h3>
  <p>Si una venta no vino del wizard:</p>
  <ol>
    <li>Clic en <strong>"+ Registrar Cierre"</strong></li>
    <li>Selecciona: Socio, Bill (opcional), Plan, Monto</li>
    <li>Sube evidencias si están disponibles</li>
    <li>Guarda y el sistema calcula comisión automáticamente</li>
  </ol>',
  'gestion_cierres_ventas',
  'TrendingUp',
  1,
  true
),

-- COMMISSIONS
(
  'Sistema de Comisiones',
  'sistema-comisiones',
  '<h2>Cálculo y Pago de Comisiones</h2>
  <p>Las comisiones se calculan automáticamente según el plan vendido. Tu rol es aprobar y procesar pagos.</p>

  <h3>Cómo se Calculan</h3>
  <p>Cada plan tiene una comisión fija configurada en <strong>Gestión de Planes</strong>:</p>
  <ul>
    <li>Presencia Web: $800 MXN</li>
    <li>Tienda Básico: $1,200 MXN</li>
    <li>Tienda Esencial: $1,500 MXN</li>
    <li>Tienda Premium: $2,000 MXN</li>
  </ul>
  <p>Al marcar una venta como Pagado, se crea automáticamente la comisión.</p>

  <h3>Solicitudes de Pago</h3>
  <p>Los socios solicitan pago quincenalmente. El sistema genera automáticamente solicitudes cada 15 días con:</p>
  <ul>
    <li>Periodo (fecha inicio - fecha fin)</li>
    <li>Ventas incluidas en el periodo</li>
    <li>Monto total solicitado</li>
    <li>Datos bancarios del socio</li>
  </ul>

  <h3>Aprobar Solicitud</h3>
  <ol>
    <li>Ve a <strong>Comisiones</strong> > Pestaña <strong>"Solicitudes"</strong></li>
    <li>Revisa ventas incluidas (deben estar en estado Pagado)</li>
    <li>Verifica datos bancarios del socio (CLABE, banco, beneficiario)</li>
    <li>Haz clic en <strong>"Aprobar"</strong></li>
    <li>Estado cambia a "Aprobada"</li>
  </ol>

  <div class="alert-tip">
    <strong>TIP:</strong> Puedes aprobar múltiples solicitudes a la vez usando selección múltiple.
  </div>

  <h3>Procesar Pago</h3>
  <ol>
    <li>Realiza la transferencia bancaria desde tu banco</li>
    <li>En el sistema, abre la solicitud aprobada</li>
    <li>Haz clic en <strong>"Marcar como Pagada"</strong></li>
    <li>Ingresa: Referencia de pago, Fecha de transferencia</li>
    <li>Guarda y el socio recibe notificación automática</li>
  </ol>

  <div class="alert-success">
    <strong>AUTOMATIZACIÓN:</strong> Las ventas se marcan como "pagado_socio" automáticamente al procesar la solicitud.
  </div>',
  'gestion_comisiones',
  'DollarSign',
  1,
  true
),

-- PLANS
(
  'Gestión de Planes',
  'gestion-planes',
  '<h2>Configuración de Planes y Precios</h2>
  <p>Los planes definen los productos que los socios venden. Como Super Admin puedes crear, editar y configurar comisiones.</p>

  <h3>Planes Activos</h3>
  <p>Los planes aparecen en el wizard y están disponibles para venta. Ver en <strong>Configuración</strong> > <strong>Planes</strong></p>

  <h3>Crear Nuevo Plan</h3>
  <ol>
    <li>Clic en <strong>"+ Nuevo Plan"</strong></li>
    <li>Completa: Nombre, Precio Anual, Descripción Corta, Comisión Socio</li>
    <li>Marca como <strong>Activo</strong></li>
    <li>Guarda y el plan aparece inmediatamente en el wizard</li>
  </ol>

  <h3>Editar Precio y Comisión</h3>
  <ol>
    <li>Encuentra el plan en la lista</li>
    <li>Clic en <strong>"Editar"</strong></li>
    <li>Modifica campos necesarios</li>
    <li>Guarda cambios</li>
  </ol>

  <div class="alert-warning">
    <strong>PRECAUCIÓN:</strong> Cambios en comisiones NO afectan ventas pasadas, solo ventas futuras.
  </div>',
  'gestion_planes',
  'Package',
  1,
  true
),

-- REVIEWS
(
  'Gestionar Reviews de Clientes',
  'gestionar-reviews-clientes',
  '<h2>Sistema de Reviews y NPS</h2>
  <p>Los socios solicitan reviews a sus clientes. Tu rol es moderar antes de publicar.</p>

  <h3>Ver Reviews Pendientes</h3>
  <ol>
    <li>Ve a <strong>Reviews</strong></li>
    <li>Verás: Nombre del Cliente, Score NPS (0-10), Comentario, Socio</li>
    <li>Filtra por: Estado (Pendiente/Aprobado/Rechazado), Socio</li>
  </ol>

  <h3>Aprobar Review</h3>
  <ol>
    <li>Lee el comentario completo</li>
    <li>Verifica que sea profesional y auténtico</li>
    <li>Clic en <strong>"Aprobar"</strong></li>
    <li>La review se publica en la landing page pública</li>
  </ol>

  <h3>Rechazar Review</h3>
  <p>Rechaza si:</p>
  <ul>
    <li>Contiene lenguaje inapropiado</li>
    <li>Parece falso o genérico</li>
    <li>Menciona competencia</li>
    <li>Tiene información confidencial</li>
  </ul>',
  'reviews_nps',
  'Star',
  1,
  true
),

-- SUCCESS CASES
(
  'Gestionar Casos de Éxito',
  'gestionar-casos-exito',
  '<h2>Moderación de Casos de Éxito</h2>
  <p>Los socios comparten sus mejores proyectos. Modera antes de publicar en el sitio web.</p>

  <h3>Ver Casos Pendientes</h3>
  <ol>
    <li>Ve a <strong>Casos de Éxito</strong></li>
    <li>Filtra por <strong>Estado: Pendiente</strong></li>
    <li>Verás: URL del Sitio, Tipo de Plan, Título, Descripción</li>
  </ol>

  <h3>Aprobar Caso de Éxito</h3>
  <ol>
    <li>Visita la URL del sitio para verificar que existe y funciona</li>
    <li>Revisa que el contenido sea apropiado para mostrar públicamente</li>
    <li>Clic en <strong>"Aprobar"</strong></li>
    <li>Se publica automáticamente en la landing page</li>
  </ol>

  <h3>Rechazar con Feedback</h3>
  <ol>
    <li>Clic en <strong>"Rechazar"</strong></li>
    <li>Escribe comentario de moderación explicando el motivo</li>
    <li>El socio recibe notificación con tu feedback</li>
  </ol>',
  'casos_exito',
  'Award',
  1,
  true
),

-- CONTENT MANAGEMENT
(
  'Editor de Contenido Web',
  'editor-contenido-web',
  '<h2>Gestión de Contenido del Sitio</h2>
  <p>Edita textos de la landing page, wizard y emails desde el sistema.</p>

  <h3>Secciones Editables</h3>
  <ul>
    <li><strong>Landing Page:</strong> Hero, beneficios, testimonios, llamadas a acción</li>
    <li><strong>Wizard:</strong> Textos de cada pantalla del proceso de venta</li>
    <li><strong>Emails:</strong> Templates de notificaciones automáticas</li>
    <li><strong>Dashboard:</strong> Mensajes y guías para socios</li>
  </ul>

  <h3>Editar Contenido</h3>
  <ol>
    <li>Ve a <strong>Contenido</strong></li>
    <li>Selecciona sección a editar</li>
    <li>Usa el editor visual para modificar textos</li>
    <li>Vista previa de cambios</li>
    <li>Publica y los cambios son inmediatos</li>
  </ol>',
  'gestion_contenido',
  'Edit',
  1,
  true
),

-- KNOWLEDGE BASE
(
  'Gestión de Base de Conocimientos',
  'gestion-base-conocimientos',
  '<h2>Artículos de Ayuda para Socios</h2>
  <p>La Base de Conocimientos contiene guías y tutoriales para que los socios aprendan a usar el sistema.</p>

  <h3>Crear Artículo</h3>
  <ol>
    <li>Ve a <strong>Base de Conocimientos</strong></li>
    <li>Clic en <strong>"+ Nuevo Artículo"</strong></li>
    <li>Completa: Título, Categoría, Tags, Contenido (editor visual)</li>
    <li>Marca como Visible cuando esté listo</li>
    <li>Guarda y los socios podrán verlo inmediatamente</li>
  </ol>

  <h3>Categorías Recomendadas</h3>
  <ul>
    <li>Primeros Pasos</li>
    <li>Gestión de Bills</li>
    <li>Uso del Wizard</li>
    <li>Comisiones y Pagos</li>
    <li>Preguntas Frecuentes</li>
  </ul>',
  'base_conocimientos',
  'BookOpen',
  1,
  true
),

-- REPORTS
(
  'Reportes y Analíticas',
  'reportes-analiticas',
  '<h2>Dashboard de Métricas y Reportes</h2>
  <p>Analiza el desempeño del sistema con reportes detallados.</p>

  <h3>Dashboard Principal</h3>
  <p>Métricas clave visibles al entrar:</p>
  <ul>
    <li><strong>Total Usuarios:</strong> Activos por rol</li>
    <li><strong>Bills:</strong> Distribuidos por estado</li>
    <li><strong>Ventas del Mes:</strong> Monto total y cantidad</li>
    <li><strong>Comisiones Pendientes:</strong> Monto a pagar</li>
  </ul>

  <h3>Reporte de Ventas</h3>
  <ol>
    <li>Ve a <strong>Cierres</strong></li>
    <li>Selecciona rango de fechas</li>
    <li>Filtra por socio o plan</li>
    <li>Exporta a CSV/Excel</li>
  </ol>

  <h3>Análisis de Comisiones</h3>
  <ol>
    <li>Ve a <strong>Comisiones</strong></li>
    <li>Revisa: Total Pagado, Pendiente, Por Socio</li>
    <li>Identifica top performers</li>
    <li>Exporta reportes para contabilidad</li>
  </ol>',
  'reportes_analiticas',
  'BarChart',
  1,
  true
),

-- FAQS
(
  'Preguntas Frecuentes',
  'preguntas-frecuentes',
  '<h2>Solución de Problemas Comunes</h2>

  <h3>¿Cómo resetear la contraseña de un usuario?</h3>
  <p>Edita el usuario y usa la opción "Enviar Email de Reseteo". El usuario recibirá un link para crear nueva contraseña.</p>

  <h3>¿Qué hacer si una venta no aparece?</h3>
  <ol>
    <li>Verifica que el socio la haya registrado correctamente</li>
    <li>Busca en Cierres con filtros de fecha amplia</li>
    <li>Si no existe, regístrala manualmente desde <strong>"+ Registrar Cierre"</strong></li>
  </ol>

  <h3>¿Cómo corregir un monto de comisión?</h3>
  <p>Edita la venta, ajusta el monto. El sistema recalcula la comisión automáticamente si aún no ha sido pagada.</p>

  <div class="alert-warning">
    <strong>IMPORTANTE:</strong> No edites ventas ya pagadas sin documentar el motivo en notas internas.
  </div>

  <h3>¿Diferencia entre Admin y Super Admin?</h3>
  <p>Admin modera contenido y ve métricas. Super Admin además gestiona usuarios, procesa pagos y configura el sistema.</p>

  <h3>¿El usuario no puede acceder?</h3>
  <p>Verifica:</p>
  <ul>
    <li>✓ Cuenta está activa (toggle en ON)</li>
    <li>✓ Email es correcto</li>
    <li>✓ Contraseña correcta (resetea si es necesario)</li>
    <li>✓ No hay problemas de red</li>
  </ul>

  <h3>¿Comisión calculada incorrectamente?</h3>
  <p>Revisa la configuración del plan en <strong>Gestión de Planes</strong>. La comisión debe estar actualizada.</p>

  <h3>¿Email de notificación no llega?</h3>
  <p>Pide al usuario revisar carpeta de spam. Verifica que el email en su perfil sea correcto.</p>

  <h3>¿Wizard no carga?</h3>
  <p>Verifica que el contenido del wizard esté publicado en <strong>Contenido</strong>. Todas las pantallas deben tener contenido visible.</p>',
  'preguntas_frecuentes',
  'HelpCircle',
  1,
  true
);
