import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { CTA } from '../components/ui/CTA';
import { SEO } from '../components/seo/SEO';
import comparisons from '../data/comparisons.json';

export default function CompareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const compare = (comparisons as any[]).find(c => c.slug === id);

  if (!compare) {
    return (
      <AppLayout>
        <Container>
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1>Comparison Not Found</h1>
            <p>The comparison page you are looking for does not exist.</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SEO 
        title={`${compare.title} | Invoice-Gen.net`}
        description={compare.description || ''}
        canonicalUrl={`https://invoice-gen.net/compare/${compare.slug}/`}
      />
      
      <Container>
        <Card>
          <div className="hero" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', color: '#0F172A', lineHeight: 1.15 }}>
              {compare.title}
            </h1>
            <p className="subtitle" style={{ fontSize: '18px', color: '#334155', marginBottom: '32px', lineHeight: 1.8, letterSpacing: '-0.01em' }}>
              {compare.description}
            </p>
          </div>

          <div className="article-content">
            {compare.content && <p>{compare.content}</p>}
          </div>
        </Card>

        <CTA />
      </Container>
    </AppLayout>
  );
}
