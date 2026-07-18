import topicGraph from '../data/topicGraph.json';

// We need a lookup table for actual page titles since the graph only has slugs.
// In a real app with hundreds of pages, this might be aggregated at build time.
import invoiceTypes from '../data/invoiceTypes.json';
import tools from '../data/tools.json';
import resources from '../data/resources.json';

// Temporary aggregate to find page titles
const allPages = [...invoiceTypes, ...tools, ...resources];

interface TopicNode {
  primaryTopic: string;
  secondaryTopics: string[];
  parentTopic: string;
  relatedTools: string[];
  relatedResources: string[];
  relatedTemplates?: string[];
}

export function getRelatedPagesForSlug(slug: string, limit: number = 4) {
  const graph = topicGraph as Record<string, TopicNode>;
  const node = graph[slug];

  if (!node) return [];

  const relatedSlugs = new Set<string>();

  // Add explicitly defined related pages
  if (node.relatedTools) node.relatedTools.forEach(s => relatedSlugs.add(s));
  if (node.relatedResources) node.relatedResources.forEach(s => relatedSlugs.add(s));
  if (node.relatedTemplates) node.relatedTemplates.forEach(s => relatedSlugs.add(s));

  // If we need more, find pages with matching secondary topics
  if (relatedSlugs.size < limit) {
    for (const [otherSlug, otherNode] of Object.entries(graph)) {
      if (otherSlug === slug) continue;
      
      const hasTopicOverlap = otherNode.secondaryTopics.some(t => node.secondaryTopics.includes(t)) ||
                              otherNode.primaryTopic === node.primaryTopic;
                              
      if (hasTopicOverlap) {
        relatedSlugs.add(otherSlug);
      }
      
      if (relatedSlugs.size >= limit) break;
    }
  }

  // Resolve slugs to actual titles and URLs
  const results = Array.from(relatedSlugs)
    .map(relatedSlug => {
      const pageData = allPages.find(p => p.slug === relatedSlug);
      if (!pageData) return null;

      // Determine category (this is simplistic, but works for the current architecture)
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
