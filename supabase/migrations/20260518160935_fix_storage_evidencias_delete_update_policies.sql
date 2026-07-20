/*
  # Fix storage evidencias DELETE and UPDATE policies

  1. Changes
    - Recreate DELETE and UPDATE policies using JWT metadata instead of profiles subquery
    - This avoids RLS recursion issues when profiles table has its own RLS policies
    
  2. Security
    - Authenticated users can update/delete their own files
    - Admins and super_admins can delete any file (via JWT role check)
*/

-- Fix UPDATE policy
DROP POLICY IF EXISTS "Socios can update own files" ON storage.objects;

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

-- Fix DELETE policy
DROP POLICY IF EXISTS "Socios can delete own files" ON storage.objects;

CREATE POLICY "Socios can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'evidencias'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'rol'::text) IN ('admin', 'super_admin')
  )
);
