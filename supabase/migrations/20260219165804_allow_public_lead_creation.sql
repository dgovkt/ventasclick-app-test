/*
  # Allow public lead creation from wizard

  1. Changes
    - Allow anonymous users to insert leads (from wizard)
*/

-- Allow anyone to insert leads (wizard creates leads anonymously)
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
