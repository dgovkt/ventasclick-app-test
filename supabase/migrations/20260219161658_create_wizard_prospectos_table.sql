/*
  # Create wizard_prospectos table for non-interested prospects

  1. New Tables
    - `wizard_prospectos`
      - `id` (uuid, primary key)
      - `socio_id` (uuid, foreign key to profiles)
      - `nombre` (text, nullable - may abandon before completing)
      - `apellidos` (text, nullable)
      - `email` (text, nullable)
      - `telefono` (text, nullable)
      - `que_vende` (text, nullable)
      - `plan_recomendado_id` (uuid, nullable - reference to planes)
      - `diagnostico_opcion` (text, nullable - A/B/C/D)
      - `created_at` (timestamptz)

  2. Purpose
    - Track prospects who said "not interested" but were still prospected
    - These are NOT leads, just records for analytics and funnel metrics
    - Allows measuring: total prospected vs leads created vs sales closed
    - Data can be used for future reactivation campaigns

  3. Security
    - Enable RLS on `wizard_prospectos` table
    - Socios can only view their own prospects
    - Super admins can view all prospects
*/

CREATE TABLE IF NOT EXISTS wizard_prospectos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nombre text,
  apellidos text,
  email text,
  telefono text,
  que_vende text,
  plan_recomendado_id uuid REFERENCES planes(id) ON DELETE SET NULL,
  diagnostico_opcion text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wizard_prospectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own prospects"
  ON wizard_prospectos
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = socio_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'super_admin'
    )
  );

CREATE POLICY "Socios can insert own prospects"
  ON wizard_prospectos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = socio_id);

CREATE POLICY "Socios can update own prospects"
  ON wizard_prospectos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = socio_id)
  WITH CHECK (auth.uid() = socio_id);

CREATE POLICY "Socios can delete own prospects"
  ON wizard_prospectos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = socio_id);

-- Create indexes for performance
CREATE INDEX idx_wizard_prospectos_socio_id ON wizard_prospectos(socio_id);
CREATE INDEX idx_wizard_prospectos_created_at ON wizard_prospectos(created_at DESC);
CREATE INDEX idx_wizard_prospectos_plan ON wizard_prospectos(plan_recomendado_id);
