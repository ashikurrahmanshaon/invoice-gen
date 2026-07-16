import React from 'react';
import { SEO } from '../components/seo/SEO';
import { LandingLayout } from '../components/layout/LandingLayout';
import { Link } from 'react-router-dom';

export const TemplateGalleryPage: React.FC = () => {
  return (
    <LandingLayout>
      <SEO 
        title="Free Invoice Templates | Download Professional Invoice Designs"
        description="Browse our gallery of free, professional invoice templates for freelancers, agencies, and small businesses. Download as PDF instantly."
        canonicalUrl="https://invoice-gen.net/templates"
      />
      <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-text-title)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Professional Invoice Templates
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--color-text-main)', maxWidth: '600px', margin: '0 auto' }}>
          Choose a professional template, customize it with your brand, and download it instantly as a PDF. 100% free.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginTop: '40px' }}>
        {/* Placeholder cards */}
        {['Freelance', 'Consultant', 'Agency', 'Contractor', 'Software Development', 'Medical'].map(template => (
          <div key={template} style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ height: '200px', background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
              Preview
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'var(--color-text-title)' }}>{template} Invoice Template</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Optimized for {template.toLowerCase()} professionals.</p>
              <Link to={`/templates/${template.toLowerCase().replace(' ', '-')}`} style={{ display: 'block', textAlign: 'center', background: 'var(--color-background)', border: '1px solid var(--color-border)', color: 'var(--color-text-title)', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
                View Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </LandingLayout>
  );
};
