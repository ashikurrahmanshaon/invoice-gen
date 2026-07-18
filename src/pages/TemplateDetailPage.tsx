import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import { LandingLayout } from '../components/layout/LandingLayout';

export const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Basic capitalization for title
  const titleString = id ? id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Invoice';

  return (
    <LandingLayout>
      <SEO 
        title={`Free ${titleString} Invoice Template | Download PDF`}
        description={`Create a professional ${titleString.toLowerCase()} invoice in seconds. Download this free template as a PDF or customize it online. No signup required.`}
        canonicalUrl={`https://invoice-gen.net/templates/${id}`}
      />
      
      <div className="workspace-layout">
        <div className="workspace-main" style={{ width: '100%' }}>
          <div className="card" style={{ padding: '24px 32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-title)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                {titleString} Invoice Template
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                A minimal, professional invoice template designed specifically for {titleString.toLowerCase()}s. Customize it with your brand and download it instantly.
              </p>
              <Link to="/" className="btn" style={{ 
                display: 'inline-flex', 
                padding: '0 32px',
                background: 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '100px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)'
              }}>
                Use This Template Now
              </Link>
            </div>

            <div style={{ margin: '32px 0', background: 'var(--color-background)', borderRadius: '12px', border: '1px dashed var(--color-border)', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
              [ Template Preview Rendering... ]
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '16px' }}>What to include in a {titleString.toLowerCase()} invoice?</h3>
                <ul style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', paddingLeft: '20px' }}>
                  <li>Your full business name and contact details</li>
                  <li>The client's name and address</li>
                  <li>A unique invoice number and date of issue</li>
                  <li>Itemized list of {titleString.toLowerCase()} services provided</li>
                  <li>Clear payment terms and due dates</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '16px' }}>Why use this template?</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                  Our {titleString.toLowerCase()} template is optimized to help you look professional and get paid faster. It automatically calculates taxes, supports multiple currencies, and can be downloaded as a high-quality PDF in one click. No account required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
