import { siteConfig } from '../../config/site';

export interface SchemaNode {
  "@type": string | string[];
  "@id"?: string;
  [key: string]: any;
}

export class SchemaRegistry {
  private static instance: SchemaRegistry;
  private graph: Map<string, SchemaNode>;
  private untrackedNodes: SchemaNode[]; // For nodes without @id
  
  private constructor() {
    this.graph = new Map();
    this.untrackedNodes = [];
  }

  public static getInstance(): SchemaRegistry {
    if (!SchemaRegistry.instance) {
      SchemaRegistry.instance = new SchemaRegistry();
    }
    return SchemaRegistry.instance;
  }

  public reset(): void {
    this.graph.clear();
    this.untrackedNodes = [];
  }

  // Register a node to the graph. Deduplicates based on @id.
  public register(node: SchemaNode): void {
    if (node['@id']) {
      if (!this.graph.has(node['@id'])) {
        this.graph.set(node['@id'], node);
      } else {
        // Merge strategy could go here, but for now we assume first-in wins for shared objects
        // or we just skip if it already exists to avoid duplication.
      }
    } else {
      this.untrackedNodes.push(node);
    }
  }

  public getGraph(): SchemaNode[] {
    return [...Array.from(this.graph.values()), ...this.untrackedNodes];
  }

  // BUILDERS

  public buildOrganization(): SchemaNode {
    const id = `${siteConfig.url}/#organization`;
    if (this.graph.has(id)) return { "@id": id } as any;

    const node: SchemaNode = {
      "@type": "Organization",
      "@id": id,
      "name": siteConfig.legalName,
      "url": siteConfig.url,
      "logo": {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        "inLanguage": "en-US",
        "url": siteConfig.logo,
        "width": 112,
        "height": 112,
        "caption": siteConfig.name
      },
      "image": { "@id": `${siteConfig.url}/#logo` },
      "sameAs": Object.values(siteConfig.social)
    };
    this.register(node);
    return { "@id": id } as any; // Return reference
  }

  public buildWebSite(): SchemaNode {
    const id = `${siteConfig.url}/#website`;
    if (this.graph.has(id)) return { "@id": id } as any;

    const orgRef = this.buildOrganization();

    const node: SchemaNode = {
      "@type": "WebSite",
      "@id": id,
      "url": siteConfig.url,
      "name": siteConfig.name,
      "description": siteConfig.description,
      "publisher": orgRef,
      "inLanguage": "en-US"
    };
    this.register(node);
    return { "@id": id } as any;
  }

  public buildWebPage(url: string, title: string, description: string): SchemaNode {
    const id = `${url}/#webpage`;
    if (this.graph.has(id)) return { "@id": id } as any;

    const websiteRef = this.buildWebSite();

    const node: SchemaNode = {
      "@type": "WebPage",
      "@id": id,
      "url": url,
      "name": title,
      "description": description,
      "isPartOf": websiteRef,
      "inLanguage": "en-US"
    };
    this.register(node);
    return { "@id": id } as any;
  }

  public buildArticle(url: string, title: string, description: string, datePublished: string, dateModified: string, authorName: string = siteConfig.defaultAuthor.name): SchemaNode {
    const id = `${url}/#article`;
    if (this.graph.has(id)) return { "@id": id } as any;

    const webpageRef = this.buildWebPage(url, title, description);
    const publisherRef = this.buildOrganization();

    const node: SchemaNode = {
      "@type": "Article",
      "@id": id,
      "isPartOf": webpageRef,
      "mainEntityOfPage": webpageRef,
      "headline": title,
      "description": description,
      "datePublished": datePublished,
      "dateModified": dateModified,
      "author": {
        "@type": "Person",
        "name": authorName
      },
      "publisher": publisherRef
    };
    this.register(node);
    return { "@id": id } as any;
  }

  public buildFAQPage(url: string, faqs: { question: string, answer: string }[]): SchemaNode {
    const id = `${url}/#faq`;
    if (this.graph.has(id)) return { "@id": id } as any;

    this.buildWebPage(url, "", ""); // Assuming it's already built, this fetches ref

    const node: SchemaNode = {
      "@type": "FAQPage",
      "@id": id,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    // We add this to the graph. FAQPage is technically a WebPage subtype, 
    // but in many implementations it's injected alongside.
    // If we strictly type it, we might merge it with WebPage. Let's keep it separate in the graph for now.
    this.register(node);
    return { "@id": id } as any;
  }
}
