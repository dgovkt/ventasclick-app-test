/*
  # Add email column to profiles table

  1. Changes
    - Add `email` column to `profiles` table to store user email
    - Update trigger function to automatically copy email from auth.users
    - Populate existing profiles with email from auth.users

  2. Security
    - Email is read-only and comes from auth.users
*/

-- Add email column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Populate existing profiles with email from auth.users
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Update the trigger function to include email
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, apellido, rol, telefono)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'socio'),
    COALESCE(NEW.raw_user_meta_data->>'telefono', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = NEW.email,
    nombre = COALESCE(NEW.raw_user_meta_data->>'nombre', profiles.nombre),
    apellido = COALESCE(NEW.raw_user_meta_data->>'apellido', profiles.apellido),
    rol = COALESCE(NEW.raw_user_meta_data->>'rol', profiles.rol),
    telefono = COALESCE(NEW.raw_user_meta_data->>'telefono', profiles.telefono);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
