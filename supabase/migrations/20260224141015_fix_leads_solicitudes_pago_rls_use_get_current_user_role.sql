/*
  # Fix leads and solicitudes_pago RLS policies

  ## Problem
  Same issue as ventas: admin policies on leads and solicitudes_pago use
  `auth.jwt() ->> 'rol'` which is not reliably populated. Super admins cannot
  see data from other users.

  ## Fix
  Replace JWT rol checks with get_current_user_role() on all affected policies.
*/

-- leads
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
DROP POLICY IF EXISTS "Admins can update all leads" ON leads;

CREATE POLICY "Admins can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  );

CREATE POLICY "Admins can update all leads"
  ON leads
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

-- solicitudes_pago
DROP POLICY IF EXISTS "Admins can view all solicitudes" ON solicitudes_pago;
DROP POLICY IF EXISTS "Admins can update solicitudes" ON solicitudes_pago;

CREATE POLICY "Admins can view all solicitudes"
  ON solicitudes_pago
  FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid()
    OR get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  );

CREATE POLICY "Admins can update solicitudes"
  ON solicitudes_pago
  FOR UPDATE
  TO authenticated
  USING (
    get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  )
  WITH CHECK (
    get_current_user_role() = ANY (ARRAY['admin', 'super_admin'])
  );
