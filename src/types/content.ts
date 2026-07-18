export type BlockType = 
  | 'hero' 
  | 'introduction' 
  | 'quickSummary' 
  | 'keyBenefits' 
  | 'featureGrid' 
  | 'stepByStepGuide' 
  | 'bestPractices' 
  | 'commonMistakes' 
  | 'realExamples' 
  | 'faq' 
  | 'relatedResources' 
  | 'relatedTemplates' 
  | 'relatedTools' 
  | 'cta' 
  | 'author' 
  | 'breadcrumb' 
  | 'lastUpdated'
  | 'timeline'
  | 'comparisonTable'
  | 'checklist'
  | 'keyTakeaways'
  | 'mythVsFact'
  | 'definition'
  | 'expertTip'
  | 'warning'
  | 'infoBox'
  | 'statistics'
  | 'quote'
  | 'caseStudy'
  | 'decisionTree'
  | 'downloads';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  readTime?: string;
  lastUpdated?: string;
}

export interface IntroductionBlock extends BaseBlock {
  type: 'introduction';
  heading: string;
  text: string;
}

export interface QuickSummaryBlock extends BaseBlock {
  type: 'quickSummary';
  summaryItems: string[];
}

export interface KeyBenefitsBlock extends BaseBlock {
  type: 'keyBenefits';
  heading?: string;
  benefits: { title: string; description: string }[];
}

export interface FeatureGridBlock extends BaseBlock {
  type: 'featureGrid';
  features: { icon?: string; title: string; description: string }[];
}

export interface StepByStepGuideBlock extends BaseBlock {
  type: 'stepByStepGuide';
  steps: { title: string; description: string }[];
}

export interface BestPracticesBlock extends BaseBlock {
  type: 'bestPractices';
  practices: { title: string; description: string }[];
}

export interface CommonMistakesBlock extends BaseBlock {
  type: 'commonMistakes';
  mistakes: { mistake: string; solution: string }[];
}

export interface RealExamplesBlock extends BaseBlock {
  type: 'realExamples';
  examples: { title: string; description: string; imageUrl?: string }[];
}

export interface FAQBlock extends BaseBlock {
  type: 'faq';
  questions: { question: string; answer: string }[];
}

export interface RelatedLink {
  title: string;
  url: string;
  description?: string;
}

export interface RelatedResourcesBlock extends BaseBlock {
  type: 'relatedResources';
  resources: RelatedLink[];
}

export interface RelatedTemplatesBlock extends BaseBlock {
  type: 'relatedTemplates';
  templates: RelatedLink[];
}

export interface RelatedToolsBlock extends BaseBlock {
  type: 'relatedTools';
  tools: RelatedLink[];
}

export interface CTABlock extends BaseBlock {
  type: 'cta';
  heading: string;
  subtext: string;
  buttonText: string;
  buttonLink: string;
}

export interface AuthorBlockType extends BaseBlock {
  type: 'author';
  authorName: string;
  authorBio: string;
  authorImage?: string;
  authorUrl?: string;
}

export interface BreadcrumbBlock extends BaseBlock {
  type: 'breadcrumb';
  crumbs: { label: string; url: string }[];
}

export interface LastUpdatedBlock extends BaseBlock {
  type: 'lastUpdated';
  date: string;
}

export interface TimelineBlock extends BaseBlock { type: 'timeline'; events: { date: string; title: string; description: string }[]; }
export interface ComparisonTableBlock extends BaseBlock { type: 'comparisonTable'; headers: string[]; rows: string[][]; }
export interface ChecklistBlock extends BaseBlock { type: 'checklist'; title: string; items: { text: string; checked: boolean }[]; }
export interface KeyTakeawaysBlock extends BaseBlock { type: 'keyTakeaways'; takeaways: string[]; }
export interface MythVsFactBlock extends BaseBlock { type: 'mythVsFact'; items: { myth: string; fact: string }[]; }
export interface DefinitionBlock extends BaseBlock { type: 'definition'; term: string; definition: string; }
export interface ExpertTipBlock extends BaseBlock { type: 'expertTip'; tip: string; expertName?: string; }
export interface WarningBlock extends BaseBlock { type: 'warning'; text: string; }
export interface InfoBoxBlock extends BaseBlock { type: 'infoBox'; text: string; }
export interface StatisticsBlock extends BaseBlock { type: 'statistics'; stats: { label: string; value: string }[]; }
export interface QuoteBlock extends BaseBlock { type: 'quote'; quote: string; author: string; }
export interface CaseStudyBlock extends BaseBlock { type: 'caseStudy'; title: string; challenge: string; solution: string; result: string; }
export interface DecisionTreeBlock extends BaseBlock { type: 'decisionTree'; title: string; nodes: any[]; /* placeholder for complex tree data */ }
export interface DownloadsBlock extends BaseBlock { type: 'downloads'; files: { name: string; url: string; type: string; size: string }[]; }

export type ContentBlock = 
  | HeroBlock 
  | IntroductionBlock 
  | QuickSummaryBlock 
  | KeyBenefitsBlock 
  | FeatureGridBlock 
  | StepByStepGuideBlock 
  | BestPracticesBlock 
  | CommonMistakesBlock 
  | RealExamplesBlock 
  | FAQBlock 
  | RelatedResourcesBlock 
  | RelatedTemplatesBlock 
  | RelatedToolsBlock 
  | CTABlock 
  | AuthorBlockType 
  | BreadcrumbBlock 
  | LastUpdatedBlock
  | TimelineBlock
  | ComparisonTableBlock
  | ChecklistBlock
  | KeyTakeawaysBlock
  | MythVsFactBlock
  | DefinitionBlock
  | ExpertTipBlock
  | WarningBlock
  | InfoBoxBlock
  | StatisticsBlock
  | QuoteBlock
  | CaseStudyBlock
  | DecisionTreeBlock
  | DownloadsBlock;

export interface DynamicContent {
  type: 'table' | 'list' | 'prosCons' | 'note' | 'warning' | 'example' | 'statistic' | 'quote' | 'callout';
  content: any; // Flexible JSON payload for dynamic blocks
}

export type ContentLifecycleStatus = 'Draft' | 'Review Required' | 'SEO Approved' | 'Production Ready';
export type PageCategory = 'News' | 'Pricing' | 'Tax' | 'Legal' | 'Invoice Guides' | 'Invoice Templates' | 'Invoice Types' | 'Resources' | 'Static Company Pages' | 'Accounting' | 'Compliance' | 'Financial Guides' | 'Blog Articles' | 'Free Tools';

export type CitationQuality = 'Very High' | 'High' | 'Medium' | 'Low';
export type CitationCategory = 'Government Sources' | 'Official Documentation' | 'Industry Standards' | 'Accounting Organizations' | 'Tax Authorities' | 'Payment Platforms' | 'Legal References' | 'Industry Reports';

export interface Citation {
  sourceName: string;
  url: string;
  category: CitationCategory;
  publicationDate: string;
  lastChecked: string;
  qualityScore: CitationQuality;
}

export interface VersionHistoryEntry {
  version: string;
  publishedDate: string;
  updatedDate: string;
  changeSummary: string;
  reviewerId?: string;
  reasonForUpdate: string;
}

export type TrustBadge = 'Verified' | 'Expert Reviewed' | 'Fact Checked' | 'Recently Updated' | 'Trusted Source';

export type ContentFreshnessStatus = 'Fresh' | 'Needs Review' | 'Outdated';

// Full Page Schema
export interface SEOContentPage {
  slug: string;
  category: PageCategory;
  status: ContentLifecycleStatus;
  lastUpdatedDate: string; // ISO string
  publishedDate?: string;
  nextReviewDate?: string;
  freshnessStatus?: ContentFreshnessStatus;
  authorId?: string;
  reviewerId?: string;
  trustBadges?: TrustBadge[];
  versionHistory?: VersionHistoryEntry[];
  citations?: Citation[];
  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    robots?: string;
    openGraph?: {
      type: 'website' | 'article';
      image: string;
    };
    twitterCard?: 'summary_large_image' | 'summary';
    schema: Record<string, any>[];
  };
  blocks: ContentBlock[];
}
