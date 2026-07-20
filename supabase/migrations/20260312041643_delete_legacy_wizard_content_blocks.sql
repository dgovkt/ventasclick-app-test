/*
  # Delete Legacy Wizard Content Blocks

  These content blocks were created in earlier iterations of the wizard
  but are no longer used by the current implementation. The active wizard
  only reads blocks with slugs matching the pattern `wizard.screen_*` and
  `wizard.screen_2.*`.

  ## Deleted slug prefixes
  - wizard.bienvenida
  - wizard.confirmacion.*
  - wizard.diagnostico.*
  - wizard.plan_tienda.*  (all 18 blocks)
  - wizard.plan_web.*     (all 18 blocks)
  - wizard.post_compra.*  (all 8 blocks)
  - wizard.step1.*        (all 9 blocks)

  ## Kept (active wizard screens)
  - wizard.screen_1  through wizard.screen_25
  - wizard.screen_2.titulo, wizard.screen_2.opcion_a/b/c/d
*/

DELETE FROM content_blocks
WHERE section = 'wizard'
  AND slug NOT LIKE 'wizard.screen%';
