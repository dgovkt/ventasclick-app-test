/*
  # Create system_config key-value table

  1. New Tables
    - `system_config`
      - `key` (text, primary key) - setting name
      - `value` (text) - setting value
      - `updated_at` (timestamptz) - last modification

  2. Seed Data
    - empresa_nombre: 'Ventas Click'
    - empresa_email: 'contacto@ventasclick.com'
    - empresa_telefono: '+52 55 1234 5678'
    - notif_leads: 'true'
    - notif_ventas: 'true'
    - notif_solicitudes_pago: 'true'

  3. Security
    - RLS enabled
    - Authenticated users can read all config
    - Only admin/super_admin can update
*/

CREATE TABLE IF NOT EXISTS system_config (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read config"
  ON system_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update config"
  ON system_config
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can insert config"
  ON system_config
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

INSERT INTO system_config (key, value) VALUES
  ('empresa_nombre', 'Ventas Click'),
  ('empresa_email', 'contacto@ventasclick.com'),
  ('empresa_telefono', '+52 55 1234 5678'),
  ('notif_leads', 'true'),
  ('notif_ventas', 'true'),
  ('notif_solicitudes_pago', 'true')
ON CONFLICT (key) DO NOTHING;