/*
  # Seed additional content blocks for landing and info pages

  1. Changes
    - Insert additional content blocks for landing page (benefits and plans)
    - Insert content blocks for info page
  
  2. Content Structure
    - Landing page benefits section
    - Landing page plans section
    - Info page sections
*/

INSERT INTO content_blocks (slug, section, title, description, type, value) VALUES
  ('landing.benefits.title', 'landing', 'Título de beneficios', 'Título de la sección de beneficios', 'text', '¿Por qué ser Socio Ventas Click?'),
  ('landing.benefits.subtitle', 'landing', 'Subtítulo de beneficios', 'Descripción de la sección de beneficios', 'text', 'Obtén todas las herramientas y el respaldo para hacer crecer tu negocio'),
  ('landing.benefits.1.title', 'landing', 'Beneficio 1: Título', 'Sin inversión inicial', 'text', 'Sin Inversión Inicial'),
  ('landing.benefits.1.description', 'landing', 'Beneficio 1: Descripción', 'Descripción del primer beneficio', 'text', 'Comienza a vender sin necesidad de capital. Solo necesitas tu entusiasmo y ganas de crecer.'),
  ('landing.benefits.2.title', 'landing', 'Beneficio 2: Título', 'Comisiones competitivas', 'text', 'Comisiones Competitivas'),
  ('landing.benefits.2.description', 'landing', 'Beneficio 2: Descripción', 'Descripción del segundo beneficio', 'text', 'Gana comisiones atractivas por cada venta que realices. Tu esfuerzo se traduce en ingresos.'),
  ('landing.benefits.3.title', 'landing', 'Beneficio 3: Título', 'Gestión simplificada', 'text', 'Gestión Simplificada'),
  ('landing.benefits.3.description', 'landing', 'Beneficio 3: Descripción', 'Descripción del tercer beneficio', 'text', 'Administra tus leads, ventas y comisiones desde una sola plataforma fácil de usar.'),
  ('landing.benefits.4.title', 'landing', 'Beneficio 4: Título', 'Soporte completo', 'text', 'Soporte Completo'),
  ('landing.benefits.4.description', 'landing', 'Beneficio 4: Descripción', 'Descripción del cuarto beneficio', 'text', 'Recibe capacitación, materiales de venta y acompañamiento para cerrar más negocios.'),
  ('landing.plans.title', 'landing', 'Título de planes', 'Título de la sección de planes', 'text', 'Nuestros Planes de Venta'),
  ('landing.plans.subtitle', 'landing', 'Subtítulo de planes', 'Descripción de la sección de planes', 'text', 'Dos soluciones digitales completas que puedes ofrecer a tus clientes'),
  ('landing.plans.presencia.title', 'landing', 'Plan Presencia Web: Título', 'Nombre del plan presencia web', 'text', 'Plan Presencia Web'),
  ('landing.plans.presencia.price', 'landing', 'Plan Presencia Web: Precio', 'Precio anual del plan', 'text', '$3,299/año'),
  ('landing.plans.presencia.description', 'landing', 'Plan Presencia Web: Descripción', 'Descripción del plan presencia web', 'text', 'Perfecto para negocios que necesitan establecer su presencia profesional en línea'),
  ('landing.plans.tienda.title', 'landing', 'Plan Tienda en Línea: Título', 'Nombre del plan tienda en línea', 'text', 'Plan Tienda en Línea'),
  ('landing.plans.tienda.price', 'landing', 'Plan Tienda en Línea: Precio', 'Precio anual del plan tienda', 'text', '$6,828/año'),
  ('landing.plans.tienda.description', 'landing', 'Plan Tienda en Línea: Descripción', 'Descripción del plan tienda en línea', 'text', 'La solución completa para negocios que desean vender sus productos en línea'),
  ('info.hero.title', 'info', 'Título del hero en página Info', 'Título principal de la página Info', 'text', 'Cómo Funciona Ser Socio Ventas Click'),
  ('info.hero.subtitle', 'info', 'Subtítulo del hero en página Info', 'Descripción de la página Info', 'text', 'Descubre todo lo que necesitas saber para iniciar tu camino como socio exitoso'),
  ('info.how_it_works.title', 'info', 'Título de cómo funciona', 'Título de la sección cómo funciona', 'text', '¿Cómo Funciona?'),
  ('info.how_it_works.subtitle', 'info', 'Subtítulo de cómo funciona', 'Descripción de la sección', 'text', 'Un proceso simple en 4 pasos para comenzar a generar ingresos'),
  ('info.steps.1.title', 'info', 'Paso 1: Título', 'Título del primer paso', 'text', '1. Regístrate Gratis'),
  ('info.steps.1.description', 'info', 'Paso 1: Descripción', 'Descripción del primer paso', 'text', 'Completa el formulario de registro y crea tu cuenta. No requiere inversión ni experiencia previa.'),
  ('info.steps.2.title', 'info', 'Paso 2: Título', 'Título del segundo paso', 'text', '2. Recibe Capacitación'),
  ('info.steps.2.description', 'info', 'Paso 2: Descripción', 'Descripción del segundo paso', 'text', 'Accede a materiales de capacitación, aprende sobre nuestros planes y técnicas de venta efectivas.'),
  ('info.steps.3.title', 'info', 'Paso 3: Título', 'Título del tercer paso', 'text', '3. Genera Leads'),
  ('info.steps.3.description', 'info', 'Paso 3: Descripción', 'Descripción del tercer paso', 'text', 'Identifica negocios que necesiten presencia web y regístralos en tu panel. Gestiona el seguimiento desde nuestra plataforma.'),
  ('info.steps.4.title', 'info', 'Paso 4: Título', 'Título del cuarto paso', 'text', '4. Cierra y Gana'),
  ('info.steps.4.description', 'info', 'Paso 4: Descripción', 'Descripción del cuarto paso', 'text', 'Cuando cierres una venta, registra el cierre en el sistema y recibe tu comisión. Así de simple.'),
  ('info.benefits.title', 'info', 'Título de beneficios en Info', 'Título de la sección de beneficios', 'text', 'Beneficios de Ser Socio'),
  ('info.benefits.subtitle', 'info', 'Subtítulo de beneficios en Info', 'Descripción de beneficios', 'text', 'Todo lo que obtienes al unirte a nuestra red'),
  ('info.examples.title', 'info', 'Título de ejemplos', 'Título de la sección de ejemplos', 'text', 'Ejemplos de Negocio'),
  ('info.examples.subtitle', 'info', 'Subtítulo de ejemplos', 'Descripción de ejemplos', 'text', 'Tipos de negocios que puedes ayudar con nuestras soluciones'),
  ('info.examples.1.title', 'info', 'Ejemplo 1: Título', 'Restaurantes y cafeterías', 'text', 'Restaurantes y Cafeterías'),
  ('info.examples.1.description', 'info', 'Ejemplo 1: Descripción', 'Descripción del primer ejemplo', 'text', 'Ayuda a restaurantes a tener su menú en línea, recibir pedidos y establecer presencia digital.'),
  ('info.examples.2.title', 'info', 'Ejemplo 2: Título', 'Tiendas de retail', 'text', 'Tiendas de Retail'),
  ('info.examples.2.description', 'info', 'Ejemplo 2: Descripción', 'Descripción del segundo ejemplo', 'text', 'Lleva tiendas físicas al mundo digital con tiendas en línea completas y sistemas de pago integrados.'),
  ('info.examples.3.title', 'info', 'Ejemplo 3: Título', 'Profesionales independientes', 'text', 'Profesionales Independientes'),
  ('info.examples.3.description', 'info', 'Ejemplo 3: Descripción', 'Descripción del tercer ejemplo', 'text', 'Diseñadores, abogados, consultores y más pueden tener su portafolio y contacto profesional en línea.'),
  ('info.examples.4.title', 'info', 'Ejemplo 4: Título', 'Servicios locales', 'text', 'Servicios Locales'),
  ('info.examples.4.description', 'info', 'Ejemplo 4: Descripción', 'Descripción del cuarto ejemplo', 'text', 'Plomeros, electricistas, jardineros pueden mostrar sus servicios y recibir solicitudes de presupuesto.'),
  ('info.cta.title', 'info', 'Título del CTA en Info', 'Título del call to action', 'text', '¿Listo para Comenzar?'),
  ('info.cta.subtitle', 'info', 'Subtítulo del CTA en Info', 'Descripción del call to action', 'text', 'Únete hoy y empieza a construir tu futuro como socio Ventas Click')
ON CONFLICT (slug) DO NOTHING;
