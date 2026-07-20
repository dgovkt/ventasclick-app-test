/*
  # Allow anonymous users to read active plans

  ## Problem
  The wizard runs unauthenticated (anon role). The existing SELECT policy
  on `planes` only allows `authenticated` users, so anon wizard sessions
  cannot read plan data, causing the save flow to fail.

  ## Fix
  Add a SELECT policy that allows anon users to view active plans.
*/

CREATE POLICY "Anyone can view active planes"
  ON planes
  FOR SELECT
  TO anon
  USING (activo = true);
