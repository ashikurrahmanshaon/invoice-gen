import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { CTA } from '../components/ui/CTA';
import { SEO } from '../components/seo/SEO';

import { HeroSection } from '../components/seo/HeroSection';
import { ArticleContent } from '../components/seo/ArticleContent';
import { FeatureGrid } from '../components/seo/FeatureGrid';
import { FAQSection } from '../components/seo/FAQSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { AuthorBlock } from '../components/seo/AuthorBlock';
import { TableOfContents } from '../components/seo/TableOfContents';
import { RelatedPages } from '../components/seo/RelatedPages';

import { getRelatedPagesForSlug } from '../utils/internalLinking';

import invoiceTypes from '../data/invoiceTypes.json';
import tools from '../data/tools.json';
import resources from '../data/resources.json';
import company from '../data/company.json';
import authors from '../data/authors.json';

const dataSources: Record<string, any[]> = {
  'invoice-types': invoiceTypes,
  'tools': tools,
  'resources': resources,
  'company': company,
};

interface PremiumSEOPageProps {
  category: 'invoice-types' | 'tools' | 'resources' | 'company';
}

export default function PremiumSEOPage({ category }: PremiumSEOPageProps) {
  let { slug } = useParams<{ slug: string }>();
  
  if (!slug && typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/\/$/, '').split('/').pop();
    if (path) slug = path;
  }
  
  const source = dataSources[category];
  const pageData = source?.find((item) => item.slug === slug);

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

  const getCanonicalPath = () => {
    if (category === 'company') return `/${pageData.slug}/`;
    return `/${category}/${pageData.slug}/`;
  };

  const canonicalUrl = `https://invoice-gen.net${getCanonicalPath()}`;

  const organizationSchema = {
    "@type": "Organization",
    "name": "Invoice-Gen.net",
    "url": "https://invoice-gen.net/",
    "logo": "https://invoice-gen.net/icon.svg",
    "description": "Free, professional invoice generator for small businesses and freelancers."
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://invoice-gen.net/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        "item": `https://invoice-gen.net/${category}/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": pageData.title,
        "item": canonicalUrl
      }
    ]
  };

  const faqSchema = pageData.faq && pageData.faq.length > 0 ? {
    "@type": "FAQPage",
    "mainEntity": pageData.faq.map((faq: any) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  const schemas: any[] = [organizationSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  const authorData = (authors as any)[pageData.authorId || 'editorial-team'];
  
  const tocItems = [];
  if (pageData.intro) tocItems.push({ id: 'introduction', title: pageData.intro.heading, level: 2 });
  if (pageData.benefits && pageData.benefits.length > 0) {
    tocItems.push({ id: 'key-benefits', title: 'Key Benefits', level: 2 });
  }
  if (pageData.stepByStep && pageData.stepByStep.length > 0) {
    tocItems.push({ id: 'step-by-step-guide', title: 'Step-by-Step Guide', level: 2 });
  }
  if (pageData.faq && pageData.faq.length > 0) {
    tocItems.push({ id: 'faq', title: 'Frequently Asked Questions', level: 2 });
  }

  const relatedPages = getRelatedPagesForSlug(slug as string, 4);

  return (
    <AppLayout>
      <SEO 
        title={pageData.title}
        description={pageData.metaDescription}
        canonicalUrl={canonicalUrl}
        schema={schemas}
      />
      
      <Container>
        <Breadcrumbs 
          items={[
            { name: 'Home', url: '/' },
            { name: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${category}/` },
            { name: pageData.title }
          ]} 
        />

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Card>
              <HeroSection 
                title={pageData.hero.title}
                subtitle={pageData.hero.subtitle}
                ctaText={pageData.hero.ctaText}
                readTime="6 min"
                lastUpdated="July 18, 2026"
              />

              <AuthorBlock 
                author={authorData}
                lastUpdated="July 18, 2026"
                readTime="6 min"
                reviewerSupport="Peer reviewed by financial experts."
              />

              <ArticleContent 
                intro={pageData.intro}
                benefits={pageData.benefits}
                stepByStep={pageData.stepByStep}
              />

              <FeatureGrid features={pageData.featureCards} />

              <FAQSection faqs={pageData.faq} />
            </Card>

            <RelatedPages pages={relatedPages} />

            <div style={{ marginTop: '64px' }}>
              <CTA />
            </div>
          </div>
          
          <div style={{ width: '300px', flexShrink: 0, display: 'none' }} className="desktop-sidebar">
            <TableOfContents items={tocItems} />
          </div>
        </div>
      </Container>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </AppLayout>
  );
}
