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
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Professional Invoice Templates
        </h1>
        <p style={{ fontSize: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
          Choose a professional template, customize it with your brand, and download it instantly as a PDF. 100% free.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginTop: '40px' }}>
        {/* Placeholder cards */}
        {['Freelance', 'Consultant', 'Agency', 'Contractor', 'Software Development', 'Medical'].map(template => (
          <div key={template} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ height: '200px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
              Preview
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>{template} Invoice Template</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748B' }}>Optimized for {template.toLowerCase()} professionals.</p>
              <Link to={`/templates/${template.toLowerCase().replace(' ', '-')}`} style={{ display: 'block', textAlign: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
                View Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </LandingLayout>
  );
};
