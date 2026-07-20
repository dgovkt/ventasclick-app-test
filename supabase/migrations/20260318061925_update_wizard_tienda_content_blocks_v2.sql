/*
  # Update Wizard Tienda en Línea Content Blocks (v2)

  ## Summary
  Updates content blocks for screens 19-27 of the Tienda en Línea wizard flow
  to match the new screen structure with plan selection and individual plan detail screens.

  ## Changes

  ### Updated Screens
  - wizard.screen_19: Plan selection (Básico/Esencial/Premium)
  - wizard.screen_20: Plan Básico details ($3,999 MXN)
  - wizard.screen_21: Plan Esencial details ($5,999 MXN)
  - wizard.screen_22: Plan Premium details ($9,999 MXN)
  - wizard.screen_24: Payment Esencial screen
  - wizard.screen_25: Payment Premium screen

  ### New Screens
  - wizard.screen_23: Payment Básico screen
  - wizard.screen_26: Payment success Tienda
  - wizard.screen_27: Thank you Tienda (final screen)
*/

UPDATE content_blocks
SET
  title = 'Pantalla 19 - Selección de Plan Tienda en Línea',
  description = 'Pantalla para seleccionar entre Plan Básico, Esencial o Premium.',
  value = 'Selecciona el plan que mejor se adapta al negocio',
  meta = jsonb_build_object(
    'subtitulo', 'Elige el plan ideal para comenzar a vender en línea',
    'plan_basico_nombre', 'Plan Básico',
    'plan_basico_precio', '$3,999 MXN',
    'plan_basico_descripcion', 'Ideal para negocios que comienzan a vender en línea',
    'plan_esencial_nombre', 'Plan Esencial',
    'plan_esencial_precio', '$5,999 MXN',
    'plan_esencial_descripcion', 'Para negocios que quieren crecer con más herramientas',
    'plan_premium_nombre', 'Plan Premium',
    'plan_premium_precio', '$9,999 MXN',
    'plan_premium_descripcion', 'La solución completa para maximizar las ventas en línea',
    'cta_seleccionar', 'Seleccionar'
  )
WHERE slug = 'wizard.screen_19';

UPDATE content_blocks
SET
  title = 'Pantalla 20 - Plan Básico Tienda en Línea',
  description = 'Detalle del Plan Básico con precio y beneficios.',
  value = 'Plan Básico Tienda en Línea',
  meta = jsonb_build_object(
    'precio', '$3,999 MXN',
    'frecuencia', 'Pago anual',
    'subtitulo', 'Todo lo que necesitas para empezar a vender en línea',
    'descripcion', 'Dile al dueño del negocio que puede adquirir su Plan Básico ahora mismo. Si no está listo para adquirirlo, pídele que deje sus datos para contactarlo posteriormente.',
    'bullets', jsonb_build_array(
      'Tienda en línea diseñada y lista para vender',
      'Catálogo de hasta 100 productos',
      'Pasarela de pagos integrada',
      'Integración con redes sociales',
      'Soporte técnico incluido'
    ),
    'cta_primario', 'Adquirir plan ahora',
    'cta_secundario', 'Quiere dejar sus datos'
  )
WHERE slug = 'wizard.screen_20';

UPDATE content_blocks
SET
  title = 'Pantalla 21 - Plan Esencial Tienda en Línea',
  description = 'Detalle del Plan Esencial con precio y beneficios.',
  value = 'Plan Esencial Tienda en Línea',
  meta = jsonb_build_object(
    'precio', '$5,999 MXN',
    'frecuencia', 'Pago anual',
    'subtitulo', 'Más herramientas para hacer crecer tu negocio en línea',
    'descripcion', 'Dile al dueño del negocio que puede adquirir su Plan Esencial ahora mismo. Si no está listo para adquirirlo, pídele que deje sus datos para contactarlo posteriormente.',
    'bullets', jsonb_build_array(
      'Todo lo del Plan Básico',
      'Catálogo de hasta 250 productos',
      'Cupones de descuento y tarjetas de regalo',
      'Integración con paqueterías',
      'Reportes de ventas avanzados',
      'Soporte prioritario'
    ),
    'cta_primario', 'Adquirir plan ahora',
    'cta_secundario', 'Quiere dejar sus datos'
  )
WHERE slug = 'wizard.screen_21';

UPDATE content_blocks
SET
  title = 'Pantalla 22 - Plan Premium Tienda en Línea',
  description = 'Detalle del Plan Premium con precio y beneficios.',
  value = 'Plan Premium Tienda en Línea',
  meta = jsonb_build_object(
    'precio', '$9,999 MXN',
    'frecuencia', 'Pago anual',
    'subtitulo', 'La solución completa para maximizar tus ventas en línea',
    'descripcion', 'Dile al dueño del negocio que puede adquirir su Plan Premium ahora mismo. Si no está listo para adquirirlo, pídele que deje sus datos para contactarlo posteriormente.',
    'bullets', jsonb_build_array(
      'Todo lo del Plan Esencial',
      'Catálogo ilimitado de productos',
      'Multitienda (vende en varias plataformas)',
      'Campañas de email marketing',
      'Gestión de inventario avanzada',
      'Consultor de ventas dedicado',
      'Soporte 24/7'
    ),
    'cta_primario', 'Adquirir plan ahora',
    'cta_secundario', 'Quiere dejar sus datos'
  )
WHERE slug = 'wizard.screen_22';

UPDATE content_blocks
SET
  title = 'Pantalla 24 - Pago Plan Esencial Tienda en Línea',
  description = 'Pantalla de pago con Chargebee para el Plan Esencial.',
  value = '¡Felicidades! Estás a punto de concretar una venta.',
  meta = jsonb_build_object(
    'descripcion', 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Esencial Tienda en Línea.',
    'instruccion', 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?',
    'chargebee_item', 'tienda-esencial-anual',
    'cta_pago', 'Activar Plan Esencial',
    'cta_primario', 'Continuar'
  )
WHERE slug = 'wizard.screen_24';

UPDATE content_blocks
SET
  title = 'Pantalla 25 - Pago Plan Premium Tienda en Línea',
  description = 'Pantalla de pago con Chargebee para el Plan Premium.',
  value = '¡Felicidades! Estás a punto de concretar una venta.',
  meta = jsonb_build_object(
    'descripcion', 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Premium Tienda en Línea.',
    'instruccion', 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?',
    'chargebee_item', 'tienda-premium-anual',
    'cta_pago', 'Activar Plan Premium',
    'cta_primario', 'Continuar'
  )
WHERE slug = 'wizard.screen_25';

INSERT INTO content_blocks (slug, section, title, description, value, meta)
VALUES (
  'wizard.screen_23',
  'wizard',
  'Pantalla 23 - Pago Plan Básico Tienda en Línea',
  'Pantalla de pago con Chargebee para el Plan Básico.',
  '¡Felicidades! Estás a punto de concretar una venta.',
  jsonb_build_object(
    'descripcion', 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Básico Tienda en Línea.',
    'instruccion', 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?',
    'chargebee_item', 'tienda-basico-anual',
    'cta_pago', 'Activar Plan Básico',
    'cta_primario', 'Continuar'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta;

INSERT INTO content_blocks (slug, section, title, description, value, meta)
VALUES (
  'wizard.screen_26',
  'wizard',
  'Pantalla 26 - Pago exitoso Tienda en Línea',
  'Confirmación de pago exitoso para el plan Tienda en Línea.',
  '¡Listo! El pago del Plan Tienda en Línea fue registrado con éxito.',
  jsonb_build_object(
    'descripcion', 'El dueño del negocio ya tiene su Tienda en Línea activa. En los próximos días recibirá acceso a su tienda lista para vender.',
    'instruccion', 'Comunícale que nuestro equipo se pondrá en contacto para agendar su llamada de onboarding.',
    'cta_primario', 'Finalizar'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta;

INSERT INTO content_blocks (slug, section, title, description, value, meta)
VALUES (
  'wizard.screen_27',
  'wizard',
  'Pantalla 27 - Gracias Tienda en Línea',
  'Pantalla final de agradecimiento para el flujo Tienda en Línea.',
  '¡Gracias por ayudar a un dueño de negocio a vender en línea!',
  jsonb_build_object(
    'cta_primario', 'Volver a menú principal'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta;
