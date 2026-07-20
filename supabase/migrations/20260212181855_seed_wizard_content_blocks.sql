/*
  # Seed wizard content blocks

  1. Changes
    - Add all content blocks for wizard flow
    - Includes diagnostic options, plan steps, and pricing
  
  2. Content Structure
    - wizard.step1.* - Diagnostic step
    - wizard.plan_web.* - Presencia Web plan flow (8 steps)
    - wizard.plan_tienda.* - Tienda en Línea plan flow (6 steps)
*/

INSERT INTO content_blocks (slug, section, title, description, type, value) VALUES
  ('wizard.step1.title', 'wizard', 'Título del diagnóstico inicial', 'Pregunta principal del primer paso', 'text', '¿Cómo vende actualmente tu negocio?'),
  
  ('wizard.step1.optionA.title', 'wizard', 'Opción A - Título', 'Primera opción de diagnóstico', 'text', 'Solo recibo llamadas o WhatsApp'),
  ('wizard.step1.optionA.description', 'wizard', 'Opción A - Descripción', 'Descripción de la primera opción', 'text', 'No tengo presencia digital. Mis clientes me contactan solo por teléfono o mensajes.'),
  
  ('wizard.step1.optionB.title', 'wizard', 'Opción B - Título', 'Segunda opción de diagnóstico', 'text', 'Tengo redes sociales'),
  ('wizard.step1.optionB.description', 'wizard', 'Opción B - Descripción', 'Descripción de la segunda opción', 'text', 'Uso Facebook, Instagram u otras redes para mostrar mis productos pero no tengo sitio web.'),
  
  ('wizard.step1.optionC.title', 'wizard', 'Opción C - Título', 'Tercera opción de diagnóstico', 'text', 'Vendo productos físicos o digitales'),
  ('wizard.step1.optionC.description', 'wizard', 'Opción C - Descripción', 'Descripción de la tercera opción', 'text', 'Necesito mostrar catálogo de productos y procesar pedidos en línea.'),
  
  ('wizard.step1.optionD.title', 'wizard', 'Opción D - Título', 'Cuarta opción de diagnóstico', 'text', 'Ya vendo en línea pero necesito mejorar'),
  ('wizard.step1.optionD.description', 'wizard', 'Opción D - Descripción', 'Descripción de la cuarta opción', 'text', 'Tengo un sitio básico o vendo por redes, pero quiero profesionalizar mi negocio.')

ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;

INSERT INTO content_blocks (slug, section, title, description, type, value) VALUES
  ('wizard.plan_web.step1.title', 'wizard', 'Plan Presencia Web - Paso 1 Título', 'Título del paso 1', 'text', 'Tu Sitio Web Profesional'),
  ('wizard.plan_web.step1.description', 'wizard', 'Plan Presencia Web - Paso 1 Descripción', 'Descripción del paso 1', 'text', 'Crea una presencia digital profesional para tu negocio'),
  ('wizard.plan_web.step1.bullets', 'wizard', 'Plan Presencia Web - Paso 1 Bullets', 'Lista de beneficios del paso 1', 'text', E'Diseño profesional adaptado a tu marca\nVisible las 24 horas, los 7 días de la semana\nAccesible desde cualquier dispositivo\nOptimizado para buscadores (SEO)'),
  
  ('wizard.plan_web.step2.title', 'wizard', 'Plan Presencia Web - Paso 2 Título', 'Título del paso 2', 'text', 'Portal Click'),
  ('wizard.plan_web.step2.description', 'wizard', 'Plan Presencia Web - Paso 2 Descripción', 'Descripción del paso 2', 'text', 'Gestiona tu sitio web desde cualquier lugar'),
  ('wizard.plan_web.step2.bullets', 'wizard', 'Plan Presencia Web - Paso 2 Bullets', 'Lista de beneficios del paso 2', 'text', E'Actualiza tu información en tiempo real\nSube fotos y contenido fácilmente\nRevisa estadísticas de visitas\nSin necesidad de conocimientos técnicos'),
  
  ('wizard.plan_web.step3.title', 'wizard', 'Plan Presencia Web - Paso 3 Título', 'Título del paso 3', 'text', 'App Móvil Click'),
  ('wizard.plan_web.step3.description', 'wizard', 'Plan Presencia Web - Paso 3 Descripción', 'Descripción del paso 3', 'text', 'Administra tu negocio desde tu celular'),
  ('wizard.plan_web.step3.bullets', 'wizard', 'Plan Presencia Web - Paso 3 Bullets', 'Lista de beneficios del paso 3', 'text', E'Disponible para iOS y Android\nActualiza contenido al instante\nRecibe notificaciones de nuevos contactos\nControl total desde tu móvil'),
  
  ('wizard.plan_web.step4.title', 'wizard', 'Plan Presencia Web - Paso 4 Título', 'Título del paso 4', 'text', 'Tarjetas NFC'),
  ('wizard.plan_web.step4.description', 'wizard', 'Plan Presencia Web - Paso 4 Descripción', 'Descripción del paso 4', 'text', 'Comparte tu negocio con un simple toque'),
  ('wizard.plan_web.step4.bullets', 'wizard', 'Plan Presencia Web - Paso 4 Bullets', 'Lista de beneficios del paso 4', 'text', E'Tecnología de proximidad sin contacto\nComparte tu sitio al acercar el celular\nMás profesional que una tarjeta tradicional\nSin apps adicionales requeridas'),
  
  ('wizard.plan_web.step5.title', 'wizard', 'Plan Presencia Web - Paso 5 Título', 'Título del paso 5', 'text', 'Dominio Propio'),
  ('wizard.plan_web.step5.description', 'wizard', 'Plan Presencia Web - Paso 5 Descripción', 'Descripción del paso 5', 'text', 'Tu marca, tu identidad en Internet'),
  ('wizard.plan_web.step5.bullets', 'wizard', 'Plan Presencia Web - Paso 5 Bullets', 'Lista de beneficios del paso 5', 'text', E'Dominio .com o .mx incluido\nCorreos corporativos profesionales\nMayor credibilidad ante clientes\nFácil de recordar y compartir'),
  
  ('wizard.plan_web.step6.title', 'wizard', 'Plan Presencia Web - Paso 6 Título', 'Título del paso 6', 'text', 'Soporte Premium'),
  ('wizard.plan_web.step6.description', 'wizard', 'Plan Presencia Web - Paso 6 Descripción', 'Descripción del paso 6', 'text', 'Nunca estarás solo en este camino'),
  ('wizard.plan_web.step6.bullets', 'wizard', 'Plan Presencia Web - Paso 6 Bullets', 'Lista de beneficios del paso 6', 'text', E'Asistencia técnica vía WhatsApp\nActualizaciones y mantenimiento incluido\nCapacitación personalizada\nResolución rápida de problemas'),
  
  ('wizard.plan_web.step7.title', 'wizard', 'Plan Presencia Web - Paso 7 Título', 'Título del paso 7', 'text', 'Activación Rápida'),
  ('wizard.plan_web.step7.description', 'wizard', 'Plan Presencia Web - Paso 7 Descripción', 'Descripción del paso 7', 'text', 'Tu sitio listo en tiempo récord'),
  ('wizard.plan_web.step7.bullets', 'wizard', 'Plan Presencia Web - Paso 7 Bullets', 'Lista de beneficios del paso 7', 'text', E'Lanzamiento en 5-7 días hábiles\nProceso guiado paso a paso\nCapacitación en el uso de tu portal\nAcompañamiento personalizado'),
  
  ('wizard.plan_web.step8.title', 'wizard', 'Plan Presencia Web - Paso 8 Título', 'Título del paso 8', 'text', 'Inversión'),
  ('wizard.plan_web.step8.description', 'wizard', 'Plan Presencia Web - Paso 8 Descripción', 'Descripción del paso 8', 'text', 'Todo lo que necesitas en un solo paquete'),
  ('wizard.plan_web.step8.bullets', 'wizard', 'Plan Presencia Web - Paso 8 Bullets', 'Lista de beneficios del paso 8', 'text', E'Sitio web profesional\nPortal y App de administración\nTarjetas NFC\nDominio y hosting\nSoporte premium'),
  
  ('wizard.plan_web.price_copy', 'wizard', 'Precio Plan Presencia Web', 'Precio mostrado en el wizard', 'text', '$3,299 MXN')

ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;

INSERT INTO content_blocks (slug, section, title, description, type, value) VALUES
  ('wizard.plan_tienda.step1.title', 'wizard', 'Plan Tienda - Paso 1 Título', 'Título del paso 1', 'text', 'Tu Tienda en Línea Completa'),
  ('wizard.plan_tienda.step1.description', 'wizard', 'Plan Tienda - Paso 1 Descripción', 'Descripción del paso 1', 'text', 'Vende en línea las 24 horas del día'),
  ('wizard.plan_tienda.step1.bullets', 'wizard', 'Plan Tienda - Paso 1 Bullets', 'Lista de beneficios del paso 1', 'text', E'Diseño profesional para e-commerce\nCarrito de compras integrado\nProcesamiento de pagos en línea\nGestión completa de pedidos'),
  
  ('wizard.plan_tienda.step2.title', 'wizard', 'Plan Tienda - Paso 2 Título', 'Título del paso 2', 'text', 'Catálogo hasta 250 Productos'),
  ('wizard.plan_tienda.step2.description', 'wizard', 'Plan Tienda - Paso 2 Descripción', 'Descripción del paso 2', 'text', 'Espacio suficiente para hacer crecer tu negocio'),
  ('wizard.plan_tienda.step2.bullets', 'wizard', 'Plan Tienda - Paso 2 Bullets', 'Lista de beneficios del paso 2', 'text', E'Hasta 250 productos con múltiples fotos\nCategorías y filtros de búsqueda\nVariantes de productos (tallas, colores, etc.)\nControl de inventario en tiempo real'),
  
  ('wizard.plan_tienda.step3.title', 'wizard', 'Plan Tienda - Paso 3 Título', 'Título del paso 3', 'text', 'Integración con Redes Sociales'),
  ('wizard.plan_tienda.step3.description', 'wizard', 'Plan Tienda - Paso 3 Descripción', 'Descripción del paso 3', 'text', 'Conecta tu tienda con tus plataformas favoritas'),
  ('wizard.plan_tienda.step3.bullets', 'wizard', 'Plan Tienda - Paso 3 Bullets', 'Lista de beneficios del paso 3', 'text', E'Sincroniza con Facebook e Instagram\nPublica productos automáticamente\nGestiona todo desde un solo lugar\nAumenta tu alcance exponencialmente'),
  
  ('wizard.plan_tienda.step4.title', 'wizard', 'Plan Tienda - Paso 4 Título', 'Título del paso 4', 'text', 'Sistema de Cupones y Descuentos'),
  ('wizard.plan_tienda.step4.description', 'wizard', 'Plan Tienda - Paso 4 Descripción', 'Descripción del paso 4', 'text', 'Herramientas para impulsar tus ventas'),
  ('wizard.plan_tienda.step4.bullets', 'wizard', 'Plan Tienda - Paso 4 Bullets', 'Lista de beneficios del paso 4', 'text', E'Crea cupones de descuento personalizados\nOfertas por tiempo limitado\nDescuentos por volumen\nPromociones especiales para clientes frecuentes'),
  
  ('wizard.plan_tienda.step5.title', 'wizard', 'Plan Tienda - Paso 5 Título', 'Título del paso 5', 'text', 'Todo lo del Plan Presencia Web'),
  ('wizard.plan_tienda.step5.description', 'wizard', 'Plan Tienda - Paso 5 Descripción', 'Descripción del paso 5', 'text', 'Incluye todas las funcionalidades del plan básico'),
  ('wizard.plan_tienda.step5.bullets', 'wizard', 'Plan Tienda - Paso 5 Bullets', 'Lista de beneficios del paso 5', 'text', E'Portal y App de administración\nTarjetas NFC incluidas\nDominio propio y correos corporativos\nSoporte premium\nCapacitación personalizada'),
  
  ('wizard.plan_tienda.step6.title', 'wizard', 'Plan Tienda - Paso 6 Título', 'Título del paso 6', 'text', 'Inversión'),
  ('wizard.plan_tienda.step6.description', 'wizard', 'Plan Tienda - Paso 6 Descripción', 'Descripción del paso 6', 'text', 'La solución completa para vender en línea'),
  ('wizard.plan_tienda.step6.bullets', 'wizard', 'Plan Tienda - Paso 6 Bullets', 'Lista de beneficios del paso 6', 'text', E'Tienda en línea completa\nHasta 250 productos\nPasarela de pagos\nIntegración con redes sociales\nSistema de cupones\nTodo lo del Plan Presencia Web'),
  
  ('wizard.plan_tienda.price_copy', 'wizard', 'Precio Plan Tienda en Línea', 'Precio mostrado en el wizard', 'text', '$6,828 MXN')

ON CONFLICT (slug) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;
