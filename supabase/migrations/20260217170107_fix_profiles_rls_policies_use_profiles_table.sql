/*
  # Fix profiles RLS policies to use profiles table

  1. Changes
    - Drop old RLS policies that read from JWT
    - Create new RLS policies that read role from profiles table
    - This ensures RLS works regardless of auth metadata

  2. Security
    - Users can only view their own profile
    - Admins and super_admins can view all profiles
    - Super admins can insert and update any profile
    - Regular users can update their own profile
*/

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON profiles;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS text AS $$
  SELECT rol FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- SELECT: Users can view their own profile OR if they are admin/super_admin can view all
CREATE POLICY "Users can view own profile or admins view all"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR get_current_user_role() IN ('admin', 'super_admin')
  );

-- INSERT: Only super_admins can insert (used when creating users)
CREATE POLICY "Super admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'super_admin');

-- UPDATE: Users can update their own profile OR super_admins can update any
CREATE POLICY "Users can update own profile or super admins update any"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR get_current_user_role() = 'super_admin'
  )
  WITH CHECK (
    auth.uid() = id 
    OR get_current_user_role() = 'super_admin'
  );
