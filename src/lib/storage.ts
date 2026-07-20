import { supabase } from './supabase';

export async function getStoragePublicUrl(path: string): Promise<string> {
  const { data } = supabase.storage.from('evidencias').getPublicUrl(path);
  return data.publicUrl;
}

export async function getStorageSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('evidencias')
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data?.signedUrl || null;
}

export async function downloadEvidence(path: string): Promise<Blob | null> {
  const { data, error } = await supabase.storage
    .from('evidencias')
    .download(path);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  return data;
}

export async function deleteEvidence(path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from('evidencias')
    .remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Solo se permiten archivos JPG, PNG o WEBP'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo no debe superar los 5MB'
    };
  }

  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_+/g, '_');
}
