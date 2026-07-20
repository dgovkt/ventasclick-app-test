/*
  # Seed Manual - User Management Sections

  Creates user management sections with detailed instructions for:
  1. Creating new users
  2. Editing user information
  3. Configuring payment data
  4. Managing user roles and permissions
  5. Deactivating/Reactivating users
*/

INSERT INTO user_manual_sections (title, slug, content, category, icon_name, order_index, visible)
VALUES
(
  'Crear Nuevo Usuario',
  'crear-nuevo-usuario',
  '<h2>Cómo Crear un Nuevo Usuario en el Sistema</h2>
  <p>Los Super Administradores pueden crear cuentas para nuevos socios, administradores o incluso otros super administradores.</p>

  <h3>Paso 1: Acceder al Módulo de Usuarios</h3>
  <ol>
    <li>Haz clic en <strong>Usuarios</strong> en el menú lateral</li>
    <li>Verás la lista de usuarios existentes</li>
    <li>Haz clic en el botón <strong>"+ Crear Usuario"</strong> en la esquina superior derecha</li>
  </ol>

  <h3>Paso 2: Completar Información Básica</h3>
  <p>El formulario contiene los siguientes campos obligatorios:</p>
  <table>
    <thead>
      <tr>
        <th>Campo</th>
        <th>Descripción</th>
        <th>Obligatorio</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Email</strong></td>
        <td>Correo electrónico del usuario. Será su nombre de usuario para login</td>
        <td>Sí</td>
      </tr>
      <tr>
        <td><strong>Contraseña</strong></td>
        <td>Contraseña inicial (mínimo 8 caracteres)</td>
        <td>Sí</td>
      </tr>
      <tr>
        <td><strong>Nombre</strong></td>
        <td>Nombre(s) del usuario</td>
        <td>Sí</td>
      </tr>
      <tr>
        <td><strong>Apellido</strong></td>
        <td>Apellido(s) del usuario</td>
        <td>Sí</td>
      </tr>
      <tr>
        <td><strong>Teléfono</strong></td>
        <td>Número de contacto (10 dígitos)</td>
        <td>No</td>
      </tr>
      <tr>
        <td><strong>Rol</strong></td>
        <td>Nivel de acceso: Socio, Admin o Super Admin</td>
        <td>Sí</td>
      </tr>
    </tbody>
  </table>

  <div class="alert-warning">
    <strong>IMPORTANTE:</strong> El email debe ser único en el sistema. Si intentas usar un email ya registrado, recibirás un error.
  </div>

  <h3>Paso 3: Asignar Rol Apropiado</h3>
  <p>Selecciona el rol según las responsabilidades del usuario:</p>
  <ul>
    <li><strong>Socio:</strong> Para vendedores que gestionarán sus propios bills y comisiones</li>
    <li><strong>Admin:</strong> Para supervisores que moderarán contenido y verán métricas globales</li>
    <li><strong>Super Admin:</strong> Para personal de confianza con acceso total al sistema</li>
  </ul>

  <h3>Paso 4: Configuración Adicional (Opcional)</h3>
  <p>Dependiendo del rol, puedes configurar:</p>
  <ul>
    <li><strong>Área:</strong> Departamento o región asignada</li>
    <li><strong>Frecuencia de Pago:</strong> Semanal o Mensual (para socios)</li>
    <li><strong>Notas Internas:</strong> Información relevante solo visible para admins</li>
  </ul>

  <h3>Paso 5: Guardar y Notificar</h3>
  <ol>
    <li>Revisa que todos los datos sean correctos</li>
    <li>Haz clic en <strong>"Crear Usuario"</strong></li>
    <li>El sistema enviará un email de bienvenida automáticamente</li>
    <li>El usuario podrá hacer login inmediatamente con sus credenciales</li>
  </ol>

  <div class="alert-tip">
    <strong>CONSEJO:</strong> Después de crear un usuario socio, comparte con él el link del wizard para que empiece a generar ventas inmediatamente.
  </div>

  <h3>Configuración de Datos Bancarios</h3>
  <p>Para usuarios tipo Socio, es importante configurar sus datos bancarios para procesar pagos:</p>
  <ol>
    <li>Una vez creado el usuario, edítalo desde la lista</li>
    <li>Navega a la sección <strong>"Datos de Pago"</strong></li>
    <li>Completa: Nombre del Banco, CLABE, Número de Cuenta, Beneficiario</li>
    <li>Guarda los cambios</li>
  </ol>

  <div class="alert-error">
    <strong>CRÍTICO:</strong> Verifica que la CLABE tenga exactamente 18 dígitos. Errores en datos bancarios retrasan los pagos.
  </div>',
  'gestion_usuarios',
  'UserPlus',
  1,
  true
),
(
  'Editar Información de Usuario',
  'editar-informacion-usuario',
  '<h2>Modificar Datos de Usuarios Existentes</h2>
  <p>Actualiza información de usuarios cuando sea necesario, incluyendo datos personales, rol y configuración de pago.</p>

  <h3>Acceder al Editor de Usuario</h3>
  <ol>
    <li>Ve a <strong>Usuarios</strong> en el menú lateral</li>
    <li>Busca al usuario usando la barra de búsqueda o filtra por rol</li>
    <li>Haz clic en el botón <strong>"Editar"</strong> (ícono de lápiz) en la fila del usuario</li>
  </ol>

  <h3>Campos Editables</h3>
  <p>Puedes modificar los siguientes datos:</p>

  <h4>Información Personal</h4>
  <ul>
    <li><strong>Nombre y Apellido:</strong> Actualiza si hay errores o cambios legales</li>
    <li><strong>Email:</strong> Cambia el correo electrónico (afecta el login)</li>
    <li><strong>Teléfono:</strong> Actualiza número de contacto</li>
  </ul>

  <h4>Configuración de Rol</h4>
  <ul>
    <li><strong>Rol:</strong> Puedes promover o degradar roles según necesidad</li>
    <li><strong>Área:</strong> Asigna o cambia departamento/región</li>
    <li><strong>Activo:</strong> Toggle para activar/desactivar la cuenta</li>
  </ul>

  <h4>Datos de Pago (Solo Socios)</h4>
  <ul>
    <li><strong>Nombre del Banco</strong></li>
    <li><strong>CLABE:</strong> 18 dígitos</li>
    <li><strong>Número de Cuenta</strong></li>
    <li><strong>Beneficiario:</strong> Nombre del titular de la cuenta</li>
    <li><strong>Frecuencia de Pago:</strong> Semanal o Mensual</li>
  </ul>

  <div class="alert-warning">
    <strong>PRECAUCIÓN AL CAMBIAR ROLES:</strong>
    <ul>
      <li>Cambiar de Super Admin a Socio quita acceso total al sistema inmediatamente</li>
      <li>Promover a Super Admin requiere confianza absoluta</li>
      <li>Cambios de rol son instantáneos y no requieren que el usuario haga logout</li>
    </ul>
  </div>

  <h3>Actualizar Contraseña</h3>
  <p>Si un usuario olvida su contraseña:</p>
  <ol>
    <li>En el editor de usuario, busca la sección <strong>"Resetear Contraseña"</strong></li>
    <li>Haz clic en <strong>"Enviar Email de Reseteo"</strong></li>
    <li>El usuario recibirá un link para crear nueva contraseña</li>
    <li>El link expira en 24 horas</li>
  </ol>

  <h3>Validación de Datos Bancarios</h3>
  <p>Antes de aprobar pagos, verifica:</p>
  <ul>
    <li>✓ CLABE tiene exactamente 18 dígitos numéricos</li>
    <li>✓ Nombre del beneficiario coincide con identificación oficial</li>
    <li>✓ Banco existe y está activo</li>
    <li>✓ Información está completa y actualizada</li>
  </ul>

  <div class="alert-tip">
    <strong>CONSEJO:</strong> Pide a los socios que verifiquen sus datos bancarios cada trimestre para evitar errores en pagos.
  </div>',
  'gestion_usuarios',
  'Edit',
  2,
  true
),
(
  'Desactivar y Reactivar Usuarios',
  'desactivar-reactivar-usuarios',
  '<h2>Gestión del Estado de Usuarios</h2>
  <p>Desactiva temporalmente usuarios sin eliminarlos del sistema, preservando su historial.</p>

  <h3>Desactivar un Usuario</h3>
  <p>Razones para desactivar una cuenta:</p>
  <ul>
    <li>El socio dejó de colaborar con la empresa</li>
    <li>Suspensión temporal por incumplimiento</li>
    <li>Usuario inactivo por periodo prolongado</li>
    <li>Cuenta duplicada o creada por error</li>
  </ul>

  <h4>Proceso de Desactivación</h4>
  <ol>
    <li>Ve a <strong>Usuarios</strong> y encuentra al usuario</li>
    <li>Haz clic en <strong>"Editar"</strong></li>
    <li>Cambia el toggle <strong>"Activo"</strong> a OFF</li>
    <li>Opcionalmente agrega una nota interna explicando el motivo</li>
    <li>Haz clic en <strong>"Guardar Cambios"</strong></li>
  </ol>

  <h3>Efectos de la Desactivación</h3>
  <p>Cuando desactivas un usuario:</p>
  <ul>
    <li>✗ No puede hacer login al sistema</li>
    <li>✓ Su historial de bills, ventas y comisiones se preserva</li>
    <li>✓ Aparece en reportes históricos</li>
    <li>✓ Sus bills existentes permanecen en el sistema</li>
    <li>✗ No aparece en listas de asignación de nuevos bills</li>
    <li>✗ No recibe notificaciones del sistema</li>
  </ul>

  <div class="alert-warning">
    <strong>IMPORTANTE:</strong> Desactivar NO elimina datos. Es una acción reversible y segura.
  </div>

  <h3>Reactivar un Usuario</h3>
  <p>Para restaurar acceso a un usuario previamente desactivado:</p>
  <ol>
    <li>En la lista de usuarios, filtra por <strong>"Inactivos"</strong></li>
    <li>Encuentra al usuario y haz clic en <strong>"Editar"</strong></li>
    <li>Cambia el toggle <strong>"Activo"</strong> a ON</li>
    <li>Verifica que su información esté actualizada</li>
    <li>Guarda los cambios</li>
    <li>El usuario podrá hacer login inmediatamente</li>
  </ol>

  <h3>Diferencia: Desactivar vs Eliminar</h3>
  <table>
    <thead>
      <tr>
        <th>Aspecto</th>
        <th>Desactivar</th>
        <th>Eliminar</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Reversibilidad</td>
        <td>✓ Reversible</td>
        <td>✗ Permanente</td>
      </tr>
      <tr>
        <td>Historial</td>
        <td>✓ Se preserva</td>
        <td>✗ Se pierde</td>
      </tr>
      <tr>
        <td>Reportes</td>
        <td>✓ Aparece</td>
        <td>✗ No aparece</td>
      </tr>
      <tr>
        <td>Datos bancarios</td>
        <td>✓ Se mantienen</td>
        <td>✗ Se eliminan</td>
      </tr>
      <tr>
        <td>Recomendado</td>
        <td>✓ Casi siempre</td>
        <td>✗ Casi nunca</td>
      </tr>
    </tbody>
  </table>

  <div class="alert-error">
    <strong>NUNCA ELIMINES USUARIOS:</strong> El sistema NO permite eliminar usuarios que tienen bills o ventas asociadas. Usa siempre DESACTIVAR en lugar de eliminar.
  </div>

  <h3>Mejores Prácticas</h3>
  <ul>
    <li>Desactiva usuarios en lugar de eliminarlos</li>
    <li>Agrega notas internas sobre el motivo de desactivación</li>
    <li>Revisa usuarios inactivos trimestralmente</li>
    <li>Consulta con el usuario antes de desactivar su cuenta</li>
    <li>Documenta decisiones importantes en las notas del usuario</li>
  </ul>',
  'gestion_usuarios',
  'UserX',
  3,
  true
);
