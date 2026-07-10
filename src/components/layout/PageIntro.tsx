import React from 'react';

export const PageIntro: React.FC = () => {
  return (
    <div className="desktop-only" style={{ 
      margin: 'var(--space-5) 0 var(--space-2)',
      display: 'flex',
      alignItems: 'center',
      height: '70px',
      width: '100%'
    }}>
      <div className="flex-col" style={{ gap: '4px' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)', margin: 0, letterSpacing: '-0.5px' }}>
          Create your invoice
        </h1>
        <p className="text-secondary text-sm" style={{ margin: 0 }}>
          Add your details, review the invoice, and download when ready.
        </p>
      </div>
    </div>
  );
};
