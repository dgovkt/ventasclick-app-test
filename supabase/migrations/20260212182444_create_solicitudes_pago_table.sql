/*
  # Create solicitudes_pago table

  1. New Tables
    - `solicitudes_pago`
      - `id` (uuid, primary key)
      - `socio_id` (uuid, FK to profiles) - Socio que solicita el pago
      - `monto_solicitado` (numeric) - Monto total solicitado
      - `estatus` (text) - 'pendiente', 'aprobada', 'pagada', 'rechazada'
      - `fecha_inicio` (date) - Fecha inicial del rango de ventas
      - `fecha_fin` (date) - Fecha final del rango de ventas
      - `comentarios_admin` (text) - Comentarios del admin
      - `payment_reference` (text) - Referencia de pago externa (ej. Chargebee)
      - `payment_date` (timestamptz) - Fecha de pago efectivo
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `solicitud_pago_ventas`
      - Tabla intermedia para relacionar solicitudes con ventas específicas
      - `solicitud_pago_id` (uuid, FK to solicitudes_pago)
      - `venta_id` (uuid, FK to ventas)
      - `comision_calculada` (numeric) - Comisión de esta venta en el momento de la solicitud
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Socios can view their own solicitudes
    - Socios can create new solicitudes
    - Admins can view and update all solicitudes
*/

CREATE TABLE IF NOT EXISTS solicitudes_pago (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  monto_solicitado numeric(10, 2) NOT NULL DEFAULT 0,
  estatus text NOT NULL CHECK (estatus IN ('pendiente', 'aprobada', 'pagada', 'rechazada')) DEFAULT 'pendiente',
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  comentarios_admin text,
  payment_reference text,
  payment_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solicitud_pago_ventas (
  solicitud_pago_id uuid NOT NULL REFERENCES solicitudes_pago(id) ON DELETE CASCADE,
  venta_id uuid NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  comision_calculada numeric(10, 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (solicitud_pago_id, venta_id)
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_pago_socio_id ON solicitudes_pago(socio_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_pago_estatus ON solicitudes_pago(estatus);
CREATE INDEX IF NOT EXISTS idx_solicitud_pago_ventas_solicitud ON solicitud_pago_ventas(solicitud_pago_id);
CREATE INDEX IF NOT EXISTS idx_solicitud_pago_ventas_venta ON solicitud_pago_ventas(venta_id);

ALTER TABLE solicitudes_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_pago_ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own payment requests"
  ON solicitudes_pago FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can create own payment requests"
  ON solicitudes_pago FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Admins can view all payment requests"
  ON solicitudes_pago FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update payment requests"
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

CREATE POLICY "Socios can view own payment request sales"
  ON solicitud_pago_ventas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM solicitudes_pago
      WHERE id = solicitud_pago_ventas.solicitud_pago_id
      AND socio_id = auth.uid()
    )
  );

CREATE POLICY "Socios can insert own payment request sales"
  ON solicitud_pago_ventas FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM solicitudes_pago
      WHERE id = solicitud_pago_ventas.solicitud_pago_id
      AND socio_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payment request sales"
  ON solicitud_pago_ventas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_solicitudes_pago_updated_at'
  ) THEN
    CREATE TRIGGER update_solicitudes_pago_updated_at BEFORE UPDATE ON solicitudes_pago
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
