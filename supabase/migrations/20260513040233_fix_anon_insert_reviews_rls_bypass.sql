/*
  # Fix anonymous review submission - RLS subquery conflict

  1. Problem
    - The existing "Anon can submit reviews via public link" policy uses a subquery 
      against profiles table within WITH CHECK
    - When anon tries to insert, the subquery against profiles is ALSO subject to RLS
    - This creates a circular dependency where the INSERT is rejected even though
      anon has SELECT access to profiles

  2. Solution
    - Create a SECURITY DEFINER helper function that checks if a given user_id 
      is a valid socio, bypassing RLS
    - Replace the policy to use this helper function instead of a direct subquery

  3. Security
    - The helper function only returns a boolean (no data leakage)
    - The policy still enforces estatus = 'pendiente'
    - The policy still validates that socio_id references a real socio
*/

-- Create helper function that bypasses RLS to check if a user is a socio
CREATE OR REPLACE FUNCTION public.is_valid_socio(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND rol = 'socio'
  );
$$;

-- Drop the existing broken policy
DROP POLICY IF EXISTS "Anon can submit reviews via public link" ON customer_reviews;

-- Create fixed policy using the SECURITY DEFINER function
CREATE POLICY "Anon can submit reviews via public link"
  ON customer_reviews
  FOR INSERT
  TO anon
  WITH CHECK (
    estatus = 'pendiente'
    AND is_valid_socio(socio_id)
  );
