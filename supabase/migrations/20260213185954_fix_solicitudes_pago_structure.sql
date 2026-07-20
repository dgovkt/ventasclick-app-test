/*
  # Fix solicitudes_pago and ventas table structure

  1. Changes to solicitudes_pago
    - Drop old columns that don't match the schema
    - Add correct columns: monto_solicitado, fecha_inicio, fecha_fin, comentarios_admin
    - Remove incorrect columns: periodo, monto_total_estimado, monto_total_autorizado, notas_admin
  
  2. Changes to ventas
    - Add comision_socio column (numeric)
    - Add fecha_cierre column (timestamptz)
    - Update estatus_pago check to include 'completado'
  
  3. Notes
    - This migration fixes the mismatch between the code and database schema
    - Safe to run multiple times due to IF EXISTS/IF NOT EXISTS checks
*/

-- Fix solicitudes_pago table structure
DO $$ 
BEGIN
  -- Drop old columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'periodo') THEN
    ALTER TABLE solicitudes_pago DROP COLUMN periodo;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'monto_total_estimado') THEN
    ALTER TABLE solicitudes_pago DROP COLUMN monto_total_estimado;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'monto_total_autorizado') THEN
    ALTER TABLE solicitudes_pago DROP COLUMN monto_total_autorizado;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'notas_admin') THEN
    ALTER TABLE solicitudes_pago RENAME COLUMN notas_admin TO comentarios_admin;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'fecha_solicitud') THEN
    ALTER TABLE solicitudes_pago DROP COLUMN fecha_solicitud;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'fecha_resolucion') THEN
    ALTER TABLE solicitudes_pago DROP COLUMN fecha_resolucion;
  END IF;

  -- Add correct columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'monto_solicitado') THEN
    ALTER TABLE solicitudes_pago ADD COLUMN monto_solicitado numeric(10, 2) NOT NULL DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'fecha_inicio') THEN
    ALTER TABLE solicitudes_pago ADD COLUMN fecha_inicio date NOT NULL DEFAULT CURRENT_DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'fecha_fin') THEN
    ALTER TABLE solicitudes_pago ADD COLUMN fecha_fin date NOT NULL DEFAULT CURRENT_DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'payment_reference') THEN
    ALTER TABLE solicitudes_pago ADD COLUMN payment_reference text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitudes_pago' AND column_name = 'payment_date') THEN
    ALTER TABLE solicitudes_pago ADD COLUMN payment_date timestamptz;
  END IF;
END $$;

-- Fix ventas table structure
DO $$
BEGIN
  -- Add comision_socio column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ventas' AND column_name = 'comision_socio') THEN
    ALTER TABLE ventas ADD COLUMN comision_socio numeric(10, 2) DEFAULT 0;
  END IF;
  
  -- Add fecha_cierre column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ventas' AND column_name = 'fecha_cierre') THEN
    ALTER TABLE ventas ADD COLUMN fecha_cierre timestamptz DEFAULT now();
  END IF;
  
  -- Drop and recreate the check constraint for estatus_pago to include 'completado'
  ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_estatus_pago_check;
  ALTER TABLE ventas ADD CONSTRAINT ventas_estatus_pago_check 
    CHECK (estatus_pago IN ('pendiente', 'pagado', 'completado', 'fallido'));
END $$;

-- Update existing ventas to have fecha_cierre = fecha if not set
UPDATE ventas SET fecha_cierre = fecha WHERE fecha_cierre IS NULL;

-- Add comment to explain the new columns
COMMENT ON COLUMN ventas.comision_socio IS 'Comisión calculada para el socio en esta venta';
COMMENT ON COLUMN ventas.fecha_cierre IS 'Fecha en que se cerró/completó la venta';
COMMENT ON COLUMN solicitudes_pago.monto_solicitado IS 'Monto total solicitado por el socio';
COMMENT ON COLUMN solicitudes_pago.fecha_inicio IS 'Fecha inicial del período de ventas';
COMMENT ON COLUMN solicitudes_pago.fecha_fin IS 'Fecha final del período de ventas';
