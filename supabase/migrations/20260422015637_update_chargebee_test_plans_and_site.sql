/*
  # Update Chargebee Test Environment Configuration

  1. Changes
    - Update the test environment row in `chargebee_config`:
      - `site_name`: from `vktdev-test` to `ventasclick-test`
      - `plan_presencia_web`: from `Bsico-MXN-Cada-ao` to `TEST-000P-MXN-Yearly`
      - `plan_tienda_basico`: from `Bsico-MXN-Cada-ao` to `Test-Tienda-Basico-MXN-Yearly`
      - `plan_tienda_esencial`: from `EsencialTest-MXN-Cada-ao` to `Test-Tienda-Esencial-MXN-Yearly`
      - `plan_tienda_premium`: from `PremiumTest-MXN-Cada-ao` to `Test-Tienda-Premium-MXN-Yearly`

  2. Reason
    - Previous test plan IDs expired and are no longer valid
    - Chargebee test site has been migrated from `vktdev-test` to `ventasclick-test`
*/

UPDATE chargebee_config
SET
  site_name = 'ventasclick-test',
  plan_presencia_web = 'TEST-000P-MXN-Yearly',
  plan_tienda_basico = 'Test-Tienda-Basico-MXN-Yearly',
  plan_tienda_esencial = 'Test-Tienda-Esencial-MXN-Yearly',
  plan_tienda_premium = 'Test-Tienda-Premium-MXN-Yearly'
WHERE environment = 'test';