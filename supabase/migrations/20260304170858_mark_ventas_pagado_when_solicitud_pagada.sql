/*
  # Mark ventas as pagado_socio=true when solicitud is paid

  ## Summary
  When a solicitud_pago is marked as 'pagada', all the linked ventas
  should have their pagado_socio flag set to true. This ensures:
  1. Those ventas no longer appear in any pending commission calculations
  2. The system stays in a consistent state
  3. Future cron runs don't attempt to reprocess already-paid commissions

  ## Changes
  - New function `marcar_ventas_pagadas_por_solicitud()`
  - New trigger `after_solicitud_pagada` on solicitudes_pago
    fires AFTER UPDATE when estatus changes to 'pagada'

  ## Notes
  - Function runs as SECURITY DEFINER so it can bypass RLS
  - Idempotent: setting pagado_socio=true on already-true rows is harmless
*/

CREATE OR REPLACE FUNCTION marcar_ventas_pagadas_por_solicitud()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.estatus = 'pagada' AND OLD.estatus IS DISTINCT FROM 'pagada' THEN
    UPDATE ventas
    SET pagado_socio = true,
        updated_at = now()
    WHERE id IN (
      SELECT venta_id
      FROM solicitud_pago_ventas
      WHERE solicitud_pago_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_solicitud_pagada ON solicitudes_pago;

CREATE TRIGGER after_solicitud_pagada
AFTER UPDATE ON solicitudes_pago
FOR EACH ROW
EXECUTE FUNCTION marcar_ventas_pagadas_por_solicitud();

-- Backfill: mark ventas as pagado_socio=true for all existing pagada solicitudes
UPDATE ventas
SET pagado_socio = true,
    updated_at = now()
WHERE id IN (
  SELECT spv.venta_id
  FROM solicitud_pago_ventas spv
  JOIN solicitudes_pago sp ON sp.id = spv.solicitud_pago_id
  WHERE sp.estatus = 'pagada'
)
AND pagado_socio = false;
