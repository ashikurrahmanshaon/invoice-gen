import entityGraphData from '../data/seoEntityGraph.json';
import type { SEOEntityNode } from '../types/seo';

const entityGraph = entityGraphData as Record<string, SEOEntityNode>;

// Pre-computed fallback list of valid pages to ensure we can resolve titles if they aren't in the graph yet
import invoiceTypes from '../data/invoiceTypes.json';
import tools from '../data/tools.json';
import resources from '../data/resources.json';
const allPages = [...invoiceTypes, ...tools, ...resources];

export function getRelatedPagesForSlug(slug: string, limit: number = 4) {
  const node = entityGraph[slug];
  
  if (!node) {
    // Fallback logic for pages not yet in the entity graph
    return [];
  }

  const relatedSlugs = new Set<string>();

  // 1. Exact Relationship Edges (Highest Priority)
  if (node.parentPage) relatedSlugs.add(node.parentPage);
  if (node.childPages) node.childPages.forEach(s => relatedSlugs.add(s));
  if (node.relatedPages) node.relatedPages.forEach(s => relatedSlugs.add(s));

  // 2. Entity Overlap (Semantic Similarity)
  if (relatedSlugs.size < limit) {
    for (const [otherSlug, otherNode] of Object.entries(entityGraph)) {
      if (otherSlug === slug) continue;
      
      const isSamePrimaryEntity = otherNode.primaryEntity === node.primaryEntity;
      const sharesSecondaryEntities = otherNode.secondaryEntities.some(e => node.secondaryEntities.includes(e));
      const sharesRelatedEntities = otherNode.relatedEntities.some(e => node.relatedEntities.includes(e));
      const isSameCategory = otherNode.category === node.category;
                              
      // Basic scoring algorithm for topical proximity
      let score = 0;
      if (isSamePrimaryEntity) score += 3;
      if (sharesSecondaryEntities) score += 2;
      if (sharesRelatedEntities) score += 1;
      if (isSameCategory) score += 1;

      if (score >= 2) {
        relatedSlugs.add(otherSlug);
      }
      
      if (relatedSlugs.size >= limit) break;
    }
  }

  // Resolve slugs to actual titles and URLs
  const results = Array.from(relatedSlugs)
    .map(relatedSlug => {
      // First try to resolve from the new entity graph title if it existed (we'd need title in entity node)
      // Since title isn't in Entity Node, we look it up in the raw data files
      const pageData = allPages.find(p => p.slug === relatedSlug);
      
      if (!pageData) {
        // As a fallback for pages defined in the graph but not yet created in content JSONs
        return {
          title: relatedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          url: `/${entityGraph[relatedSlug]?.category || 'resources'}/${relatedSlug}/`
        };
      }

      let category = 'resources';
      if (invoiceTypes.some(p => p.slug === relatedSlug)) category = 'invoice-types';
      if (tools.some(p => p.slug === relatedSlug)) category = 'tools';

      return {
        title: pageData.title,
        url: `/${category}/${relatedSlug}/`
      };
    })
    .filter(Boolean)
    .slice(0, limit);

  return results as { title: string; url: string }[];
}
