import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2024-01-01', // Use today's date or your preferred version
  useCdn: process.env.NODE_ENV === 'production',
};

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

// Set up a helper function for generating Image URLs with only the asset reference data in your documents
const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source) => builder.image(source);

// Helper function to get localized content
export function getLocalizedContent(content, locale = 'en') {
  if (!content) return null;
  
  // If content is an object with locale keys, return the appropriate locale
  if (typeof content === 'object' && content[locale]) {
    return content[locale];
  }
  
  // If content is an object with 'en' and 'bn' keys, return the appropriate one
  if (typeof content === 'object' && (content.en || content.bn)) {
    return content[locale] || content.en || content.bn;
  }
  
  // If content is a string, return as is
  if (typeof content === 'string') {
    return content;
  }
  
  return null;
}

// Helper function to get localized slug
export function getLocalizedSlug(slugs, locale = 'en') {
  if (!slugs) return null;
  
  if (typeof slugs === 'object' && slugs[locale]) {
    return slugs[locale];
  }
  
  if (typeof slugs === 'object' && (slugs.en || slugs.bn)) {
    return slugs[locale] || slugs.en || slugs.bn;
  }
  
  if (typeof slugs === 'string') {
    return slugs;
  }
  
  return null;
} 