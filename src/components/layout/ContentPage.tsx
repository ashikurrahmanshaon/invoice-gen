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
      
      {/* Premium Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        background: 'linear-gradient(180deg, var(--color-primary-light) 0%, rgba(255,255,255,0) 100%)',
        opacity: 0.5,
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div style={{ padding: 'var(--space-10) 0 var(--space-16)', maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h1 style={{ 
            fontSize: 'clamp(36px, 5vw, 56px)', 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            marginBottom: 'var(--space-4)',
            background: 'linear-gradient(135deg, var(--color-text-main) 0%, var(--color-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            {title}
          </h1>
          {description && (
            <p style={{ 
              fontSize: '18px', 
              color: 'var(--color-text-secondary)', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              {description}
            </p>
          )}
        </div>

        {/* Premium Content Card */}
        <div className="content-page-card">
          <style dangerouslySetInnerHTML={{__html: `
            .content-page-card {
              background: var(--color-surface);
              border: 1px solid var(--color-border);
              border-radius: 24px;
              padding: clamp(32px, 6vw, 64px);
              box-shadow: 0 20px 40px -20px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.5) inset;
              position: relative;
              overflow: hidden;
            }
            .content-page-card::before {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 6px;
              background: linear-gradient(90deg, var(--color-primary), #00C853);
            }
            .content-page-card h2 {
              font-size: 24px;
              font-weight: 700;
              color: var(--color-text-main);
              margin-top: 48px;
              margin-bottom: 16px;
              letter-spacing: -0.02em;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .content-page-card h2:first-child {
              margin-top: 0;
            }
            .content-page-card p {
              font-size: 17px;
              line-height: 1.8;
              color: var(--color-text-secondary);
              margin-bottom: 24px;
            }
            .content-page-card ul {
              margin-bottom: 24px;
              padding-left: 20px;
            }
            .content-page-card li {
              font-size: 17px;
              line-height: 1.8;
              color: var(--color-text-secondary);
              margin-bottom: 12px;
              position: relative;
            }
            .content-page-card li::marker {
              color: var(--color-primary);
            }
            .content-page-card strong {
              color: var(--color-text-main);
              font-weight: 600;
            }
          `}} />
          {children}
        </div>
      </div>
    </LandingLayout>
  );
};
