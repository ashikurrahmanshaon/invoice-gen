import React from 'react';
import { ContentBlock } from '../types/content';
import {
  HeroBlock,
  IntroductionBlock,
  QuickSummaryBlock,
  KeyBenefitsBlock,
  FeatureGridBlock,
  StepByStepGuideBlock,
  BestPracticesBlock,
  CommonMistakesBlock,
  RealExamplesBlock,
  FAQBlock,
  RelatedLinksRenderer,
  CTABlock,
  AuthorBlock,
  BreadcrumbBlock,
  LastUpdatedBlock,
  TimelineBlock,
  ComparisonTableBlock,
  ChecklistBlock,
  KeyTakeawaysBlock,
  MythVsFactBlock,
  DefinitionBlock,
  ExpertTipBlock,
  WarningBlock,
  InfoBoxBlock,
  StatisticsBlock,
  QuoteBlock,
  CaseStudyBlock,
  DecisionTreeBlock,
  DownloadsBlock
} from '../components/seo/blocks/BlockComponents';

export interface ContentEngineProps {
  blocks: ContentBlock[];
}

export const ContentEngine: React.FC<ContentEngineProps> = ({ blocks }) => {
  return (
    <div className="content-engine">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'hero': return <HeroBlock key={block.id || index} {...block} />;
          case 'introduction': return <IntroductionBlock key={block.id || index} {...block} />;
          case 'quickSummary': return <QuickSummaryBlock key={block.id || index} {...block} />;
          case 'keyBenefits': return <KeyBenefitsBlock key={block.id || index} {...block} />;
          case 'featureGrid': return <FeatureGridBlock key={block.id || index} {...block} />;
          case 'stepByStepGuide': return <StepByStepGuideBlock key={block.id || index} {...block} />;
          case 'bestPractices': return <BestPracticesBlock key={block.id || index} {...block} />;
          case 'commonMistakes': return <CommonMistakesBlock key={block.id || index} {...block} />;
          case 'realExamples': return <RealExamplesBlock key={block.id || index} {...block} />;
          case 'faq': return <FAQBlock key={block.id || index} {...block} />;
          case 'relatedResources': return <RelatedLinksRenderer key={block.id || index} title="Related Resources" links={block.resources} />;
          case 'relatedTemplates': return <RelatedLinksRenderer key={block.id || index} title="Related Templates" links={block.templates} />;
          case 'relatedTools': return <RelatedLinksRenderer key={block.id || index} title="Related Tools" links={block.tools} />;
          case 'cta': return <CTABlock key={block.id || index} {...block} />;
          case 'author': return <AuthorBlock key={block.id || index} {...block} />;
          case 'breadcrumb': return <BreadcrumbBlock key={block.id || index} {...block} />;
          case 'lastUpdated': return <LastUpdatedBlock key={block.id || index} {...block} />;
          case 'timeline': return <TimelineBlock key={block.id || index} {...block} />;
          case 'comparisonTable': return <ComparisonTableBlock key={block.id || index} {...block} />;
          case 'checklist': return <ChecklistBlock key={block.id || index} {...block} />;
          case 'keyTakeaways': return <KeyTakeawaysBlock key={block.id || index} {...block} />;
          case 'mythVsFact': return <MythVsFactBlock key={block.id || index} {...block} />;
          case 'definition': return <DefinitionBlock key={block.id || index} {...block} />;
          case 'expertTip': return <ExpertTipBlock key={block.id || index} {...block} />;
          case 'warning': return <WarningBlock key={block.id || index} {...block} />;
          case 'infoBox': return <InfoBoxBlock key={block.id || index} {...block} />;
          case 'statistics': return <StatisticsBlock key={block.id || index} {...block} />;
          case 'quote': return <QuoteBlock key={block.id || index} {...block} />;
          case 'caseStudy': return <CaseStudyBlock key={block.id || index} {...block} />;
          case 'decisionTree': return <DecisionTreeBlock key={block.id || index} {...block} />;
          case 'downloads': return <DownloadsBlock key={block.id || index} {...block} />;
          default:
            console.warn(`Unsupported block type found: ${(block as any).type}`);
            return null;
        }
      })}
    </div>
  );
};
