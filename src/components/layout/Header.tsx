import React, { useState, useEffect } from 'react';
import type { SaveStatus } from '../../hooks/useAutoSave';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface HeaderProps {
  onNewInvoice?: () => void;
  onResetEverything?: () => void;
  onDownloadPDF?: () => void;
  onOpenHelp?: () => void;
  saveStatus?: SaveStatus;
  showNewInvoiceToast?: boolean;
  activeView?: 'editor' | 'history' | 'settings';
  onViewChange?: (view: 'editor' | 'history' | 'settings') => void;
  onSave?: () => void;
  onSaveAsNew?: () => void;
  hasLoadedHistory?: boolean;
  onLoadDemo?: () => void;
  currentStage?: number;
  isMobileView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onViewChange,
  saveStatus
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light'); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      if (onViewChange) onViewChange('editor');
      else navigate('/');
    } else {
      navigate('/');
    }
  };

  const navLinkStyle = {
    fontSize: '15px', 
    color: 'var(--color-text-secondary)', 
    fontWeight: 500, 
    textDecoration: 'none', 
    padding: '8px 12px', 
    borderRadius: '6px', 
    transition: 'all 0.2s ease',
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    color: 'var(--color-text-main)',
    fontWeight: 600,
    position: 'relative' as const,
  };

  return (
    <>
      <style>{`
        .hover-bg { transition: background 0.15s; }
        .hover-bg:hover { background: rgba(0,0,0,0.04); }
        .mobile-drawer-link { display: block; padding: 12px 16px; border-radius: 8px; color: var(--color-text-main); font-weight: 500; font-size: 16px; text-decoration: none; }
        .mobile-drawer-link:hover { background: rgba(0,0,0,0.04); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .nav-active-indicator {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: var(--color-primary);
          border-radius: 4px;
        }
      `}</style>
      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000, 
          background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(24px)', 
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.04)' : '1px solid transparent',
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Mobile: Hamburger & Logo */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }}
              aria-label="Open Menu"
            >
              <Menu size={24} color="var(--color-text-main)" />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }} onClick={handleLogoClick} aria-label="Go to Homepage">
              <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} aria-hidden="true">
                <defs>
                  <linearGradient id="docGradient" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E676" />
                    <stop offset="1" stopColor="#00A65A" />
                  </linearGradient>
                  <linearGradient id="foldGradient" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C853" />
                    <stop offset="1" stopColor="#007936" />
                  </linearGradient>
                </defs>
                <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradient)"/>
                <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradient)"/>
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
              </svg>
            </button>
          </div>

          {/* Desktop: Logo */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }} onClick={handleLogoClick} aria-label="Go to Homepage">
              <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} aria-hidden="true">
                <defs>
                  <linearGradient id="docGradient" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E676" />
                    <stop offset="1" stopColor="#00A65A" />
                  </linearGradient>
                  <linearGradient id="foldGradient" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C853" />
                    <stop offset="1" stopColor="#007936" />
                  </linearGradient>
                </defs>
                <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradient)"/>
                <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradient)"/>
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>.net</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 400, color: '#94a3b8', letterSpacing: '0.2px', marginTop: '-4px' }}>Professional Invoice Generator</span>
              </div>
            </button>
          </div>

          {/* Desktop: Center Links */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowToolsMenu(true)}
              onMouseLeave={() => setShowToolsMenu(false)}
            >
              <button 
                style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              >
                Tools
                <ChevronDown size={14} style={{ transform: showToolsMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                {(location.pathname === '/' || location.pathname === '/purchase-order-generator' || location.pathname === '/quote-generator' || location.pathname === '/estimate-generator') && <div className="nav-active-indicator" />}
              </button>
              
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', minWidth: '240px',
                background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: '8px', zIndex: 1001,
                opacity: showToolsMenu ? 1 : 0, visibility: showToolsMenu ? 'visible' : 'hidden',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                marginTop: showToolsMenu ? '4px' : '10px'
              }}>
                <Link to="/" className="hover-bg" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: 'var(--color-text-main)', fontWeight: location.pathname === '/' ? 600 : 500, fontSize: '14px', textDecoration: 'none' }}>Invoice Generator</Link>
                <Link to="/purchase-order-generator" className="hover-bg" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: 'var(--color-text-main)', fontWeight: location.pathname === '/purchase-order-generator' ? 600 : 500, fontSize: '14px', textDecoration: 'none' }}>Purchase Order Generator</Link>
                <Link to="/quote-generator" className="hover-bg" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: 'var(--color-text-main)', fontWeight: location.pathname === '/quote-generator' ? 600 : 500, fontSize: '14px', textDecoration: 'none' }}>Quote Generator</Link>
                <Link to="/estimate-generator" className="hover-bg" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: 'var(--color-text-main)', fontWeight: location.pathname === '/estimate-generator' ? 600 : 500, fontSize: '14px', textDecoration: 'none' }}>Estimate Generator</Link>
              </div>
            </div>

            <Link to="/templates" style={location.pathname.startsWith('/templates') ? activeNavLinkStyle : navLinkStyle} onMouseEnter={(e) => { if(!location.pathname.startsWith('/templates')) e.currentTarget.style.color = 'var(--color-text-main)' }} onMouseLeave={(e) => { if(!location.pathname.startsWith('/templates')) e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
              Templates
              {location.pathname.startsWith('/templates') && <div className="nav-active-indicator" />}
            </Link>
            <Link to="/guides" style={location.pathname.startsWith('/guides') ? activeNavLinkStyle : navLinkStyle} onMouseEnter={(e) => { if(!location.pathname.startsWith('/guides')) e.currentTarget.style.color = 'var(--color-text-main)' }} onMouseLeave={(e) => { if(!location.pathname.startsWith('/guides')) e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
              Guides
              {location.pathname.startsWith('/guides') && <div className="nav-active-indicator" />}
            </Link>
            <Link to="/blog" style={location.pathname.startsWith('/blog') ? activeNavLinkStyle : navLinkStyle} onMouseEnter={(e) => { if(!location.pathname.startsWith('/blog')) e.currentTarget.style.color = 'var(--color-text-main)' }} onMouseLeave={(e) => { if(!location.pathname.startsWith('/blog')) e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
              Blog
              {location.pathname.startsWith('/blog') && <div className="nav-active-indicator" />}
            </Link>
            <Link to="/pricing" style={location.pathname.startsWith('/pricing') ? activeNavLinkStyle : navLinkStyle} onMouseEnter={(e) => { if(!location.pathname.startsWith('/pricing')) e.currentTarget.style.color = 'var(--color-text-main)' }} onMouseLeave={(e) => { if(!location.pathname.startsWith('/pricing')) e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
              Pricing
              {location.pathname.startsWith('/pricing') && <div className="nav-active-indicator" />}
            </Link>
          </div>

          {/* Desktop & Mobile: Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Auto Save Status (Desktop Only) */}
            {saveStatus && saveStatus !== 'idle' && (
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: saveStatus === 'success' ? '#00A65A' : 'var(--color-text-secondary)', opacity: 1, animation: saveStatus === 'success' ? 'fadeOut 3s forwards' : 'none' }}>
                <style>{`@keyframes fadeOut { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }`}</style>
                {saveStatus === 'saving' && <span style={{ opacity: 0.6 }}>Saving...</span>}
                {saveStatus === 'success' && <span>✓ Saved</span>}
              </div>
            )}

            <button 
              className="desktop-only"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <div className="desktop-only" style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>

            <Link to="/login" className="desktop-only" style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-text-main)', textDecoration: 'none', padding: '8px 12px', borderRadius: '6px', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>Log in</Link>
            <Link to="/signup" className="btn btn-primary" style={{ height: '36px', padding: '0 16px', fontSize: '14.5px' }}>Sign up</Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px', 
          background: 'white', zIndex: 2000, 
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isMobileMenuOpen ? '4px 0 24px rgba(0,0,0,0.1)' : 'none',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-title)' }}>Invoice-Gen</span>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }} aria-label="Close Menu">
            <X size={24} color="var(--color-text-main)" />
          </button>
        </div>
        
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.5px', marginBottom: '8px', marginTop: '8px' }}>Tools</div>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Invoice Generator</Link>
          <Link to="/purchase-order-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Purchase Order</Link>
          <Link to="/quote-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Quote Generator</Link>
          <Link to="/estimate-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Estimate Generator</Link>
          
          <div style={{ height: '1px', background: 'var(--color-border)', margin: '16px 0' }}></div>
          
          <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Templates</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Guides & Blog</Link>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn hover-lift" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-main)' }}>Log in</Link>
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign up</Link>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1999, animation: 'fadeIn 0.2s' }}
        />
      )}
    </>
  );
};
