import React, { memo, useState } from 'react';
import * as Types from '../../../types/content';
import { authors, reviewers, editorialTeam } from '../../../config/authors';
import { ArrowRight, Clock, Calendar, ShieldCheck, HelpCircle, BookOpen, AlertTriangle, Info, Quote, Share2 } from 'lucide-react';

export const HeroBlock: React.FC<Types.HeroBlock> = memo(({ title, subtitle, ctaText, ctaLink, readTime, lastUpdated }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="hero" style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '10px' }}>
      <h1 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '20px', color: '#0F172A', lineHeight: 1.25 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '18px', color: '#475569', marginBottom: '28px', lineHeight: 1.7, maxWidth: '760px', margin: '0 auto 28px auto' }}>
          {subtitle}
        </p>
      )}
      {ctaText && ctaLink && (
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <a 
            href={ctaLink} 
            style={{ 
              padding: '14px 32px', 
              fontSize: '16px', 
              backgroundColor: '#0ea5e9', 
              color: 'white', 
              borderRadius: '100px', 
              textDecoration: 'none', 
              fontWeight: 700, 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(14, 165, 233, 0.3)',
              transition: 'all 0.25s ease'
            }}
          >
            {ctaText} <ArrowRight size={18} />
          </a>
        </div>
      )}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748B', marginTop: '16px', background: '#F8FAFC', padding: '8px 20px', borderRadius: '100px', border: '1px solid #E2E8F0', fontWeight: 500, flexWrap: 'wrap', justifyContent: 'center' }}>
        {readTime && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} style={{ color: '#0ea5e9' }} /> {readTime} read</span>}
        {readTime && lastUpdated && <span style={{ opacity: 0.4 }}>•</span>}
        {lastUpdated && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} style={{ color: '#0ea5e9' }} /> Updated {lastUpdated}</span>}
        <span style={{ opacity: 0.4 }}>•</span>
        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#0ea5e9',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <Share2 size={14} /> {copied ? 'Link Copied!' : 'Share Article'}
        </button>
      </div>
    </div>
  );
});

export const IntroductionBlock: React.FC<Types.IntroductionBlock> = memo(({ heading, text }) => (
  <div style={{ marginBottom: '48px' }} id="introduction">
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
      {heading}
    </h2>
    <p style={{ color: '#334155', fontSize: '17px', lineHeight: 1.8 }}>
      {text}
    </p>
  </div>
));

export const QuickSummaryBlock: React.FC<Types.QuickSummaryBlock> = memo(({ summaryItems = [] }) => (
  <div style={{ marginBottom: '48px', backgroundColor: '#F8FAFC', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <BookOpen size={20} style={{ color: '#0ea5e9' }} /> Quick Summary
    </h3>
    <ul style={{ paddingLeft: '20px', color: '#334155', fontSize: '16px', lineHeight: 1.8, margin: 0 }}>
      {(summaryItems || []).map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
    </ul>
  </div>
));

export const KeyBenefitsBlock: React.FC<Types.KeyBenefitsBlock> = memo(({ heading = 'Key Benefits', benefits = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
      {heading}
    </h2>
    {(benefits || []).map((benefit, idx) => (
      <div key={idx} style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#1E293B' }}>{benefit.title}</h3>
        <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>{benefit.description}</p>
      </div>
    ))}
  </div>
));

export const FeatureGridBlock: React.FC<Types.FeatureGridBlock> = memo(({ features = [] }) => (
  <div style={{ marginBottom: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
    {(features || []).map((feature, idx) => (
      <div key={idx} style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: '#0F172A' }}>{feature.title}</h3>
        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{feature.description}</p>
      </div>
    ))}
  </div>
));

export const StepByStepGuideBlock: React.FC<Types.StepByStepGuideBlock> = memo(({ steps = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '28px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
      Step-by-Step Guide
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {(steps || []).map((step, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '20px', padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)' }}>
            {idx + 1}
          </div>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}>{step.title}</h3>
            <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));

export const BestPracticesBlock: React.FC<Types.BestPracticesBlock> = memo(({ practices = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
      Best Practices
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(practices || []).map((practice, idx) => (
        <div key={idx} style={{ padding: '20px 24px', background: '#F8FAFC', borderRadius: '14px', borderLeft: '4px solid #10B981', borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <strong style={{ fontSize: '17px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>{practice.title}</strong>
          <span style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>{practice.description}</span>
        </div>
      ))}
    </div>
  </div>
));

export const CommonMistakesBlock: React.FC<Types.CommonMistakesBlock> = memo(({ mistakes = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
      Common Mistakes to Avoid
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {(mistakes || []).map((mistake, idx) => (
        <div key={idx} style={{ padding: '24px', backgroundColor: '#FEF2F2', borderRadius: '16px', border: '1px solid #FECACA' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Mistake: {mistake.mistake}
          </h3>
          <p style={{ color: '#7F1D1D', fontSize: '15px', lineHeight: 1.6, margin: 0 }}><strong>Solution:</strong> {mistake.solution}</p>
        </div>
      ))}
    </div>
  </div>
));

export const RealExamplesBlock: React.FC<Types.RealExamplesBlock> = memo(({ examples = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
      Real Examples
    </h2>
    {(examples || []).map((example, idx) => (
      <div key={idx} style={{ marginBottom: '24px', padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '10px', color: '#1E293B' }}>{example.title}</h3>
        <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>{example.description}</p>
      </div>
    ))}
  </div>
));

export const FAQBlock: React.FC<Types.FAQBlock> = memo(({ questions = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '2px solid #F1F5F9', paddingBottom: '12px' }}>
      Frequently Asked Questions
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {(questions || []).map((faq, idx) => (
        <div key={idx} style={{ padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} style={{ color: '#0ea5e9' }} /> {faq.question}
          </h3>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: 0, paddingLeft: '26px' }}>{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
));

export const RelatedLinksRenderer: React.FC<{ title: string, links?: Types.RelatedLink[] }> = memo(({ title, links = [] }) => (
  <div style={{ marginBottom: '48px', padding: '28px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: '#0F172A' }}>{title}</h3>
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyleType: 'none', padding: 0, margin: 0 }}>
      {(links || []).map((link, idx) => (
        <li key={idx}>
          <a href={link.url} style={{ fontSize: '16px', fontWeight: 700, color: '#0ea5e9', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {link.title} <ArrowRight size={14} />
          </a>
          {link.description && <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '14px' }}>{link.description}</p>}
        </li>
      ))}
    </ul>
  </div>
));

export const CTABlock: React.FC<Types.CTABlock> = memo(({ heading, subtext, buttonText, buttonLink }) => (
  <div style={{ margin: '48px 0', padding: '44px 32px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', borderRadius: '24px', textAlign: 'center', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>{heading}</h2>
    <p style={{ fontSize: '17px', color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>{subtext}</p>
    <a 
      href={buttonLink} 
      style={{ 
        padding: '14px 36px', 
        fontSize: '16px', 
        backgroundColor: '#0ea5e9', 
        color: 'white', 
        borderRadius: '100px', 
        textDecoration: 'none', 
        fontWeight: 700, 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
      }}
    >
      {buttonText} <ArrowRight size={18} />
    </a>
  </div>
));

export const AuthorBlock: React.FC<Types.AuthorBlockType> = memo(({ authorName, authorBio, authorImage }) => {
  const [imgError, setImgError] = useState(false);
  
  // Always resolve to the centralized Editorial Team to override legacy placeholders
  const isLegacyAuthor = !authorName || ['Jane Doe', 'Alex Rivera', 'David Chen', 'Elena Rostova', 'John Smith, Esq.'].includes(authorName);
  
  const displayAvatar = (!isLegacyAuthor && authorImage && !imgError && !authorImage.includes('/avatars/')) 
    ? authorImage 
    : editorialTeam.avatarUrl;

  const displayName = isLegacyAuthor ? editorialTeam.name : authorName;
  const displayBio = isLegacyAuthor ? editorialTeam.bio : authorBio;

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '24px 28px', backgroundColor: '#F8FAFC', borderRadius: '20px', marginBottom: '48px', border: '1px solid #E2E8F0', alignItems: 'center', flexWrap: 'wrap' }}>
      <img 
        src={displayAvatar} 
        alt={displayName} 
        onError={() => setImgError(true)}
        loading="lazy"
        decoding="async"
        width="64"
        height="64"
        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} 
      />
      <div style={{ flex: 1, minWidth: '220px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Written By</div>
        <strong style={{ fontSize: '18px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>{displayName}</strong>
        <p style={{ color: '#475569', margin: 0, lineHeight: 1.5, fontSize: '14px' }}>{displayBio}</p>
      </div>
    </div>
  );
});

export const EEATAuthorReviewerBlock: React.FC<{ authorId?: string; reviewerId?: string }> = memo(({ authorId, reviewerId }) => {
  // Always resolves to editorialTeam due to proxy in authors.ts
  const author = authorId ? authors[authorId] || editorialTeam : editorialTeam;
  const reviewer = reviewerId ? reviewers[reviewerId] : null;
  const [authorImgError, setAuthorImgError] = useState(false);
  const [reviewerImgError, setReviewerImgError] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
      {author && (
        <div style={{ display: 'flex', gap: '20px', padding: '24px 28px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <img 
            src={(authorImgError || !author.avatarUrl || author.avatarUrl.includes('/avatars/')) ? editorialTeam.avatarUrl : author.avatarUrl} 
            alt={author.name} 
            onError={() => setAuthorImgError(true)}
            loading="lazy"
            decoding="async"
            width="68"
            height="68"
            style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} 
          />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Written By</div>
            <strong style={{ fontSize: '19px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {author.name} 
              <span style={{ fontSize: '11px', backgroundColor: '#E0F2FE', color: '#0369A1', padding: '2px 10px', borderRadius: '100px', fontWeight: 600 }}>{author.experience}</span>
            </strong>
            <p style={{ color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5, fontSize: '14px' }}>{author.bio}</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(author.expertise || []).map(exp => <span key={exp} style={{ fontSize: '11px', backgroundColor: '#FFFFFF', color: '#475569', padding: '3px 10px', borderRadius: '100px', border: '1px solid #E2E8F0', fontWeight: 500 }}>{exp}</span>)}
            </div>
          </div>
        </div>
      )}
      
      {reviewer && (
        <div style={{ display: 'flex', gap: '16px', padding: '20px 24px', backgroundColor: '#F0FDF4', borderRadius: '16px', border: '1px solid #BBF7D0', alignItems: 'center' }}>
          <img 
            src={(reviewerImgError || !reviewer.avatarUrl || reviewer.avatarUrl.includes('/avatars/')) ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' : reviewer.avatarUrl} 
            alt={reviewer.name} 
            onError={() => setReviewerImgError(true)}
            loading="lazy"
            decoding="async"
            width="52"
            height="52"
            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF' }} 
          />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Expert Reviewed By
            </div>
            <strong style={{ fontSize: '16px', color: '#14532D', display: 'block', marginBottom: '2px' }}>
              {reviewer.name}
            </strong>
            <p style={{ color: '#15803D', margin: 0, lineHeight: 1.4, fontSize: '13px' }}>{reviewer.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
});

export const BreadcrumbBlock: React.FC<Types.BreadcrumbBlock> = memo(({ crumbs = [] }) => (
  <div style={{ marginBottom: '24px', fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
    {(crumbs || []).map((crumb, idx) => (
      <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <a href={crumb.url} style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s ease' }}>{crumb.label}</a>
        {idx < (crumbs || []).length - 1 && <span style={{ color: '#CBD5E1' }}>/</span>}
      </span>
    ))}
  </div>
));

export const LastUpdatedBlock: React.FC<Types.LastUpdatedBlock> = memo(({ date }) => (
  <div style={{ fontSize: '13px', color: '#64748B', fontStyle: 'italic', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <Calendar size={14} /> Last updated: {date}
  </div>
));

export const TimelineBlock: React.FC<Types.TimelineBlock> = memo(({ events = [] }) => (
  <div style={{ marginBottom: '48px', borderLeft: '2px solid #E2E8F0', paddingLeft: '24px', marginLeft: '12px' }}>
    {(events || []).map((evt, idx) => (
      <div key={idx} style={{ marginBottom: '28px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#0ea5e9', border: '3px solid #FFFFFF' }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase' }}>{evt.date}</span>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '6px 0', color: '#0F172A' }}>{evt.title}</h3>
        <p style={{ color: '#475569', margin: 0, lineHeight: 1.6, fontSize: '15px' }}>{evt.description}</p>
      </div>
    ))}
  </div>
));

export const ComparisonTableBlock: React.FC<Types.ComparisonTableBlock> = memo(({ headers = [], rows = [] }) => (
  <div style={{ overflowX: 'auto', marginBottom: '48px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          {(headers || []).map((h, i) => <th key={i} style={{ padding: '16px 20px', color: '#0F172A', fontWeight: 700, fontSize: '15px' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {(rows || []).map((row, i) => (
          <tr key={i} style={{ borderBottom: i < (rows || []).length - 1 ? '1px solid #F1F5F9' : 'none' }}>
            {(row || []).map((cell, j) => <td key={j} style={{ padding: '16px 20px', color: '#334155', fontSize: '15px' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export const ChecklistBlock: React.FC<Types.ChecklistBlock> = memo(({ title, items = [] }) => (
  <div style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: '#0F172A' }}>{title}</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {(items || []).map((item, idx) => (
        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '16px', color: '#334155' }}>
          <span style={{ color: item.checked ? '#10B981' : '#CBD5E1', fontSize: '20px', fontWeight: 'bold' }}>{item.checked ? '✓' : '○'}</span>
          {item.text}
        </li>
      ))}
    </ul>
  </div>
));

export const KeyTakeawaysBlock: React.FC<Types.KeyTakeawaysBlock> = memo(({ takeaways = [] }) => (
  <div style={{ marginBottom: '48px', padding: '28px', backgroundColor: '#EFF6FF', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#1E3A8A' }}>Key Takeaways</h3>
    <ul style={{ paddingLeft: '20px', color: '#1E40AF', fontSize: '16px', margin: 0, lineHeight: 1.7 }}>
      {(takeaways || []).map((t, i) => <li key={i} style={{ marginBottom: '8px' }}>{t}</li>)}
    </ul>
  </div>
));

export const MythVsFactBlock: React.FC<Types.MythVsFactBlock> = memo(({ items = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0F172A' }}>Myth vs Fact</h2>
    <div style={{ display: 'grid', gap: '20px' }}>
      {(items || []).map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px' }}>
            <strong style={{ color: '#991B1B', display: 'block', marginBottom: '6px', fontSize: '15px' }}>Myth</strong>
            <p style={{ color: '#7F1D1D', margin: 0, fontSize: '15px', lineHeight: 1.5 }}>{item.myth}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px' }}>
            <strong style={{ color: '#166534', display: 'block', marginBottom: '6px', fontSize: '15px' }}>Fact</strong>
            <p style={{ color: '#15803D', margin: 0, fontSize: '15px', lineHeight: 1.5 }}>{item.fact}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));

export const DefinitionBlock: React.FC<Types.DefinitionBlock> = memo(({ term, definition }) => (
  <div style={{ marginBottom: '36px', padding: '24px 28px', background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', borderLeft: '4px solid #0ea5e9', borderRadius: '14px', borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
    <strong style={{ fontSize: '20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 800 }}>
      <BookOpen size={20} style={{ color: '#0ea5e9' }} /> {term}
    </strong>
    <p style={{ color: '#334155', margin: 0, fontSize: '16px', lineHeight: 1.7 }}>{definition}</p>
  </div>
));

export const ExpertTipBlock: React.FC<Types.ExpertTipBlock> = memo(({ tip, expertName }) => (
  <div style={{ marginBottom: '32px', padding: '24px 28px', backgroundColor: '#FEFCE8', borderLeft: '4px solid #EAB308', borderRadius: '14px', borderTop: '1px solid #FEF08A', borderRight: '1px solid #FEF08A', borderBottom: '1px solid #FEF08A' }}>
    <strong style={{ color: '#854D0E', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Expert Tip {expertName ? `from ${expertName}` : ''}</strong>
    <p style={{ color: '#713F12', margin: 0, fontSize: '16px', fontStyle: 'italic', lineHeight: 1.6 }}>"{tip}"</p>
  </div>
));

export const WarningBlock: React.FC<Types.WarningBlock> = memo(({ text }) => (
  <div style={{ padding: '20px 24px', backgroundColor: '#FFFBEB', borderLeft: '4px solid #F59E0B', color: '#92400E', marginBottom: '32px', borderRadius: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
    <div><strong>Warning:</strong> {text}</div>
  </div>
));

export const InfoBoxBlock: React.FC<Types.InfoBoxBlock> = memo(({ text }) => (
  <div style={{ padding: '20px 24px', backgroundColor: '#EFF6FF', borderLeft: '4px solid #3B82F6', color: '#1E40AF', marginBottom: '32px', borderRadius: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
    <div><strong>Info:</strong> {text}</div>
  </div>
));

export const StatisticsBlock: React.FC<Types.StatisticsBlock> = memo(({ stats = [] }) => (
  <div style={{ marginBottom: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
    {(stats || []).map((s, i) => (
      <div key={i} style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '28px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '42px', fontWeight: 900, color: '#0ea5e9', marginBottom: '6px' }}>{s.value}</div>
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
      </div>
    ))}
  </div>
));

export const QuoteBlock: React.FC<Types.QuoteBlock> = memo(({ quote, author }) => (
  <blockquote style={{ margin: '40px 0', padding: '32px 36px', background: '#F8FAFC', borderLeft: '4px solid #0F172A', borderRadius: '16px', fontSize: '20px', color: '#334155', fontStyle: 'italic', position: 'relative' }}>
    <Quote size={32} style={{ position: 'absolute', top: '16px', right: '20px', opacity: 0.1, color: '#0F172A' }} />
    "{quote}"
    <footer style={{ marginTop: '16px', fontSize: '15px', fontWeight: 700, fontStyle: 'normal', color: '#0F172A' }}>— {author}</footer>
  </blockquote>
));

export const CaseStudyBlock: React.FC<Types.CaseStudyBlock> = memo(({ title, challenge, solution, result }) => (
  <div style={{ marginBottom: '48px', padding: '36px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
    <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: '#0F172A' }}>Case Study: {title}</h3>
    <div style={{ display: 'grid', gap: '20px' }}>
      <div><strong style={{ display: 'block', color: '#1E293B', fontSize: '16px', marginBottom: '6px' }}>The Challenge</strong><p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>{challenge}</p></div>
      <div><strong style={{ display: 'block', color: '#1E293B', fontSize: '16px', marginBottom: '6px' }}>The Solution</strong><p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>{solution}</p></div>
      <div><strong style={{ display: 'block', color: '#1E293B', fontSize: '16px', marginBottom: '6px' }}>The Result</strong><p style={{ color: '#10B981', fontWeight: 700, margin: 0, fontSize: '15px' }}>{result}</p></div>
    </div>
  </div>
));

export const DecisionTreeBlock: React.FC<Types.DecisionTreeBlock> = memo(({ title }) => (
  <div style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px dashed #CBD5E1' }}>
    <h3 style={{ color: '#0F172A', fontSize: '20px', fontWeight: 700 }}>Decision Tree: {title}</h3>
    <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Interactive Decision Tree Visualization</p>
  </div>
));

export const DownloadsBlock: React.FC<Types.DownloadsBlock> = memo(({ files = [] }) => (
  <div style={{ marginBottom: '48px' }}>
    <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px', color: '#0F172A' }}>Downloads</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(files || []).map((file, i) => (
        <a key={i} href={file.url} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px', backgroundColor: '#F8FAFC', borderRadius: '12px', textDecoration: 'none', color: '#0F172A', border: '1px solid #E2E8F0', fontWeight: 600 }}>
          <span>{file.name}</span>
          <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>{file.type} • {file.size}</span>
        </a>
      ))}
    </div>
  </div>
));
