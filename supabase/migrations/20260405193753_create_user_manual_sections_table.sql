/*
  # Create User Manual Sections Table

  1. New Tables
    - `user_manual_sections`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Section title
      - `slug` (text, unique) - URL-friendly identifier
      - `content` (text) - HTML content of the section
      - `category` (text) - Category for organization
      - `icon_name` (text) - Lucide icon name
      - `order_index` (integer) - Display order within category
      - `parent_section_id` (uuid, nullable) - For hierarchical structure
      - `visible` (boolean) - Visibility toggle
      - `created_by` (uuid) - Reference to profiles
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `user_manual_sections` table
    - Add policy for super_admin to SELECT
    - Add policy for super_admin to INSERT
    - Add policy for super_admin to UPDATE
    - Add policy for super_admin to DELETE

  3. Indexes
    - Index on slug for fast lookups
    - Index on category for filtering
    - Index on order_index for sorting
    - Composite index on (visible, category, order_index)
*/

-- Create enum for categories
DO $$ BEGIN
  CREATE TYPE manual_category AS ENUM (
    'introduccion',
    'gestion_usuarios',
    'gestion_bills_leads',
    'gestion_cierres_ventas',
    'gestion_comisiones',
    'gestion_planes',
    'reviews_nps',
    'casos_exito',
    'gestion_contenido',
    'base_conocimientos',
    'configuracion_sistema',
    'reportes_analiticas',
    'preguntas_frecuentes'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create table
CREATE TABLE IF NOT EXISTS user_manual_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  category manual_category NOT NULL,
  icon_name text NOT NULL DEFAULT 'FileText',
  order_index integer NOT NULL DEFAULT 0,
  parent_section_id uuid REFERENCES user_manual_sections(id) ON DELETE SET NULL,
  visible boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_manual_sections ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current user role from profiles
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT rol FROM profiles WHERE id = auth.uid();
$$;

-- RLS Policies for super_admin only
CREATE POLICY "Super admins can view manual sections"
  ON user_manual_sections
  FOR SELECT
  TO authenticated
  USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Super admins can insert manual sections"
  ON user_manual_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "Super admins can update manual sections"
  ON user_manual_sections
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "Super admins can delete manual sections"
  ON user_manual_sections
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'super_admin');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_manual_sections_slug ON user_manual_sections(slug);
CREATE INDEX IF NOT EXISTS idx_manual_sections_category ON user_manual_sections(category);
CREATE INDEX IF NOT EXISTS idx_manual_sections_order ON user_manual_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_manual_sections_visible_category_order 
  ON user_manual_sections(visible, category, order_index);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_manual_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_manual_sections_updated_at
  BEFORE UPDATE ON user_manual_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_manual_sections_updated_at();