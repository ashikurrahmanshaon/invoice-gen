import React from 'react';

export interface RelatedPageLink {
  title: string;
  url: string;
}

interface RelatedPagesProps {
  pages: RelatedPageLink[];
}

export const RelatedPages: React.FC<RelatedPagesProps> = ({ pages }) => {
  if (!pages || pages.length === 0) return null;

  return (
    <div className="related-content" style={{ marginTop: '64px' }}>
      <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#0F172A' }}>
        Keep Reading
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {pages.map((related, idx) => (
          <a 
            key={idx}
            href={related.url} 
            style={{
              padding: '20px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--color-text-main)',
              fontWeight: 500,
              display: 'block',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-main)';
            }}
          >
            {related.title}
            <div style={{ marginTop: '8px', color: 'var(--color-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Read more <span style={{ fontSize: '16px' }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
