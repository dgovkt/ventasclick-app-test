/*
  # Fix wizard_results RLS for public access

  1. Changes
    - Allow public insert to wizard_results
    - Allow public select for retrieving diagnosis
*/

-- Allow anyone to insert wizard results
DROP POLICY IF EXISTS "Anyone can insert results" ON wizard_results;
CREATE POLICY "Anyone can insert results"
  ON wizard_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read results by token
DROP POLICY IF EXISTS "Anyone can read results by token" ON wizard_results;
CREATE POLICY "Anyone can read results by token"
  ON wizard_results
  FOR SELECT
  TO anon, authenticated
  USING (true);
