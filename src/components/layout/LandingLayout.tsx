import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
        <Header />
      </div>

      <main id="main-content" style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};
