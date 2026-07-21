import { SchemaNode } from './SchemaRegistry';

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  coverage: number;
  typesUsed: string[];
  missingOpportunities: string[];
}

export class SchemaValidator {
  
  public static validate(graph: SchemaNode[]): SchemaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let coverage = 0;
    const typesUsed = new Set<string>();
    
    // Check JSON Syntax safety (is it serializable?)
    try {
      JSON.stringify(graph);
    } catch {
      errors.push("Graph is not valid JSON serializable.");
    }

    const idMap = new Set<string>();
    let totalFields = 0;
    let populatedFields = 0;

    // Track IDs to prevent duplicates and validate references
    graph.forEach(node => {
      if (node['@id']) {
        if (idMap.has(node['@id'])) {
          errors.push(`Duplicate @id found: ${node['@id']}`);
        } else {
          idMap.add(node['@id']);
        }
      }
      
      const typeStr = Array.isArray(node['@type']) ? node['@type'].join(', ') : node['@type'];
      if (typeStr) typesUsed.add(typeStr);

      // Recursive check for populated fields (rough coverage metric)
      const countFields = (obj: any) => {
        for (const key in obj) {
          totalFields++;
          if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
            populatedFields++;
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              countFields(obj[key]);
            }
          }
        }
      };
      countFields(node);
    });

    coverage = totalFields === 0 ? 0 : Math.round((populatedFields / totalFields) * 100);

    // Deep Checks
    graph.forEach(node => {
      // Required Properties Check
      if (node['@type'] === 'Article') {
        if (!node['headline']) errors.push("Article missing required property: headline");
        if (!node['author']) errors.push("Article missing required property: author");
        if (!node['datePublished']) warnings.push("Article missing recommended property: datePublished");
      }
      
      if (node['@type'] === 'Organization') {
        if (!node['logo']) errors.push("Organization missing required property: logo");
        if (!node['url']) errors.push("Organization missing required property: url");
      }

      // Invalid References Check (checking if object with only @id exists in the graph)
      const checkRefs = (obj: any) => {
        if (obj && typeof obj === 'object') {
          if (Object.keys(obj).length === 1 && obj['@id']) {
            if (!idMap.has(obj['@id'])) {
              errors.push(`Invalid reference: ${obj['@id']} is referenced but not defined in the graph.`);
            }
          } else {
            Object.values(obj).forEach(checkRefs);
          }
        }
      };
      checkRefs(node);
    });

    // Missing Opportunities
    const missingOpportunities: string[] = [];
    if (!typesUsed.has('BreadcrumbList')) missingOpportunities.push("BreadcrumbList (improves search navigation)");
    if (!typesUsed.has('FAQPage')) missingOpportunities.push("FAQPage (eligible for rich snippets)");

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      coverage,
      typesUsed: Array.from(typesUsed),
      missingOpportunities
    };
  }
}
