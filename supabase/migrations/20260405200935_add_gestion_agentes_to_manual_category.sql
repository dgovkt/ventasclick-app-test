/*
  # Add 'gestion_agentes' to manual_category enum

  1. Changes
    - Adds 'gestion_agentes' value to the manual_category enum type
    - This allows creating manual sections for agent management documentation

  2. Security
    - No RLS changes required
    - Only affects enum definition
*/

ALTER TYPE manual_category ADD VALUE IF NOT EXISTS 'gestion_agentes';
