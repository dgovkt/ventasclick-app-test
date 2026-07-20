/*
  # Add comentario_moderacion field to casos_exito

  1. Changes
    - Add `comentario_moderacion` (text, nullable) field to casos_exito table
    - This field stores internal comments from admins during moderation
    - Only visible to admin/super_admin roles
  
  2. Notes
    - This field is used for internal communication
    - Socios cannot see this field
    - Can contain reasons for rejection or approval notes
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'casos_exito' AND column_name = 'comentario_moderacion'
  ) THEN
    ALTER TABLE casos_exito ADD COLUMN comentario_moderacion text;
  END IF;
END $$;
