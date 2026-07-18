export type KeywordIntent = 'informational' | 'commercial' | 'transactional' | 'comparison' | 'brand' | 'tool' | 'template';
export type KeywordPriority = 'critical' | 'high' | 'medium' | 'low';
export type BusinessValue = 'high' | 'medium' | 'low';

export interface ContentBrief {
  targetAudience: string;
  searchIntent: KeywordIntent;
  wordCountTarget: number;
  requiredSections: string[];
  faqSuggestions: string[];
  ctaType: string;
  internalLinkTargets: string[];
}

export interface SERPIntelligence {
  featuredSnippetOpportunity: boolean;
  peopleAlsoAsk: boolean;
  imagePack: boolean;
  videoOpportunity: boolean;
  aiOverviewPlaceholder: boolean;
}

export interface Localization {
  language: string;
  locale: string;
  country: string;
  region: string;
  currency: string;
}

export interface KeywordCluster {
  slug: string; // The specific page route this applies to
  
  // Core Keywords
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  semanticKeywords: string[]; // LSI
  entityKeywords: string[]; // Google Knowledge Graph entities
  questionKeywords: string[]; // People Also Ask
  commercialKeywords: string[];
  
  // Strategy
  searchIntent: KeywordIntent;
  priority: KeywordPriority;
  businessValue: BusinessValue;
  topicalAuthorityScore: number; // 0-100 rating
  internalLinkPriority: number; // 0-100 rating
  
  // Content Engine Elements
  contentBrief: ContentBrief;
  serpIntelligence: SERPIntelligence;
  localization: Localization;
}

export type KeywordGraph = Record<string, KeywordCluster>;
