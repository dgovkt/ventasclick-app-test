/*
  # Create wizard_accesos table for tracking wizard visits

  1. New Tables
    - `wizard_accesos`
      - `id` (uuid, primary key)
      - `socio_id` (uuid, foreign key to profiles)
      - `fecha_acceso` (timestamptz)
      - `ip_address` (text, nullable)
      - `user_agent` (text, nullable)
      - `completed` (boolean, default false)
      - `session_id` (text, unique identifier for the session)
      - `abandoned_at_step` (integer, nullable - which step they left)

  2. Purpose
    - Track every time someone opens a socio's wizard
    - Measure completion rates and abandonment funnel
    - Identify which screens cause the most dropoff
    - Calculate time spent in wizard and conversion metrics

  3. Security
    - Enable RLS on `wizard_accesos` table
    - Socios can only view their own access logs
    - Super admins can view all access logs
    - Public can insert (for anonymous wizard tracking)
*/

CREATE TABLE IF NOT EXISTS wizard_accesos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fecha_acceso timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  completed boolean DEFAULT false,
  session_id text NOT NULL,
  abandoned_at_step integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wizard_accesos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Socios can view own access logs"
  ON wizard_accesos
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

CREATE POLICY "Anyone can insert access logs"
  ON wizard_accesos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "System can update access logs"
  ON wizard_accesos
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_wizard_accesos_socio_id ON wizard_accesos(socio_id);
CREATE INDEX idx_wizard_accesos_fecha ON wizard_accesos(fecha_acceso DESC);
CREATE INDEX idx_wizard_accesos_session ON wizard_accesos(session_id);
CREATE INDEX idx_wizard_accesos_completed ON wizard_accesos(completed);
