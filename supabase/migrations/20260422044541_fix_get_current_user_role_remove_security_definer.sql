/*
  # Fix get_current_user_role() - remove SECURITY DEFINER

  The function used SECURITY DEFINER which switches execution context
  to the function owner (postgres). In that context, auth.jwt() returns
  NULL because postgres has no JWT. This made the function always return
  'socio' for everyone, breaking all admin RLS policies.

  1. Changes
    - Remove SECURITY DEFINER so the function runs as the calling user
    - auth.jwt() now correctly reads the JWT of the authenticated user
    - Reads role from jwt -> user_metadata -> rol
    - Falls back to 'socio' if not set

  2. Impact
    - Admins/super_admins can now see and manage KB articles
    - Socios can see visible articles
    - All other tables using this function are also fixed
*/

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    auth.jwt()->'user_metadata'->>'rol',
    'socio'
  );
$$;