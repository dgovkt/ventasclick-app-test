/*
  # Rewrite solicitud generation for 1 solicitud = 1 venta model

  ## Summary
  Replaces the old `generar_solicitudes_catorcenales()` function that grouped ventas
  by (socio x period) with a new version that creates one individual solicitud per venta.

  ## Changes
  1. `generar_solicitudes_catorcenales()` - Now creates one solicitud per completed venta
     - Each venta gets its own solicitud_pago record
     - The solicitud_pago_ventas junction remains for referential integrity (1:1)
     - Idempotent: skips ventas already linked to a solicitud

  2. Trigger `after_venta_completada` - Unchanged behavior, still fires on estatus_pago = 'completado'

  ## Security
  - Function remains SECURITY DEFINER for service role context
  - Existing RLS policies unchanged
*/

-- Replace the generation function with individual model
CREATE OR REPLACE FUNCTION generar_solicitudes_catorcenales()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r RECORD;
  new_solicitud_id uuid;
BEGIN
  -- For each completed, unpaid venta not yet linked to any solicitud,
  -- create an individual solicitud_pago
  FOR r IN
    SELECT
      v.id AS venta_id,
      v.socio_id,
      v.comision_socio,
      pc.periodo_inicio,
      pc.periodo_fin
    FROM ventas v
    CROSS JOIN LATERAL get_periodo_catorcenal(v.fecha_cierre::date) pc
    WHERE v.estatus_pago = 'completado'
      AND v.pagado_socio = false
      AND NOT EXISTS (
        SELECT 1 FROM solicitud_pago_ventas spv
        WHERE spv.venta_id = v.id
      )
  LOOP
    -- Create individual solicitud for this single venta
    INSERT INTO solicitudes_pago (
      socio_id,
      monto_solicitado,
      estatus,
      fecha_inicio,
      fecha_fin
    ) VALUES (
      r.socio_id,
      r.comision_socio,
      'pendiente',
      r.periodo_inicio,
      r.periodo_fin
    )
    RETURNING id INTO new_solicitud_id;

    -- Link the venta to its solicitud (1:1)
    INSERT INTO solicitud_pago_ventas (solicitud_pago_id, venta_id, comision_calculada)
    VALUES (new_solicitud_id, r.venta_id, r.comision_socio)
    ON CONFLICT (solicitud_pago_id, venta_id) DO NOTHING;
  END LOOP;
END;
$$;
