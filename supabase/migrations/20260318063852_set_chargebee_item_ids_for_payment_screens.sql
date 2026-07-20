/*
  # Set correct Chargebee item IDs for all wizard payment screens

  ## Summary
  Updates the meta field of all four wizard payment screens to include the correct
  Chargebee item price IDs. These IDs are used by the frontend to open the right
  Chargebee checkout for each plan.

  ## Changes
  - wizard.screen_9  (Presencia Web $3,499):  chargebee_item = 'TP-000P-MXN-Yearly'
  - wizard.screen_23 (Tienda Básico $3,999):   chargebee_item = 'TP-001-MXN-Yearly'
  - wizard.screen_24 (Tienda Esencial $5,999): chargebee_item = 'TP-002-MXN-Yearly'
  - wizard.screen_25 (Tienda Premium $9,999):  chargebee_item = 'TP-003-MXN-Yearly'

  ## Notes
  - The frontend reads meta->>'chargebee_item' and falls back to hardcoded defaults
    if the field is absent, so this migration makes the DB the authoritative source.
*/

UPDATE content_blocks
SET meta = meta || '{"chargebee_item": "TP-000P-MXN-Yearly"}'::jsonb
WHERE slug = 'wizard.screen_9';

UPDATE content_blocks
SET meta = meta || '{"chargebee_item": "TP-001-MXN-Yearly"}'::jsonb
WHERE slug = 'wizard.screen_23';

UPDATE content_blocks
SET meta = meta || '{"chargebee_item": "TP-002-MXN-Yearly"}'::jsonb
WHERE slug = 'wizard.screen_24';

UPDATE content_blocks
SET meta = meta || '{"chargebee_item": "TP-003-MXN-Yearly"}'::jsonb
WHERE slug = 'wizard.screen_25';
