import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { SEO } from '../components/seo/SEO';
import { ContentEngine } from '../engine/ContentEngine';
import type { SEOContentPage } from '../types/content';

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

  return (
    <AppLayout>
      <SEO 
        title={pageData.meta.title}
        description={pageData.meta.description}
        canonicalUrl={canonicalUrl}
        schema={pageData.meta.schema}
      />
      
      <Container>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 20px 100px 20px' }}>
          <ContentEngine blocks={pageData.blocks} />
        </div>
      </Container>
    </AppLayout>
  );
}
