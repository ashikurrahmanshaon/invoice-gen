import React from 'react';
import { ContentPage } from '../components/layout/ContentPage';
import { LandingLayout } from '../components/layout/LandingLayout';
import { SEO } from '../components/seo/SEO';
import { ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { editorialTeam } from '../config/authors';

export const BlogHomePage: React.FC = () => {
  const articles = [
    {
      title: 'How to Write a Professional Invoice',
      excerpt: 'Learn exactly what to include in your invoice to get paid faster and look professional to your clients.',
      url: '/blog/how-to-write-an-invoice',
      category: 'Guides',
      readTime: '5 min read',
      date: 'Jul 18, 2026',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      author: {
        name: editorialTeam.name,
        avatar: editorialTeam.avatarUrl,
        role: editorialTeam.experience
      }
    },
    {
      title: 'Best Payment Terms for Freelancers',
      excerpt: 'Should you use Net 30, Net 15, or Due on Receipt? We break down the pros and cons of each payment term.',
      url: '/blog/payment-terms-explained',
      category: 'Freelancing',
      readTime: '7 min read',
      date: 'Jul 15, 2026',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      author: {
        name: editorialTeam.name,
        avatar: editorialTeam.avatarUrl,
        role: editorialTeam.experience
      }
    },
    {
      title: 'How to Handle Late Payments Gracefully',
      excerpt: 'Struggling with unpaid invoices? Here is a step-by-step guide to following up without ruining client relationships.',
      url: '/blog/late-payment-fees-guide',
      category: 'Business',
      readTime: '6 min read',
      date: 'Jul 10, 2026',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
      author: {
        name: editorialTeam.name,
        avatar: editorialTeam.avatarUrl,
        role: editorialTeam.experience
      }
    },
    {
      title: 'Tax Deductions Every Freelancer Should Know',
      excerpt: 'Save money this tax season by knowing exactly what expenses you can legally write off as a contractor.',
      url: '/blog/tax-invoice',
      category: 'Taxes',
      readTime: '8 min read',
      date: 'Jul 04, 2026',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
      author: {
        name: editorialTeam.name,
        avatar: editorialTeam.avatarUrl,
        role: editorialTeam.experience
      }
    },
    {
      title: 'Invoice vs. Receipt: What\'s the Difference?',
      excerpt: 'A comprehensive look at the legal and practical differences between these two essential financial documents.',
      url: '/blog/invoice-vs-receipt',
      category: 'Accounting',
      readTime: '4 min read',
      date: 'Jun 28, 2026',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      author: {
        name: editorialTeam.name,
        avatar: editorialTeam.avatarUrl,
        role: editorialTeam.experience
      }
    },
    {
      title: 'The Guide to Recurring Invoices',
      excerpt: 'From time tracking to invoicing, these are the top software tools you need to run your contracting business efficiently.',
      url: '/blog/recurring-invoice',
      category: 'Resources',
      readTime: '10 min read',
      date: 'Jun 20, 2026',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      author: {
        name: editorialTeam.name,
        avatar: editorialTeam.avatarUrl,
        role: editorialTeam.experience
      }
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
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--color-text-title)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Invoicing & Business <span style={{ color: 'var(--color-primary)' }}>Insights</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            Expert guides, practical strategies, and best practices to help you optimize invoicing, accelerate cash flow, and grow your business.
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
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              
              {/* Photo Thumbnail Wrapper */}
              <div style={{ width: '100%', height: '210px', overflow: 'hidden', position: 'relative', background: '#F1F5F9' }}>
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="blog-card-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="210"
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  left: '16px', 
                  background: 'rgba(15, 23, 42, 0.75)', 
                  color: '#FFFFFF', 
                  padding: '5px 14px', 
                  borderRadius: '100px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <Tag size={12} style={{ opacity: 0.9 }} /> {article.category}
                </div>
              </div>
              
              {/* Content Area */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 className="blog-card-title" style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: 'var(--color-text-title)', 
                  marginBottom: '12px', 
                  lineHeight: 1.4,
                  transition: 'color 0.2s ease'
                }}>
                  {article.title}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '24px', 
                  lineHeight: 1.6, 
                  flex: 1 
                }}>
                  {article.excerpt}
                </p>

                {/* Author & Footer Info */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  borderTop: '1px solid var(--color-border)', 
                  paddingTop: '16px',
                  marginTop: 'auto'
                }}>
                  {/* Author Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={article.author.avatar} 
                      alt={article.author.name}
                      style={{ 
                        width: '34px', 
                        height: '34px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '2px solid var(--color-border)' 
                      }} 
                      loading="lazy"
                      decoding="async"
                      width="34"
                      height="34"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-title)', lineHeight: 1.2 }}>
                        {article.author.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                        {article.date} · {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Read More Arrow */}
                  <div className="blog-card-arrow" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-faint)',
                    color: 'var(--color-primary)', 
                    transition: 'all 0.25s ease'
                  }}>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          .blog-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 36px rgba(0,0,0,0.09) !important;
            border-color: var(--color-border-hover) !important;
          }
          .blog-card:hover .blog-card-img {
            transform: scale(1.06);
          }
          .blog-card:hover .blog-card-title {
            color: var(--color-primary) !important;
          }
          .blog-card:hover .blog-card-arrow {
            background: var(--color-primary) !important;
            color: #FFFFFF !important;
            transform: translateX(3px);
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
