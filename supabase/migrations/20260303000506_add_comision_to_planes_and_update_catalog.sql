/*
  # Add comision_socio to planes and update plan catalog

  ## Summary
  This migration updates the product catalog to reflect the new 4-plan structure with
  fixed commission amounts per plan, replacing the old 2-plan catalog.

  ## Changes

  ### Modified Tables
  - `planes`
    - Added `comision_socio` column (numeric, default 0): Fixed commission amount the socio
      earns when selling this plan. Previously commissions were calculated as a percentage
      (15%) of the sale amount in application code; now each plan has a specific fixed amount.

  ### Data Changes
  - Deactivates the old 2 plans (Plan Presencia Web at $3,299 and Plan Tienda en Línea at $6,828)
    instead of deleting them to preserve referential integrity with existing ventas records.
  - Inserts 4 new active plans with their public prices and fixed commissions:
    1. Plan Presencia Web  - $3,499 MXN + IVA - comision $800
    2. Plan Tienda Básico  - $3,999 MXN + IVA - comision $900
    3. Plan Tienda Esencial - $5,999 MXN + IVA - comision $1,000
    4. Plan Tienda Premium  - $9,999 MXN + IVA - comision $1,500

  ## Notes
  - Old plans are NOT deleted; they are deactivated to maintain FK integrity.
  - The new column has a safe DEFAULT of 0 so existing rows are not broken.
*/

-- 1. Add comision_socio column to planes
ALTER TABLE planes
  ADD COLUMN IF NOT EXISTS comision_socio numeric(10,2) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN planes.comision_socio IS 'Comisión fija en MXN que recibe el socio al vender este plan';

-- 2. Deactivate old plans (preserve FK references from ventas)
UPDATE planes SET activo = false
WHERE nombre IN ('Plan Presencia Web', 'Plan Tienda en Línea');

-- 3. Insert new 4-plan catalog
INSERT INTO planes (nombre, precio_anual, comision_socio, descripcion_corta, descripcion_completa, activo)
VALUES
  (
    'Plan Presencia Web',
    3499,
    800,
    'Sitio web profesional para tu negocio',
    'Presencia digital profesional con sitio web personalizado, hosting, dominio y soporte técnico por 1 año',
    true
  ),
  (
    'Plan Tienda Básico',
    3999,
    900,
    'Tienda en línea básica para empezar a vender',
    'Tienda en línea con catálogo de productos, carrito de compras, hosting, dominio y soporte técnico por 1 año',
    true
  ),
  (
    'Plan Tienda Esencial',
    5999,
    1000,
    'Tienda en línea esencial con funcionalidades avanzadas',
    'Tienda en línea con pasarela de pagos, gestión de inventario, reportes, hosting, dominio y soporte técnico por 1 año',
    true
  ),
  (
    'Plan Tienda Premium',
    9999,
    1500,
    'Tienda en línea premium con todas las funcionalidades',
    'Solución completa de e-commerce con integraciones avanzadas, marketing digital, SEO, hosting, dominio y soporte prioritario por 1 año',
    true
  );
