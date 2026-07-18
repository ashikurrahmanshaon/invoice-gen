import React from 'react';

export interface FeatureCard {
  icon?: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: FeatureCard[];
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {features.map((feat, idx) => (
          <div key={idx} style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#0F172A' }}>
              {feat.title}
            </h3>
            <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6 }}>
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
