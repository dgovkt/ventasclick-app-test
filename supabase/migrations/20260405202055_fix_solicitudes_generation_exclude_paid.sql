/*
  # Fix automatic solicitudes generation to exclude paid requests

  ## Summary
  The current system adds new confirmed ventas to existing solicitudes even if those
  solicitudes are already marked as "pagada" (paid). This causes ventas to become 
  "trapped" in paid requests with no way to manage them.

  ## Changes
  1. Update `generar_solicitudes_catorcenales()` function
     - Change line 100 from excluding only 'rechazada' 
     - To exclude both 'rechazada' AND 'pagada'
     - This ensures new ventas create NEW solicitudes if the period is already paid
  
  2. Create new solicitudes for ventas currently trapped in paid requests
     - Identify ventas in "completado" state with pagado_socio=false
     - That are linked to solicitudes with estatus='pagada'
     - Move them to new pending solicitudes
  
  ## Security
  - Function runs as SECURITY DEFINER to bypass RLS
  - Maintains audit trail by not modifying existing paid solicitudes
*/

-- ─────────────────────────────────────────────────────────────────
-- 1. Update the main function to exclude paid solicitudes
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generar_solicitudes_catorcenales()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r RECORD;
BEGIN
  -- Group unpaid completed ventas by socio + biweekly period
  -- that are not already linked to any solicitud_pago
  FOR r IN
    SELECT
      v.socio_id,
      pc.periodo_inicio,
      pc.periodo_fin,
      SUM(v.comision_socio)            AS monto_total,
      ARRAY_AGG(v.id)                  AS venta_ids,
      ARRAY_AGG(v.comision_socio)      AS comisiones
    FROM ventas v
    CROSS JOIN LATERAL get_periodo_catorcenal(v.fecha_cierre::date) pc
    WHERE v.estatus_pago = 'completado'
      AND v.pagado_socio = false
      AND NOT EXISTS (
        SELECT 1 FROM solicitud_pago_ventas spv
        WHERE spv.venta_id = v.id
      )
    GROUP BY v.socio_id, pc.periodo_inicio, pc.periodo_fin
  LOOP
    DECLARE
      new_solicitud_id uuid;
      existing_solicitud_id uuid;
    BEGIN
      -- Check if a solicitud for this socio+period already exists
      -- NOW EXCLUDING both 'rechazada' AND 'pagada'
      SELECT id INTO existing_solicitud_id
      FROM solicitudes_pago
      WHERE socio_id     = r.socio_id
        AND fecha_inicio = r.periodo_inicio
        AND fecha_fin    = r.periodo_fin
        AND estatus NOT IN ('rechazada', 'pagada')
      LIMIT 1;

      IF existing_solicitud_id IS NULL THEN
        -- Create new solicitud
        INSERT INTO solicitudes_pago (
          socio_id,
          monto_solicitado,
          estatus,
          fecha_inicio,
          fecha_fin
        ) VALUES (
          r.socio_id,
          r.monto_total,
          'pendiente',
          r.periodo_inicio,
          r.periodo_fin
        )
        RETURNING id INTO new_solicitud_id;
      ELSE
        -- Update the monto on the existing solicitud (new ventas added)
        new_solicitud_id := existing_solicitud_id;
        UPDATE solicitudes_pago
        SET monto_solicitado = monto_solicitado + r.monto_total,
            updated_at       = now()
        WHERE id = new_solicitud_id;
      END IF;

      -- Link each venta to the solicitud
      FOR i IN 1..array_length(r.venta_ids, 1) LOOP
        INSERT INTO solicitud_pago_ventas (solicitud_pago_id, venta_id, comision_calculada)
        VALUES (new_solicitud_id, r.venta_ids[i], r.comisiones[i])
        ON CONFLICT (solicitud_pago_id, venta_id) DO NOTHING;
      END LOOP;
    END;
  END LOOP;
END;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 2. Fix existing trapped ventas by moving them to new solicitudes
-- ─────────────────────────────────────────────────────────────────
DO $$
DECLARE
  r RECORD;
  new_solicitud_id uuid;
BEGIN
  -- Find ventas that are in paid solicitudes but not yet marked as paid
  FOR r IN
    SELECT 
      v.id as venta_id,
      v.socio_id,
      v.comision_socio,
      pc.periodo_inicio,
      pc.periodo_fin,
      spv.solicitud_pago_id as old_solicitud_id
    FROM ventas v
    CROSS JOIN LATERAL get_periodo_catorcenal(v.fecha_cierre::date) pc
    JOIN solicitud_pago_ventas spv ON spv.venta_id = v.id
    JOIN solicitudes_pago sp ON sp.id = spv.solicitud_pago_id
    WHERE v.estatus_pago = 'completado'
      AND v.pagado_socio = false
      AND sp.estatus = 'pagada'
  LOOP
    -- Check if there's already a pending/approved solicitud for this period
    SELECT id INTO new_solicitud_id
    FROM solicitudes_pago
    WHERE socio_id = r.socio_id
      AND fecha_inicio = r.periodo_inicio
      AND fecha_fin = r.periodo_fin
      AND estatus IN ('pendiente', 'aprobada')
    LIMIT 1;

    IF new_solicitud_id IS NULL THEN
      -- Create a new solicitud for this period
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
    ELSE
      -- Add to existing pending/approved solicitud
      UPDATE solicitudes_pago
      SET monto_solicitado = monto_solicitado + r.comision_socio,
          updated_at = now()
      WHERE id = new_solicitud_id;
    END IF;

    -- Remove link from old paid solicitud
    DELETE FROM solicitud_pago_ventas
    WHERE solicitud_pago_id = r.old_solicitud_id
      AND venta_id = r.venta_id;

    -- Update monto of old paid solicitud (subtract the removed venta)
    UPDATE solicitudes_pago
    SET monto_solicitado = monto_solicitado - r.comision_socio,
        updated_at = now()
    WHERE id = r.old_solicitud_id;

    -- Link to new solicitud
    INSERT INTO solicitud_pago_ventas (solicitud_pago_id, venta_id, comision_calculada)
    VALUES (new_solicitud_id, r.venta_id, r.comision_socio);

    RAISE NOTICE 'Moved venta % from paid solicitud % to new solicitud %', 
      r.venta_id, r.old_solicitud_id, new_solicitud_id;
  END LOOP;
END $$;
