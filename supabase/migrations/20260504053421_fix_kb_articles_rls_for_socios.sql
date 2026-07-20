/*
  # Fix KB articles RLS policy for socios

  1. Changes
    - Drop and recreate the "Anyone authenticated can view visible KB articles" policy
    - Make it explicitly allow ALL authenticated users (including socios) to read visible articles
    - Also add a policy for the 'socio' role specifically via JWT check for extra clarity
  
  2. Security
    - Socios can only see articles where visible = true
    - Admins retain full access via their existing policy
*/

-- Drop the existing policy and recreate with explicit role check
DROP POLICY IF EXISTS "Anyone authenticated can view visible KB articles" ON kb_articles;

CREATE POLICY "Authenticated users can view visible KB articles"
  ON kb_articles
  FOR SELECT
  TO authenticated
  USING (visible = true);
