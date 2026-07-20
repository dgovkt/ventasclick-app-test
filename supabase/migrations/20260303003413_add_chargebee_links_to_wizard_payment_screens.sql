/*
  # Add Chargebee payment link_url to wizard payment screens

  ## Summary
  Updates the meta field of wizard screens 9 and 25 to include a
  `link_url` placeholder. This allows admins to configure plan-specific
  Chargebee checkout URLs via the Content Management editor.

  ## Changes
  - wizard.screen_9: adds `link_url: ""` to meta (Presencia Web payment screen)
  - wizard.screen_25: adds `link_url: ""` to meta (Tienda en Línea payment screen)

  ## Notes
  - Empty string means the button renders as disabled/static until admin fills it in
  - Admin sets each URL to the corresponding Chargebee hosted checkout link
*/

UPDATE content_blocks
SET meta = meta || '{"link_url": ""}'::jsonb
WHERE slug IN ('wizard.screen_9', 'wizard.screen_25');
