/*
  # Fix all RLS recursion issues across all tables

  1. Changes
    - Replace all policies that query profiles table with JWT-based checks
    - This prevents infinite recursion when checking roles
  
  2. Security
    - Maintains same security model but uses auth.jwt()->>'rol' instead of querying profiles
    - Users can still only access their own data
    - Admins and super_admins can access all data
*/

-- LEADS table
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
DROP POLICY IF EXISTS "Admins can update all leads" ON leads;

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update all leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- VENTAS table
DROP POLICY IF EXISTS "Admins can view all ventas" ON ventas;
DROP POLICY IF EXISTS "Admins can update all ventas" ON ventas;

CREATE POLICY "Admins can view all ventas"
  ON ventas FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update all ventas"
  ON ventas FOR UPDATE
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- COMISIONES table
DROP POLICY IF EXISTS "Admins can view all comisiones" ON comisiones;
DROP POLICY IF EXISTS "Admins can insert comisiones" ON comisiones;
DROP POLICY IF EXISTS "Admins can update comisiones" ON comisiones;

CREATE POLICY "Admins can view all comisiones"
  ON comisiones FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can insert comisiones"
  ON comisiones FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update comisiones"
  ON comisiones FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- SOLICITUDES_PAGO table
DROP POLICY IF EXISTS "Admins can view all solicitudes" ON solicitudes_pago;
DROP POLICY IF EXISTS "Admins can update solicitudes" ON solicitudes_pago;

CREATE POLICY "Admins can view all solicitudes"
  ON solicitudes_pago FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update solicitudes"
  ON solicitudes_pago FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- CASOS_EXITO table
DROP POLICY IF EXISTS "Admins can view all casos_exito" ON casos_exito;
DROP POLICY IF EXISTS "Admins can update casos_exito" ON casos_exito;

CREATE POLICY "Admins can view all casos_exito"
  ON casos_exito FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update casos_exito"
  ON casos_exito FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- CUSTOMER_REVIEWS table
DROP POLICY IF EXISTS "Admins can view all reviews" ON customer_reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON customer_reviews;

CREATE POLICY "Admins can view all reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (
    socio_id = auth.uid() OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- PLANES table
DROP POLICY IF EXISTS "Anyone authenticated can view active planes" ON planes;
DROP POLICY IF EXISTS "Admins can insert planes" ON planes;
DROP POLICY IF EXISTS "Admins can update planes" ON planes;
DROP POLICY IF EXISTS "Admins can delete planes" ON planes;

CREATE POLICY "Anyone authenticated can view active planes"
  ON planes FOR SELECT
  TO authenticated
  USING (
    activo = true OR
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can insert planes"
  ON planes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update planes"
  ON planes FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can delete planes"
  ON planes FOR DELETE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

-- CONTENT_BLOCKS table
DROP POLICY IF EXISTS "Admins can insert content" ON content_blocks;
DROP POLICY IF EXISTS "Admins can update content" ON content_blocks;
DROP POLICY IF EXISTS "Admins can delete content" ON content_blocks;

CREATE POLICY "Admins can insert content"
  ON content_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update content"
  ON content_blocks FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  )
  WITH CHECK (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can delete content"
  ON content_blocks FOR DELETE
  TO authenticated
  USING (
    auth.jwt()->>'rol' IN ('admin', 'super_admin')
  );
