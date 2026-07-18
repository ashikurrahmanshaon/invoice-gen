import React, { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Intersection Observer to highlight active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' } // triggers when heading is near the top
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll with offset for header
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div style={{
      position: 'sticky',
      top: '100px',
      padding: '24px',
      backgroundColor: '#F8FAFC',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Table of Contents
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const paddingLeft = (item.level - 2) * 16; // Indent H3, H4
          
          return (
            <li key={item.id} style={{ paddingLeft: `${paddingLeft}px` }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                style={{
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-primary)' : '#475569',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  display: 'block',
                  lineHeight: 1.4,
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  paddingLeft: '10px',
                  marginLeft: '-12px'
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#1E293B';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#475569';
                }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
