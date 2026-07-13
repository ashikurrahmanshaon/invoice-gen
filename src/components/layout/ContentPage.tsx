import React from 'react';
import { SEO } from '../seo/SEO';
import { LandingLayout } from './LandingLayout';

interface ContentPageProps {
  title: string;
  description: string;
  urlPath: string;
  children: React.ReactNode;
}

export const ContentPage: React.FC<ContentPageProps> = ({ title, description, urlPath, children }) => {
  return (
    <LandingLayout>
      <SEO 
        title={title}
        description={description}
        canonicalUrl={`https://invoice-gen.net${urlPath}`}
      />
      
      <div style={{ padding: 'var(--space-12) 0 var(--space-10)', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 'var(--space-6)', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <div style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
          {children}
        </div>
      </div>
    </LandingLayout>
  );
};
