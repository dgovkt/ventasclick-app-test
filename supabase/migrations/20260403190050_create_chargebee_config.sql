/*
  # Create Chargebee Configuration Table

  1. New Tables
    - `chargebee_config`
      - `id` (uuid, primary key)
      - `environment` (text) - 'test' or 'production'
      - `site_name` (text) - Chargebee site identifier
      - `is_active` (boolean) - Whether this environment is currently active
      - `plan_presencia_web` (text) - Item ID for Presencia Web plan
      - `plan_tienda_basico` (text) - Item ID for Tienda Básico plan
      - `plan_tienda_esencial` (text) - Item ID for Tienda Esencial plan
      - `plan_tienda_premium` (text) - Item ID for Tienda Premium plan
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `chargebee_config` table
    - Add policy for anyone to read configuration
    - Add policy for super_admin users to update configuration

  3. Initial Data
    - Insert production environment configuration (active by default)
    - Insert test environment configuration (inactive)
*/

-- Create chargebee_config table
CREATE TABLE IF NOT EXISTS chargebee_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment text NOT NULL UNIQUE CHECK (environment IN ('test', 'production')),
  site_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  plan_presencia_web text NOT NULL,
  plan_tienda_basico text NOT NULL,
  plan_tienda_esencial text NOT NULL,
  plan_tienda_premium text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chargebee_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read the active configuration
CREATE POLICY "Anyone can read active chargebee config"
  ON chargebee_config
  FOR SELECT
  USING (true);

-- Policy: Only super_admin can update configuration
CREATE POLICY "Super admin can update chargebee config"
  ON chargebee_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'super_admin'
    )
  );

-- Insert production configuration (active by default)
INSERT INTO chargebee_config (
  environment,
  site_name,
  is_active,
  plan_presencia_web,
  plan_tienda_basico,
  plan_tienda_esencial,
  plan_tienda_premium
) VALUES (
  'production',
  'ventasclick',
  true,
  'TP-000P-MXN-Yearly',
  'TP-001-MXN-Yearly',
  'TP-002-MXN-Yearly',
  'TP-003-MXN-Yearly'
) ON CONFLICT (environment) DO NOTHING;

-- Insert test configuration (inactive)
INSERT INTO chargebee_config (
  environment,
  site_name,
  is_active,
  plan_presencia_web,
  plan_tienda_basico,
  plan_tienda_esencial,
  plan_tienda_premium
) VALUES (
  'test',
  'vktdev-test',
  false,
  'Bsico-MXN-Cada-ao',
  'Bsico-MXN-Cada-ao',
  'EsencialTest-MXN-Cada-ao',
  'PremiumTest-MXN-Cada-ao'
) ON CONFLICT (environment) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chargebee_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chargebee_config_updated_at
  BEFORE UPDATE ON chargebee_config
  FOR EACH ROW
  EXECUTE FUNCTION update_chargebee_config_updated_at();

-- Create function to ensure only one config is active at a time
CREATE OR REPLACE FUNCTION ensure_single_active_chargebee_config()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    -- Deactivate all other configurations
    UPDATE chargebee_config
    SET is_active = false
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_config
  BEFORE UPDATE ON chargebee_config
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION ensure_single_active_chargebee_config();