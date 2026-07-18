import React from 'react';

export interface IntroSection {
  heading: string;
  text: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface Step {
  title: string;
  description: string;
}

interface ArticleContentProps {
  intro?: IntroSection;
  benefits?: Benefit[];
  stepByStep?: Step[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ intro, benefits, stepByStep }) => {
  return (
    <div className="article-content">
      {/* Introduction */}
      {intro && (
        <div style={{ marginBottom: '64px' }} id="introduction">
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#0F172A', letterSpacing: '-0.02em' }}>
            {intro.heading}
          </h2>
          <p style={{ color: '#334155', fontSize: '18px', lineHeight: 1.8 }}>
            {intro.text}
          </p>
        </div>
      )}

      {/* Benefits Sections */}
      {benefits && benefits.length > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <h2 id="key-benefits" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            Key Benefits
          </h2>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{ marginBottom: '32px' }} id={`benefit-${idx + 1}`}>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', color: '#1E293B' }}>
                {benefit.title}
              </h3>
              <p style={{ color: '#334155', fontSize: '18px', lineHeight: 1.8 }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Step By Step Guide */}
      {stepByStep && stepByStep.length > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <h2 id="step-by-step-guide" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            Step-by-Step Guide
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {stepByStep.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '20px' }} id={`step-${idx + 1}`}>
                <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  {idx + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '18px', lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
