/*
  # Seed Manual - Introduction Sections

  Creates the introduction sections of the user manual with comprehensive content:
  1. Welcome and Overview
  2. Roles and Permissions
  3. Dashboard Navigation
  4. Getting Started Guide
*/

-- Insert Introduction sections
INSERT INTO user_manual_sections (title, slug, content, category, icon_name, order_index, visible)
VALUES
(
  'Bienvenida al Sistema Ventas Click',
  'bienvenida-sistema-ventas-click',
  '<h2>Bienvenido al Manual de Usuario de Ventas Click</h2>
  <p>Este manual ha sido diseñado específicamente para Super Administradores del sistema Ventas Click. Aquí encontrarás toda la información necesaria para gestionar eficientemente la plataforma y apoyar a tu equipo de socios comerciales.</p>
  
  <h3>Objetivos de Ventas Click</h3>
  <p>Ventas Click es una plataforma integral diseñada para:</p>
  <ul>
    <li><strong>Gestionar el ciclo completo de ventas</strong> desde la captación de leads hasta el cierre</li>
    <li><strong>Automatizar el cálculo y pago de comisiones</strong> a socios comerciales</li>
    <li><strong>Facilitar la colaboración</strong> entre socios, administradores y super administradores</li>
    <li><strong>Proporcionar herramientas de marketing</strong> como el wizard de ventas y casos de éxito</li>
    <li><strong>Ofrecer transparencia total</strong> en el proceso de ventas y comisiones</li>
  </ul>

  <h3>Audiencia de este Manual</h3>
  <p>Este manual está dirigido exclusivamente a Super Administradores que tienen:</p>
  <ul>
    <li>Acceso completo a todas las funcionalidades del sistema</li>
    <li>Responsabilidad de configurar y mantener la plataforma</li>
    <li>Autoridad para gestionar usuarios, contenido y configuraciones globales</li>
    <li>Capacidad para aprobar pagos, revisar métricas y tomar decisiones estratégicas</li>
  </ul>

  <div class="alert-tip">
    <strong>TIP:</strong> Usa la barra de búsqueda en el menú lateral para encontrar rápidamente información específica.
  </div>

  <h3>Cómo Usar este Manual</h3>
  <p>El manual está organizado en categorías temáticas que puedes explorar desde el menú lateral:</p>
  <ol>
    <li>Navega por las categorías expandiendo cada sección</li>
    <li>Haz clic en cualquier título para ver el contenido completo</li>
    <li>Usa los botones "Anterior" y "Siguiente" para moverte secuencialmente</li>
    <li>Utiliza la función de búsqueda para encontrar términos específicos</li>
    <li>Imprime secciones individuales cuando necesites material de referencia</li>
  </ol>',
  'introduccion',
  'BookOpen',
  1,
  true
),
(
  'Roles y Permisos del Sistema',
  'roles-y-permisos-sistema',
  '<h2>Sistema de Roles en Ventas Click</h2>
  <p>El sistema cuenta con tres niveles de acceso, cada uno con permisos y responsabilidades específicas:</p>

  <h3>1. Socio Comercial</h3>
  <p>Los socios son los usuarios que generan ventas y ganan comisiones. Sus permisos incluyen:</p>
  <ul>
    <li>✓ Gestionar sus propios Bills (leads)</li>
    <li>✓ Registrar cierres de ventas</li>
    <li>✓ Ver y solicitar pago de comisiones</li>
    <li>✓ Usar el wizard de ventas con sus prospectos</li>
    <li>✓ Compartir casos de éxito</li>
    <li>✓ Solicitar reviews de clientes</li>
    <li>✓ Consultar la base de conocimientos</li>
    <li>✗ No pueden ver datos de otros socios</li>
    <li>✗ No pueden aprobar o rechazar contenido</li>
    <li>✗ No tienen acceso a configuraciones del sistema</li>
  </ul>

  <h3>2. Administrador</h3>
  <p>Los administradores tienen permisos ampliados para supervisar operaciones:</p>
  <ul>
    <li>✓ Todo lo que puede hacer un Socio</li>
    <li>✓ Ver bills y ventas de todos los socios</li>
    <li>✓ Aprobar o rechazar casos de éxito</li>
    <li>✓ Aprobar o rechazar reviews de clientes</li>
    <li>✓ Editar contenido del sitio web y wizard</li>
    <li>✓ Gestionar artículos de la base de conocimientos</li>
    <li>✗ No pueden gestionar usuarios</li>
    <li>✗ No pueden configurar comisiones de planes</li>
    <li>✗ No tienen acceso a configuraciones críticas</li>
  </ul>

  <h3>3. Super Administrador</h3>
  <p>Los super administradores tienen control total del sistema:</p>
  <ul>
    <li>✓ Todo lo que puede hacer un Administrador</li>
    <li>✓ Crear, editar y desactivar usuarios</li>
    <li>✓ Configurar planes y comisiones</li>
    <li>✓ Aprobar y procesar pagos de comisiones</li>
    <li>✓ Acceder a reportes y analíticas completas</li>
    <li>✓ Configurar integraciones (Chargebee, etc.)</li>
    <li>✓ Modificar configuraciones del sistema</li>
    <li>✓ Gestionar este manual de usuario</li>
  </ul>

  <div class="alert-warning">
    <strong>IMPORTANTE:</strong> Con grandes poderes vienen grandes responsabilidades. Como Super Admin, tus acciones afectan a todo el sistema. Siempre verifica antes de realizar cambios críticos.
  </div>

  <h3>Tabla Comparativa de Permisos</h3>
  <table>
    <thead>
      <tr>
        <th>Funcionalidad</th>
        <th>Socio</th>
        <th>Admin</th>
        <th>Super Admin</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Gestionar propios bills</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Ver todos los bills</td>
        <td>✗</td>
        <td>✓</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Registrar cierres</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Ver comisiones propias</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Ver comisiones de todos</td>
        <td>✗</td>
        <td>✓</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Aprobar contenido</td>
        <td>✗</td>
        <td>✓</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Gestionar usuarios</td>
        <td>✗</td>
        <td>✗</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Procesar pagos</td>
        <td>✗</td>
        <td>✗</td>
        <td>✓</td>
      </tr>
      <tr>
        <td>Configurar sistema</td>
        <td>✗</td>
        <td>✗</td>
        <td>✓</td>
      </tr>
    </tbody>
  </table>

  <h3>Cuándo Escalar Permisos</h3>
  <p>Considera promover un usuario cuando:</p>
  <ul>
    <li><strong>De Socio a Admin:</strong> Necesitas alguien que supervise operaciones diarias pero sin acceso a configuraciones críticas</li>
    <li><strong>De Admin a Super Admin:</strong> Requieres delegar responsabilidades de configuración del sistema y gestión financiera</li>
  </ul>

  <div class="alert-tip">
    <strong>CONSEJO:</strong> Mantén el número de Super Admins al mínimo necesario para reducir riesgos de seguridad.
  </div>',
  'introduccion',
  'Shield',
  2,
  true
),
(
  'Navegación del Dashboard',
  'navegacion-dashboard',
  '<h2>Tour por el Dashboard de Super Admin</h2>
  <p>El dashboard de Super Admin es tu centro de control. Desde aquí puedes acceder a todas las funcionalidades del sistema.</p>

  <h3>Estructura del Menú Lateral</h3>
  <p>El menú lateral está organizado en las siguientes secciones:</p>

  <h4>1. Dashboard (Inicio)</h4>
  <p>Vista general con métricas clave y resumen de actividad reciente. Incluye:</p>
  <ul>
    <li>Total de usuarios activos</li>
    <li>Bills en cada estado</li>
    <li>Ventas del periodo</li>
    <li>Comisiones pendientes de pago</li>
  </ul>

  <h4>2. Bills</h4>
  <p>Gestión de leads y prospectos. Permite ver todos los bills del sistema, filtrar por socio, estado y origen.</p>

  <h4>3. Cierres</h4>
  <p>Registro y seguimiento de ventas cerradas. Visualiza ventas por socio, plan vendido y estado de pago.</p>

  <h4>4. Comisiones</h4>
  <p>Centro de control de pagos a socios. Aquí apruebas solicitudes de pago y marcas comisiones como pagadas.</p>

  <h4>5. Casos de Éxito</h4>
  <p>Modera y aprueba los casos de éxito enviados por socios para publicación en el sitio web.</p>

  <h4>6. Reviews</h4>
  <p>Gestiona las reviews de clientes capturadas por los socios. Aprueba o rechaza antes de publicar.</p>

  <h4>7. Usuarios</h4>
  <p>Administración completa de usuarios del sistema. Crea, edita, activa y desactiva cuentas.</p>

  <h4>8. Contenido</h4>
  <p>Editor de contenido para landing page, wizard y emails del sistema.</p>

  <h4>9. Base de Conocimientos</h4>
  <p>Gestiona artículos de ayuda y documentación para socios.</p>

  <h4>10. Manual de Usuario</h4>
  <p>Este manual que estás leyendo. Puedes editar y agregar contenido.</p>

  <h4>11. Configuración</h4>
  <p>Ajustes generales del sistema, configuración de Chargebee y parámetros globales.</p>

  <div class="alert-tip">
    <strong>ACCESO RÁPIDO:</strong> Usa las teclas de navegación del teclado para moverte más rápido entre secciones.
  </div>

  <h3>Barra Superior</h3>
  <p>En la barra superior encontrarás:</p>
  <ul>
    <li><strong>Logo de Ventas Click:</strong> Haz clic para volver al Dashboard</li>
    <li><strong>Tu Perfil:</strong> Muestra tu nombre y rol actual</li>
    <li><strong>Botón de Menú (móvil):</strong> En dispositivos móviles, muestra/oculta el menú lateral</li>
  </ul>

  <h3>Vista Móvil</h3>
  <p>El dashboard es completamente responsive. En móviles y tablets:</p>
  <ul>
    <li>El menú lateral se oculta por defecto</li>
    <li>Usa el botón hamburguesa (☰) para abrir el menú</li>
    <li>Las tablas se adaptan con scroll horizontal</li>
    <li>Los formularios se reorganizan en una sola columna</li>
  </ul>',
  'introduccion',
  'Compass',
  3,
  true
),
(
  'Primeros Pasos como Super Admin',
  'primeros-pasos-super-admin',
  '<h2>Guía de Inicio Rápido</h2>
  <p>Si eres nuevo como Super Administrador, sigue estos pasos para familiarizarte con el sistema:</p>

  <h3>Día 1: Familiarización</h3>
  <ol>
    <li><strong>Explora el Dashboard:</strong> Revisa las métricas principales y entiende qué representa cada número</li>
    <li><strong>Revisa los Usuarios:</strong> Ve a Usuarios y familiarízate con los socios activos</li>
    <li><strong>Consulta los Bills:</strong> Observa el flujo de trabajo de un bill desde nuevo hasta cerrado</li>
    <li><strong>Lee la Base de Conocimientos:</strong> Revisa los artículos disponibles para socios</li>
  </ol>

  <h3>Semana 1: Operaciones Básicas</h3>
  <ol>
    <li><strong>Prueba el Wizard:</strong> Simula el proceso de venta que usan los socios</li>
    <li><strong>Revisa Comisiones:</strong> Entiende cómo se calculan y procesan los pagos</li>
    <li><strong>Modera Contenido:</strong> Aprueba o rechaza un caso de éxito o review</li>
    <li><strong>Edita un Artículo KB:</strong> Actualiza o crea contenido de ayuda</li>
  </ol>

  <h3>Mes 1: Dominio Completo</h3>
  <ol>
    <li><strong>Gestiona Usuarios:</strong> Crea un nuevo usuario de prueba</li>
    <li><strong>Configura un Plan:</strong> Ajusta precios o comisiones de un plan</li>
    <li><strong>Procesa un Pago:</strong> Completa el ciclo de aprobar y pagar comisiones</li>
    <li><strong>Personaliza Contenido:</strong> Edita textos de la landing page o wizard</li>
    <li><strong>Revisa Analíticas:</strong> Genera reportes de ventas por periodo</li>
  </ol>

  <div class="alert-success">
    <strong>¡FELICIDADES!</strong> Una vez completados estos pasos, estarás listo para gestionar el sistema de forma independiente.
  </div>

  <h3>Recursos Adicionales</h3>
  <p>Para continuar tu aprendizaje:</p>
  <ul>
    <li>Lee las secciones específicas de este manual según las necesites</li>
    <li>Consulta la sección de Preguntas Frecuentes para resolver dudas comunes</li>
    <li>Experimenta en un entorno de prueba antes de hacer cambios críticos</li>
    <li>Mantén comunicación con otros Super Admins para compartir mejores prácticas</li>
  </ul>

  <div class="alert-tip">
    <strong>RECOMENDACIÓN:</strong> Dedica 30 minutos diarios durante tu primera semana para explorar cada sección del sistema sin presión.
  </div>',
  'introduccion',
  'Rocket',
  4,
  true
);
