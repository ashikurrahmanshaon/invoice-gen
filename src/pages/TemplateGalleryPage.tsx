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
      
      <div className="workspace-layout">
        <div className="workspace-main" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '40px', marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-title)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Professional Invoice Templates
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--color-text-main)', maxWidth: '600px', margin: '0 auto' }}>
              Choose a professional template, customize it with your brand, and download it instantly as a PDF. 100% free.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Placeholder cards */}
            {['Freelance', 'Consultant', 'Agency', 'Contractor', 'Software Development', 'Medical'].map(template => (
              <div key={template} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                  Preview
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'var(--color-text-title)' }}>{template} Invoice Template</h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Optimized for {template.toLowerCase()} professionals.</p>
                  <Link to={`/templates/${template.toLowerCase().replace(' ', '-')}`} className="btn btn-outline" style={{ display: 'flex', width: '100%' }}>
                    View Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
