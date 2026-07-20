/*
  # Fix wizard_prospectos table structure

  1. Changes
    - Add token column for linking to wizard_accesos
    - Add interesado boolean field
    - Allow public insert for anonymous wizard submissions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wizard_prospectos' AND column_name = 'token'
  ) THEN
    ALTER TABLE wizard_prospectos ADD COLUMN token text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wizard_prospectos' AND column_name = 'interesado'
  ) THEN
    ALTER TABLE wizard_prospectos ADD COLUMN interesado boolean DEFAULT false;
  END IF;
END $$;

-- Allow public to insert prospectos (anonymous wizard users)
DROP POLICY IF EXISTS "Anyone can insert prospects" ON wizard_prospectos;
CREATE POLICY "Anyone can insert prospects"
  ON wizard_prospectos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
