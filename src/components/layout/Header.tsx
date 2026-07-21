import React, { useState, useEffect } from 'react';
import type { SaveStatus } from '../../hooks/useAutoSave';
import { ChevronDown, Menu, X, Sun, Moon, LayoutTemplate, BookOpen, FileText, ShoppingCart, FileCheck, Calculator, Download } from 'lucide-react';
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
  saveStatus,
  onDownloadPDF
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  return (
    <>
      <style>{`
        .hover-bg { transition: background 0.15s; }
        .hover-bg:hover { background: rgba(0,0,0,0.04); }
        .mobile-drawer-link { display: flex; alignItems: center; gap: 10px; padding: 12px 16px; border-radius: 8px; color: var(--color-text-main); font-weight: 500; font-size: 15px; text-decoration: none; align-items: center; }
        .mobile-drawer-link:hover { background: rgba(0,0,0,0.04); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .nav-link-modern {
          font-size: 15px;
          color: var(--color-text-secondary);
          font-weight: 500;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 99px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link-modern:hover {
          background: rgba(0,0,0,0.04);
          color: var(--color-text-main);
        }
        .nav-link-modern.active {
          color: var(--color-text-main);
          font-weight: 600;
          background: rgba(0,0,0,0.02);
        }
        .theme-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .theme-toggle-btn:hover {
          background: rgba(0,0,0,0.04);
          color: var(--color-text-main);
          transform: scale(1.05);
        }
        .theme-toggle-btn:active {
          transform: scale(0.95);
        }
      `}</style>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          background: isScrolled ? 'rgba(255, 255, 255, 0.97)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
          height: isScrolled ? '56px' : '64px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

          {/* Mobile-Only Header Layout */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
            {/* Hamburger (Left) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }}
              aria-label="Open Menu"
            >
              <Menu size={24} color="var(--color-text-main)" />
            </button>

            {/* Centered Logo & Text */}
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} onClick={handleLogoClick} aria-label="Go to Homepage">
              <svg width="24" height="28" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} aria-hidden="true">
                <defs>
                  <linearGradient id="docGradientMobile" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E676" />
                    <stop offset="1" stopColor="#00A65A" />
                  </linearGradient>
                  <linearGradient id="foldGradientMobile" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C853" />
                    <stop offset="1" stopColor="#007936" />
                  </linearGradient>
                </defs>
                <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradientMobile)" />
                <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradientMobile)" />
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
              </svg>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>.net</span>
              </div>
            </button>

            {/* Download PDF Button (Right) */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {onDownloadPDF && (
                <button
                  onClick={onDownloadPDF}
                  style={{ background: 'var(--color-primary)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 166, 90, 0.2)', cursor: 'pointer', marginRight: '-8px' }}
                  aria-label="Download PDF"
                >
                  <Download size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop: Logo */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }} onClick={handleLogoClick} aria-label="Go to Homepage">
              <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} aria-hidden="true">
                <defs>
                  <linearGradient id="docGradientDesktop" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E676" />
                    <stop offset="1" stopColor="#00A65A" />
                  </linearGradient>
                  <linearGradient id="foldGradientDesktop" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C853" />
                    <stop offset="1" stopColor="#007936" />
                  </linearGradient>
                </defs>
                <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradientDesktop)" />
                <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradientDesktop)" />
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>.net</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 400, color: '#94a3b8', letterSpacing: '0.2px', marginTop: '-3px' }}>Professional Invoice Generator</span>
              </div>
            </button>
          </div>

          {/* Desktop: Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowToolsMenu(true)}
              onMouseLeave={() => setShowToolsMenu(false)}
            >
              <button
                className={`nav-link-modern ${(location.pathname === '/' || location.pathname === '/purchase-order-generator' || location.pathname === '/quote-generator' || location.pathname === '/estimate-generator') ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Tools
                <ChevronDown size={14} style={{ transform: showToolsMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', marginLeft: '-2px', opacity: 0.6 }} />
              </button>

              <div style={{
                position: 'absolute', top: '100%', left: '0', minWidth: '240px',
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

            <Link to="/templates" className={`nav-link-modern ${location.pathname.startsWith('/templates') ? 'active' : ''}`}>
              Templates
            </Link>
            <Link to="/guides" className={`nav-link-modern ${location.pathname.startsWith('/guides') ? 'active' : ''}`}>
              Guides
            </Link>
            <Link to="/blog" className={`nav-link-modern ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
              Blog
            </Link>
          </nav>

          {/* Desktop & Mobile: Right Actions */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* Auto Save Status (Desktop Only) */}
            {saveStatus && saveStatus !== 'idle' && (
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: saveStatus === 'success' ? '#00A65A' : 'var(--color-text-secondary)', opacity: 1, animation: saveStatus === 'success' ? 'fadeOut 3s forwards' : 'none' }}>
                <style>{`@keyframes fadeOut { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }`}</style>
                {saveStatus === 'saving' && <span style={{ opacity: 0.6 }}>Saving...</span>}
                {saveStatus === 'success' && <span>✓ Saved</span>}
              </div>
            )}

            <button
              className="desktop-only theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle Theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <div style={{ display: 'flex', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
              </div>
            </button>

            <div className="desktop-only" style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>

            <Link to="/login" className="desktop-only" style={{ height: '36px', minHeight: '36px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)', textDecoration: 'none', padding: '0 16px', borderRadius: '6px', border: '1px solid var(--color-border)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>Log in</Link>
            <Link to="/signup" className="btn btn-primary" style={{ height: '36px', minHeight: '36px', padding: '0 16px', fontSize: '14px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>Sign up</Link>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="24" height="27" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} aria-hidden="true">
              <defs>
                <linearGradient id="docGradientDrawer" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00E676" />
                  <stop offset="1" stopColor="#00A65A" />
                </linearGradient>
                <linearGradient id="foldGradientDrawer" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00C853" />
                  <stop offset="1" stopColor="#007936" />
                </linearGradient>
              </defs>
              <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradientDrawer)" />
              <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradientDrawer)" />
              <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
              <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
              <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
            </svg>
            <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>.net</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }} aria-label="Close Menu">
            <X size={24} color="var(--color-text-main)" />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.5px', marginBottom: '8px', marginTop: '8px' }}>Tools</div>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><FileText size={18} color="var(--color-text-secondary)" /> Invoice Generator</Link>
          <Link to="/purchase-order-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><ShoppingCart size={18} color="var(--color-text-secondary)" /> Purchase Order</Link>
          <Link to="/quote-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><FileCheck size={18} color="var(--color-text-secondary)" /> Quote Generator</Link>
          <Link to="/estimate-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><Calculator size={18} color="var(--color-text-secondary)" /> Estimate Generator</Link>

          <div style={{ height: '1px', background: 'var(--color-border)', margin: '16px 0' }}></div>

          <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><LayoutTemplate size={18} color="var(--color-text-secondary)" /> Templates</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><BookOpen size={18} color="var(--color-text-secondary)" /> Guides & Blog</Link>
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
