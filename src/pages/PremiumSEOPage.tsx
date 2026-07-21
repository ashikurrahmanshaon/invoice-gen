import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { SEO } from '../components/seo/SEO';
import { ContentEngine } from '../engine/ContentEngine';
import { trackEvent } from '../utils/analytics';
import type { SEOContentPage } from '../types/content';
import { editorialTeam } from '../config/authors';

// Dynamically import all JSON pages
const pageModules = import.meta.glob('../data/pages/*.json', { eager: true });

// Build a map of slug -> page data
const pagesRegistry: Record<string, SEOContentPage> = {};
for (const path in pageModules) {
  const pageData = (pageModules[path] as any).default as SEOContentPage;
  if (pageData && pageData.slug) {
    pagesRegistry[pageData.slug] = pageData;
  }
}

export default function PremiumSEOPage() {
  let { slug } = useParams<{ slug: string }>();
  
  if (!slug && typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/\/$/, '').split('/').pop();
    if (path) slug = path;
  }
  
  const pageData = slug ? pagesRegistry[slug] : undefined;

  useEffect(() => {
    if (pageData) {
      if (pageData.category === 'Invoice Guides') {
        trackEvent('guide_opened', { article_slug: pageData.slug });
      } else if (pageData.category === 'Blog Articles') {
        trackEvent('blog_opened', { article_slug: pageData.slug });
      }
    }
  }, [pageData]);

  if (!pageData) {
    return (
      <AppLayout>
        <Container>
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  // Map canonical based on the new route paths if required, but the JSON provides meta.canonicalUrl
  const canonicalUrl = pageData.meta.canonicalUrl || `https://invoice-gen.net/${pageData.slug}`;

  // Force centralized author and publisher on any Article schema
  let finalSchema = pageData.meta.schema;
  if (finalSchema) {
    const processSchemaObj = (obj: any) => {
      if (obj && obj['@type'] === 'Article') {
        obj.author = {
          "@type": "Organization",
          "name": editorialTeam.name,
          "url": editorialTeam.socialProfiles.website
        };
        obj.publisher = {
          "@type": "Organization",
          "name": "Invoice-Gen",
          "logo": {
            "@type": "ImageObject",
            "url": "https://invoice-gen.net/logo.svg"
          }
        };
      }
      return obj;
    };
    
    if (Array.isArray(finalSchema)) {
      finalSchema = finalSchema.map(processSchemaObj);
    } else {
      finalSchema = processSchemaObj(JSON.parse(JSON.stringify(finalSchema)));
    }
  }

  return (
    <AppLayout>
      <SEO 
        title={pageData.meta.title}
        description={pageData.meta.description}
        canonicalUrl={canonicalUrl}
        schema={finalSchema}
      />
      
      <Container>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 20px 100px 20px' }}>
          <ContentEngine blocks={pageData.blocks} />
        </div>
      </Container>
    </AppLayout>
  );
}
