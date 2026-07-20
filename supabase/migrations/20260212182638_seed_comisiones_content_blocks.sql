/*
  # Seed comisiones content blocks

  1. Changes
    - Add all content blocks for commission/payment system
    - Includes texts for summary, configuration, and payment requests
  
  2. Content Structure
    - comisiones.resumen.* - Commission summary tab
    - comisiones.config.* - Payment configuration tab
    - comisiones.solicitudes.* - Payment requests tab
    - comisiones.nueva_solicitud.* - New payment request modal
*/

INSERT INTO content_blocks (slug, section, title, description, type, value) VALUES
  ('comisiones.resumen.title', 'comisiones', 'Título resumen de comisiones', 'Título de la pestaña resumen', 'text', 'Resumen de Comisiones'),
  ('comisiones.resumen.description', 'comisiones', 'Descripción resumen', 'Subtítulo de la pestaña resumen', 'text', 'Estado actual de tus comisiones'),
  ('comisiones.resumen.pendiente', 'comisiones', 'Label pendientes', 'Etiqueta para comisiones pendientes', 'text', 'Pendientes'),
  ('comisiones.resumen.aprobada', 'comisiones', 'Label aprobadas', 'Etiqueta para comisiones aprobadas', 'text', 'Aprobadas'),
  ('comisiones.resumen.pagada', 'comisiones', 'Label pagadas', 'Etiqueta para comisiones pagadas', 'text', 'Pagadas'),
  ('comisiones.resumen.info_title', 'comisiones', 'Título información', 'Título del bloque informativo', 'text', 'Información importante'),
  ('comisiones.resumen.info_1', 'comisiones', 'Info 1', 'Primera línea de información', 'text', 'Las comisiones pendientes están en revisión y serán procesadas según tu frecuencia de pago configurada.'),
  ('comisiones.resumen.info_2', 'comisiones', 'Info 2', 'Segunda línea de información', 'text', 'Las comisiones aprobadas serán pagadas en los próximos días hábiles.'),
  ('comisiones.resumen.info_3', 'comisiones', 'Info 3', 'Tercera línea de información', 'text', 'Configura tus datos bancarios en la pestaña "Configurar pago" para recibir tus comisiones.'),

  ('comisiones.config.title', 'comisiones', 'Título configuración', 'Título de la pestaña configuración', 'text', 'Configuración de Pago'),
  ('comisiones.config.description', 'comisiones', 'Descripción configuración', 'Subtítulo de la pestaña configuración', 'text', 'Configura tus datos bancarios para recibir tus comisiones'),
  ('comisiones.config.banco', 'comisiones', 'Label banco', 'Etiqueta campo banco', 'text', 'Nombre del Banco'),
  ('comisiones.config.clabe', 'comisiones', 'Label CLABE', 'Etiqueta campo CLABE', 'text', 'CLABE Interbancaria'),
  ('comisiones.config.clabe_help', 'comisiones', 'Ayuda CLABE', 'Texto de ayuda para CLABE', 'text', 'La CLABE debe tener exactamente 18 dígitos'),
  ('comisiones.config.cuenta', 'comisiones', 'Label cuenta', 'Etiqueta campo cuenta', 'text', 'Número de Cuenta'),
  ('comisiones.config.beneficiario', 'comisiones', 'Label beneficiario', 'Etiqueta campo beneficiario', 'text', 'Nombre del Beneficiario'),
  ('comisiones.config.frecuencia', 'comisiones', 'Label frecuencia', 'Etiqueta campo frecuencia', 'text', 'Frecuencia de Pago'),
  ('comisiones.config.save', 'comisiones', 'Botón guardar', 'Texto botón guardar configuración', 'text', 'Guardar Configuración'),

  ('comisiones.solicitudes.title', 'comisiones', 'Título solicitudes', 'Título de la pestaña solicitudes', 'text', 'Solicitudes de Cobro'),
  ('comisiones.solicitudes.description', 'comisiones', 'Descripción solicitudes', 'Subtítulo de la pestaña solicitudes', 'text', 'Gestiona tus solicitudes de pago'),
  ('comisiones.solicitudes.empty', 'comisiones', 'Estado vacío', 'Mensaje cuando no hay solicitudes', 'text', 'No tienes solicitudes de cobro'),

  ('comisiones.nueva_solicitud.title', 'comisiones', 'Título nueva solicitud', 'Título del modal de nueva solicitud', 'text', 'Nueva Solicitud de Cobro'),
  ('comisiones.nueva_solicitud.info', 'comisiones', 'Info nueva solicitud', 'Información del proceso', 'text', 'Selecciona el período de ventas y las comisiones que deseas cobrar. El administrador revisará tu solicitud y procesará el pago según tu frecuencia configurada.')

ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;
