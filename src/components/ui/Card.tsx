import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card = ({ children, className = '', noPadding = false }: CardProps) => {
  return (
    <div className={`card ${className}`} style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      padding: noPadding ? '0' : '32px',
      border: '1px solid #E2E8F0',
      marginBottom: '32px',
      width: '100%'
    }}>
      {children}
    </div>
  );
};
