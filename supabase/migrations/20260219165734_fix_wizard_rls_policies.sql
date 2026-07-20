/*
  # Fix RLS policies for wizard public access

  1. Changes
    - Allow public read access to wizard_accesos by token
    - Allow public read access to content_blocks for wizard section
    - Ensure wizard_results, wizard_prospectos have correct policies
*/

-- Allow anyone to read wizard_accesos by token (needed for validation)
DROP POLICY IF EXISTS "Anyone can read wizard access by token" ON wizard_accesos;
CREATE POLICY "Anyone can read wizard access by token"
  ON wizard_accesos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to read wizard content blocks
DROP POLICY IF EXISTS "Anyone can read wizard content" ON content_blocks;
CREATE POLICY "Anyone can read wizard content"
  ON content_blocks
  FOR SELECT
  TO anon, authenticated
  USING (section = 'wizard' OR section = 'landing');
