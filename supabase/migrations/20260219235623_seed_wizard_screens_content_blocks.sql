/*
  # Seed Wizard Screens Content Blocks

  ## Summary
  Seeds all wizard screen content into the content_blocks table so each screen
  can be edited from the admin panel without touching code.

  ## Content Structure
  - section = 'wizard'
  - value = main heading or primary text of the screen
  - meta = JSON with all other editable fields per screen:
    - subtitulo: secondary heading
    - descripcion: body paragraph text
    - bullets: array of bullet point strings
    - dato_importante: highlighted stat/tip text
    - link_texto: call-to-action link text
    - link_url: call-to-action link URL
    - precio: price string
    - frecuencia: payment frequency string
    - cta_primario: primary button label
    - cta_secundario: secondary button label

  ## Screens covered
  - screen_1: Welcome / Bienvenida
  - screen_2: Diagnostico (question + 4 options)
  - screen_3: Confirmation for Plan Presencia Web
  - screen_4 to screen_7: Plan Presencia Web benefits
  - screen_8: Plan Presencia Web pricing + CTA
  - screen_9 to screen_16: Post-purchase onboarding (shared)
  - screen_17: Prospecto data form
  - screen_18: Confirmation for Plan Tienda en Linea
  - screen_19 to screen_22: Plan Tienda en Linea benefits
  - screen_24: Plan Tienda en Linea pricing + CTA
*/

INSERT INTO content_blocks (slug, section, title, description, type, locale, value, meta)
VALUES

-- Screen 1: Bienvenida
(
  'wizard.screen_1',
  'wizard',
  'Pantalla 1 - Bienvenida',
  'Pantalla de bienvenida del wizard. Fondo oscuro con imagen.',
  'text',
  'es-MX',
  'Hola,',
  '{"subtitulo": "Estás por ayudar a un negocio a dar su siguiente paso al mundo digital.", "descripcion": "¡Comencemos por descubrir juntos qué solución de Ventas Click necesita!", "cta_primario": "Comenzar diagnóstico"}'::jsonb
),

-- Screen 2: Diagnostico - titulo y pregunta
(
  'wizard.screen_2.titulo',
  'wizard',
  'Pantalla 2 - Título del diagnóstico',
  'Instrucción y pregunta principal de la pantalla de diagnóstico.',
  'text',
  'es-MX',
  'Pregunta al dueño del negocio:',
  '{"pregunta": "¿Cómo vende actualmente tu negocio?"}'::jsonb
),

-- Screen 2: Opción A
(
  'wizard.screen_2.opcion_a',
  'wizard',
  'Pantalla 2 - Opción A',
  'Primera opción del diagnóstico (lleva a Plan Presencia Web).',
  'text',
  'es-MX',
  'A: No tengo página web. Solo uso redes sociales o WhatsApp.',
  '{"descripcion": "Publico en redes o mando información por WhatsApp, pero no tengo un sitio donde toda mi información esté ordenada.", "cta": "Seleccionar", "plan": "presencia_web"}'::jsonb
),

-- Screen 2: Opción B
(
  'wizard.screen_2.opcion_b',
  'wizard',
  'Pantalla 2 - Opción B',
  'Segunda opción del diagnóstico (lleva a Plan Presencia Web).',
  'text',
  'es-MX',
  'B: Ya tengo página web, pero está desactualizada o no puedo editarla.',
  '{"descripcion": "Mi sitio está viejo, carga lento, no muestra info actual y dependo de un tercero para hacer cambios.", "cta": "Seleccionar", "plan": "presencia_web"}'::jsonb
),

-- Screen 2: Opción C
(
  'wizard.screen_2.opcion_c',
  'wizard',
  'Pantalla 2 - Opción C',
  'Tercera opción del diagnóstico (lleva a Plan Presencia Web).',
  'text',
  'es-MX',
  'C: Tengo negocio local pero no tengo presencia en Internet',
  '{"descripcion": "La gente no encuentra mi negocio cuando lo busca en Google.", "cta": "Seleccionar", "plan": "presencia_web"}'::jsonb
),

-- Screen 2: Opción D
(
  'wizard.screen_2.opcion_d',
  'wizard',
  'Pantalla 2 - Opción D',
  'Cuarta opción del diagnóstico (lleva a Plan Tienda en Línea).',
  'text',
  'es-MX',
  'D: Vendo mis productos por WhatsApp/redes y quiero que mis clientes compren directo en línea.',
  '{"descripcion": "Quiero carrito, pagos, catálogo, y que la gente compre sin depender de mí.", "cta": "Seleccionar", "plan": "tienda_en_linea"}'::jsonb
),

-- Screen 3: Confirmación Plan Presencia Web
(
  'wizard.screen_3',
  'wizard',
  'Pantalla 3 - Confirmación Plan Presencia Web',
  'Pantalla de confirmación tras seleccionar opción A, B o C.',
  'text',
  'es-MX',
  '¡Listo! Ya detectamos qué necesita este negocio.',
  '{"descripcion": "Este cliente requiere una presencia profesional en internet para que más personas lo encuentren, lo conozcan y le tengan confianza.", "subtitulo": "¡Vamos a decirle paso a paso qué incluye el Plan Presencia Web!", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 4: Plan Presencia Web - Beneficio 1 (Sitio web)
(
  'wizard.screen_4',
  'wizard',
  'Pantalla 4 - Sitio web profesional',
  'Primer beneficio del Plan Presencia Web.',
  'text',
  'es-MX',
  '1. Sitio web profesional',
  '{"subtitulo": "Sitio web profesional con toda la información del negocio.", "bullets": ["Quién eres", "Qué haces", "Horarios", "Ubicación", "Galería de fotos", "Formulario para recibir mensajes"], "descripcion": "Es muy fácil de actualizar, incluso desde el celular. No necesitas conocimientos técnicos; es tan simple como subir una foto a Facebook.", "dato_importante": "Los negocios con sitio web generan hasta 70% más confianza que los que solo tienen redes sociales.", "link_texto": "Para mostrar ejemplos de sitios web, da clic aquí.", "link_url": "", "plan_label": "El plan Presencia Web incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 5: Plan Presencia Web - Beneficio 2 (Portal Click)
(
  'wizard.screen_5',
  'wizard',
  'Pantalla 5 - Portal Click',
  'Segundo beneficio del Plan Presencia Web.',
  'text',
  'es-MX',
  '2. Portal Click',
  '{"subtitulo": "Portal Click es una página donde tu negocio reúne todos los enlaces del negocio.", "bullets": ["Centraliza toda la información del negocio: Facebook, Instagram, TikTok, WhatsApp, dirección, horario, enlaces importantes y tu sitio web.", "Incluye un botón para dejar reseñas en Google, lo que potencia la reputación del negocio.", "Tiene un botón único para \"Guardar Contacto\", así tus clientes guardan tus datos sin usar tarjetas impresas."], "dato_importante": "Un enlace único aumenta la probabilidad de que te escriban o te visiten y finalmente te compren.", "link_texto": "Para mostrar cómo funciona Portal Click da clic aquí.", "link_url": "", "plan_label": "El plan Presencia Web incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 6: Plan Presencia Web - Beneficio 3 (App móvil)
(
  'wizard.screen_6',
  'wizard',
  'Pantalla 6 - Aplicación móvil Ventas Click',
  'Tercer beneficio del Plan Presencia Web.',
  'text',
  'es-MX',
  '3. Aplicación móvil Ventas Click',
  '{"subtitulo": "Aplicación móvil para administrar todo desde un solo lugar", "bullets": ["Desde tu celular puedes actualizar tu sitio web en segundos: cambiar fotos, textos, horarios o datos de contacto sin depender de nadie.", "También puedes editar tu Portal Click: agregar o quitar enlaces, cambiar redes sociales, actualizar tu link de reseñas o tu botón de guardar contacto.", "Además, puedes organizar tus contactos, dar seguimiento a tus clientes y contestar las reseñas que te dejan en Google, todo desde la App."], "dato_importante": "Los negocios que responden mensajes y comentarios rápido pueden aumentar hasta un 60% la posibilidad de cerrar una venta.", "link_texto": "Para mostrar cómo funciona la App, da clic aquí.", "link_url": "", "plan_label": "El plan Presencia Web incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 7: Plan Presencia Web - Beneficio 4 (Tarjetas NFC)
(
  'wizard.screen_7',
  'wizard',
  'Pantalla 7 - Tarjetas NFC',
  'Cuarto beneficio del Plan Presencia Web.',
  'text',
  'es-MX',
  '4. Tarjetas NFC',
  '{"descripcion": "Las Tarjetas NFC permiten que cualquier persona guarde la información de tu negocio en segundos, solo acercando su celular.", "subtitulo": "Olvídate de las tarjetas de papel que se pierden, se tiran o se quedan sin espacio.", "como_funciona": "Al acercar la tarjeta al teléfono, se abre automáticamente tu Portal Click con toda la información del negocio.", "dato_importante": "En promedio, 8 de cada 10 personas pierden las tarjetas físicas en las primeras 24 horas. Con NFC, tu información siempre queda guardada en el celular del cliente.", "link_texto": "Para mostrar cómo funcionan las Tarjetas NFC, da clic aquí.", "link_url": "", "plan_label": "El plan Presencia Web incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 8: Precio Plan Presencia Web
(
  'wizard.screen_8',
  'wizard',
  'Pantalla 8 - Precio Plan Presencia Web',
  'Pantalla de precio y cierre del Plan Presencia Web.',
  'text',
  'es-MX',
  'Menciona al dueño de negocio el costo de Plan Presencia Web:',
  '{"precio": "$3,299 MXN", "frecuencia": "Pago Anual", "subtitulo": "¿Qué sigue? Adquirir plan", "descripcion": "Dile al dueño del negocio que puede activar su plan ahora mismo. La activación es inmediata y, en minutos, queda habilitado su sitio, su Portal Click y el acceso a su aplicación.", "cta_primario": "Adquirir plan ahora", "cta_secundario": "Quiere dejar sus datos"}'::jsonb
),

-- Screen 9: Felicitaciones - preparar pago
(
  'wizard.screen_9',
  'wizard',
  'Pantalla 9 - Felicitaciones, concretar venta',
  'Pantalla de preparación para el pago.',
  'text',
  'es-MX',
  '¡Felicidades! Estás a punto de concretar una venta.',
  '{"descripcion": "Ahora, junto con el dueño del negocio, realicen el pago del Plan Presencia Web.", "instruccion": "Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?", "cta_pago": "Activar Plan Presencia Web", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 10: Pago confirmado
(
  'wizard.screen_10',
  'wizard',
  'Pantalla 10 - Pago registrado con éxito',
  'Confirmación de que el pago fue procesado.',
  'text',
  'es-MX',
  '¡Listo! El pago del Plan Presencia Web fue registrado con éxito.',
  '{"descripcion": "Ahora acompaña al dueño del negocio a visualizar su Presencia Web activada.", "instruccion": "Da clic en continuar y sigan estos sencillos pasos:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 11: Descargar App + Ingresar
(
  'wizard.screen_11',
  'wizard',
  'Pantalla 11 - Descargar e ingresar a la App',
  'Instrucciones para descargar e ingresar a la App Ventas Click.',
  'text',
  'es-MX',
  '1. Descargar la App Ventas Click',
  '{"descripcion": "Pídele al dueño del negocio que abra su cámara y escanee el código QR para descargar la aplicación en su celular.", "titulo_2": "2. Ingresar a la App Ventas Click", "descripcion_2": "Una vez descargada la App:", "pasos_2": ["-Pide al dueño del negocio abrir su correo electrónico con el que se registro.", "-Dentro del correo que recibió, encontrará su usuario y contraseña."], "url_android": "", "url_ios": "", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 12: Visualizar sitio web
(
  'wizard.screen_12',
  'wizard',
  'Pantalla 12 - Visualizar sitio web en la App',
  'Instrucciones para ver el sitio web dentro de la App.',
  'text',
  'es-MX',
  '3. Visualizar su sitio web',
  '{"descripcion": "Dentro de la App:", "pasos": ["Entren al menú \"Productos\".", "Seleccionen \"Página Web\".", "Encontrarán la información básica que se registró al comprar el plan."], "subtitulo": "Ahora el dueño de negocio podrá editarlo fácilmente:", "bullets": ["Cambiar textos", "Subir logotipo", "Actualizar horarios", "Añadir una galería de fotos"], "cierre": "Todo se edita en segundos, igual que subir una foto a Facebook.", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 13: Visualizar Portal Click + NFC
(
  'wizard.screen_13',
  'wizard',
  'Pantalla 13 - Visualizar Portal Click y Tarjetas NFC',
  'Instrucciones para ver el Portal Click y esperar las tarjetas NFC.',
  'text',
  'es-MX',
  '3. Visualizar su Portal Click',
  '{"descripcion": "Dentro de la App:", "pasos": ["Entren al menú \"Productos\".", "Seleccionen \"Portal Click\"."], "descripcion_extra": "El dueño del negocio puede añadir nuevos enlaces copiando y pegando, así de simple.", "titulo_2": "4. Esperar sus Tarjetas NFC", "descripcion_2": "Mencionale que recibirá dos tarjetas NFC directamente en su domicilio, junto con las instrucciones para activarlas.", "cierre": "La activación es muy sencilla y solo toma unos segundos.", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 14: Llamada de inducción + Soporte
(
  'wizard.screen_14',
  'wizard',
  'Pantalla 14 - Llamada de inducción y enlace de soporte',
  'Instrucciones para recordarle la llamada de inducción y compartir soporte.',
  'text',
  'es-MX',
  '5. Recuérdale su llamada de inducción',
  '{"descripcion": "Tu cliente recibirá una llamada de inducción donde le explicarán, paso a paso, cómo:", "bullets": ["Añadir nuevos enlaces", "Actualizar la información de su sitio web", "Usar la App Ventas Click"], "titulo_2": "6. Comparte el enlace de Soporte", "descripcion_2": "Para cualquier duda futura, pídele que guarde este enlace y pueda contactarnos siempre que lo necesite:", "link_soporte": "https://soporte.ventasclick.com/portal/es/signin", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 15: Carga de evidencia
(
  'wizard.screen_15',
  'wizard',
  'Pantalla 15 - Carga de evidencia',
  'Pantalla para subir foto de evidencia de que el cliente inició sesión en la App.',
  'text',
  'es-MX',
  'Antes de finalizar, carga evidencia',
  '{"descripcion": "Antes de continuar, asegúrate de guardar evidencia de que el dueño del negocio ingresó correctamente a su aplicación.", "instruccion": "¿Qué debes hacer?", "bullets": ["Toma otra fotografía donde se vea que el cliente inició sesión correctamente en su App.", "Sube las imágenes en este paso."], "nota": "Estas fotografías son necesarias para validar la activación del plan.", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 16: Pantalla final de gracias
(
  'wizard.screen_16',
  'wizard',
  'Pantalla 16 - Gracias / Cierre',
  'Pantalla de cierre y agradecimiento al socio.',
  'text',
  'es-MX',
  '¡Gracias por ayudar a un dueño de negocio a potenciar tu Presencia Web!',
  '{"cta_primario": "Volver a menú principal"}'::jsonb
),

-- Screen 17: Dejar datos del prospecto
(
  'wizard.screen_17',
  'wizard',
  'Pantalla 17 - Guardar datos del prospecto',
  'Formulario para guardar los datos de un prospecto que no compró.',
  'text',
  'es-MX',
  'Guardar los datos del prospecto',
  '{"descripcion": "El dueño de negocio mostró interés, pero decidió no activar el plan ahora. Por favor, completa los datos a continuación para poder contactarlo más adelante.", "cta_primario": "Guardar"}'::jsonb
),

-- Screen 18: Confirmación Plan Tienda en Línea
(
  'wizard.screen_18',
  'wizard',
  'Pantalla 18 - Confirmación Plan Tienda en Línea',
  'Pantalla de confirmación tras seleccionar la opción D.',
  'text',
  'es-MX',
  '¡Listo! Ya detectamos qué necesita este negocio.',
  '{"descripcion": "Este cliente requiere una Tienda en Línea, lista para vender sus productos por internet, con carrito de compras, pagos y conexión a paquetería.", "subtitulo": "¡Vamos a decirle paso a paso qué incluye el Plan Tienda en Línea!", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 19: Plan Tienda - Beneficio 1 (Diseño)
(
  'wizard.screen_19',
  'wizard',
  'Pantalla 19 - Diseño completo de tienda en línea',
  'Primer beneficio del Plan Tienda en Línea.',
  'text',
  'es-MX',
  '1. Diseño completo de tienda en línea',
  '{"descripcion": "Diseñamos la Tienda en Línea completa y lista para vender. El dueño de negocio no tendrá que diseñar nada, a diferencia de la competencia, nos encargamos de dejarla funcionando desde el primer día.", "dato_importante": "No paga comisiones por sus ventas.", "link_texto": "Ejemplos de tiendas en línea", "link_url": "", "plan_label": "El plan Tienda en Línea incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 20: Plan Tienda - Beneficio 2 (Catálogo)
(
  'wizard.screen_20',
  'wizard',
  'Pantalla 20 - Catálogo con hasta 250 productos',
  'Segundo beneficio del Plan Tienda en Línea.',
  'text',
  'es-MX',
  '2. Catálogo con hasta 250 productos',
  '{"descripcion": "La Tienda en Línea puede mostrar hasta 250 productos, ofreciendo a los clientes una tienda amplia y completa.", "dato_importante": "El 84% de los mexicanos compradores en línea ya realizan compras digitales, lo que significa que la mayoría de la población que compra ya lo hace por internet.", "plan_label": "El plan Tienda en Línea incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 21: Plan Tienda - Beneficio 3 (Vende en todas partes)
(
  'wizard.screen_21',
  'wizard',
  'Pantalla 21 - Vende en todas partes',
  'Tercer beneficio del Plan Tienda en Línea.',
  'text',
  'es-MX',
  '3. Vende en todas partes',
  '{"descripcion": "La tienda está conectada directamente a las redes sociales, así cada producto que subes aparece automáticamente en Facebook, Instagram y TikTok.", "dato_importante": "En México más del 90% de las personas que compran por redes lo hacen por Facebook, lo que demuestra que tener tu tienda conectada ahí puede generar muchas ventas.", "plan_label": "El plan Tienda en Línea incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 22: Plan Tienda - Beneficio 4 (Cupones)
(
  'wizard.screen_22',
  'wizard',
  'Pantalla 22 - Cupones de descuento',
  'Cuarto beneficio del Plan Tienda en Línea.',
  'text',
  'es-MX',
  '4. Cupones de descuento',
  '{"descripcion": "Con la Tienda en Línea se pueden crear cupones de descuento y tarjetas de regalo sin complicaciones.", "dato_importante": "Esto permite que los clientes aprovechen las ofertas y que el dueño del negocio tenga más oportunidades de venta y fidelización.", "plan_label": "El plan Tienda en Línea incluye:", "cta_primario": "Continuar"}'::jsonb
),

-- Screen 24: Precio Plan Tienda en Línea
(
  'wizard.screen_24',
  'wizard',
  'Pantalla 24 - Precio Plan Tienda en Línea',
  'Pantalla de precio y cierre del Plan Tienda en Línea.',
  'text',
  'es-MX',
  'Menciona al dueño de negocio el costo de Plan Tienda en Línea:',
  '{"precio": "$6,828 MXN", "frecuencia": "Pago anual", "subtitulo": "¿Qué sigue? Adquirir plan", "descripcion": "Dile al dueño del negocio que puede adquirir su plan ahora mismo. Si no está listo para adquirirlo, pídele que deje sus datos para contactarlo posteriormente.", "cta_primario": "Adquirir plan Tienda en Línea", "cta_secundario": "Prospecto quiere dejar sus datos"}'::jsonb
),

-- Screen 25: Felicitaciones Tienda en Línea
(
  'wizard.screen_25',
  'wizard',
  'Pantalla 25 - Felicitaciones, concretar venta Tienda en Línea',
  'Pantalla de preparación para el pago del Plan Tienda en Línea.',
  'text',
  'es-MX',
  '¡Felicidades! Estás a punto de concretar una venta.',
  '{"descripcion": "Ahora, junto con el dueño del negocio, realicen el pago del Plan Tienda en Línea.", "instruccion": "Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?", "cta_pago": "Activar Plan Tienda en Línea", "cta_primario": "Continuar"}'::jsonb
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  meta = EXCLUDED.meta,
  updated_at = now();
