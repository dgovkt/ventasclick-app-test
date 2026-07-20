/*
  # Sync profile roles to auth.users metadata

  Some users have mismatched roles between `profiles.rol` and
  `auth.users.raw_user_meta_data->>'rol'`. The JWT-based
  `get_current_user_role()` reads from metadata, so these users
  cannot access admin features.

  1. Changes
    - Sync all existing users: copy `profiles.rol` to `auth.users.raw_user_meta_data`
    - Create trigger on `profiles` table so future role changes
      are automatically synced to auth.users metadata

  2. Security
    - Trigger function uses SECURITY DEFINER to write to auth.users
    - Only syncs the `rol` field, preserves all other metadata
*/

-- Step 1: Sync existing mismatched roles
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT p.id, p.rol, u.raw_user_meta_data
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE COALESCE(u.raw_user_meta_data->>'rol', '') != p.rol
  LOOP
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(r.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('rol', r.rol)
    WHERE id = r.id;
  END LOOP;
END $$;

-- Step 2: Create trigger function to keep roles in sync
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NEW.rol IS DISTINCT FROM OLD.rol THEN
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('rol', NEW.rol)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 3: Attach trigger
DROP TRIGGER IF EXISTS on_profile_role_change ON profiles;
CREATE TRIGGER on_profile_role_change
  AFTER UPDATE OF rol ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role_to_auth();