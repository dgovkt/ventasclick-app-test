/*
  # Fix all RLS policies using profiles subquery (recursion bug)

  Many policies check the user's role via `EXISTS (SELECT 1 FROM profiles WHERE ...)`
  But the `profiles` table has its own RLS policy that calls `get_current_user_role()`,
  which queries `profiles` again -- causing infinite recursion. Postgres silently
  resolves this by returning zero rows, so the policies always deny access.

  The fix: replace all `EXISTS (SELECT 1 FROM profiles ...)` checks with
  `get_current_user_role()` which is SECURITY DEFINER and bypasses RLS.

  1. Affected Tables (19 policies across 10 tables)
    - chargebee_config: UPDATE
    - chargebee_webhooks: SELECT, UPDATE
    - content_blocks: DELETE, INSERT, UPDATE
    - evidencias_ventas: SELECT
    - kb_articles: DELETE, INSERT, SELECT, UPDATE
    - socio_manual_sections: DELETE, INSERT, UPDATE
    - solicitud_pago_ventas: SELECT
    - solicitudes_pago: SELECT, UPDATE
    - wizard_accesos: SELECT
    - wizard_prospectos: SELECT

  2. Security
    - No change in access level -- same roles, correct lookup method
*/

-- =============================================
-- chargebee_config
-- =============================================
DROP POLICY IF EXISTS "Super admin can update chargebee config" ON chargebee_config;
CREATE POLICY "Super admin can update chargebee config"
  ON chargebee_config FOR UPDATE TO authenticated
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

-- =============================================
-- chargebee_webhooks
-- =============================================
DROP POLICY IF EXISTS "Only admins can view webhooks" ON chargebee_webhooks;
CREATE POLICY "Only admins can view webhooks"
  ON chargebee_webhooks FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "System can update webhooks" ON chargebee_webhooks;
CREATE POLICY "System can update webhooks"
  ON chargebee_webhooks FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================
-- content_blocks
-- =============================================
DROP POLICY IF EXISTS "Admins can delete content blocks" ON content_blocks;
CREATE POLICY "Admins can delete content blocks"
  ON content_blocks FOR DELETE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can insert content blocks" ON content_blocks;
CREATE POLICY "Admins can insert content blocks"
  ON content_blocks FOR INSERT TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update content blocks" ON content_blocks;
CREATE POLICY "Admins can update content blocks"
  ON content_blocks FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================
-- evidencias_ventas
-- =============================================
DROP POLICY IF EXISTS "Socios can view own sale evidences" ON evidencias_ventas;
CREATE POLICY "Socios can view own sale evidences"
  ON evidencias_ventas FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventas
      JOIN leads ON ventas.lead_id = leads.id
      WHERE ventas.id = evidencias_ventas.venta_id
        AND leads.socio_id = auth.uid()
    )
    OR get_current_user_role() IN ('admin', 'super_admin')
  );

-- =============================================
-- kb_articles
-- =============================================
DROP POLICY IF EXISTS "Admins can delete KB articles" ON kb_articles;
CREATE POLICY "Admins can delete KB articles"
  ON kb_articles FOR DELETE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can create KB articles" ON kb_articles;
CREATE POLICY "Admins can create KB articles"
  ON kb_articles FOR INSERT TO authenticated
  WITH CHECK (
    get_current_user_role() IN ('admin', 'super_admin')
    AND autor_id = auth.uid()
  );

DROP POLICY IF EXISTS "Admins can view all KB articles" ON kb_articles;
CREATE POLICY "Admins can view all KB articles"
  ON kb_articles FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update KB articles" ON kb_articles;
CREATE POLICY "Admins can update KB articles"
  ON kb_articles FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================
-- socio_manual_sections
-- =============================================
DROP POLICY IF EXISTS "Admins can delete socio manual sections" ON socio_manual_sections;
CREATE POLICY "Admins can delete socio manual sections"
  ON socio_manual_sections FOR DELETE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can insert socio manual sections" ON socio_manual_sections;
CREATE POLICY "Admins can insert socio manual sections"
  ON socio_manual_sections FOR INSERT TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update socio manual sections" ON socio_manual_sections;
CREATE POLICY "Admins can update socio manual sections"
  ON socio_manual_sections FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================
-- solicitud_pago_ventas
-- =============================================
DROP POLICY IF EXISTS "Admins can view all payment request sales" ON solicitud_pago_ventas;
CREATE POLICY "Admins can view all payment request sales"
  ON solicitud_pago_ventas FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================
-- solicitudes_pago
-- =============================================
DROP POLICY IF EXISTS "Admins can view all payment requests" ON solicitudes_pago;
CREATE POLICY "Admins can view all payment requests"
  ON solicitudes_pago FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update payment requests" ON solicitudes_pago;
CREATE POLICY "Admins can update payment requests"
  ON solicitudes_pago FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- =============================================
-- wizard_accesos
-- =============================================
DROP POLICY IF EXISTS "Socios can view own access logs" ON wizard_accesos;
CREATE POLICY "Socios can view own access logs"
  ON wizard_accesos FOR SELECT TO authenticated
  USING (
    auth.uid() = socio_id
    OR get_current_user_role() = 'super_admin'
  );

-- =============================================
-- wizard_prospectos
-- =============================================
DROP POLICY IF EXISTS "Socios can view own prospects" ON wizard_prospectos;
CREATE POLICY "Socios can view own prospects"
  ON wizard_prospectos FOR SELECT TO authenticated
  USING (
    auth.uid() = socio_id
    OR get_current_user_role() = 'super_admin'
  );