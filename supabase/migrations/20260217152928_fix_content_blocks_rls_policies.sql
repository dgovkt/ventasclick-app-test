/*
  # Fix Content Blocks RLS Policies

  1. Changes
    - Drop existing policies that check JWT
    - Create new policies that check profiles table
    - Ensure admins can manage content properly
  
  2. Security
    - Authenticated users can view content
    - Only admin and super_admin roles can modify content
*/

DROP POLICY IF EXISTS "Anyone authenticated can view content" ON content_blocks;
DROP POLICY IF EXISTS "Admins can insert content" ON content_blocks;
DROP POLICY IF EXISTS "Admins can update content" ON content_blocks;
DROP POLICY IF EXISTS "Admins can delete content" ON content_blocks;

CREATE POLICY "Authenticated users can view content"
  ON content_blocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert content blocks"
  ON content_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update content blocks"
  ON content_blocks FOR UPDATE
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

CREATE POLICY "Admins can delete content blocks"
  ON content_blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );