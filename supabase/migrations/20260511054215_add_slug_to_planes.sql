/*
  # Add slug column to planes table

  1. Changes
    - Adds `slug` column (text, unique) to `planes` table
    - Populates slugs for existing known plans used by the wizard
    - Adds unique constraint to prevent duplicate slugs

  2. Purpose
    - Decouples wizard plan lookups from display names
    - Admins can rename plans freely without breaking the wizard
    - The slug is a stable, internal identifier

  3. Slug assignments
    - 'Plan Presencia Web' (active) -> 'presencia_web'
    - 'Plan Tienda Básico' -> 'tienda_basico'
    - 'Plan Tienda Esencial' -> 'tienda_esencial'
    - 'Plan Tienda Premium' -> 'tienda_premium'
    - Other plans get auto-generated slugs from their names
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'planes' AND column_name = 'slug'
  ) THEN
    ALTER TABLE planes ADD COLUMN slug text;
  END IF;
END $$;

-- Set slugs for the wizard-critical plans
UPDATE planes SET slug = 'presencia_web' WHERE nombre = 'Plan Presencia Web' AND activo = true AND slug IS NULL;
UPDATE planes SET slug = 'tienda_basico' WHERE nombre = 'Plan Tienda Básico' AND activo = true AND slug IS NULL;
UPDATE planes SET slug = 'tienda_esencial' WHERE nombre = 'Plan Tienda Esencial' AND activo = true AND slug IS NULL;
UPDATE planes SET slug = 'tienda_premium' WHERE nombre = 'Plan Tienda Premium' AND activo = true AND slug IS NULL;

-- Auto-generate slugs for any remaining plans that don't have one
UPDATE planes SET slug = lower(replace(replace(replace(replace(nombre, ' ', '_'), 'á', 'a'), 'é', 'e'), 'í', 'i'))
WHERE slug IS NULL;

-- Ensure uniqueness - append id fragment if duplicates exist
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY activo DESC, created_at DESC) as rn
    FROM planes
    WHERE slug IS NOT NULL
  LOOP
    IF r.rn > 1 THEN
      UPDATE planes SET slug = r.slug || '_' || left(r.id::text, 8) WHERE id = r.id;
    END IF;
  END LOOP;
END $$;

-- Now make slug NOT NULL and UNIQUE
ALTER TABLE planes ALTER COLUMN slug SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'planes_slug_key'
  ) THEN
    ALTER TABLE planes ADD CONSTRAINT planes_slug_key UNIQUE (slug);
  END IF;
END $$;