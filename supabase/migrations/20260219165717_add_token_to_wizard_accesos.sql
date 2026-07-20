/*
  # Add token column to wizard_accesos table

  1. Changes
    - Add `token` column to wizard_accesos as unique identifier
    - Make session_id nullable since we're using token instead
    - Add index on token for fast lookups
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wizard_accesos' AND column_name = 'token'
  ) THEN
    ALTER TABLE wizard_accesos ADD COLUMN token text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_wizard_accesos_token ON wizard_accesos(token);
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wizard_accesos' AND column_name = 'session_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE wizard_accesos ALTER COLUMN session_id DROP NOT NULL;
  END IF;
END $$;
