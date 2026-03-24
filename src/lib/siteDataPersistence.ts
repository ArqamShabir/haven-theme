import type { Product } from '@/stores/productStore';
import type { SiteSettings } from '@/stores/settingsStore';

interface SiteDataPayload {
  settings: SiteSettings;
  products: Product[];
}

interface UploadedImage {
  url: string;
}

const isLocalDev = () => {
  if (typeof window === 'undefined') return false;

  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

export const saveSiteDataToProjectFile = async (payload: SiteDataPayload) => {
  if (!isLocalDev()) {
    return { ok: false, skipped: true };
  }

  const response = await fetch('/__site-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to save site data');
  }

  return { ok: true, skipped: false };
};

export const uploadImagesToPublic = async (files: File[]): Promise<UploadedImage[]> => {
  if (!isLocalDev()) {
    throw new Error('Image upload to project files is only available in local dev');
  }

  const payload = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      type: file.type,
      dataUrl: await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      }),
    }))
  );

  const response = await fetch('/__upload-images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: payload }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload images');
  }

  const data = await response.json();
  return data.files as UploadedImage[];
};
