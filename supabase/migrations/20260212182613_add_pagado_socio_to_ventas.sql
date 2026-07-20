/*
  # Add pagado_socio field to ventas

  1. Changes
    - Add pagado_socio (boolean) to ventas table
    - Indicates if the commission has been paid to the partner
    - Default false
  
  2. Notes
    - This field helps track which sales have been included in payment requests
    - Admins will mark this as true when payment is processed
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ventas' AND column_name = 'pagado_socio'
  ) THEN
    ALTER TABLE ventas ADD COLUMN pagado_socio boolean NOT NULL DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ventas_pagado_socio ON ventas(pagado_socio);
