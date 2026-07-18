import React from 'react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
      <ol style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        display: 'flex', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        fontSize: '14px',
        color: '#64748B'
      }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              {isLast || !item.url ? (
                <span style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a 
                  href={item.url} 
                  style={{ 
                    color: '#64748B', 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#00A65A'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  {item.name}
                </a>
              )}
              {!isLast && (
                <span style={{ margin: '0 8px', color: '#CBD5E1', fontSize: '12px' }}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
