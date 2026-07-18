import { SEOContentPage } from '../types/content';
import { QualityScoreReport, QualityRecommendation } from '../types/engine';
import { validateContent } from './validator';

export function calculateQualityScore(page: SEOContentPage): QualityScoreReport {
  const report = validateContent(page);
  const metrics = report.metrics;
  const recommendations: QualityRecommendation[] = [];
  
  let seoScore = 100;
  let eeatScore = 100;
  let readabilityScore = metrics.readabilityScore;
  let uxScore = 100;
  let contentDepthScore = 100;
  let internalLinkingScore = metrics.linkDistributionScore;

  // SEO
  if (!metrics.schemaValid) { seoScore -= 10; recommendations.push({ category: 'SEO', impact: 'High', suggestion: 'Fix JSON-LD schema.' }); }
  if (metrics.h1Count !== 1) seoScore -= 10;
  if (!metrics.hasCanonical) seoScore -= 10;

  // EEAT
  if (metrics.isStale) { eeatScore -= 20; recommendations.push({ category: 'EEAT', impact: 'High', suggestion: 'Content is stale based on category policy. Review and update.' }); }
  if (!metrics.hasAuthor) eeatScore -= 10;

  // UX
  if (!metrics.accessibilityValid) { uxScore -= 15; recommendations.push({ category: 'UX', impact: 'High', suggestion: 'Fix accessibility issues.' }); }
  if (metrics.imageAltCoverage < 100) uxScore -= 10;
  
  // Content Depth
  if (metrics.wordCount < 500) contentDepthScore -= 20;
  if (!metrics.tablePresence) { contentDepthScore -= 5; recommendations.push({ category: 'Content Depth', impact: 'Low', suggestion: 'Include a comparison table.' }); }

  seoScore = Math.max(0, seoScore);
  eeatScore = Math.max(0, eeatScore);
  readabilityScore = Math.max(0, readabilityScore);
  uxScore = Math.max(0, uxScore);
  contentDepthScore = Math.max(0, contentDepthScore);
  internalLinkingScore = Math.max(0, internalLinkingScore);

  const overallScore = Math.round(
    (seoScore * 0.25) + 
    (eeatScore * 0.2) + 
    (readabilityScore * 0.15) + 
    (uxScore * 0.15) + 
    (contentDepthScore * 0.15) + 
    (internalLinkingScore * 0.1)
  );

  return {
    overallScore,
    scores: {
      seo: seoScore,
      eeat: eeatScore,
      readability: readabilityScore,
      ux: uxScore,
      contentDepth: contentDepthScore,
      internalLinking: internalLinkingScore
    },
    recommendations
  };
}
