/*
  # Update pricing in content blocks

  ## Summary
  Updates all content blocks that contain old pricing ($3,299 and $6,828) to reflect
  the new 4-plan catalog prices.

  ## Changes
  - Updates landing page plan prices:
    - Plan Presencia Web: $3,299/año → $3,499/año
    - Plan Tienda en Línea: $6,828/año → removed (replaced by 4-plan structure)
  - Updates wizard screen 8 meta (Plan Presencia Web price): $3,299 → $3,499
  - Updates wizard screen 24 meta (Plan Tienda price): $6,828 → $3,999 (Tienda Básico)
  - Updates any other content blocks with old prices in value or meta fields
*/

-- Update landing page plan presencia price
UPDATE content_blocks
SET value = '$3,499/año'
WHERE slug = 'landing.plans.presencia.price';

-- Update landing page plan tienda price (now represents Tienda Básico entry point)
UPDATE content_blocks
SET value = '$3,999/año'
WHERE slug = 'landing.plans.tienda.price';

-- Update wizard screen 8 meta (Plan Presencia Web pricing screen)
UPDATE content_blocks
SET meta = jsonb_set(
  COALESCE(meta, '{}'::jsonb),
  '{precio}',
  '"$3,499 MXN"'
)
WHERE slug = 'wizard.screen_8' AND meta->>'precio' IS NOT NULL;

-- Update wizard screen 24 meta (Plan Tienda pricing screen) to show Tienda Básico
UPDATE content_blocks
SET meta = jsonb_set(
  COALESCE(meta, '{}'::jsonb),
  '{precio}',
  '"$3,999 MXN"'
)
WHERE slug = 'wizard.screen_24' AND meta->>'precio' IS NOT NULL;
