/*
  # Add payment configuration to profiles

  1. Changes
    - Add payment configuration fields to profiles table
    - nombre_banco (text) - Nombre del banco
    - clabe (text) - CLABE interbancaria
    - numero_cuenta (text) - Número de cuenta
    - beneficiario (text) - Nombre del beneficiario
    - frecuencia_pago (text) - 'semanal' o 'mensual'
    - payment_config_updated_at (timestamptz) - Última actualización de config de pago
  
  2. Notes
    - Campos opcionales para permitir configuración gradual
    - CLABE debe ser validada en frontend (18 dígitos)
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'nombre_banco'
  ) THEN
    ALTER TABLE profiles ADD COLUMN nombre_banco text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'clabe'
  ) THEN
    ALTER TABLE profiles ADD COLUMN clabe text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'numero_cuenta'
  ) THEN
    ALTER TABLE profiles ADD COLUMN numero_cuenta text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'beneficiario'
  ) THEN
    ALTER TABLE profiles ADD COLUMN beneficiario text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'frecuencia_pago'
  ) THEN
    ALTER TABLE profiles ADD COLUMN frecuencia_pago text CHECK (frecuencia_pago IN ('semanal', 'mensual'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'payment_config_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN payment_config_updated_at timestamptz;
  END IF;
END $$;
