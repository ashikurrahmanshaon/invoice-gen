import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const Container = ({ children, className = '', id }: ContainerProps) => {
  return (
    <div id={id} className={`container ${className}`} style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
      {children}
    </div>
  );
};
