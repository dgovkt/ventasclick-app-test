/*
  # Fix planes table RLS policies

  1. Changes
    - Replace all RLS policies on the `planes` table that use `auth.jwt() ->> 'rol'`
      with `get_current_user_role()` which reads the role from the `profiles` table
    - This fixes the bug where editing/saving a plan had no effect because the JWT
      does not contain a top-level `rol` claim, causing the UPDATE policy to silently
      reject the write

  2. Affected Policies
    - "Admins can update planes" (UPDATE) - was blocking plan edits
    - "Admins can insert planes" (INSERT) - was blocking new plan creation
    - "Admins can delete planes" (DELETE) - was blocking plan deletion
    - "Anyone authenticated can view active planes" (SELECT) - admin branch was broken

  3. Notes
    - The `get_current_user_role()` function already exists as SECURITY DEFINER
      and is used by other tables (ventas, leads, solicitudes_pago)
    - The anonymous SELECT policy "Anyone can view active planes" is left unchanged
*/

-- Drop existing broken policies
DROP POLICY IF EXISTS "Admins can update planes" ON planes;
DROP POLICY IF EXISTS "Admins can insert planes" ON planes;
DROP POLICY IF EXISTS "Admins can delete planes" ON planes;
DROP POLICY IF EXISTS "Anyone authenticated can view active planes" ON planes;

-- Recreate with get_current_user_role()
CREATE POLICY "Admins can update planes"
  ON planes
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can insert planes"
  ON planes
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can delete planes"
  ON planes
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Anyone authenticated can view active planes"
  ON planes
  FOR SELECT
  TO authenticated
  USING (
    activo = true
    OR get_current_user_role() IN ('admin', 'super_admin')
  );