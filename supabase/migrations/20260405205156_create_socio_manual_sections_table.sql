/*
  # Create Socio Manual Sections Table

  1. New Tables
    - `socio_manual_sections`
      - `id` (uuid, primary key)
      - `seccion` (text) - Main section name (e.g., "dashboard", "leads", "cierres")
      - `subseccion` (text) - Subsection name for organizing content within a section
      - `titulo` (text) - Display title for the section/subsection
      - `contenido` (text) - HTML content with formatting
      - `orden` (integer) - Sort order within the section
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `socio_manual_sections` table
    - Allow authenticated users to read all sections
    - Only admins and super_admins can insert, update, or delete sections

  3. Notes
    - This table stores the user manual content for the partner (socio) dashboard
    - Content is organized by sections and subsections for easy navigation
    - Admins can edit content through a dedicated interface
*/

CREATE TABLE IF NOT EXISTS socio_manual_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion text NOT NULL,
  subseccion text,
  titulo text NOT NULL,
  contenido text NOT NULL,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE socio_manual_sections ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read manual sections
CREATE POLICY "Authenticated users can read socio manual sections"
  ON socio_manual_sections
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins and super_admins can insert sections
CREATE POLICY "Admins can insert socio manual sections"
  ON socio_manual_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

-- Only admins and super_admins can update sections
CREATE POLICY "Admins can update socio manual sections"
  ON socio_manual_sections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

-- Only admins and super_admins can delete sections
CREATE POLICY "Admins can delete socio manual sections"
  ON socio_manual_sections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

-- Create index for faster queries by section
CREATE INDEX IF NOT EXISTS idx_socio_manual_seccion ON socio_manual_sections(seccion, orden);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_socio_manual_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_socio_manual_sections_updated_at
  BEFORE UPDATE ON socio_manual_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_socio_manual_sections_updated_at();