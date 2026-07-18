import { SEOContentPage } from '../../types/content';

export function validateSchema(page: SEOContentPage): boolean {
  if (!page.meta.schema || page.meta.schema.length === 0) return false;
  
  let isValid = true;
  page.meta.schema.forEach(s => {
    // Basic structural validation
    if (!s['@type']) isValid = false;
  });
  
  // Future: Check duplicate schema, required properties based on type
  
  return isValid;
}
