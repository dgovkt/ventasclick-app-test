/*
  # Fix profiles RLS infinite recursion

  1. Changes
    - Drop existing policies that cause recursion
    - Create new policies using auth.jwt() to access rol from user metadata
    - This avoids querying the profiles table within profiles policies
  
  2. Security
    - Users can still only view and update their own profiles
    - Admins and super_admins can view all profiles
    - Super admins can update and insert profiles
    - No recursion because we use JWT claims instead of table queries
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON profiles;

-- Create new policies using JWT claims to avoid recursion
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    (auth.jwt()->>'rol' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    (auth.jwt()->>'rol' = 'super_admin')
  )
  WITH CHECK (
    auth.uid() = id OR
    (auth.jwt()->>'rol' = 'super_admin')
  );

CREATE POLICY "Super admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'rol' = 'super_admin'
  );
