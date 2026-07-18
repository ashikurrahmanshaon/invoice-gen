import React, { memo } from 'react';
import * as Types from '../../../types/content';
import { authors, reviewers } from '../../../config/authors';

export const HeroBlock: React.FC<Types.HeroBlock> = memo(({ title, subtitle, ctaText, ctaLink, readTime, lastUpdated }) => (
  <div className="hero" style={{ textAlign: 'center', marginBottom: '48px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '24px', color: '#0F172A', lineHeight: 1.15 }}>
      {title}
    </h1>
    <p style={{ fontSize: '20px', color: '#334155', marginBottom: '32px', lineHeight: 1.8, maxWidth: '800px', margin: '0 auto' }}>
      {subtitle}
    </p>
    <div style={{ marginTop: '32px', marginBottom: '24px' }}>
      <a href={ctaLink} style={{ padding: '16px 32px', fontSize: '18px', backgroundColor: '#0ea5e9', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
        {ctaText}
      </a>
    </div>
    {(readTime || lastUpdated) && (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px', color: '#64748B', marginTop: '24px' }}>
        {readTime && <span>{readTime} read</span>}
        {lastUpdated && <span>Updated {lastUpdated}</span>}
      </div>
    )}
  </div>
));

export const IntroductionBlock: React.FC<Types.IntroductionBlock> = memo(({ heading, text }) => (
  <div style={{ marginBottom: '64px' }} id="introduction">
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em' }}>
      {heading}
    </h2>
    <p style={{ color: '#334155', fontSize: '18px', lineHeight: 1.8 }}>
      {text}
    </p>
  </div>
));

export const QuickSummaryBlock: React.FC<Types.QuickSummaryBlock> = memo(({ summaryItems }) => (
  <div style={{ marginBottom: '48px', backgroundColor: '#F8FAFC', padding: '32px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#0F172A' }}>Quick Summary</h3>
    <ul style={{ paddingLeft: '24px', color: '#334155', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
      {summaryItems.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
    </ul>
  </div>
));

export const KeyBenefitsBlock: React.FC<Types.KeyBenefitsBlock> = memo(({ heading = 'Key Benefits', benefits }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
      {heading}
    </h2>
    {benefits.map((benefit, idx) => (
      <div key={idx} style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', color: '#1E293B' }}>{benefit.title}</h3>
        <p style={{ color: '#334155', fontSize: '18px', lineHeight: 1.8 }}>{benefit.description}</p>
      </div>
    ))}
  </div>
));

export const FeatureGridBlock: React.FC<Types.FeatureGridBlock> = memo(({ features }) => (
  <div style={{ marginBottom: '64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
    {features.map((feature, idx) => (
      <div key={idx} style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#0F172A' }}>{feature.title}</h3>
        <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6 }}>{feature.description}</p>
      </div>
    ))}
  </div>
));

export const StepByStepGuideBlock: React.FC<Types.StepByStepGuideBlock> = memo(({ steps }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
      Step-by-Step Guide
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {steps.map((step, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {idx + 1}
          </div>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>{step.title}</h3>
            <p style={{ color: '#475569', fontSize: '18px', lineHeight: 1.7 }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));

export const BestPracticesBlock: React.FC<Types.BestPracticesBlock> = memo(({ practices }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
      Best Practices
    </h2>
    <ul style={{ paddingLeft: '24px', color: '#334155', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
      {practices.map((practice, idx) => (
        <li key={idx} style={{ marginBottom: '16px' }}>
          <strong>{practice.title}:</strong> {practice.description}
        </li>
      ))}
    </ul>
  </div>
));

export const CommonMistakesBlock: React.FC<Types.CommonMistakesBlock> = memo(({ mistakes }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
      Common Mistakes to Avoid
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {mistakes.map((mistake, idx) => (
        <div key={idx} style={{ padding: '24px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#991B1B' }}>Mistake: {mistake.mistake}</h3>
          <p style={{ color: '#7F1D1D', fontSize: '16px', lineHeight: 1.6, margin: 0 }}><strong>Solution:</strong> {mistake.solution}</p>
        </div>
      ))}
    </div>
  </div>
));

export const RealExamplesBlock: React.FC<Types.RealExamplesBlock> = memo(({ examples }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
      Real Examples
    </h2>
    {examples.map((example, idx) => (
      <div key={idx} style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px', color: '#1E293B' }}>{example.title}</h3>
        <p style={{ color: '#475569', fontSize: '18px', lineHeight: 1.7 }}>{example.description}</p>
      </div>
    ))}
  </div>
));

export const FAQBlock: React.FC<Types.FAQBlock> = memo(({ questions }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
      Frequently Asked Questions
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {questions.map((faq, idx) => (
        <div key={idx} style={{ paddingBottom: '24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#1E293B' }}>{faq.question}</h3>
          <p style={{ color: '#475569', fontSize: '18px', lineHeight: 1.7, margin: 0 }}>{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
));

export const RelatedLinksRenderer: React.FC<{ title: string, links: Types.RelatedLink[] }> = memo(({ title, links }) => (
  <div style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#0F172A' }}>{title}</h3>
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyleType: 'none', padding: 0, margin: 0 }}>
      {links.map((link, idx) => (
        <li key={idx}>
          <a href={link.url} style={{ fontSize: '18px', fontWeight: 600, color: '#0ea5e9', textDecoration: 'none' }}>{link.title}</a>
          {link.description && <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '16px' }}>{link.description}</p>}
        </li>
      ))}
    </ul>
  </div>
));

export const CTABlock: React.FC<Types.CTABlock> = memo(({ heading, subtext, buttonText, buttonLink }) => (
  <div style={{ margin: '64px 0', padding: '48px', backgroundColor: '#0F172A', color: 'white', borderRadius: '16px', textAlign: 'center' }}>
    <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>{heading}</h2>
    <p style={{ fontSize: '20px', color: '#94A3B8', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>{subtext}</p>
    <a href={buttonLink} style={{ padding: '16px 40px', fontSize: '20px', backgroundColor: '#0ea5e9', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
      {buttonText}
    </a>
  </div>
));

export const AuthorBlock: React.FC<Types.AuthorBlockType> = memo(({ authorName, authorBio, authorImage }) => {
  return (
    <div style={{ display: 'flex', gap: '24px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '12px', marginBottom: '48px', border: '1px solid #E2E8F0' }}>
      <img src={authorImage || '/avatars/default.png'} alt={authorName} loading="lazy" decoding="async" width={80} height={80} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', marginBottom: '4px' }}>Written By</div>
        <strong style={{ fontSize: '20px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>{authorName}</strong>
        <p style={{ color: '#475569', margin: 0, lineHeight: 1.6 }}>{authorBio}</p>
      </div>
    </div>
  );
});

export const EEATAuthorReviewerBlock: React.FC<{ authorId?: string; reviewerId?: string }> = memo(({ authorId, reviewerId }) => {
  const author = authorId ? authors[authorId] : null;
  const reviewer = reviewerId ? reviewers[reviewerId] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
      {author && (
        <div style={{ display: 'flex', gap: '24px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <img src={author.avatarUrl || '/avatars/default.png'} alt={author.name} loading="lazy" decoding="async" width={80} height={80} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', marginBottom: '4px' }}>Written By</div>
            <strong style={{ fontSize: '20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {author.name} 
              <span style={{ fontSize: '12px', backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '2px 8px', borderRadius: '12px' }}>{author.experience}</span>
            </strong>
            <p style={{ color: '#475569', margin: 0, lineHeight: 1.6, marginBottom: '12px' }}>{author.bio}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {author.expertise.map(exp => <span key={exp} style={{ fontSize: '12px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '4px 8px', borderRadius: '4px' }}>{exp}</span>)}
            </div>
          </div>
        </div>
      )}
      
      {reviewer && (
        <div style={{ display: 'flex', gap: '24px', padding: '24px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
          <img src={reviewer.avatarUrl || '/avatars/default.png'} alt={reviewer.name} loading="lazy" decoding="async" width={64} height={64} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', marginBottom: '4px' }}>Expert Reviewed By</div>
            <strong style={{ fontSize: '18px', color: '#14532D', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {reviewer.name}
            </strong>
            <p style={{ color: '#15803D', margin: 0, lineHeight: 1.5, fontSize: '14px' }}>{reviewer.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
});

export const BreadcrumbBlock: React.FC<Types.BreadcrumbBlock> = memo(({ crumbs }) => (
  <div style={{ marginBottom: '32px', fontSize: '14px', color: '#64748B' }}>
    {crumbs.map((crumb, idx) => (
      <span key={idx}>
        <a href={crumb.url} style={{ color: '#64748B', textDecoration: 'none' }}>{crumb.label}</a>
        {idx < crumbs.length - 1 && <span style={{ margin: '0 8px' }}>/</span>}
      </span>
    ))}
  </div>
));

export const LastUpdatedBlock: React.FC<Types.LastUpdatedBlock> = memo(({ date }) => (
  <div style={{ fontSize: '14px', color: '#64748B', fontStyle: 'italic', marginBottom: '32px' }}>
    Last updated: {date}
  </div>
));

export const TimelineBlock: React.FC<Types.TimelineBlock> = memo(({ events }) => (
  <div style={{ marginBottom: '64px', borderLeft: '2px solid #E2E8F0', paddingLeft: '24px' }}>
    {events.map((evt, idx) => (
      <div key={idx} style={{ marginBottom: '32px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '-33px', top: '0', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0ea5e9' }}>{evt.date}</span>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '8px 0', color: '#0F172A' }}>{evt.title}</h3>
        <p style={{ color: '#475569', margin: 0, lineHeight: 1.6 }}>{evt.description}</p>
      </div>
    ))}
  </div>
));

export const ComparisonTableBlock: React.FC<Types.ComparisonTableBlock> = memo(({ headers, rows }) => (
  <div style={{ overflowX: 'auto', marginBottom: '48px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #E2E8F0' }}>
      <thead>
        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          {headers.map((h, i) => <th key={i} style={{ padding: '16px', color: '#0F172A' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '16px', color: '#334155' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export const ChecklistBlock: React.FC<Types.ChecklistBlock> = memo(({ title, items }) => (
  <div style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#0F172A' }}>{title}</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item, idx) => (
        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '18px', color: '#334155' }}>
          <span style={{ color: item.checked ? '#10B981' : '#CBD5E1', fontSize: '24px' }}>{item.checked ? '✓' : '○'}</span>
          {item.text}
        </li>
      ))}
    </ul>
  </div>
));

export const KeyTakeawaysBlock: React.FC<Types.KeyTakeawaysBlock> = memo(({ takeaways }) => (
  <div style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#1E3A8A' }}>Key Takeaways</h3>
    <ul style={{ paddingLeft: '24px', color: '#1E40AF', fontSize: '18px', margin: 0, lineHeight: 1.6 }}>
      {takeaways.map((t, i) => <li key={i} style={{ marginBottom: '8px' }}>{t}</li>)}
    </ul>
  </div>
));

export const MythVsFactBlock: React.FC<Types.MythVsFactBlock> = memo(({ items }) => (
  <div style={{ marginBottom: '64px' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A' }}>Myth vs Fact</h2>
    <div style={{ display: 'grid', gap: '24px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '24px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
            <strong style={{ color: '#991B1B', display: 'block', marginBottom: '8px' }}>Myth</strong>
            <p style={{ color: '#7F1D1D', margin: 0 }}>{item.myth}</p>
          </div>
          <div style={{ padding: '24px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
            <strong style={{ color: '#166534', display: 'block', marginBottom: '8px' }}>Fact</strong>
            <p style={{ color: '#15803D', margin: 0 }}>{item.fact}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));

export const DefinitionBlock: React.FC<Types.DefinitionBlock> = memo(({ term, definition }) => (
  <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #64748B' }}>
    <strong style={{ fontSize: '20px', color: '#0F172A', display: 'block', marginBottom: '8px' }}>{term}</strong>
    <p style={{ color: '#475569', margin: 0, fontSize: '18px' }}>{definition}</p>
  </div>
));

export const ExpertTipBlock: React.FC<Types.ExpertTipBlock> = memo(({ tip, expertName }) => (
  <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#FEFCE8', borderLeft: '4px solid #EAB308' }}>
    <strong style={{ color: '#854D0E', display: 'block', marginBottom: '8px' }}>Expert Tip {expertName ? `from ${expertName}` : ''}</strong>
    <p style={{ color: '#713F12', margin: 0, fontSize: '18px', fontStyle: 'italic' }}>"{tip}"</p>
  </div>
));

export const WarningBlock: React.FC<Types.WarningBlock> = memo(({ text }) => (
  <div style={{ padding: '16px 24px', backgroundColor: '#FFFBEB', borderLeft: '4px solid #F59E0B', color: '#92400E', marginBottom: '32px' }}>
    <strong>Warning:</strong> {text}
  </div>
));

export const InfoBoxBlock: React.FC<Types.InfoBoxBlock> = memo(({ text }) => (
  <div style={{ padding: '16px 24px', backgroundColor: '#EFF6FF', borderLeft: '4px solid #3B82F6', color: '#1E40AF', marginBottom: '32px' }}>
    <strong>Info:</strong> {text}
  </div>
));

export const StatisticsBlock: React.FC<Types.StatisticsBlock> = memo(({ stats }) => (
  <div style={{ marginBottom: '48px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
    {stats.map((s, i) => (
      <div key={i} style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#0ea5e9', marginBottom: '8px' }}>{s.value}</div>
        <div style={{ fontSize: '16px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
      </div>
    ))}
  </div>
));

export const QuoteBlock: React.FC<Types.QuoteBlock> = memo(({ quote, author }) => (
  <blockquote style={{ margin: '48px 0', padding: '32px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #0F172A', fontSize: '24px', color: '#334155', fontStyle: 'italic' }}>
    "{quote}"
    <footer style={{ marginTop: '16px', fontSize: '16px', fontWeight: 700, fontStyle: 'normal', color: '#0F172A' }}>— {author}</footer>
  </blockquote>
));

export const CaseStudyBlock: React.FC<Types.CaseStudyBlock> = memo(({ title, challenge, solution, result }) => (
  <div style={{ marginBottom: '64px', padding: '48px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
    <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px', color: '#0F172A' }}>Case Study: {title}</h3>
    <div style={{ display: 'grid', gap: '24px' }}>
      <div><strong style={{ display: 'block', color: '#1E293B', fontSize: '18px', marginBottom: '8px' }}>The Challenge</strong><p style={{ color: '#475569', margin: 0 }}>{challenge}</p></div>
      <div><strong style={{ display: 'block', color: '#1E293B', fontSize: '18px', marginBottom: '8px' }}>The Solution</strong><p style={{ color: '#475569', margin: 0 }}>{solution}</p></div>
      <div><strong style={{ display: 'block', color: '#1E293B', fontSize: '18px', marginBottom: '8px' }}>The Result</strong><p style={{ color: '#10B981', fontWeight: 600, margin: 0 }}>{result}</p></div>
    </div>
  </div>
));

export const DecisionTreeBlock: React.FC<Types.DecisionTreeBlock> = memo(({ title }) => (
  <div style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '12px', textAlign: 'center', border: '1px dashed #CBD5E1' }}>
    <h3 style={{ color: '#0F172A' }}>Decision Tree: {title}</h3>
    <p style={{ color: '#64748B' }}>Interactive Decision Tree Visualization Placeholder</p>
  </div>
));

export const DownloadsBlock: React.FC<Types.DownloadsBlock> = memo(({ files }) => (
  <div style={{ marginBottom: '48px' }}>
    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#0F172A' }}>Downloads</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {files.map((file, i) => (
        <a key={i} href={file.url} style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '8px', textDecoration: 'none', color: '#0F172A', border: '1px solid #E2E8F0' }}>
          <strong>{file.name}</strong>
          <span style={{ color: '#64748B' }}>{file.type} • {file.size}</span>
        </a>
      ))}
    </div>
  </div>
));
