/*
  # Create chargebee_webhooks table for future integration

  1. New Tables
    - `chargebee_webhooks`
      - `id` (uuid, primary key)
      - `event_type` (text, e.g., 'subscription_activated', 'payment_succeeded')
      - `payload` (jsonb, complete webhook payload from Chargebee)
      - `processed` (boolean, default false)
      - `processed_at` (timestamptz, nullable)
      - `error_message` (text, nullable - if processing failed)
      - `created_at` (timestamptz)

  2. Purpose
    - Receive and store webhook events from Chargebee payment platform
    - Queue for processing payment confirmations
    - Update ventas.estatus_pago when payment succeeds
    - Create commission records when subscription activates
    - Track processing status and errors for debugging

  3. Security
    - Enable RLS on `chargebee_webhooks` table
    - Only admins and super admins can view webhooks
    - Webhook endpoint validates Chargebee signature before insertion

  4. Future Implementation Notes
    - Endpoint: POST /api/chargebee/webhook
    - Validates signature using CHARGEBEE_WEBHOOK_SECRET
    - On 'subscription_activated' or 'payment_succeeded':
      - Update ventas.estatus_pago to 'completado'
      - Create comisiones record with estatus='pendiente'
    - Admin reviews and manually approves commission
*/

CREATE TABLE IF NOT EXISTS chargebee_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chargebee_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view webhooks"
  ON chargebee_webhooks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can insert webhooks"
  ON chargebee_webhooks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "System can update webhooks"
  ON chargebee_webhooks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_chargebee_webhooks_event_type ON chargebee_webhooks(event_type);
CREATE INDEX idx_chargebee_webhooks_processed ON chargebee_webhooks(processed);
CREATE INDEX idx_chargebee_webhooks_created_at ON chargebee_webhooks(created_at DESC);

-- Add comment with integration instructions
COMMENT ON TABLE chargebee_webhooks IS 'Stores Chargebee webhook events. Future integration requires: 1) Edge function at /chargebee/webhook, 2) Signature validation, 3) Update ventas.estatus_pago on payment_succeeded, 4) Create comisiones record for admin approval';
