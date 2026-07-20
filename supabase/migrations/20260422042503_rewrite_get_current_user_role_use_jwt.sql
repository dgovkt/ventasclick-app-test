/*
  # Rewrite get_current_user_role() to read from JWT token

  The previous implementation queried the `profiles` table, which caused
  recursive RLS evaluation issues even with SECURITY DEFINER + search_path.

  The new implementation reads the role directly from the JWT token's
  `user_metadata.rol` field, which requires no database query at all.
  This completely eliminates all recursion issues.

  1. Changes
    - `get_current_user_role()` now uses `auth.jwt()->'user_metadata'->>'rol'`
    - No longer queries the `profiles` table
    - Still SECURITY DEFINER + STABLE for compatibility

  2. Impact
    - All 19+ RLS policies that depend on this function now work correctly
    - Admin/super_admin users can read, create, update, and delete
      articles, content blocks, and all other protected resources
*/

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT COALESCE(
    auth.jwt()->'user_metadata'->>'rol',
    'socio'
  );
$$;