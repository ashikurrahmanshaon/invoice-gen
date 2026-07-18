import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { CTA } from '../components/ui/CTA';
import { SEO } from '../components/seo/SEO';
import blogsData from '../data/seoContent.json';

interface Blog {
  slug: string;
  title: string;
  date: string;
  sections: Array<{ h2: string; p: string }>;
  faq?: Array<{ q: string; a: string }>;
}

const blogs: Blog[] = blogsData as Blog[];

export default function BlogDetailPage() {
  const { slug } = useParams();
  
  const targetSlug = slug ? slug.trim().toLowerCase() : '';
  const blog = blogs.find(b => b.slug.trim().toLowerCase() === targetSlug);

  if (import.meta.env.DEV) {
    console.log('Total articles loaded:', blogs.length);
    console.log('Current route slug:', targetSlug);
    console.log('Matched article:', blog ? blog.title : 'None');
  }

  if (!blog) {
    return (
      <AppLayout>
        <Container>
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1>Article Not Found</h1>
            <p>The article you are looking for does not exist. (Slug searched: {targetSlug})</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SEO 
        title={`${blog.title} | Invoice-Gen.net`}
        description={blog.sections[0]?.p || ''}
        canonicalUrl={`https://invoice-gen.net/blog/${blog.slug}/`}
      />
      
      <Container>
        <Card>
          <div className="article-header" style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px', color: '#0F172A', lineHeight: 1.15 }}>
              {blog.title}
            </h1>
            <div className="date-meta" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Published on {blog.date}
            </div>
          </div>

          <div className="article-content">
            {blog.sections.map((s, i) => (
              <div key={i}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginTop: '56px', marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em' }}>
                  {s.h2}
                </h2>
                <p style={{ color: '#334155', fontSize: '18px', marginBottom: '24px', lineHeight: 1.8 }}>
                  {s.p}
                </p>
              </div>
            ))}
          </div>

          {blog.faq && blog.faq.length > 0 && (
            <div className="faq-section" style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: '#0F172A' }}>
                Frequently Asked Questions
              </h2>
              {blog.faq.map((f, i) => (
                <div key={i} className="faq-item" style={{ marginBottom: '32px' }}>
                  <div className="faq-q" style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
                    {f.q}
                  </div>
                  <div className="faq-a" style={{ color: 'var(--color-text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
                    {f.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="related-content" style={{ marginTop: '64px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Related Articles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {blogs.filter(b => b.slug !== slug).slice(0, 4).map(b => (
              <a 
                key={b.slug}
                href={`/blog/${b.slug}/`} 
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
                {b.title}
              </a>
            ))}
          </div>
        </div>

        <CTA />
      </Container>
    </AppLayout>
  );
}
