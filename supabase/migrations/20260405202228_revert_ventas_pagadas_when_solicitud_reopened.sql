/*
  # Revert ventas pagado_socio flag when solicitud is reopened

  ## Summary
  When a solicitud_pago is changed from 'pagada' back to 'pendiente' or 'aprobada'
  (reopened), the linked ventas should have their pagado_socio flag reset to false.
  This ensures those ventas appear again in the unpaid commissions list.

  ## Changes
  - Update existing trigger `marcar_ventas_pagadas_por_solicitud` to also handle reopening
  - When solicitud changes FROM 'pagada' TO another status, mark ventas as unpaid

  ## Security
  - Function runs as SECURITY DEFINER so it can bypass RLS
  - Maintains audit trail in solicitudes_pago.comentarios_admin
*/

CREATE OR REPLACE FUNCTION marcar_ventas_pagadas_por_solicitud()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When marking solicitud as 'pagada', mark all linked ventas as pagado_socio=true
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

  -- When reopening a solicitud (changing FROM 'pagada' to another status),
  -- mark all linked ventas as pagado_socio=false
  IF OLD.estatus = 'pagada' AND NEW.estatus IS DISTINCT FROM 'pagada' THEN
    UPDATE ventas
    SET pagado_socio = false,
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
