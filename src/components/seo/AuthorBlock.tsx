import React from 'react';

export interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  avatarUrl?: string;
}

interface AuthorBlockProps {
  author: AuthorProfile;
  lastUpdated: string;
  readTime: string;
  reviewerSupport?: string;
}

export const AuthorBlock: React.FC<AuthorBlockProps> = ({ 
  author, 
  lastUpdated, 
  readTime,
  reviewerSupport
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: '20px', 
      padding: '24px 0', 
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0',
      marginBottom: '48px',
      marginTop: '24px'
    }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        {author.avatarUrl ? (
          <img 
            src={author.avatarUrl} 
            alt={author.name} 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {author.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              Written by {author.name}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 500, marginBottom: '8px' }}>
              {author.role}
            </div>
          </div>
          
          <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {readTime} read
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Updated {lastUpdated}
            </span>
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginTop: '8px', marginBottom: '12px' }}>
          {author.bio}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: reviewerSupport ? '12px' : '0' }}>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Expertise:</span>
          {author.expertise.map((exp, idx) => (
            <span key={idx} style={{ fontSize: '13px', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '12px' }}>
              {exp}
            </span>
          ))}
        </div>

        {reviewerSupport && (
          <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {reviewerSupport}
          </div>
        )}
      </div>
    </div>
  );
};
