/*
  # Socios Ventas Click - Schema Completo

  ## Descripción General
  Sistema de gestión para socios de ventas con autenticación basada en roles (socio, admin, super_admin).
  Incluye gestión de leads, ventas, comisiones, pagos, casos de éxito y reviews de clientes.

  ## Nuevas Tablas

  ### 1. profiles
  Extensión de auth.users con datos adicionales según el rol del usuario.
  - `id` (uuid, PK, FK to auth.users)
  - `nombre` (text)
  - `apellido` (text)
  - `rol` (text) - valores: 'socio', 'admin', 'super_admin'
  - `telefono` (text, nullable) - para socios
  - `datos_bancarios` (jsonb, nullable) - información bancaria para socios
  - `frecuencia_pago` (text, nullable) - 'semanal' o 'mensual', para socios
  - `area` (text, nullable) - para admin/super_admin
  - `notas_internas` (text, nullable) - para admin/super_admin
  - `activo` (boolean) - indica si el usuario está activo
  - `fecha_registro` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. planes
  Planes de servicio disponibles para venta.
  - `id` (uuid, PK)
  - `nombre` (text) - ej: "Plan Presencia Web", "Plan Tienda en Línea"
  - `precio_anual` (numeric) - precio en MXN
  - `descripcion_corta` (text)
  - `descripcion_completa` (text, nullable)
  - `activo` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. leads
  Prospectos gestionados por socios.
  - `id` (uuid, PK)
  - `socio_id` (uuid, FK to profiles)
  - `nombre` (text)
  - `apellidos` (text)
  - `email` (text)
  - `telefono` (text)
  - `que_vende` (text) - qué producto/servicio vende el prospecto
  - `plan_recomendado_id` (uuid, FK to planes, nullable)
  - `estado` (text) - 'nuevo', 'en_seguimiento', 'cerrado_ganado', 'cerrado_perdido'
  - `origen` (text) - 'wizard', 'manual', 'otro'
  - `notas` (text, nullable)
  - `fecha_creacion` (timestamptz)
  - `fecha_ultima_actualizacion` (timestamptz)

  ### 4. ventas
  Cierres de ventas realizadas.
  - `id` (uuid, PK)
  - `socio_id` (uuid, FK to profiles)
  - `lead_id` (uuid, FK to leads, nullable)
  - `plan_id` (uuid, FK to planes)
  - `fecha` (timestamptz)
  - `monto` (numeric)
  - `estatus_pago` (text) - 'pendiente', 'pagado', 'fallido'
  - `referencia_externa` (text, nullable) - ID de Chargebee u otro sistema
  - `notas` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. comisiones
  Comisiones generadas por ventas.
  - `id` (uuid, PK)
  - `socio_id` (uuid, FK to profiles)
  - `venta_id` (uuid, FK to ventas)
  - `monto_estimado` (numeric)
  - `monto_autorizado` (numeric, nullable)
  - `estatus` (text) - 'pendiente', 'autorizada', 'pagada', 'rechazada'
  - `fecha_creacion` (timestamptz)
  - `fecha_actualizacion` (timestamptz)

  ### 6. solicitudes_pago
  Solicitudes de pago de comisiones por período.
  - `id` (uuid, PK)
  - `socio_id` (uuid, FK to profiles)
  - `periodo` (text) - ej: "2026-Q1-Quincena1"
  - `monto_total_estimado` (numeric)
  - `monto_total_autorizado` (numeric, nullable)
  - `estatus` (text) - 'pendiente', 'aprobada', 'pagada', 'rechazada'
  - `fecha_solicitud` (timestamptz)
  - `fecha_resolucion` (timestamptz, nullable)
  - `notas_admin` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. casos_exito
  Casos de éxito propuestos por socios.
  - `id` (uuid, PK)
  - `socio_id` (uuid, FK to profiles)
  - `url_sitio` (text)
  - `tipo_plan` (text) - 'presencia_web', 'tienda_en_linea'
  - `titulo` (text)
  - `descripcion_corta` (text)
  - `descripcion_completa` (text, nullable)
  - `estatus` (text) - 'pendiente', 'aprobado', 'rechazado'
  - `aprobado_por` (uuid, FK to profiles, nullable)
  - `fecha_aprobacion` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. customer_reviews
  Reviews de clientes gestionadas por socios.
  - `id` (uuid, PK)
  - `socio_id` (uuid, FK to profiles)
  - `nombre_cliente` (text)
  - `contacto_cliente` (text, nullable)
  - `score_nps` (integer) - 0 a 10
  - `comentario` (text)
  - `estatus` (text) - 'pendiente', 'aprobado', 'rechazado'
  - `aprobado_por` (uuid, FK to profiles, nullable)
  - `fecha_aprobacion` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Seguridad (RLS)
  
  Todas las tablas tienen Row Level Security habilitado con políticas específicas por rol:
  
  - **socio**: puede ver y gestionar solo sus propios datos
  - **admin**: puede ver todos los datos y moderar contenido, pero no editar configuraciones críticas
  - **super_admin**: acceso completo a todos los datos y configuraciones

  ## Notas Importantes
  
  1. Los roles se almacenan en `profiles.rol` y verificados mediante consultas a la tabla profiles
  2. Todos los timestamps usan `timestamptz` para manejo correcto de zonas horarias
  3. Los campos monetarios usan tipo `numeric` para precisión
  4. Las relaciones están implementadas con foreign keys con CASCADE apropiado
  5. Trigger automático para crear profile al registrar usuario en auth.users
*/

-- Tabla: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL DEFAULT '',
  apellido text NOT NULL DEFAULT '',
  rol text NOT NULL CHECK (rol IN ('socio', 'admin', 'super_admin')) DEFAULT 'socio',
  telefono text,
  datos_bancarios jsonb,
  frecuencia_pago text CHECK (frecuencia_pago IN ('semanal', 'mensual') OR frecuencia_pago IS NULL),
  area text,
  notas_internas text,
  activo boolean NOT NULL DEFAULT true,
  fecha_registro timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Super admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'super_admin'
    )
  );

-- Tabla: planes
CREATE TABLE IF NOT EXISTS planes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  precio_anual numeric NOT NULL,
  descripcion_corta text NOT NULL,
  descripcion_completa text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE planes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active planes"
  ON planes FOR SELECT
  TO authenticated
  USING (
    activo = true OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert planes"
  ON planes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update planes"
  ON planes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete planes"
  ON planes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Tabla: leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellidos text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  que_vende text NOT NULL,
  plan_recomendado_id uuid REFERENCES planes(id) ON DELETE SET NULL,
  estado text NOT NULL CHECK (estado IN ('nuevo', 'en_seguimiento', 'cerrado_ganado', 'cerrado_perdido')) DEFAULT 'nuevo',
  origen text NOT NULL CHECK (origen IN ('wizard', 'manual', 'otro')) DEFAULT 'manual',
  notas text,
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  fecha_ultima_actualizacion timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can insert own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Socios can update own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (socio_id = auth.uid())
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Socios can delete own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Tabla: ventas
CREATE TABLE IF NOT EXISTS ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  plan_id uuid NOT NULL REFERENCES planes(id) ON DELETE RESTRICT,
  fecha timestamptz NOT NULL DEFAULT now(),
  monto numeric NOT NULL,
  estatus_pago text NOT NULL CHECK (estatus_pago IN ('pendiente', 'pagado', 'fallido')) DEFAULT 'pendiente',
  referencia_externa text,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own ventas"
  ON ventas FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can insert own ventas"
  ON ventas FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Socios can update own ventas"
  ON ventas FOR UPDATE
  TO authenticated
  USING (socio_id = auth.uid())
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Admins can view all ventas"
  ON ventas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all ventas"
  ON ventas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Tabla: comisiones
CREATE TABLE IF NOT EXISTS comisiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  venta_id uuid NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  monto_estimado numeric NOT NULL,
  monto_autorizado numeric,
  estatus text NOT NULL CHECK (estatus IN ('pendiente', 'autorizada', 'pagada', 'rechazada')) DEFAULT 'pendiente',
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  fecha_actualizacion timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comisiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own comisiones"
  ON comisiones FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Admins can view all comisiones"
  ON comisiones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update comisiones"
  ON comisiones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert comisiones"
  ON comisiones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Tabla: solicitudes_pago
CREATE TABLE IF NOT EXISTS solicitudes_pago (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  periodo text NOT NULL,
  monto_total_estimado numeric NOT NULL,
  monto_total_autorizado numeric,
  estatus text NOT NULL CHECK (estatus IN ('pendiente', 'aprobada', 'pagada', 'rechazada')) DEFAULT 'pendiente',
  fecha_solicitud timestamptz NOT NULL DEFAULT now(),
  fecha_resolucion timestamptz,
  notas_admin text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE solicitudes_pago ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own solicitudes"
  ON solicitudes_pago FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can insert own solicitudes"
  ON solicitudes_pago FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Admins can view all solicitudes"
  ON solicitudes_pago FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update solicitudes"
  ON solicitudes_pago FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Tabla: casos_exito
CREATE TABLE IF NOT EXISTS casos_exito (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url_sitio text NOT NULL,
  tipo_plan text NOT NULL CHECK (tipo_plan IN ('presencia_web', 'tienda_en_linea')),
  titulo text NOT NULL,
  descripcion_corta text NOT NULL,
  descripcion_completa text,
  estatus text NOT NULL CHECK (estatus IN ('pendiente', 'aprobado', 'rechazado')) DEFAULT 'pendiente',
  aprobado_por uuid REFERENCES profiles(id) ON DELETE SET NULL,
  fecha_aprobacion timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE casos_exito ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own casos_exito"
  ON casos_exito FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can insert own casos_exito"
  ON casos_exito FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Socios can update own pending casos_exito"
  ON casos_exito FOR UPDATE
  TO authenticated
  USING (socio_id = auth.uid() AND estatus = 'pendiente')
  WITH CHECK (socio_id = auth.uid() AND estatus = 'pendiente');

CREATE POLICY "Anyone can view approved casos_exito"
  ON casos_exito FOR SELECT
  TO authenticated
  USING (estatus = 'aprobado');

CREATE POLICY "Admins can view all casos_exito"
  ON casos_exito FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update casos_exito"
  ON casos_exito FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Tabla: customer_reviews
CREATE TABLE IF NOT EXISTS customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nombre_cliente text NOT NULL,
  contacto_cliente text,
  score_nps integer NOT NULL CHECK (score_nps >= 0 AND score_nps <= 10),
  comentario text NOT NULL,
  estatus text NOT NULL CHECK (estatus IN ('pendiente', 'aprobado', 'rechazado')) DEFAULT 'pendiente',
  aprobado_por uuid REFERENCES profiles(id) ON DELETE SET NULL,
  fecha_aprobacion timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can insert own reviews"
  ON customer_reviews FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Socios can update own pending reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (socio_id = auth.uid() AND estatus = 'pendiente')
  WITH CHECK (socio_id = auth.uid() AND estatus = 'pendiente');

CREATE POLICY "Anyone can view approved reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (estatus = 'aprobado');

CREATE POLICY "Admins can view all reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_planes_updated_at'
  ) THEN
    CREATE TRIGGER update_planes_updated_at BEFORE UPDATE ON planes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_leads_updated_at'
  ) THEN
    CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_ventas_updated_at'
  ) THEN
    CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_comisiones_updated_at'
  ) THEN
    CREATE TRIGGER update_comisiones_updated_at BEFORE UPDATE ON comisiones
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_solicitudes_pago_updated_at'
  ) THEN
    CREATE TRIGGER update_solicitudes_pago_updated_at BEFORE UPDATE ON solicitudes_pago
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_casos_exito_updated_at'
  ) THEN
    CREATE TRIGGER update_casos_exito_updated_at BEFORE UPDATE ON casos_exito
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_customer_reviews_updated_at'
  ) THEN
    CREATE TRIGGER update_customer_reviews_updated_at BEFORE UPDATE ON customer_reviews
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Trigger especial para leads: actualizar fecha_ultima_actualizacion
CREATE OR REPLACE FUNCTION update_lead_fecha_ultima_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_ultima_actualizacion = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_leads_fecha_actualizacion'
  ) THEN
    CREATE TRIGGER update_leads_fecha_actualizacion BEFORE UPDATE ON leads
      FOR EACH ROW EXECUTE FUNCTION update_lead_fecha_ultima_actualizacion();
  END IF;
END $$;

-- Trigger para crear profile automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'socio')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- Insertar planes iniciales
INSERT INTO planes (nombre, precio_anual, descripcion_corta, descripcion_completa, activo)
VALUES 
  (
    'Plan Presencia Web',
    3299,
    'Sitio web profesional para tu negocio',
    'Incluye diseño personalizado, hosting, dominio y soporte técnico por 1 año',
    true
  ),
  (
    'Plan Tienda en Línea',
    6828,
    'Tienda en línea completa con carrito de compras',
    'Incluye catálogo de productos, pasarela de pagos, gestión de inventario, hosting, dominio y soporte técnico por 1 año',
    true
  )
ON CONFLICT DO NOTHING;