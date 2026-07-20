-- Create Storage Bucket for Evidencias
--
-- 1. Purpose
--   - Create a private storage bucket for photographic evidence of sales
--   - Socios upload payment receipts, screenshots, app activation evidence
--   - Bucket is private (only authenticated users can access)
--   - Files are organized by socio: evidencias/{socio_id}/{timestamp}_{filename}
--
-- 2. Bucket Configuration
--   - Name: evidencias
--   - Public: false (requires authentication)
--   - File size limit: 10MB per file
--   - Allowed MIME types: image/jpeg, image/png, image/webp
--
-- 3. Security Policies
--   - Socios can upload files to their own folder (evidencias/{their_user_id}/*)
--   - Socios can read files from their own folder
--   - Admins and super-admins can read all files
--   - Admins and super-admins can delete files if needed

-- Create the evidencias storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidencias',
  'evidencias',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Socios can upload to their own folder
CREATE POLICY "Socios can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Socios can read their own files
CREATE POLICY "Socios can read own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'evidencias'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  )
);

-- Policy: Socios can update their own files
CREATE POLICY "Socios can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'evidencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'evidencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Socios can delete their own files
CREATE POLICY "Socios can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'evidencias'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  )
);
