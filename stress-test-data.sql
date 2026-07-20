-- Stress Test Data Generation Script
-- This script creates comprehensive test data for all features

-- Note: Run this against your Supabase database to populate test data
-- WARNING: This will create test data in your database

-- Test Users (Profiles will be created via trigger)
-- You'll need to create these users through the auth system first
-- For now, we'll assume we have test user IDs

-- Sample plan types for reference
INSERT INTO planes (nombre, descripcion, precio, comision_porcentaje, caracteristicas, activo)
VALUES
  ('Presencia Web', 'Sitio web básico con presencia en línea', 500.00, 15.00, '["Diseño responsivo", "5 páginas", "Hosting incluido"]', true),
  ('E-commerce', 'Tienda en línea completa', 1500.00, 20.00, '["Catálogo de productos", "Carrito de compras", "Pasarela de pago"]', true),
  ('Personalizado', 'Desarrollo a medida', 3000.00, 25.00, '["Funcionalidades personalizadas", "Integración API", "Soporte premium"]', true)
ON CONFLICT (nombre) DO NOTHING;

-- Test Content Blocks
INSERT INTO content_blocks (seccion, clave, titulo, contenido, activo)
VALUES
  ('landing', 'hero_title', 'Título Hero Test', 'Bienvenido a Socios Ventas Click - Stress Test', true),
  ('landing', 'hero_subtitle', 'Subtítulo Hero Test', 'Sistema de comisiones y ventas bajo prueba de estrés', true),
  ('wizard', 'welcome_message', 'Mensaje Bienvenida Wizard', 'Diagnóstico de necesidades - Test Mode', true),
  ('comisiones', 'terms', 'Términos de Comisiones', 'Términos y condiciones de comisiones para testing', true)
ON CONFLICT (clave) DO UPDATE SET contenido = EXCLUDED.contenido;

-- Note: The following data requires actual user IDs from auth.users
-- These would need to be created through the signup process or inserted into auth.users directly

-- For demonstration, showing the structure of test data that would be inserted:

/*
-- Test Leads (requires real socio_id from profiles)
INSERT INTO leads (socio_id, nombre_cliente, email_cliente, telefono_cliente, empresa_cliente, tipo_plan_interes, presupuesto_estimado, mensaje, estatus)
SELECT
  (SELECT id FROM profiles WHERE rol = 'socio' LIMIT 1),
  'Cliente Test ' || generate_series,
  'cliente' || generate_series || '@test.com',
  '555-0' || LPAD(generate_series::text, 3, '0'),
  'Empresa Test ' || generate_series,
  CASE (generate_series % 3)
    WHEN 0 THEN 'presencia_web'
    WHEN 1 THEN 'e_commerce'
    ELSE 'personalizado'
  END,
  500.00 + (generate_series * 100),
  'Mensaje de prueba para lead ' || generate_series,
  CASE (generate_series % 5)
    WHEN 0 THEN 'nuevo'
    WHEN 1 THEN 'contactado'
    WHEN 2 THEN 'calificado'
    WHEN 3 THEN 'propuesta_enviada'
    ELSE 'ganado'
  END
FROM generate_series(1, 100);

-- Test Sales (requires real lead_id and socio_id)
INSERT INTO ventas (lead_id, socio_id, monto_venta, plan_id, estatus, fecha_cierre)
SELECT
  l.id,
  l.socio_id,
  1000.00 + (random() * 2000)::numeric(10,2),
  (SELECT id FROM planes ORDER BY random() LIMIT 1),
  CASE (random() * 3)::int
    WHEN 0 THEN 'pendiente'
    WHEN 1 THEN 'completada'
    ELSE 'cancelada'
  END,
  NOW() - (random() * 365)::int * interval '1 day'
FROM leads l
WHERE l.estatus = 'ganado'
LIMIT 50;

-- Test Commissions (requires real venta_id and socio_id)
INSERT INTO comisiones (venta_id, socio_id, monto_comision, porcentaje_aplicado, estatus)
SELECT
  v.id,
  v.socio_id,
  v.monto_venta * 0.15,
  15.00,
  CASE (random() * 3)::int
    WHEN 0 THEN 'pendiente'
    WHEN 1 THEN 'aprobada'
    ELSE 'pagada'
  END
FROM ventas v
WHERE v.estatus = 'completada';

-- Test Success Cases (requires real socio_id)
INSERT INTO casos_exito (socio_id, url_sitio, tipo_plan, titulo, descripcion_corta, descripcion_completa, estatus)
SELECT
  (SELECT id FROM profiles WHERE rol = 'socio' ORDER BY random() LIMIT 1),
  'https://ejemplo' || generate_series || '.com',
  CASE (generate_series % 3)
    WHEN 0 THEN 'presencia_web'
    WHEN 1 THEN 'e_commerce'
    ELSE 'personalizado'
  END,
  'Caso de Éxito Test ' || generate_series,
  'Descripción corta del caso de éxito número ' || generate_series,
  'Descripción completa y detallada del caso de éxito número ' || generate_series || '. Este cliente logró excelentes resultados.',
  CASE (generate_series % 3)
    WHEN 0 THEN 'pendiente'
    WHEN 1 THEN 'aprobado'
    ELSE 'rechazado'
  END
FROM generate_series(1, 30);

-- Test Customer Reviews (requires real socio_id)
INSERT INTO customer_reviews (socio_id, nombre_cliente, contacto_cliente, score_nps, comentario, estatus)
SELECT
  (SELECT id FROM profiles WHERE rol = 'socio' ORDER BY random() LIMIT 1),
  'Cliente Review ' || generate_series,
  'review' || generate_series || '@test.com',
  (random() * 10)::int,
  'Comentario de prueba para el review número ' || generate_series || '. El servicio fue excelente.',
  CASE (generate_series % 3)
    WHEN 0 THEN 'pendiente'
    WHEN 1 THEN 'aprobado'
    ELSE 'rechazado'
  END
FROM generate_series(1, 50);

-- Test KB Articles (requires real autor_id)
INSERT INTO kb_articles (titulo, contenido, categoria, tags, autor_id, visible)
SELECT
  'Artículo KB Test ' || generate_series,
  'Contenido detallado del artículo ' || generate_series || '. Este artículo contiene información importante para los socios.',
  CASE (generate_series % 4)
    WHEN 0 THEN 'ventas'
    WHEN 1 THEN 'tecnico'
    WHEN 2 THEN 'comisiones'
    ELSE 'general'
  END,
  ARRAY['test', 'kb', 'articulo' || generate_series],
  (SELECT id FROM profiles WHERE rol IN ('admin', 'super_admin') ORDER BY random() LIMIT 1),
  (random() > 0.3)
FROM generate_series(1, 20);

-- Test Wizard Results (requires real socio_id)
INSERT INTO wizard_results (socio_id, respuestas, plan_recomendado, datos_cliente)
SELECT
  (SELECT id FROM profiles WHERE rol = 'socio' ORDER BY random() LIMIT 1),
  jsonb_build_object(
    'tiene_sitio', (random() > 0.5),
    'necesita_ecommerce', (random() > 0.5),
    'presupuesto', (1000 + random() * 4000)::int
  ),
  CASE (random() * 3)::int
    WHEN 0 THEN 'presencia_web'
    WHEN 1 THEN 'e_commerce'
    ELSE 'personalizado'
  END,
  jsonb_build_object(
    'nombre', 'Cliente Wizard ' || generate_series,
    'email', 'wizard' || generate_series || '@test.com',
    'telefono', '555-' || LPAD(generate_series::text, 4, '0')
  )
FROM generate_series(1, 40);
*/

-- Summary of test data structure
SELECT 'Test data schema prepared. Run individual INSERT statements after creating test users through authentication system.' as message;
