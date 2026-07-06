import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const rawProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || '';
// Sanity project ID is an 8-character alphanumeric string.
// If it is empty, a placeholder, or doesn't match the standard format, we use a dummy valid ID to prevent crash.
const isValidFormat = /^[a-z0-9-]+$/i.test(rawProjectId) && rawProjectId.length >= 8 && !rawProjectId.includes('YOUR_');
const projectId = isValidFormat ? rawProjectId : 'dummyid12';

export const sanityClient = createClient({
  projectId: projectId,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Disable CDN during static builds so Vercel builds always get the fresh content instantly
  apiVersion: '2026-07-06',
});

export const isSanityConfigured = isValidFormat;

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!isSanityConfigured || !source) {
    return {
      url: () => ''
    };
  }
  try {
    return builder.image(source);
  } catch (err) {
    return {
      url: () => ''
    };
  }
}
