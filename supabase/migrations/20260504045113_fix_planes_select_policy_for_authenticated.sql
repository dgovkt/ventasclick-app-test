/*
  # Fix planes SELECT policy for authenticated users

  1. Problem
    - The SELECT policy on `planes` only applied to `anon` role
    - Authenticated users (admin, super_admin) could not read any plans
    - This caused the Settings page to show empty Planes and Comisiones tabs

  2. Fix
    - Add a SELECT policy for authenticated admins/super_admins to view ALL plans (including inactive)
    - Keep the existing anon policy that only shows active plans for public use (wizard)
*/

CREATE POLICY "Admins can view all planes"
  ON planes
  FOR SELECT
  TO authenticated
  USING (
    ((auth.jwt() -> 'user_metadata'::text) ->> 'rol'::text) = ANY (ARRAY['admin'::text, 'super_admin'::text])
  );
