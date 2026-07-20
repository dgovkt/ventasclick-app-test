/*
  # Add phone field to profiles table

  1. Changes
    - Add `telefono` column to `profiles` table
      - Type: text
      - Optional field (nullable)
      - Default: empty string
  
  2. Security
    - No changes to RLS policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'telefono'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN telefono text DEFAULT '';
  END IF;
END $$;
