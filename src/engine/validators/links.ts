import { SEOContentPage } from '../../types/content';

export function validateLinks(page: SEOContentPage): { isValid: boolean; distributionScore: number; internalLinks: number; externalLinks: number } {
  let internal = 0;
  let external = 0;
  
  const jsonString = JSON.stringify(page.blocks);
  // Very rough heuristic to count links in JSON blocks
  const linkMatches = jsonString.match(/https?:\/\/[^\s"]+/gi) || [];
  const internalMatches = jsonString.match(/"\/(?!\/)[^\s"]+"/gi) || [];
  
  external = linkMatches.length;
  internal = internalMatches.length;

  const total = internal + external;
  // A good internal linking strategy has more internal links
  const distributionScore = total === 0 ? 0 : Math.min(100, Math.round((internal / total) * 100) + 20);

  return {
    isValid: true, // Placeholder for broken links check
    distributionScore,
    internalLinks: internal,
    externalLinks: external
  };
}
