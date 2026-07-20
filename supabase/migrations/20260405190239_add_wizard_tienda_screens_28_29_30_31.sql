/*
  # Add Wizard Content Blocks for Tienda en Línea Flow (Screens 28-31)

  1. Changes
    - Add content block for screen 28: Descargar App (Tienda)
    - Add content block for screen 29: Visualizar Tienda en App
    - Add content block for screen 30: Captura de Evidencia (Tienda)
    - Add content block for screen 31: Gracias Tienda en Línea (renamed from 27)

  2. Purpose
    - Complete the Tienda en Línea flow with app download and evidence capture
    - Match the same flow as Presencia Web for consistency
*/

-- Insert wizard.screen_28 (Descargar App - Tienda)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta) VALUES
(
  'wizard.screen_28',
  'wizard',
  'Descargar App Tienda',
  'Instrucciones para descargar la app',
  'text',
  '1. Descargar la App Ventas Click',
  jsonb_build_object(
    'descripcion', 'Pídele al dueño del negocio que abra su cámara y escanee el código QR para descargar la aplicación en su celular.',
    'url_android', 'https://play.google.com/store',
    'url_ios', 'https://apps.apple.com',
    'titulo_2', '2. Ingresar a la App Ventas Click',
    'descripcion_2', 'Una vez descargada la App:',
    'pasos_2', jsonb_build_array(
      '-Pide al dueño del negocio abrir su correo electrónico con el que se registró.',
      '-Dentro del correo que recibió, encontrará su usuario y contraseña.'
    ),
    'cta_primario', 'Continuar'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Insert wizard.screen_29 (Visualizar Tienda en App)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta) VALUES
(
  'wizard.screen_29',
  'wizard',
  'Visualizar Tienda',
  'Guía para visualizar tienda en app',
  'text',
  '3. Visualizar Tienda en Línea en la App',
  jsonb_build_object(
    'descripcion', 'Ahora que el dueño del negocio ha ingresado a la App, guíalo para que vea su Tienda en Línea:',
    'pasos', jsonb_build_array(
      '1. En el menú principal, busca la sección "Mi Tienda" o "Tienda en Línea".',
      '2. Allí podrá ver su tienda en construcción.',
      '3. Muy pronto recibirá una llamada para completar los datos de sus productos y personalizar su tienda.'
    ),
    'nota', '¡El dueño del negocio ya puede comenzar a explorar las funcionalidades de su nueva tienda en línea!',
    'cta_primario', 'Continuar'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Insert wizard.screen_30 (Captura de Evidencia - Tienda)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta) VALUES
(
  'wizard.screen_30',
  'wizard',
  'Evidencia Tienda',
  'Subir evidencia de activación',
  'text',
  '4. Subir Evidencia de Activación',
  jsonb_build_object(
    'descripcion', 'Para finalizar, toma una foto como evidencia de la activación exitosa de la Tienda en Línea.',
    'label', 'Selecciona una foto:',
    'cta_primario', 'Finalizar y Subir Evidencia'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Update wizard.screen_31 (Gracias Tienda en Línea - renamed from screen 27)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta) VALUES
(
  'wizard.screen_31',
  'wizard',
  'Gracias Tienda',
  'Mensaje de agradecimiento final',
  'text',
  '¡Gracias por ayudar a un dueño de negocio a comenzar a vender sus productos por Internet!',
  jsonb_build_object(
    'cta_primario', 'Volver a menú principal'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();
