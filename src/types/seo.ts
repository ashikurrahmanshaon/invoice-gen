export type SearchIntent = 'informational' | 'navigational' | 'transactional' | 'commercial_investigation';
export type DifficultyLevel = 'low' | 'medium' | 'high';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ContentStatus = 'planned' | 'drafting' | 'published' | 'needs_update';
export type ContentType = 'hub' | 'spoke' | 'tool' | 'template' | 'guide' | 'comparison';
export type ReviewFrequency = 'monthly' | 'quarterly' | 'bi-annually' | 'annually';

export interface SEOEntityNode {
  // Graph Identity
  slug: string;
  category: string; // The parent category (e.g., 'templates', 'resources')
  
  // Entities
  primaryEntity: string;
  secondaryEntities: string[];
  relatedEntities: string[];
  
  // Strategy
  searchIntent: SearchIntent;
  targetAudience: string[];
  difficulty: DifficultyLevel;
  priority: PriorityLevel;
  estimatedSearchVolume: number;
  
  // Content Lifecycle
  contentStatus: ContentStatus;
  contentType: ContentType;
  wordCountTarget: number;
  lastUpdated: string;
  reviewFrequency: ReviewFrequency;
  
  // Keyword Strategy
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  lsiKeywords: string[];
  
  // SERP Features
  featuredSnippetOpportunity: string | null;
  peopleAlsoAsk: string[];
  schemaTypes: string[]; // e.g., ['Organization', 'BreadcrumbList', 'FAQPage', 'Article']
  
  // Link Architecture
  internalLinkScore: number; // 0-100 rating for internal authority flow
  externalLinkOpportunity: string[]; // e.g., ['accounting blogs', 'freelancer forums']
  parentPage: string | null; // slug of the parent hub
  childPages: string[]; // slugs of supporting spoke pages
  relatedPages: string[]; // horizontal links across branches
}

export interface SEOEntityGraph {
  [slug: string]: SEOEntityNode;
}
