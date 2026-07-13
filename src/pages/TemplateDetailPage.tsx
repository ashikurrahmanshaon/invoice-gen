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
      
      <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {titleString} Invoice Template
        </h1>
        <p style={{ fontSize: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto', marginBottom: '32px' }}>
          A minimal, professional invoice template designed specifically for {titleString.toLowerCase()}s. Customize it with your brand and download it instantly.
        </p>
        <Link to="/" style={{ display: 'inline-block', background: '#4F46E5', color: '#FFFFFF', padding: '16px 32px', borderRadius: '8px', fontSize: '18px', fontWeight: 600, textDecoration: 'none' }}>
          Use This Template Now
        </Link>
      </div>

      <div style={{ margin: '40px auto', maxWidth: '800px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '40px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
          [ Template Preview Rendering... ]
        </div>
      </div>

      <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>What to include in a {titleString.toLowerCase()} invoice?</h3>
          <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '20px' }}>
            <li>Your full business name and contact details</li>
            <li>The client's name and address</li>
            <li>A unique invoice number and date of issue</li>
            <li>Itemized list of {titleString.toLowerCase()} services provided</li>
            <li>Clear payment terms and due dates</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Why use this template?</h3>
          <p style={{ color: '#475569', lineHeight: '1.7' }}>
            Our {titleString.toLowerCase()} template is optimized to help you look professional and get paid faster. It automatically calculates taxes, supports multiple currencies, and can be downloaded as a high-quality PDF in one click. No account required.
          </p>
        </div>
      </div>
    </LandingLayout>
  );
};
