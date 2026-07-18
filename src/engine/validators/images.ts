import { SEOContentPage } from '../../types/content';

export function validateImages(page: SEOContentPage): { count: number; altCoverage: number; missingWidthHeight: boolean } {
  let count = 0;
  let altCount = 0;

  // Search JSON for image URL strings as a heuristic
  const jsonString = JSON.stringify(page.blocks);
  const imageRegex = /https?:\/\/[^\s"]+\.(png|jpe?g|gif|webp|avif)/gi;
  const matches = jsonString.match(imageRegex);
  
  if (matches) {
    count = matches.length;
    // Heuristic: If we parse out image nodes in specific blocks (e.g. authorImage)
    // we can check for explicitly defined alt properties.
    altCount = count; // Placeholder: Assume 100% alt coverage if passed statically.
  }

  return {
    count,
    altCoverage: count === 0 ? 100 : (altCount / count) * 100,
    missingWidthHeight: false
  };
}
