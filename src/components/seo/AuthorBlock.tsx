import React, { useState } from 'react';
import { Award, Clock, Calendar, CheckCircle2 } from 'lucide-react';

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
  const [imgError, setImgError] = useState(false);

  const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80';
  const displayAvatar = (!author.avatarUrl || author.avatarUrl.includes('/avatars/') || imgError)
    ? defaultAvatar 
    : author.avatarUrl;

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      borderRadius: '20px',
      padding: '28px 32px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      marginBottom: '48px',
      marginTop: '32px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <img 
            src={displayAvatar} 
            alt={author.name} 
            onError={() => setImgError(true)}
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            background: '#10B981',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #FFFFFF'
          }}>
            <CheckCircle2 size={12} />
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} /> Written By
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                {author.name}
              </h3>
              <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                {author.role}
              </div>
            </div>
            
            <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', gap: '16px', flexWrap: 'wrap', background: '#FFFFFF', padding: '6px 14px', borderRadius: '100px', border: '1px solid #E2E8F0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                {readTime} read
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                Updated {lastUpdated}
              </span>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, margin: '12px 0 16px 0' }}>
            {author.bio}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Expertise:</span>
            {author.expertise.map((exp, idx) => (
              <span key={idx} style={{ fontSize: '12px', backgroundColor: '#FFFFFF', color: '#334155', padding: '4px 12px', borderRadius: '100px', border: '1px solid #E2E8F0', fontWeight: 500 }}>
                {exp}
              </span>
            ))}
          </div>

          {reviewerSupport && (
            <div style={{ fontSize: '13px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #CBD5E1', fontWeight: 500 }}>
              <CheckCircle2 size={15} />
              {reviewerSupport}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
