/*
  # Clean up duplicate profiles policies

  1. Changes
    - Drop old "Users can view own profile" policy if exists
    - Drop old "Users can update own profile" policy if exists
    - Create clean policies for basic user access
  
  2. Security
    - Users can view their own profile
    - Users can update their own profile
    - No recursion issues
*/

-- Drop potentially duplicate policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create clean basic policies for all users
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
