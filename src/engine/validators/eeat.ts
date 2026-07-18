import { SEOContentPage, PageCategory } from '../../types/content';

export interface EEATValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEEAT(page: SEOContentPage): EEATValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Reviewer Requirements for YMYL
  const ymylCategories: PageCategory[] = ['Tax', 'Legal', 'Accounting', 'Compliance', 'Financial Guides'];
  if (ymylCategories.includes(page.category)) {
    if (!page.reviewerId) {
      errors.push(`Reviewer REQUIRED for YMYL category: ${page.category}`);
    }
  }

  // Missing Basic Identity
  if (!page.authorId) {
    errors.push('Missing Author Profile ID');
  }

  // Missing Dates
  if (!page.publishedDate) errors.push('Missing Published Date');
  if (!page.lastUpdatedDate) errors.push('Missing Last Updated Date');
  
  if (!page.nextReviewDate) {
    warnings.push('Missing Next Review Date (affects freshness predictability)');
  }

  // Missing Citations
  if (!page.citations || page.citations.length === 0) {
    if (ymylCategories.includes(page.category)) {
      errors.push('Citations are mandatory for YMYL pages.');
    } else {
      warnings.push('No external citations provided. This lowers Trust score.');
    }
  } else {
    // Validate citation quality
    const lowQuality = page.citations.filter(c => c.qualityScore === 'Low');
    if (lowQuality.length > 0) {
      warnings.push(`Found ${lowQuality.length} Low Quality citations.`);
    }
  }

  // Missing Trust Policies / Signals
  // The global trust signals (policies) are usually linked in the footer.
  // Statically checking page badges here:
  if (!page.trustBadges || page.trustBadges.length === 0) {
    warnings.push('No trust badges assigned to page.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
