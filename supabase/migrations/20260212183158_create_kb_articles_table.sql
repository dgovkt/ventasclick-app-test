/*
  # Create KB Articles table

  1. New Tables
    - `kb_articles`
      - `id` (uuid, primary key)
      - `titulo` (text) - Título del artículo
      - `slug` (text, unique) - Slug único para URLs
      - `categoria` (text) - Categoría del artículo
      - `tags` (text array) - Lista de etiquetas
      - `contenido` (text) - Contenido HTML enriquecido
      - `visible` (boolean) - Si el artículo es visible
      - `autor_id` (uuid, FK to profiles) - Admin/super_admin autor
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on kb_articles table
    - Socios can view visible articles
    - Admins and super_admins can CRUD all articles
  
  3. Indexes
    - Index on categoria for filtering
    - Index on visible for queries
    - Index on slug for lookups
    - GIN index on tags for array searches
*/

CREATE TABLE IF NOT EXISTS kb_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  slug text UNIQUE NOT NULL,
  categoria text NOT NULL,
  tags text[] DEFAULT '{}',
  contenido text NOT NULL,
  visible boolean NOT NULL DEFAULT false,
  autor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kb_articles_categoria ON kb_articles(categoria);
CREATE INDEX IF NOT EXISTS idx_kb_articles_visible ON kb_articles(visible);
CREATE INDEX IF NOT EXISTS idx_kb_articles_slug ON kb_articles(slug);
CREATE INDEX IF NOT EXISTS idx_kb_articles_tags ON kb_articles USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_kb_articles_autor ON kb_articles(autor_id);

ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view visible KB articles"
  ON kb_articles FOR SELECT
  TO authenticated
  USING (visible = true);

CREATE POLICY "Admins can view all KB articles"
  ON kb_articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can create KB articles"
  ON kb_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
    AND autor_id = auth.uid()
  );

CREATE POLICY "Admins can update KB articles"
  ON kb_articles FOR UPDATE
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

CREATE POLICY "Admins can delete KB articles"
  ON kb_articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_kb_articles_updated_at'
  ) THEN
    CREATE TRIGGER update_kb_articles_updated_at BEFORE UPDATE ON kb_articles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
