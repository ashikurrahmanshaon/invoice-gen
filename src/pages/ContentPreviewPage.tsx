import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ContentEngine } from '../engine/ContentEngine';
import { calculateQualityScore } from '../engine/qualityScore';
import examplePage from '../data/pages/example-seo-page.json';
import { SEOContentPage, ContentBlock } from '../types/content';
import { SchemaRegistry } from '../engine/schema/SchemaRegistry';
import { SchemaValidator } from '../engine/schema/SchemaValidator';
import { SchemaInspector } from '../components/seo/SchemaInspector';

import { calculateEEATScore } from '../engine/eeatScore';
import { EEATAuthorReviewerBlock } from '../components/seo/blocks/BlockComponents';

export const ContentPreviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'validator' | 'quality' | 'schema' | 'eeat'>('content');

  // Ensure we only render this in development
  if (import.meta.env && import.meta.env.MODE === 'production') {
    return <div>This route is not available in production.</div>;
  }

  const page = examplePage as unknown as SEOContentPage;
  const scoreReport = calculateQualityScore(page);
  const eeatReport = calculateEEATScore(page);

  // Generate Schema
  const registry = SchemaRegistry.getInstance();
  registry.reset();
  
  registry.buildWebSite();
  registry.buildArticle(
    page.meta.canonicalUrl || 'https://invoice-gen.net/example',
    page.meta.title,
    page.meta.description,
    page.lastUpdatedDate,
    page.lastUpdatedDate
  );

  const faqBlock = page.blocks.find(b => b.type === 'faq') as any;
  if (faqBlock && faqBlock.faqs) {
    registry.buildFAQPage(page.meta.canonicalUrl || 'https://invoice-gen.net/example', faqBlock.faqs);
  }

  const schemaGraph = registry.getGraph();
  const schemaValidation = SchemaValidator.validate(schemaGraph);

  const tabs = [
    { id: 'content', label: 'Content Preview' },
    { id: 'validator', label: 'Validator' },
    { id: 'quality', label: 'Quality Score' },
    { id: 'eeat', label: 'EEAT & Trust' },
    { id: 'schema', label: 'Schema Inspector' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Helmet>
        <title>Dev Preview: {page.meta?.title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Dev Header & Tabs */}
      <div style={{ backgroundColor: '#1E293B', padding: '0 48px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
          <div>
            <h1 style={{ color: '#F8FAFC', margin: 0, fontSize: '24px' }}>Enterprise SEO Engine</h1>
            <span style={{ color: '#94A3B8', fontSize: '14px' }}>Developer Dashboard • {page.meta.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {page.trustBadges?.map(badge => (
              <span key={badge} style={{ padding: '4px 12px', borderRadius: '16px', backgroundColor: '#047857', color: '#D1FAE5', fontSize: '12px', fontWeight: 'bold' }}>
                ✓ {badge}
              </span>
            ))}
            <span style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#334155', color: '#F8FAFC' }}>
              Status: {page.status}
            </span>
            <span style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: scoreReport.overallScore >= 95 ? '#064E3B' : '#7F1D1D', color: '#F8FAFC', fontWeight: 'bold' }}>
              Score: {scoreReport.overallScore}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 0',
                color: activeTab === tab.id ? '#38BDF8' : '#94A3B8',
                borderBottom: activeTab === tab.id ? '2px solid #38BDF8' : '2px solid transparent',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '48px', maxWidth: activeTab === 'content' ? '900px' : '1200px', margin: '0 auto', width: '100%' }}>
        
        {activeTab === 'content' && (
          <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 0 20px rgba(0,0,0,0.05)', padding: '48px' }}>
            <EEATAuthorReviewerBlock authorId={page.authorId} reviewerId={page.reviewerId} />
            <ContentEngine blocks={page.blocks as ContentBlock[]} />
            
            {/* Citations Footer */}
            {page.citations && page.citations.length > 0 && (
              <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '20px', color: '#0F172A', marginBottom: '24px' }}>Sources & Citations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {page.citations.map((c, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#475569' }}>
                      <span style={{ display: 'inline-block', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', marginRight: '8px', fontSize: '12px' }}>{c.category}</span>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>{c.sourceName}</a>
                      <span style={{ color: '#94A3B8', marginLeft: '8px' }}>(Quality: {c.qualityScore})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ... Validator and Quality Tabs omitted for brevity in replace block, keep them unchanged ... */}
        {activeTab === 'validator' && (
          <div>
            <h2 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '32px' }}>Validation Engine Rules</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 16px 0' }}>SEO Metrics</h3>
                <p><strong>H1 Count:</strong> {scoreReport.scores.seo} (Should be 1)</p>
                <p><strong>Title Length:</strong> {page.meta.title.length} chars (Target 30-60)</p>
                <p><strong>Meta Description:</strong> {page.meta.description.length} chars (Target 100-160)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div>
            <h2 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '32px' }}>Quality Score Report</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>Overall Score</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: scoreReport.overallScore >= 95 ? '#10B981' : '#F59E0B' }}>{scoreReport.overallScore}</div>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>SEO Score</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: scoreReport.scores.seo >= 95 ? '#10B981' : '#F59E0B' }}>{scoreReport.scores.seo}</div>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>EEAT Base Score</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: scoreReport.scores.eeat >= 95 ? '#10B981' : '#F59E0B' }}>{scoreReport.scores.eeat}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eeat' && (
          <div>
            <h2 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '32px' }}>EEAT & Trust System</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>Experience</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: eeatReport.scores.experience >= 90 ? '#10B981' : '#F59E0B' }}>{eeatReport.scores.experience}</div>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>Expertise</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: eeatReport.scores.expertise >= 90 ? '#10B981' : '#F59E0B' }}>{eeatReport.scores.expertise}</div>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>Authority</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: eeatReport.scores.authority >= 90 ? '#10B981' : '#F59E0B' }}>{eeatReport.scores.authority}</div>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <h3 style={{ color: '#64748B', margin: '0 0 16px 0' }}>Trust</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: eeatReport.scores.trust >= 90 ? '#10B981' : '#F59E0B' }}>{eeatReport.scores.trust}</div>
              </div>
            </div>
            
            <div style={{ padding: '32px', backgroundColor: '#1E293B', borderRadius: '12px', textAlign: 'center', marginBottom: '32px', color: '#F8FAFC' }}>
              <h3 style={{ color: '#94A3B8', margin: '0 0 16px 0' }}>Overall EEAT Trust Score</h3>
              <div style={{ fontSize: '64px', fontWeight: 800, color: eeatReport.overallEEAT >= 95 ? '#34D399' : '#FBBF24' }}>{eeatReport.overallEEAT}</div>
            </div>
            
            <h3 style={{ fontSize: '20px', color: '#0F172A', marginBottom: '16px' }}>EEAT Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {eeatReport.recommendations.map((rec, i) => (
                <div key={i} style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '8px', borderLeft: `4px solid #F59E0B`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <SchemaInspector graph={schemaGraph} validation={schemaValidation} />
        )}

      </div>
    </div>
  );
};

export default ContentPreviewPage;
