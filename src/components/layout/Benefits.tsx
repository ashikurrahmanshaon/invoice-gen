import React from 'react';
import { UserMinus, Calculator, Globe, Smartphone } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    { icon: <UserMinus size={20} className="text-primary" />, title: 'No Account Required', desc: 'Instantly create and download invoices.' },
    { icon: <Calculator size={20} className="text-primary" />, title: 'Automatic Calculations', desc: 'Taxes, discounts, shipping, and balances calculated instantly.' },
    { icon: <Globe size={20} className="text-primary" />, title: 'Multiple Currencies', desc: 'Support for USD, EUR, GBP, and more.' },
    { icon: <Smartphone size={20} className="text-primary" />, title: 'Works on Any Device', desc: 'Mobile-friendly step-by-step creation flow.' }
  ];

  return (
    <section id="benefits" style={{ padding: 'var(--space-10) 0', borderTop: '1px solid var(--color-border)' }}>
      <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
        <h2 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-8)' }}>Everything You Need to Create an Invoice</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', textAlign: 'left' }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{
                background: 'rgba(21, 94, 239, 0.05)',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-1)'
              }}>{benefit.icon}</div>
              <h3 className="font-semibold text-sm">{benefit.title}</h3>
              <p className="text-secondary text-xs" style={{ lineHeight: 1.4 }}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
