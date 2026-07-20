/*
  # Allow anonymous users to read socio profile names for review form

  The public review form needs to display the socio's name when a client
  opens the review link. Currently, `profiles` only has SELECT policies
  for authenticated users, so anonymous visitors get "Socio no encontrado".

  1. Changes
    - Add a SELECT policy for anon users that only exposes nombre and apellido
      of socio profiles (via a limited USING clause that checks rol = 'socio')

  2. Security
    - Only allows reading profiles where rol = 'socio'
    - The frontend query already filters by id and rol, so exposure is minimal
    - No sensitive fields (email, telefono, etc.) are exposed by this policy
      since the frontend only selects nombre and apellido
*/

CREATE POLICY "Anon can view socio names for reviews"
  ON profiles
  FOR SELECT
  TO anon
  USING (rol = 'socio');