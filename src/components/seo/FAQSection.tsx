import React from 'react';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div style={{ marginBottom: '64px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.02em' }} id="faq">
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {faqs.map((faqItem, idx) => (
          <div key={idx}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#0F172A' }}>
              {faqItem.q}
            </h3>
            <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6 }}>
              {faqItem.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
