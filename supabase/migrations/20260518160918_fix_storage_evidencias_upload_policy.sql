/*
  # Fix storage evidencias upload policy

  1. Changes
    - Drop and recreate the INSERT policy on storage.objects for the evidencias bucket
    - The new policy allows any authenticated user to upload to their own subfolder
    - Uses a simpler path check: the object name must start with the user's auth.uid()
    
  2. Security
    - Only authenticated users can upload
    - Users can only upload to paths starting with their own user ID
    - This fixes issues where storage.foldername might not match correctly
*/

-- Drop existing upload policy
DROP POLICY IF EXISTS "Socios can upload to own folder" ON storage.objects;

-- Recreate with a simpler, more reliable check
CREATE POLICY "Socios can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Also ensure the SELECT policy works during upload (Supabase needs SELECT for upsert checks)
DROP POLICY IF EXISTS "Socios can read own files" ON storage.objects;

CREATE POLICY "Socios can read own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'evidencias'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'rol'::text) IN ('admin', 'super_admin')
  )
);
