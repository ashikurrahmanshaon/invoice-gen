import { SEOContentPage, PageCategory } from '../types/content';
import { authors, reviewers } from '../config/authors';

export interface TrustScoreReport {
  overallEEAT: number;
  scores: {
    experience: number;
    expertise: number;
    authority: number;
    trust: number;
  };
  recommendations: string[];
}

export function calculateEEATScore(page: SEOContentPage): TrustScoreReport {
  let experience = 100;
  let expertise = 100;
  let authority = 100;
  let trust = 100;
  const recommendations: string[] = [];

  const author = page.authorId ? authors[page.authorId] : null;
  const reviewer = page.reviewerId ? reviewers[page.reviewerId] : null;

  // Expertise (Focuses on Author/Reviewer qualifications)
  if (!author) {
    expertise -= 40;
  } else if (author.expertise.length < 2) {
    expertise -= 10;
    recommendations.push('Author should list more specific expertise areas.');
  }

  if (reviewer) {
    expertise += 10; // Boost for having a reviewer
  }

  // Experience (Focuses on firsthand knowledge, length of author experience)
  if (!author || !author.experience) {
    experience -= 30;
  } else if (!author.experience.includes('Years') && !author.experience.includes('+')) {
    experience -= 10;
  }

  // Authority (Citations and backlinks, but we only have citations statically)
  if (!page.citations || page.citations.length === 0) {
    authority -= 30;
    recommendations.push('Add high-quality citations to boost Authority.');
  } else {
    let highQualityCount = 0;
    page.citations.forEach(c => {
      if (c.qualityScore === 'Very High' || c.qualityScore === 'High') highQualityCount++;
      if (c.qualityScore === 'Low') authority -= 10;
    });
    if (highQualityCount < 2) {
      authority -= 10;
      recommendations.push('Include more Very High / High quality citations (e.g. Government/Official Docs).');
    }
  }

  // Trust (Transparency, policies, dates, version history)
  if (!page.publishedDate || !page.lastUpdatedDate) {
    trust -= 20;
  }
  if (!page.versionHistory || page.versionHistory.length === 0) {
    trust -= 10;
    recommendations.push('Add a version history log for transparency.');
  }
  if (!page.trustBadges || page.trustBadges.length === 0) {
    trust -= 10;
  }
  
  const ymylCategories: PageCategory[] = ['Tax', 'Legal', 'Accounting', 'Compliance', 'Financial Guides'];
  if (ymylCategories.includes(page.category) && !reviewer) {
    trust -= 40; // Massive penalty for missing reviewer on YMYL
  }

  experience = Math.min(100, Math.max(0, experience));
  expertise = Math.min(100, Math.max(0, expertise));
  authority = Math.min(100, Math.max(0, authority));
  trust = Math.min(100, Math.max(0, trust));

  const overallEEAT = Math.round((experience * 0.2) + (expertise * 0.3) + (authority * 0.2) + (trust * 0.3));

  return {
    overallEEAT,
    scores: { experience, expertise, authority, trust },
    recommendations
  };
}
