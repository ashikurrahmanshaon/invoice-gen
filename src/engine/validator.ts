import { SEOContentPage } from '../types/content';
import { ValidatorReport, ValidationIssue } from '../types/engine';
import { checkPassiveVoice, checkParagraphLengths, calculateReadTime, calculateReadingLevel } from './validators/linguistic';
import { calculateContentFreshness, isContentStale } from './validators/freshness';
import { validateAccessibility, checkHeadingBalance } from './validators/accessibility';
import { validateImages } from './validators/images';
import { validateSchema } from './validators/schema';
import { validateLinks } from './validators/links';

export function validateContent(page: SEOContentPage): ValidatorReport {
  const issues: ValidationIssue[] = [];
  const blocks = page.blocks || [];
  
  let rawText = '';
  let h1Count = 0;
  let hasFAQ = false;
  let hasCTA = false;
  let hasBreadcrumb = false;
  let hasLastUpdated = false;
  let hasAuthor = false;
  let hasRelatedPages = false;
  let tablePresence = false;

  blocks.forEach(block => {
    if ('title' in block && typeof block.title === 'string') rawText += block.title + ' ';
    if ('text' in block && typeof block.text === 'string') rawText += block.text + ' ';
    if ('description' in block && typeof block.description === 'string') rawText += block.description + ' ';
    if ('heading' in block && typeof block.heading === 'string') rawText += block.heading + ' ';
    
    if (block.type === 'hero') h1Count++;
    if (block.type === 'faq') hasFAQ = true;
    if (block.type === 'cta') hasCTA = true;
    if (block.type === 'breadcrumb') hasBreadcrumb = true;
    if (block.type === 'lastUpdated') hasLastUpdated = true;
    if (block.type === 'author') hasAuthor = true;
    if (['relatedResources', 'relatedTemplates', 'relatedTools'].includes(block.type)) hasRelatedPages = true;
    if (block.type === 'comparisonTable') tablePresence = true;
  });
  
  const words = rawText.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Linguistics
  const paragraphLengthsValid = checkParagraphLengths(rawText);
  const passiveVoiceScore = checkPassiveVoice(rawText);
  const readTimeMinutes = calculateReadTime(wordCount);
  const readingLevel = calculateReadingLevel(rawText, wordCount);
  const readabilityScore = Math.round((passiveVoiceScore + (paragraphLengthsValid ? 100 : 50)) / 2);

  // Freshness
  const contentFreshnessDays = calculateContentFreshness(page.lastUpdatedDate);
  const isStale = isContentStale(page.category, contentFreshnessDays);

  // Images
  const imgStats = validateImages(page);
  
  // Links
  const linkStats = validateLinks(page);
  
  // Accessibility & Structure
  const accessibilityValid = validateAccessibility(page);
  const headingBalanceValid = checkHeadingBalance(page);
  
  // Schema
  const schemaValid = validateSchema(page);

  // Basic SEO Checks
  if (h1Count !== 1) issues.push({ type: 'error', category: 'SEO', message: 'Must have exactly one H1.' });
  const titleLength = page.meta?.title?.length || 0;
  if (titleLength < 30 || titleLength > 60) issues.push({ type: 'error', category: 'SEO', message: 'Meta Title length invalid.' });
  const metaDescriptionLength = page.meta?.description?.length || 0;
  if (metaDescriptionLength < 100 || metaDescriptionLength > 160) issues.push({ type: 'error', category: 'SEO', message: 'Meta Description length invalid.' });
  if (!page.meta?.canonicalUrl) issues.push({ type: 'error', category: 'SEO', message: 'Missing Canonical URL.' });
  if (!schemaValid) issues.push({ type: 'error', category: 'SEO', message: 'Schema validation failed.' });
  
  if (isStale) issues.push({ type: 'error', category: 'Freshness', message: `Content is stale for category: ${page.category}` });
  if (passiveVoiceScore < 80) issues.push({ type: 'warning', category: 'Linguistics', message: 'Too much passive voice.' });
  if (!paragraphLengthsValid) issues.push({ type: 'error', category: 'Linguistics', message: 'Paragraphs are too long.' });
  
  const ctaPlacementValid = hasCTA; // Placeholder for CTA placement logic

  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    issues,
    metrics: {
      h1Count,
      wordCount,
      readabilityScore,
      titleLength,
      metaDescriptionLength,
      hasCanonical: !!page.meta?.canonicalUrl,
      hasRobots: !!page.meta?.robots,
      hasOpenGraph: !!page.meta?.openGraph,
      hasTwitterCard: !!page.meta?.twitterCard,
      hasJsonLd: schemaValid,
      internalLinksCount: linkStats.internalLinks,
      externalLinksCount: linkStats.externalLinks,
      missingImageAltCount: imgStats.count - (imgStats.count * (imgStats.altCoverage/100)),
      brokenImageCount: 0,
      duplicateContentRisk: 'Low',
      hasFAQ,
      hasCTA,
      hasBreadcrumb,
      hasLastUpdated,
      hasAuthor,
      hasRelatedPages,
      pageSpeedWarnings: [],
      // 6.5
      readTimeMinutes,
      readingLevel,
      contentFreshnessDays,
      isStale,
      paragraphLengthsValid,
      passiveVoiceScore,
      headingBalanceValid,
      ctaPlacementValid,
      faqQualityValid: hasFAQ,
      linkDistributionScore: linkStats.distributionScore,
      imageCount: imgStats.count,
      imageAltCoverage: imgStats.altCoverage,
      tablePresence,
      accessibilityValid,
      schemaValid,
      linksValid: linkStats.isValid
    }
  };
}
