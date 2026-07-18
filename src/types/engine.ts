export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
}

export interface ValidatorReport {
  isValid: boolean;
  issues: ValidationIssue[];
  metrics: {
    h1Count: number;
    wordCount: number;
    readabilityScore: number;
    titleLength: number;
    metaDescriptionLength: number;
    hasCanonical: boolean;
    hasRobots: boolean;
    hasOpenGraph: boolean;
    hasTwitterCard: boolean;
    hasJsonLd: boolean;
    internalLinksCount: number;
    externalLinksCount: number;
    missingImageAltCount: number;
    brokenImageCount: number;
    duplicateContentRisk: 'Low' | 'Medium' | 'High';
    hasFAQ: boolean;
    hasCTA: boolean;
    hasBreadcrumb: boolean;
    hasLastUpdated: boolean;
    hasAuthor: boolean;
    hasRelatedPages: boolean;
    pageSpeedWarnings: string[];
    // New 6.5 metrics
    readTimeMinutes: number;
    readingLevel: string;
    contentFreshnessDays: number;
    isStale: boolean;
    paragraphLengthsValid: boolean;
    passiveVoiceScore: number;
    headingBalanceValid: boolean;
    ctaPlacementValid: boolean;
    faqQualityValid: boolean;
    linkDistributionScore: number;
    imageCount: number;
    imageAltCoverage: number;
    tablePresence: boolean;
    accessibilityValid: boolean;
    schemaValid: boolean;
    linksValid: boolean;
  };
}

export interface QualityRecommendation {
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  suggestion: string;
}

export interface QualityScoreReport {
  overallScore: number;
  scores: {
    seo: number;
    eeat: number;
    readability: number;
    ux: number;
    contentDepth: number;
    internalLinking: number;
  };
  recommendations: QualityRecommendation[];
}
