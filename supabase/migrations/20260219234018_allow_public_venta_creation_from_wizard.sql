/*
  # Allow anonymous venta creation from wizard

  1. Changes
    - Add INSERT policy on ventas for anon role
    - Needed when a prospect selects "Adquirir plan ahora" in the public wizard
*/

DROP POLICY IF EXISTS "Anyone can insert ventas from wizard" ON ventas;
CREATE POLICY "Anyone can insert ventas from wizard"
  ON ventas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
