import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { CTA } from '../components/ui/CTA';
import { SEO } from '../components/seo/SEO';
import templates from '../data/templates.json';

export const TemplateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const template = templates.find(t => t.slug === id);
  
  if (!template) {
    return (
      <AppLayout>
        <Container>
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1>Template Not Found</h1>
            <p>The template you are looking for does not exist.</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  const cleanText = (text: string) => text.replace(/<[^>]*>?/gm, '');

  return (
    <AppLayout>
      <SEO 
        title={`${template.title} | Invoice-Gen.net`}
        description={cleanText(template.subtitle)}
        canonicalUrl={`https://invoice-gen.net/templates/${template.slug}`}
      />
      
      <Container>
        <Card>
          <div className="hero" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', color: '#0F172A', lineHeight: 1.15 }}>
              {template.title}
            </h1>
            <p className="subtitle" style={{ fontSize: '18px', color: '#334155', marginBottom: '32px', lineHeight: 1.8, letterSpacing: '-0.01em' }}>
              {cleanText(template.subtitle)}
            </p>
          </div>

          <article>
            <p style={{ color: '#334155', fontSize: '18px', marginBottom: '24px', lineHeight: 1.8 }}>
              If you are a professional working as one of the following: <strong>{template.roleText}</strong>, then having a specialized invoice template is critical to getting paid on time.
            </p>
            
            <h2 style={{ fontSize: '30px', fontWeight: 700, marginTop: '56px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', color: '#0F172A', letterSpacing: '-0.02em' }}>
              What to Include on Your Invoice
            </h2>
            <p style={{ color: '#334155', fontSize: '18px', marginBottom: '24px', lineHeight: 1.8 }}>
              Ensure your invoice includes all necessary details to avoid payment delays:
            </p>
            <ul style={{ marginLeft: '24px', marginBottom: '20px', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              {template.nicheList.map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>

            <h2 style={{ fontSize: '30px', fontWeight: 700, marginTop: '56px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', color: '#0F172A', letterSpacing: '-0.02em' }}>
              Pro Tips for Getting Paid Faster
            </h2>
            <ul style={{ marginLeft: '24px', marginBottom: '20px', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              {template.nicheTips.map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </article>
        </Card>

        <div className="related-templates" style={{ marginTop: '64px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Other Popular Templates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {templates.filter(t => t.slug !== id).slice(0, 4).map(t => (
              <a 
                key={t.slug}
                href={`/templates/${t.slug}/`} 
                style={{
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--color-text-main)',
                  fontWeight: 500,
                  display: 'block'
                }}
              >
                {t.title}
              </a>
            ))}
          </div>
        </div>

        <CTA />
      </Container>
    </AppLayout>
  );
};
