/*
  # Fix RLS: Use app_metadata for role checks

  The current RLS policies check `user_metadata.rol` from the JWT token.
  While this works when synced properly, `app_metadata` is more reliable
  because it cannot be modified by the user (only by server-side operations).

  1. Changes
    - Sync all existing user roles to `raw_app_meta_data`
    - Update the trigger to also sync to `raw_app_meta_data`
    - Update `get_current_user_role()` to check `app_metadata` first, then `user_metadata`
    - Recreate all critical RLS policies to use the updated function

  2. Security
    - `app_metadata` cannot be modified by the client
    - Fallback chain: app_metadata.rol -> user_metadata.rol -> 'socio'
*/

-- Step 1: Sync existing roles to raw_app_meta_data
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT p.id, p.rol, u.raw_app_meta_data
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
  LOOP
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(r.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('rol', r.rol)
    WHERE id = r.id;
  END LOOP;
END $$;

-- Step 2: Update trigger to sync to both metadata fields
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NEW.rol IS DISTINCT FROM OLD.rol THEN
    UPDATE auth.users
    SET
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('rol', NEW.rol),
      raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('rol', NEW.rol)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 3: Update get_current_user_role() to check app_metadata first
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  claims := coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb,
    '{}'::jsonb
  );
  -- Check app_metadata first (cannot be tampered by user), then user_metadata
  user_role := claims->'app_metadata'->>'rol';
  IF user_role IS NULL THEN
    user_role := claims->'user_metadata'->>'rol';
  END IF;
  RETURN coalesce(user_role, 'socio');
END;
$$;

-- Step 4: Recreate critical RLS policies using get_current_user_role()
-- This ensures they work regardless of which metadata field has the role

-- KB Articles
DROP POLICY IF EXISTS "Admins can view all KB articles" ON kb_articles;
CREATE POLICY "Admins can view all KB articles"
  ON kb_articles FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can create KB articles" ON kb_articles;
CREATE POLICY "Admins can create KB articles"
  ON kb_articles FOR INSERT TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update KB articles" ON kb_articles;
CREATE POLICY "Admins can update KB articles"
  ON kb_articles FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can delete KB articles" ON kb_articles;
CREATE POLICY "Admins can delete KB articles"
  ON kb_articles FOR DELETE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Customer Reviews
DROP POLICY IF EXISTS "Admins can view all reviews" ON customer_reviews;
CREATE POLICY "Admins can view all reviews"
  ON customer_reviews FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update reviews" ON customer_reviews;
CREATE POLICY "Admins can update reviews"
  ON customer_reviews FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- Casos de Exito
DROP POLICY IF EXISTS "Admins can view all casos_exito" ON casos_exito;
CREATE POLICY "Admins can view all casos_exito"
  ON casos_exito FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update casos_exito" ON casos_exito;
CREATE POLICY "Admins can update casos_exito"
  ON casos_exito FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

-- Planes
DROP POLICY IF EXISTS "Admins can view all planes" ON planes;
CREATE POLICY "Admins can view all planes"
  ON planes FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can insert planes" ON planes;
CREATE POLICY "Admins can insert planes"
  ON planes FOR INSERT TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can update planes" ON planes;
CREATE POLICY "Admins can update planes"
  ON planes FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can delete planes" ON planes;
CREATE POLICY "Admins can delete planes"
  ON planes FOR DELETE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'));

-- System Config
DROP POLICY IF EXISTS "Admins can update config" ON system_config;
CREATE POLICY "Admins can update config"
  ON system_config FOR UPDATE TO authenticated
  USING (get_current_user_role() IN ('admin', 'super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));

DROP POLICY IF EXISTS "Admins can insert config" ON system_config;
CREATE POLICY "Admins can insert config"
  ON system_config FOR INSERT TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'super_admin'));