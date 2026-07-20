/*
  # Add porcentaje_comision column to planes

  1. Modified Tables
    - `planes`
      - Added `porcentaje_comision` (numeric, default 0) - stores the commission percentage
  
  2. Notes
    - The comision_socio column remains for backward compatibility
    - porcentaje_comision is the source of truth; comision_socio is derived as (precio_anual * porcentaje_comision / 100)
    - Backfill existing plans: calculate porcentaje from existing comision_socio values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'planes' AND column_name = 'porcentaje_comision'
  ) THEN
    ALTER TABLE planes ADD COLUMN porcentaje_comision numeric DEFAULT 0;
  END IF;
END $$;

-- Backfill: derive percentage from existing data
UPDATE planes
SET porcentaje_comision = CASE
  WHEN precio_anual > 0 THEN ROUND((comision_socio / precio_anual) * 100, 2)
  ELSE 0
END
WHERE porcentaje_comision = 0 OR porcentaje_comision IS NULL;