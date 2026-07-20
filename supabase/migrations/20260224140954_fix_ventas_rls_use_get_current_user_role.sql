/*
  # Fix ventas RLS policies - use get_current_user_role() instead of JWT claim

  ## Problem
  The existing "Admins can view all ventas" and "Admins can update all ventas" policies
  check the role using `auth.jwt() ->> 'rol'`, but the rol field is stored in the
  profiles table and is NOT reliably synced to the JWT claims. This causes super_admin
  users to be unable to see ventas created by socios.

  ## Fix
  Replace JWT-based role checks with get_current_user_role() which reads directly from
  the profiles table, consistent with how other tables (profiles, leads, etc.) handle
  admin access.

  ## Changes
  - Drop and recreate "Admins can view all ventas" SELECT policy
  - Drop and recreate "Admins can update all ventas" UPDATE policy
*/

DROP POLICY IF EXISTS "Admins can view all ventas" ON ventas;
DROP POLICY IF EXISTS "Admins can update all ventas" ON ventas;

CREATE POLICY "Admins can view all ventas"
  ON ventas
  FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  );

CREATE POLICY "Admins can update all ventas"
  ON ventas
  FOR UPDATE
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  )
  WITH CHECK (
    socio_id = auth.uid()
    OR get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  );
