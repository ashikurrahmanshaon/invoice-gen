import React from 'react';
import { ContentPage } from '../components/layout/ContentPage';
import { Link } from 'react-router-dom';

export const BlogHomePage: React.FC = () => (
  <ContentPage title="Invoicing Guides & Resources" description="Expert resources and guides on invoicing, freelancing, and small business management." urlPath="/blog">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
      <div style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-3)' }}>How to Write a Professional Invoice</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Learn exactly what to include in your invoice to get paid faster and look professional.</p>
        <Link to="/blog/how-to-write-a-professional-invoice" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>Read Guide →</Link>
      </div>
      <div style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-3)' }}>Best Payment Terms for Freelancers</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Should you use Net 30, Net 15, or Due on Receipt? We break down the pros and cons.</p>
        <Link to="/blog/best-payment-terms-freelancers" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>Read Guide →</Link>
      </div>
    </div>
  </ContentPage>
);

export const CompareHomePage: React.FC = () => (
  <ContentPage title="Compare Invoicing Software" description="Factual comparisons of Invoice-Gen.net with other popular invoicing tools." urlPath="/compare">
    <p>We believe in transparency. See how Invoice-Gen.net compares to other options on the market.</p>
    <ul style={{ lineHeight: '2', marginTop: '20px' }}>
      <li><Link to="/compare/invoice-simple" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Invoice-Gen.net vs Invoice Simple</Link></li>
      <li><Link to="/compare/wave" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Invoice-Gen.net vs Wave</Link></li>
      <li><Link to="/compare/adobe-express" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Invoice-Gen.net vs Adobe Express</Link></li>
    </ul>
  </ContentPage>
);
