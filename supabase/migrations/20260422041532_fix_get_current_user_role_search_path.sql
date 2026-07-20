/*
  # Fix get_current_user_role() function search_path

  The SECURITY DEFINER function lacked a `search_path` setting.
  Without it, `auth.uid()` may not resolve correctly because
  the `auth` schema is not in the default search path when
  running as the function owner.

  1. Changes
    - Recreate `get_current_user_role()` with explicit
      `SET search_path = public, auth` so that both `profiles`
      and `auth.uid()` resolve correctly.
    - Function remains SECURITY DEFINER + STABLE.

  2. Impact
    - Fixes all RLS policies that depend on this function
      (kb_articles, content_blocks, chargebee_config,
       chargebee_webhooks, solicitudes_pago, etc.)
*/

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT rol FROM profiles WHERE id = auth.uid();
$$;