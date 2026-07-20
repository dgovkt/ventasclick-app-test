/*
  # Add planes SELECT policy for socios

  1. Problem
    - Socios (authenticated) also need to read active planes for the commission simulator,
      prospects page, and wizard flow
    - Only anon users could previously read active planes

  2. Fix
    - Add SELECT policy for authenticated socios to view active plans only
*/

CREATE POLICY "Socios can view active planes"
  ON planes
  FOR SELECT
  TO authenticated
  USING (
    activo = true
    AND ((auth.jwt() -> 'user_metadata'::text) ->> 'rol'::text) = 'socio'
  );
