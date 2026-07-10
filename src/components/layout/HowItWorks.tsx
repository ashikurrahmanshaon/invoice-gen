import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    { num: '1', title: 'Add your details', desc: 'Enter your business and client information.' },
    { num: '2', title: 'Add your items', desc: 'Enter services, rates, and quantities.' },
    { num: '3', title: 'Download your invoice', desc: 'Review your invoice and save the finished PDF.' }
  ];

  return (
    <section id="how-it-works" style={{ padding: 'var(--space-10) 0', borderTop: '1px solid var(--color-border)' }}>
      <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
        <h2 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-8)' }}>Create an Invoice in Minutes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
          {steps.map((step) => (
            <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-background)',
                border: '2px solid var(--color-border)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--space-2)'
              }}>{step.num}</div>
              <h3 className="font-semibold text-base">{step.title}</h3>
              <p className="text-secondary text-sm" style={{ maxWidth: '240px', lineHeight: 1.4 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
