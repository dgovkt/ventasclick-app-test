/*
  # Fix all broken RLS policies using auth.jwt() ->> 'rol'

  The JWT token does not contain a top-level 'rol' claim. The role is stored
  in the `profiles` table and must be read via `get_current_user_role()`.

  Policies using `auth.jwt() ->> 'rol'` silently deny all admin operations
  (reads, writes, updates) because the condition never matches.

  1. Affected Tables
    - `casos_exito`: admin SELECT and UPDATE policies
    - `comisiones`: admin INSERT, SELECT, and UPDATE policies
    - `customer_reviews`: admin SELECT and UPDATE policies
    - `wizard_results`: admin SELECT policy

  2. Changes
    - Drop each broken policy
    - Recreate with `get_current_user_role() IN ('admin', 'super_admin')`

  3. Security
    - No change in access level — same roles allowed, just using the correct lookup
    - All policies remain restricted to authenticated admin/super_admin users
*/

-- =============================================================
-- casos_exito
-- =============================================================

DROP POLICY IF EXISTS "Admins can view all casos_exito" ON casos_exito;
CREATE POLICY "Admins can view all casos_exito"
  ON casos_exito
  FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() IN ('admin', 'super_admin')
  );

DROP POLICY IF EXISTS "Admins can update casos_exito" ON casos_exito;
CREATE POLICY "Admins can update casos_exito"
  ON casos_exito
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================================
-- comisiones
-- =============================================================

DROP POLICY IF EXISTS "Admins can insert comisiones" ON comisiones;
CREATE POLICY "Admins can insert comisiones"
  ON comisiones
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can view all comisiones" ON comisiones;
CREATE POLICY "Admins can view all comisiones"
  ON comisiones
  FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() IN ('admin', 'super_admin')
  );

DROP POLICY IF EXISTS "Admins can update comisiones" ON comisiones;
CREATE POLICY "Admins can update comisiones"
  ON comisiones
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================================
-- customer_reviews
-- =============================================================

DROP POLICY IF EXISTS "Admins can view all reviews" ON customer_reviews;
CREATE POLICY "Admins can view all reviews"
  ON customer_reviews
  FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() IN ('admin', 'super_admin')
  );

DROP POLICY IF EXISTS "Admins can update reviews" ON customer_reviews;
CREATE POLICY "Admins can update reviews"
  ON customer_reviews
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================================
-- wizard_results
-- =============================================================

DROP POLICY IF EXISTS "Admins can view all wizard results" ON wizard_results;
CREATE POLICY "Admins can view all wizard results"
  ON wizard_results
  FOR SELECT
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));