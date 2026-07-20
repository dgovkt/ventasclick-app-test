/*
  # Create evidencias_ventas table for photo uploads

  1. New Tables
    - `evidencias_ventas`
      - `id` (uuid, primary key)
      - `venta_id` (uuid, foreign key to ventas)
      - `foto_url` (text, URL to Supabase Storage)
      - `tipo` (text, e.g., 'comprobante', 'captura_pantalla', 'otro')
      - `nota` (text, optional note from socio)
      - `created_at` (timestamptz)

  2. Purpose
    - Store photographic evidence of sales
    - Socios upload payment receipts, screenshots, etc.
    - Admin reviews evidence before approving commissions
    - Multiple photos per sale allowed

  3. Security
    - Enable RLS on `evidencias_ventas` table
    - Socios can only manage evidences for their own sales
    - Admins and super admins can view all evidences
*/

CREATE TABLE IF NOT EXISTS evidencias_ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id uuid NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  foto_url text NOT NULL,
  tipo text DEFAULT 'otro',
  nota text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evidencias_ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own sale evidences"
  ON evidencias_ventas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventas
      JOIN leads ON ventas.lead_id = leads.id
      WHERE ventas.id = evidencias_ventas.venta_id
      AND leads.socio_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Socios can insert own sale evidences"
  ON evidencias_ventas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ventas
      JOIN leads ON ventas.lead_id = leads.id
      WHERE ventas.id = evidencias_ventas.venta_id
      AND leads.socio_id = auth.uid()
    )
  );

CREATE POLICY "Socios can update own sale evidences"
  ON evidencias_ventas
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventas
      JOIN leads ON ventas.lead_id = leads.id
      WHERE ventas.id = evidencias_ventas.venta_id
      AND leads.socio_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ventas
      JOIN leads ON ventas.lead_id = leads.id
      WHERE ventas.id = evidencias_ventas.venta_id
      AND leads.socio_id = auth.uid()
    )
  );

CREATE POLICY "Socios can delete own sale evidences"
  ON evidencias_ventas
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventas
      JOIN leads ON ventas.lead_id = leads.id
      WHERE ventas.id = evidencias_ventas.venta_id
      AND leads.socio_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_evidencias_ventas_venta_id ON evidencias_ventas(venta_id);
CREATE INDEX idx_evidencias_ventas_created_at ON evidencias_ventas(created_at DESC);
CREATE INDEX idx_evidencias_ventas_tipo ON evidencias_ventas(tipo);
