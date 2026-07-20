/*
  # Allow anonymous users to submit reviews via public review link

  1. Problem
    - The public review form at /review/:socioId allows anyone to submit a review
    - However, the customer_reviews table only has INSERT policies for authenticated users
    - Anonymous visitors (e.g., clients opening the link on mobile) cannot submit reviews

  2. Changes
    - Add INSERT policy for anon role on customer_reviews
    - Policy validates that the socio_id references an actual socio in profiles
    - Policy enforces that estatus is always 'pendiente' to prevent abuse

  3. Security
    - Only allows inserting with estatus = 'pendiente' (reviews still require admin approval)
    - Validates that socio_id corresponds to an existing user with rol = 'socio'
    - No sensitive data exposure since this is INSERT-only
*/

CREATE POLICY "Anon can submit reviews via public link"
  ON customer_reviews
  FOR INSERT
  TO anon
  WITH CHECK (
    estatus = 'pendiente'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = socio_id
      AND profiles.rol = 'socio'
    )
  );
