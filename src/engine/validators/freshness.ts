import { PageCategory } from '../../types/content';

export function calculateContentFreshness(lastUpdatedDate: string): number {
  if (!lastUpdatedDate) return 9999;
  const updated = new Date(lastUpdatedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - updated.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

export function isContentStale(category: PageCategory, freshnessDays: number): boolean {
  let threshold = 365;
  switch (category) {
    case 'News':
    case 'Pricing':
      threshold = 30;
      break;
    case 'Tax':
      threshold = 90;
      break;
    case 'Legal':
    case 'Invoice Guides':
      threshold = 180;
      break;
    case 'Invoice Templates':
    case 'Invoice Types':
    case 'Resources':
    case 'Static Company Pages':
    default:
      threshold = 365;
      break;
  }
  return freshnessDays > threshold;
}
