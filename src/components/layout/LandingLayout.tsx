import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" id="main-content" style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
