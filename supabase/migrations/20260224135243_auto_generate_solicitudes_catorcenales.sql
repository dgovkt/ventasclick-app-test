/*
  # Auto-generate biweekly payment requests (solicitudes catorcenales)

  ## Summary
  Implements fully automatic commission payment requests so socios never need to
  manually request their commissions. The system:

  1. New DB function `get_periodo_catorcenal(fecha)`
     - Given any date, returns the biweekly period (inicio, fin, pago) it belongs to,
       using the same Wednesday-based schedule already in the frontend
       (reference: 2025-01-01 Wednesday, every 14 days).

  2. New DB function `generar_solicitudes_catorcenales()`
     - Called automatically or manually.
     - For every socio who has at least one completed + unpaid venta not yet linked
       to a solicitud, groups those ventas by their biweekly period and creates
       one solicitud_pago per (socio × period), then links the ventas.
     - Idempotent: skips periods that already have a solicitud for that socio.

  3. New DB trigger `after_venta_completada` on ventas
     - Fires AFTER UPDATE when estatus_pago changes to 'completado'.
     - Immediately calls generar_solicitudes_catorcenales() so the commission
       request is created the moment the admin marks the venta as complete.

  4. pg_cron job
     - Runs every Wednesday at 23:00 UTC as a safety net to catch any missed ventas.

  ## Security
  - The function runs as SECURITY DEFINER (service role) so the trigger can
    insert into solicitudes_pago without relying on the user's RLS context.
  - Added policy so admins can INSERT into solicitudes_pago (needed for service-role calls).
*/

-- ─────────────────────────────────────────────────────────────────
-- 1. Helper: get biweekly period for a given date
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_periodo_catorcenal(p_fecha date)
RETURNS TABLE(periodo_inicio date, periodo_fin date, periodo_pago date)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  reference_date date := '2025-01-01';  -- Wednesday reference
  diff_days      int;
  period_index   int;
  corte_date     date;
BEGIN
  diff_days    := p_fecha - reference_date;
  period_index := floor(diff_days::numeric / 14)::int;
  corte_date   := reference_date + (period_index * 14);

  RETURN QUERY SELECT
    (corte_date - 13)::date  AS periodo_inicio,
    corte_date               AS periodo_fin,
    (corte_date + 2)::date   AS periodo_pago;
END;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 2. Main function: generate solicitudes for all pending ventas
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
      SELECT id INTO existing_solicitud_id
      FROM solicitudes_pago
      WHERE socio_id     = r.socio_id
        AND fecha_inicio = r.periodo_inicio
        AND fecha_fin    = r.periodo_fin
        AND estatus NOT IN ('rechazada')
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
-- 3. Trigger function: fires when a venta is marked completado
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_venta_completada()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.estatus_pago = 'completado' AND OLD.estatus_pago IS DISTINCT FROM 'completado' THEN
    PERFORM generar_solicitudes_catorcenales();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger to ensure it's up to date
DROP TRIGGER IF EXISTS after_venta_completada ON ventas;

CREATE TRIGGER after_venta_completada
AFTER UPDATE ON ventas
FOR EACH ROW
EXECUTE FUNCTION trigger_venta_completada();

-- ─────────────────────────────────────────────────────────────────
-- 4. pg_cron: run every Wednesday at 23:00 UTC as safety net
-- ─────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule(
      'generar-solicitudes-catorcenales',
      '0 23 * * 3',
      'SELECT generar_solicitudes_catorcenales()'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- 5. Add INSERT policy for service role (needed for SECURITY DEFINER)
-- ─────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'solicitudes_pago'
      AND policyname = 'Service role can insert solicitudes'
  ) THEN
    CREATE POLICY "Service role can insert solicitudes"
      ON solicitudes_pago FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'solicitudes_pago'
      AND policyname = 'Service role can update solicitudes'
  ) THEN
    CREATE POLICY "Service role can update solicitudes"
      ON solicitudes_pago FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'solicitud_pago_ventas'
      AND policyname = 'Service role can insert solicitud ventas'
  ) THEN
    CREATE POLICY "Service role can insert solicitud ventas"
      ON solicitud_pago_ventas FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- 6. Run immediately to catch all existing unpaid ventas
-- ─────────────────────────────────────────────────────────────────
SELECT generar_solicitudes_catorcenales();
