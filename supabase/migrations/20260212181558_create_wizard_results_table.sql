/*
  # Create wizard_results table

  1. New Tables
    - `wizard_results`
      - `id` (uuid, primary key)
      - `socio_id` (uuid, FK to profiles) - socio que realizó el wizard
      - `lead_id` (uuid, FK to leads, nullable) - lead creado si aplica
      - `plan_recomendado_id` (uuid, FK to planes, nullable) - plan recomendado
      - `resultado` (text) - 'compro', 'dejo_datos', 'no_interesado'
      - `diagnostico_opcion` (text) - opción elegida en diagnóstico inicial (A, B, C, D)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on wizard_results table
    - Socios can view their own wizard results
    - Admins can view all wizard results
*/

CREATE TABLE IF NOT EXISTS wizard_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  plan_recomendado_id uuid REFERENCES planes(id) ON DELETE SET NULL,
  resultado text NOT NULL CHECK (resultado IN ('compro', 'dejo_datos', 'no_interesado')),
  diagnostico_opcion text CHECK (diagnostico_opcion IN ('A', 'B', 'C', 'D')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wizard_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own wizard results"
  ON wizard_results FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

CREATE POLICY "Socios can insert own wizard results"
  ON wizard_results FOR INSERT
  TO authenticated
  WITH CHECK (socio_id = auth.uid());

CREATE POLICY "Admins can view all wizard results"
  ON wizard_results FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );
