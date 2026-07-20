/*
  # Add script_url to chargebee_config

  1. Changes
    - Adds `script_url` column to `chargebee_config` table
    - Stores the Chargebee JS script URL per environment
    - Defaults to the standard v2 URL
    - Allows admins to update when scripts expire or change version

  2. Purpose
    - Chargebee script URLs can expire or be versioned
    - Admins need the ability to update the script URL without code changes
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chargebee_config' AND column_name = 'script_url'
  ) THEN
    ALTER TABLE chargebee_config ADD COLUMN script_url text NOT NULL DEFAULT 'https://js.chargebee.com/v2/chargebee.js';
  END IF;
END $$;