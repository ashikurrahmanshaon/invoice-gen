import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Faq: React.FC = () => {
  const faqs = [
    { q: 'Is Invoice-Gen.net free?', a: 'Yes, Invoice-Gen.net is 100% free with no signup, login, or subscription required.' },
    { q: 'Do I need to create an account?', a: 'No, you do not need an account. You can generate and download invoices immediately.' },
    { q: 'Can I use Invoice-Gen.net on my phone?', a: 'Yes, our mobile flow is fully optimized. You can easily build and review invoices from any mobile browser.' },
    { q: 'Does my draft save automatically?', a: 'Yes, your draft is automatically saved in your browser local storage so you can safely refresh or return later.' },
    { q: 'Which currencies are supported?', a: 'We support major currencies including USD, EUR, and GBP to customize your invoice layout.' },
    { q: 'Can I add tax and discounts?', a: 'Yes, you can easily add custom tax rates, discount rates, shipping fees, and record payments already made.' }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" style={{ padding: 'var(--space-10) 0', borderTop: '1px solid var(--color-border)' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <h2 className="text-2xl font-bold" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Frequently Asked Questions</h2>
        <div className="flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                style={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button 
                  onClick={() => toggle(i)}
                  className="flex justify-between items-center text-sm font-semibold"
                  style={{ 
                    width: '100%', 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    color: 'var(--color-text-main)'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-secondary" /> : <ChevronDown size={16} className="text-secondary" />}
                </button>
                {isOpen && (
                  <div style={{ 
                    padding: '0 var(--space-4) var(--space-4)', 
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.5
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
