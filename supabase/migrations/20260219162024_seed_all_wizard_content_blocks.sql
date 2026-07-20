/*
  # Seed all wizard content blocks with correct prices

  1. Updates
    - Add welcome screen (screen 0) content
    - Add confirmation screens after diagnosis
    - Add all diagnosis options (A, B, C, D) with editable content
    - Add all Plan Presencia Web steps (1-8) with $3,299 MXN price
    - Add all Plan Tienda en Línea steps (1-6) with $6,828 MXN price
    - Add post-purchase flow screens (9-16)

  2. Purpose
    - All wizard text content becomes editable through CMS
    - Correct pricing displayed throughout the flow
    - Complete 16+ screen wizard with professional messaging
    - Admins can update any text without code changes
*/

-- Welcome screen (screen 0)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES (
  'wizard.bienvenida',
  'wizard',
  'Pantalla de Bienvenida del Wizard',
  'Primera pantalla que ve el usuario al entrar al wizard',
  'richtext',
  '¡Bienvenido al Diagnóstico Digital!',
  jsonb_build_object(
    'subtitulo', 'Estás a punto de ayudar a un negocio a transformarse digitalmente',
    'descripcion', 'Hola, estás por ayudar a un negocio a dar el salto al mundo digital. En los próximos minutos, vamos a identificar la mejor solución para sus necesidades y presupuesto.',
    'bullets', jsonb_build_array(
      'Proceso rápido de 5 minutos',
      'Diagnóstico personalizado',
      'Propuesta inmediata con precio especial',
      'Sin compromiso de compra'
    ),
    'cta_text', 'Comenzar Diagnóstico'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Diagnosis screen title
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES (
  'wizard.diagnostico.titulo',
  'wizard',
  'Título de la Pantalla de Diagnóstico',
  'Título que aparece en la pantalla de diagnóstico',
  'text',
  '¿Qué necesita el negocio?',
  jsonb_build_object(
    'descripcion', 'Selecciona la opción que mejor describe su situación actual:'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Diagnosis options
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES 
  (
    'wizard.diagnostico.opcion_a',
    'wizard',
    'Opción A del Diagnóstico',
    'Primera opción de diagnóstico: dar a conocer negocio',
    'text',
    'Dar a conocer su negocio',
    jsonb_build_object(
      'descripcion', 'El negocio es nuevo o no tiene presencia en internet. Necesita empezar a ser visible en línea.',
      'icon', 'Megaphone'
    )
  ),
  (
    'wizard.diagnostico.opcion_b',
    'wizard',
    'Opción B del Diagnóstico',
    'Segunda opción de diagnóstico: mejorar imagen',
    'text',
    'Mejorar su imagen digital',
    jsonb_build_object(
      'descripcion', 'Ya tiene redes sociales o página web, pero necesita verse más profesional y confiable.',
      'icon', 'Sparkles'
    )
  ),
  (
    'wizard.diagnostico.opcion_c',
    'wizard',
    'Opción C del Diagnóstico',
    'Tercera opción de diagnóstico: vender en línea',
    'text',
    'Vender en línea',
    jsonb_build_object(
      'descripcion', 'Quiere recibir pedidos y pagos directamente por internet, con carrito de compras.',
      'icon', 'ShoppingCart'
    )
  ),
  (
    'wizard.diagnostico.opcion_d',
    'wizard',
    'Opción D del Diagnóstico',
    'Cuarta opción de diagnóstico: crecer ventas',
    'text',
    'Crecer sus ventas digitales',
    jsonb_build_object(
      'descripcion', 'Ya vende por internet pero necesita una plataforma más robusta para vender más.',
      'icon', 'TrendingUp'
    )
  )
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Confirmation screens
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES 
  (
    'wizard.confirmacion.presencia_web',
    'wizard',
    'Confirmación Plan Presencia Web',
    'Pantalla de confirmación después del diagnóstico para presencia web',
    'text',
    '¡Perfecto!',
    jsonb_build_object(
      'subtitulo', 'El plan ideal es: Plan Presencia Web',
      'descripcion', 'Basado en las necesidades, este plan les ayudará a establecer una presencia profesional en línea.',
      'cta_text', 'Ver detalles del plan'
    )
  ),
  (
    'wizard.confirmacion.tienda',
    'wizard',
    'Confirmación Plan Tienda',
    'Pantalla de confirmación después del diagnóstico para tienda',
    'text',
    '¡Excelente!',
    jsonb_build_object(
      'subtitulo', 'El plan ideal es: Plan Tienda en Línea',
      'descripcion', 'Basado en las necesidades, este plan les permitirá vender y recibir pagos en línea de manera profesional.',
      'cta_text', 'Ver detalles del plan'
    )
  )
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Plan Presencia Web steps (1-8)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES 
  (
    'wizard.plan_web.step1',
    'wizard',
    'Plan Presencia Web - Paso 1',
    'Diseño profesional y atractivo',
    'text',
    'Diseño Profesional y Atractivo',
    jsonb_build_object(
      'descripcion', 'Tu sitio web contará con un diseño moderno, limpio y profesional que inspira confianza en tus clientes.',
      'bullets', jsonb_build_array(
        'Diseño responsive que se adapta a todos los dispositivos',
        'Paleta de colores profesional alineada a tu marca',
        'Tipografías elegantes y legibles',
        'Imágenes de alta calidad'
      ),
      'step', 1,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step2',
    'wizard',
    'Plan Presencia Web - Paso 2',
    'Información clara y organizada',
    'text',
    'Información Clara y Organizada',
    jsonb_build_object(
      'descripcion', 'Estructura tu información de manera que tus clientes encuentren rápidamente lo que buscan.',
      'bullets', jsonb_build_array(
        'Sección de servicios o productos destacados',
        'Página "Acerca de" para contar tu historia',
        'Información de contacto visible y accesible',
        'Galería de fotos de tu negocio o trabajos'
      ),
      'step', 2,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step3',
    'wizard',
    'Plan Presencia Web - Paso 3',
    'Formulario de contacto',
    'text',
    'Formulario de Contacto Integrado',
    jsonb_build_object(
      'descripcion', 'Tus clientes podrán contactarte fácilmente desde tu sitio web a cualquier hora del día.',
      'bullets', jsonb_build_array(
        'Formulario simple y fácil de usar',
        'Recibe notificaciones por email',
        'Base de datos de contactos',
        'Integración con WhatsApp Business'
      ),
      'step', 3,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step4',
    'wizard',
    'Plan Presencia Web - Paso 4',
    'Dominio incluido',
    'text',
    'Dominio .com.mx por un Año',
    jsonb_build_object(
      'descripcion', 'Incluye tu propio dominio profesional con terminación .com.mx por todo un año.',
      'bullets', jsonb_build_array(
        'Elige el nombre que represente tu negocio',
        'Dominio .com.mx incluido sin costo adicional',
        'Registro y configuración sin complicaciones',
        'Renovación sencilla al finalizar el año'
      ),
      'step', 4,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step5',
    'wizard',
    'Plan Presencia Web - Paso 5',
    'Hosting confiable',
    'text',
    'Hosting por un Año Incluido',
    jsonb_build_object(
      'descripcion', 'Alojamiento web confiable y rápido para que tu sitio esté siempre disponible.',
      'bullets', jsonb_build_array(
        'Hosting profesional por 12 meses',
        'Velocidad de carga optimizada',
        'Certificado SSL para seguridad',
        'Soporte técnico incluido'
      ),
      'step', 5,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step6',
    'wizard',
    'Plan Presencia Web - Paso 6',
    'Optimización SEO',
    'text',
    'Optimización para Buscadores (SEO)',
    jsonb_build_object(
      'descripcion', 'Tu sitio estará optimizado para que tus clientes te encuentren en Google.',
      'bullets', jsonb_build_array(
        'Configuración de palabras clave',
        'Metadatos optimizados',
        'Sitemap para Google',
        'Indexación en buscadores'
      ),
      'step', 6,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step7',
    'wizard',
    'Plan Presencia Web - Paso 7',
    'Capacitación y soporte',
    'text',
    'Capacitación y Soporte',
    jsonb_build_object(
      'descripcion', 'Te enseñamos a actualizar tu sitio web y te damos soporte continuo.',
      'bullets', jsonb_build_array(
        'Video tutorial paso a paso',
        'Manual de uso en PDF',
        'Sesión de inducción personalizada',
        'Soporte por WhatsApp'
      ),
      'step', 7,
      'total_steps', 8
    )
  ),
  (
    'wizard.plan_web.step8',
    'wizard',
    'Plan Presencia Web - Precio',
    'Inversión y precio final',
    'text',
    '¡Inversión Súper Accesible!',
    jsonb_build_object(
      'descripcion', 'Todo lo que necesitas para tener presencia profesional en internet.',
      'precio', '$3,299',
      'moneda', 'MXN',
      'frecuencia', 'Pago único',
      'incluye', jsonb_build_array(
        'Diseño web profesional',
        'Dominio .com.mx por 1 año',
        'Hosting por 1 año',
        'Formulario de contacto',
        'Optimización SEO básica',
        'Capacitación y soporte'
      ),
      'nota', 'Precio especial de lanzamiento. Oferta por tiempo limitado.',
      'step', 8,
      'total_steps', 8
    )
  )
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Plan Tienda steps (1-6) - continuing in next insert for readability
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES 
  (
    'wizard.plan_tienda.step1',
    'wizard',
    'Plan Tienda - Paso 1',
    'Catálogo de productos',
    'text',
    'Catálogo de Productos Completo',
    jsonb_build_object(
      'descripcion', 'Sistema profesional para mostrar todos tus productos con fotos, descripciones y precios.',
      'bullets', jsonb_build_array(
        'Carga ilimitada de productos',
        'Fotos en alta resolución',
        'Descripciones detalladas',
        'Organización por categorías',
        'Búsqueda y filtros'
      ),
      'step', 1,
      'total_steps', 6
    )
  ),
  (
    'wizard.plan_tienda.step2',
    'wizard',
    'Plan Tienda - Paso 2',
    'Carrito de compras',
    'text',
    'Carrito de Compras Integrado',
    jsonb_build_object(
      'descripcion', 'Tus clientes pueden agregar productos, revisar su pedido y completar la compra fácilmente.',
      'bullets', jsonb_build_array(
        'Carrito intuitivo y fácil de usar',
        'Cálculo automático de totales',
        'Opciones de envío',
        'Cupones de descuento',
        'Gestión de inventario'
      ),
      'step', 2,
      'total_steps', 6
    )
  ),
  (
    'wizard.plan_tienda.step3',
    'wizard',
    'Plan Tienda - Paso 3',
    'Pasarela de pagos',
    'text',
    'Pasarela de Pagos Segura',
    jsonb_build_object(
      'descripcion', 'Acepta pagos con tarjetas de crédito y débito de forma segura y confiable.',
      'bullets', jsonb_build_array(
        'Integración con Stripe o Mercado Pago',
        'Acepta todas las tarjetas principales',
        'Proceso de pago seguro (SSL)',
        'Confirmación automática de pedidos',
        'Panel de administración de ventas'
      ),
      'step', 3,
      'total_steps', 6
    )
  ),
  (
    'wizard.plan_tienda.step4',
    'wizard',
    'Plan Tienda - Paso 4',
    'Panel de administración',
    'text',
    'Panel de Control Completo',
    jsonb_build_object(
      'descripcion', 'Administra productos, pedidos y clientes desde un panel intuitivo y fácil de usar.',
      'bullets', jsonb_build_array(
        'Dashboard con estadísticas de ventas',
        'Gestión de pedidos en tiempo real',
        'Base de datos de clientes',
        'Reportes de ventas',
        'Actualización de inventario'
      ),
      'step', 4,
      'total_steps', 6
    )
  ),
  (
    'wizard.plan_tienda.step5',
    'wizard',
    'Plan Tienda - Paso 5',
    'Todo incluido',
    'text',
    'Paquete Todo Incluido',
    jsonb_build_object(
      'descripcion', 'Además de la tienda, incluye todo lo necesario para que empieces a vender de inmediato.',
      'bullets', jsonb_build_array(
        'Dominio .com.mx por 1 año',
        'Hosting premium por 1 año',
        'Certificado SSL de seguridad',
        'Capacitación personalizada',
        'Soporte técnico continuo',
        'Optimización SEO'
      ),
      'step', 5,
      'total_steps', 6
    )
  ),
  (
    'wizard.plan_tienda.step6',
    'wizard',
    'Plan Tienda - Precio',
    'Inversión y precio final',
    'text',
    '¡Tienda Completa a Precio Increíble!',
    jsonb_build_object(
      'descripcion', 'Todo lo que necesitas para vender en línea de forma profesional.',
      'precio', '$6,828',
      'moneda', 'MXN',
      'frecuencia', 'Pago único',
      'incluye', jsonb_build_array(
        'Tienda en línea completa',
        'Catálogo ilimitado de productos',
        'Carrito de compras',
        'Pasarela de pagos integrada',
        'Panel de administración',
        'Dominio .com.mx por 1 año',
        'Hosting premium por 1 año',
        'Capacitación y soporte'
      ),
      'nota', 'Precio especial de lanzamiento. Comienza a vender hoy mismo.',
      'step', 6,
      'total_steps', 6
    )
  )
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();

-- Post-purchase flow (9-16)
INSERT INTO content_blocks (slug, section, title, description, type, value, meta)
VALUES 
  (
    'wizard.post_compra.step9',
    'wizard',
    'Post-Compra - Paso 9',
    'Preparación para el pago',
    'text',
    '¡Excelente Decisión!',
    jsonb_build_object(
      'descripcion', 'A continuación te explicamos cómo completar tu pago de forma segura.',
      'bullets', jsonb_build_array(
        'Recibirás un link de pago por email',
        'Puedes pagar con tarjeta de crédito o débito',
        'El proceso es 100% seguro',
        'En cuanto se confirme el pago, comenzamos a trabajar'
      ),
      'step', 9,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step10',
    'wizard',
    'Post-Compra - Paso 10',
    'Confirmación de pago',
    'text',
    '¡Pago Confirmado!',
    jsonb_build_object(
      'descripcion', 'Hemos recibido tu pago exitosamente. Ahora comienza la magia.',
      'bullets', jsonb_build_array(
        'Recibirás un email de confirmación',
        'Tu proyecto comenzará en las próximas 24 horas',
        'Te contactaremos para iniciar el diseño',
        'Tiempo estimado de entrega: 7-10 días hábiles'
      ),
      'step', 10,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step11',
    'wizard',
    'Post-Compra - Paso 11',
    'Descarga app Click',
    'text',
    'Descarga la App Click',
    jsonb_build_object(
      'descripcion', 'Podrás ver y gestionar tu sitio web desde tu celular con la app oficial de Click.',
      'bullets', jsonb_build_array(
        'Disponible para iOS y Android',
        'Gestiona tu sitio desde tu celular',
        'Recibe notificaciones de contactos',
        'Actualiza contenido en cualquier momento'
      ),
      'qr_ios', 'https://apps.apple.com/mx/app/click-negocios/idXXXXXX',
      'qr_android', 'https://play.google.com/store/apps/details?id=com.click.negocios',
      'step', 11,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step12',
    'wizard',
    'Post-Compra - Paso 12',
    'Visualizar sitio en app',
    'text',
    'Cómo Ver tu Sitio en la App',
    jsonb_build_object(
      'descripcion', 'Sigue estos sencillos pasos para visualizar tu nuevo sitio web en la app Click.',
      'steps', jsonb_build_array(
        'Abre la app Click en tu celular',
        'Inicia sesión con tus credenciales',
        'Ve a la sección "Mi Sitio"',
        'Ahí podrás ver tu sitio en tiempo real'
      ),
      'step', 12,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step13',
    'wizard',
    'Post-Compra - Paso 13',
    'Acceso al portal',
    'text',
    'Portal Click - Tu Centro de Control',
    jsonb_build_object(
      'descripcion', 'Accede al Portal Click desde cualquier computadora para gestionar tu negocio digital.',
      'url_portal', 'https://portal.click.com.mx',
      'bullets', jsonb_build_array(
        'Panel de control completo',
        'Edita contenido de tu sitio',
        'Ve estadísticas de visitas',
        'Gestiona tus contactos',
        'Soporte técnico disponible'
      ),
      'step', 13,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step14',
    'wizard',
    'Post-Compra - Paso 14',
    'Llamada de inducción',
    'text',
    'Sesión de Inducción Personalizada',
    jsonb_build_object(
      'descripcion', 'Agendaremos una videollamada para explicarte cómo usar todas las herramientas.',
      'bullets', jsonb_build_array(
        'Sesión personalizada de 30 minutos',
        'Te enseñamos a usar el portal',
        'Respondemos todas tus dudas',
        'Recibirás grabación de la sesión'
      ),
      'link_soporte', 'https://wa.me/52XXXXXXXXXX',
      'step', 14,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step15',
    'wizard',
    'Post-Compra - Paso 15',
    'Subir evidencia',
    'text',
    'Comparte tu Experiencia',
    jsonb_build_object(
      'descripcion', 'Ayúdanos subiendo fotos o capturas de pantalla del proceso de compra.',
      'bullets', jsonb_build_array(
        'Sube comprobante de pago (opcional)',
        'Comparte capturas de pantalla',
        'Formatos aceptados: JPG, PNG, PDF',
        'Tamaño máximo: 5MB por archivo'
      ),
      'step', 15,
      'total_steps', 16
    )
  ),
  (
    'wizard.post_compra.step16',
    'wizard',
    'Post-Compra - Paso 16',
    'Mensaje final',
    'text',
    '¡Gracias por tu Confianza!',
    jsonb_build_object(
      'descripcion', 'Estamos emocionados de acompañarte en esta transformación digital. Tu éxito es nuestro éxito.',
      'mensaje_final', 'En los próximos días recibirás noticias sobre el avance de tu proyecto. Mientras tanto, descarga la app y explora el portal.',
      'cta_text', 'Volver al Inicio',
      'step', 16,
      'total_steps', 16
    )
  )
ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();
