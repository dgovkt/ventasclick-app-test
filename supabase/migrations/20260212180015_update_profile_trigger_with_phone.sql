/*
  # Update profile creation trigger to include phone

  1. Changes
    - Update `create_profile_for_user` function to capture `telefono` from user metadata
  
  2. Security
    - No changes to RLS policies
*/

CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, rol, telefono)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'socio'),
    COALESCE(NEW.raw_user_meta_data->>'telefono', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    nombre = COALESCE(NEW.raw_user_meta_data->>'nombre', profiles.nombre),
    apellido = COALESCE(NEW.raw_user_meta_data->>'apellido', profiles.apellido),
    rol = COALESCE(NEW.raw_user_meta_data->>'rol', profiles.rol),
    telefono = COALESCE(NEW.raw_user_meta_data->>'telefono', profiles.telefono);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
