import React from 'react';
import { ContentPage } from '../components/layout/ContentPage';

export const BlogHomePage: React.FC = () => (
  <ContentPage title="Invoicing Guides & Resources" description="Expert resources and guides on invoicing, freelancing, and small business management." urlPath="/blog">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-title)', marginBottom: '12px' }}>How to Write a Professional Invoice</h3>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Learn exactly what to include in your invoice to get paid faster and look professional.</p>
        <a href="/blog/how-to-write-a-professional-invoice" className="btn btn-outline" style={{ display: 'inline-flex', textDecoration: 'none' }}>Read Guide</a>
      </div>
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-title)', marginBottom: '12px' }}>Best Payment Terms for Freelancers</h3>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Should you use Net 30, Net 15, or Due on Receipt? We break down the pros and cons.</p>
        <a href="/blog/best-payment-terms-freelancers" className="btn btn-outline" style={{ display: 'inline-flex', textDecoration: 'none' }}>Read Guide</a>
      </div>
    </div>
  </ContentPage>
);

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
