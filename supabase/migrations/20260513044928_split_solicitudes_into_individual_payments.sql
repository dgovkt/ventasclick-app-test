/*
  # Split multi-venta solicitudes into individual payment records

  ## Summary
  Migrates the payment system from a "batch per period" model to a "1 solicitud = 1 venta" model.
  Each sale now has its own independent payment request that can be managed individually.

  ## Changes
  1. For each solicitud_pago that has MORE than 1 linked venta:
     - Creates N new solicitudes (one per venta)
     - Copies socio_id, fecha_inicio, fecha_fin, estatus, comentarios_admin
     - Sets monto_solicitado = comision_calculada from the junction table
     - For paid solicitudes, copies payment_reference and payment_date
     - Updates solicitud_pago_ventas to point to the new individual solicitud
     - Deletes the original multi-venta solicitud

  2. Data integrity:
     - Only splits solicitudes with 2+ ventas
     - Solicitudes with exactly 1 venta remain untouched
     - All statuses and payment references are preserved

  ## Important Notes
  - This is a data migration, not a schema change
  - The solicitud_pago_ventas junction table remains (now always 1:1)
  - No data is lost -- all payment references and dates are preserved on each new record
*/

DO $$
DECLARE
  sol RECORD;
  venta_link RECORD;
  new_sol_id uuid;
BEGIN
  -- Loop through all solicitudes that have more than 1 linked venta
  FOR sol IN
    SELECT sp.id, sp.socio_id, sp.estatus, sp.fecha_inicio, sp.fecha_fin,
           sp.comentarios_admin, sp.payment_reference, sp.payment_date,
           sp.created_at, sp.updated_at
    FROM solicitudes_pago sp
    WHERE (
      SELECT COUNT(*) FROM solicitud_pago_ventas spv WHERE spv.solicitud_pago_id = sp.id
    ) > 1
  LOOP
    -- For each linked venta, create an individual solicitud
    FOR venta_link IN
      SELECT spv.venta_id, spv.comision_calculada
      FROM solicitud_pago_ventas spv
      WHERE spv.solicitud_pago_id = sol.id
    LOOP
      -- Create the new individual solicitud
      INSERT INTO solicitudes_pago (
        socio_id, monto_solicitado, estatus, fecha_inicio, fecha_fin,
        comentarios_admin, payment_reference, payment_date, created_at, updated_at
      ) VALUES (
        sol.socio_id,
        venta_link.comision_calculada,
        sol.estatus,
        sol.fecha_inicio,
        sol.fecha_fin,
        sol.comentarios_admin,
        sol.payment_reference,
        sol.payment_date,
        sol.created_at,
        sol.updated_at
      )
      RETURNING id INTO new_sol_id;

      -- Update the junction to point to the new individual solicitud
      UPDATE solicitud_pago_ventas
      SET solicitud_pago_id = new_sol_id
      WHERE solicitud_pago_id = sol.id
        AND venta_id = venta_link.venta_id;
    END LOOP;

    -- Delete the original multi-venta solicitud (now has no linked ventas)
    DELETE FROM solicitudes_pago WHERE id = sol.id;
  END LOOP;
END $$;
