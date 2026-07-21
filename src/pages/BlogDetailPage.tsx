import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { CTA } from '../components/ui/CTA';
import { SEO } from '../components/seo/SEO';
import { Clock, Share2, ArrowRight } from 'lucide-react';
import blogsData from '../data/seoContent.json';
import { trackEvent } from '../utils/analytics';

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
  const [copied, setCopied] = useState(false);
  
  const targetSlug = slug ? slug.trim().toLowerCase() : '';
  const blog = blogs.find(b => b.slug.trim().toLowerCase() === targetSlug);

  if (import.meta.env.DEV) {
    console.log('Total articles loaded:', blogs.length);
    console.log('Current route slug:', targetSlug);
    console.log('Matched article:', blog ? blog.title : 'None');
  }

  useEffect(() => {
    if (blog) {
      trackEvent('blog_opened', { article_slug: blog.slug });
    }
  }, [blog]);

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
        canonicalUrl={`https://invoice-gen.net/blog/${blog.slug}`}
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

          {/* Meta bar: reading time + share */}
          {(() => {
            const wordCount = blog.sections.reduce((acc, s) => acc + s.p.split(/\s+/).length + s.h2.split(/\s+/).length, 0);
            const readTime = Math.max(1, Math.round(wordCount / 200));
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
                  <Clock size={14} /> {readTime} min read
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      trackEvent('share_link', { article_slug: blog.slug });
                      setTimeout(() => setCopied(false), 2500);
                    }
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', padding: 0 }}
                >
                  <Share2 size={14} /> {copied ? 'Link Copied!' : 'Share Article'}
                </button>
              </div>
            );
          })()}

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {blogs.filter(b => b.slug !== slug).slice(0, 4).map(b => (
              <a 
                key={b.slug}
                href={`/blog/${b.slug}/`} 
                className="guide-card"
              >
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-title)', margin: 0, lineHeight: 1.4 }}>
                  {b.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {b.sections[0]?.p?.substring(0, 100)}...
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                  Read more <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>

        <CTA />
      </Container>
    </AppLayout>
  );
}
