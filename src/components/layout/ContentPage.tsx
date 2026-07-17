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
      
      <div className="workspace-layout">
        <div className="workspace-main" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 800, 
                letterSpacing: '-0.02em', 
                marginBottom: '16px',
                color: 'var(--color-text-title)'
              }}>
                {title}
              </h1>
              {description && (
                <p style={{ 
                  fontSize: '18px', 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: 1.6
                }}>
                  {description}
                </p>
              )}
            </div>

            <div className="blog-article">
              {children}
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
