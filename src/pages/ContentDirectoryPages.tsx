import React from 'react';
import { ContentPage } from '../components/layout/ContentPage';
import { LandingLayout } from '../components/layout/LandingLayout';
import { SEO } from '../components/seo/SEO';
import { ArrowRight, Clock, Tag, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlogHomePage: React.FC = () => {
  const articles = [
    {
      title: 'How to Write a Professional Invoice',
      excerpt: 'Learn exactly what to include in your invoice to get paid faster and look professional to your clients.',
      url: '/blog/how-to-write-an-invoice',
      category: 'Guides',
      readTime: '5 min read',
      gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)'
    },
    {
      title: 'Best Payment Terms for Freelancers',
      excerpt: 'Should you use Net 30, Net 15, or Due on Receipt? We break down the pros and cons of each payment term.',
      url: '/blog/payment-terms-explained',
      category: 'Freelancing',
      readTime: '7 min read',
      gradient: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
    },
    {
      title: 'How to Handle Late Payments gracefully',
      excerpt: 'Struggling with unpaid invoices? Here is a step-by-step guide to following up without ruining client relationships.',
      url: '/blog/late-payment-fees-guide',
      category: 'Business',
      readTime: '6 min read',
      gradient: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)'
    },
    {
      title: 'Tax Deductions Every Freelancer Should Know',
      excerpt: 'Save money this tax season by knowing exactly what expenses you can legally write off as a contractor.',
      url: '/blog/tax-invoice',
      category: 'Taxes',
      readTime: '8 min read',
      gradient: 'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)'
    },
    {
      title: 'Invoice vs. Receipt: Whats the Difference?',
      excerpt: 'A comprehensive look at the legal and practical differences between these two essential financial documents.',
      url: '/blog/invoice-vs-receipt',
      category: 'Accounting',
      readTime: '4 min read',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'The Guide to Recurring Invoices',
      excerpt: 'From time tracking to invoicing, these are the top software tools you need to run your contracting business efficiently.',
      url: '/blog/recurring-invoice',
      category: 'Resources',
      readTime: '10 min read',
      gradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
    }
  ];

  return (
    <LandingLayout>
      <SEO 
        title="Invoicing Guides & Resources | Invoice-Gen.net"
        description="Expert resources, articles, and guides on invoicing, freelancing, and small business management."
        canonicalUrl="https://invoice-gen.net/blog"
      />
      
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 80px 24px' }}>
        
        {/* Blog Hero */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--color-primary-faint)', color: 'var(--color-primary)', borderRadius: '100px', fontWeight: 600, fontSize: '13px', marginBottom: '24px' }}>
            <BookOpen size={16} /> Latest Resources
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--color-text-title)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Business Guides & <span style={{ color: 'var(--color-primary)' }}>Insights</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Everything you need to know about invoicing, getting paid faster, and running your freelance business successfully.
          </p>
        </div>

        {/* Article Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {articles.map((article, index) => (
            <Link key={index} to={article.url} className="blog-card" style={{ 
              display: 'flex', flexDirection: 'column', 
              background: 'var(--color-surface)', 
              borderRadius: '20px', 
              overflow: 'hidden',
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              
              {/* Thumbnail / Gradient Area */}
              <div style={{ width: '100%', height: '180px', background: article.gradient, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.9)', color: '#0F172A', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
                  <Tag size={12} /> {article.category}
                </div>
              </div>
              
              {/* Content Area */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', lineHeight: 1.6, flex: 1 }}>
                  {article.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-tertiary)', fontSize: '13px', fontWeight: 500 }}>
                    <Clock size={14} /> {article.readTime}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontSize: '14px', fontWeight: 600 }}>
                    Read <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
            border-color: var(--color-border-hover) !important;
          }
        `}</style>

      </div>
    </LandingLayout>
  );
};

export const CompareHomePage: React.FC = () => (
  <ContentPage title="Compare Invoicing Software" description="Factual comparisons of Invoice-Gen.net with other popular invoicing tools." urlPath="/compare">
    <p style={{ marginBottom: '24px' }}>We believe in transparency. See how Invoice-Gen.net compares to other options on the market.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <a href="/compare/invoice-simple" className="card" style={{ textDecoration: 'none', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Invoice-Gen.net vs Invoice Simple</span>
        <span style={{ color: 'var(--color-primary)' }}>Compare →</span>
      </a>
      <a href="/compare/wave" className="card" style={{ textDecoration: 'none', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Invoice-Gen.net vs Wave</span>
        <span style={{ color: 'var(--color-primary)' }}>Compare →</span>
      </a>
      <a href="/compare/adobe-express" className="card" style={{ textDecoration: 'none', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Invoice-Gen.net vs Adobe Express</span>
        <span style={{ color: 'var(--color-primary)' }}>Compare →</span>
      </a>
    </div>
  </ContentPage>
);
