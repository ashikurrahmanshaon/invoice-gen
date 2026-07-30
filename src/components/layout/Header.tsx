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
        /* Premium Glassmorphism & Header Variables */
        :root {
          --header-height: 72px;
          --header-height-scrolled: 64px;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .hover-bg-tool {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-bg-tool:hover {
          background: rgba(0, 166, 90, 0.04);
          transform: translateX(4px);
        }
        .hover-bg-tool:hover .tool-icon-container {
          background: #00A65A !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(0, 166, 90, 0.3);
        }
        .tool-icon-container {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-drawer-link {
          display: flex; alignItems: center; gap: 12px; padding: 14px 16px; 
          border-radius: 12px; color: var(--color-text-main); font-weight: 600; 
          font-size: 15px; text-decoration: none; transition: all 0.2s;
        }
        .mobile-drawer-link:hover { 
          background: rgba(0, 166, 90, 0.06); 
          color: var(--color-primary);
        }

        .nav-link-modern {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-weight: 500;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 100px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .nav-link-modern:hover {
          color: var(--color-text-main);
          background: rgba(0,0,0,0.03);
        }
        .nav-link-modern.active {
          color: var(--color-primary);
          font-weight: 600;
          background: rgba(0, 166, 90, 0.08);
        }

        .theme-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .theme-toggle-btn:hover {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.08);
          color: var(--color-text-main);
        }
        .theme-toggle-btn:active {
          transform: scale(0.92);
        }

        .tools-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%) translateY(10px) scale(0.98);
          min-width: 340px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);
          padding: 12px;
          z-index: 1001;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top center;
        }
        .tools-dropdown.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        .header-signup-btn {
          height: 38px;
          padding: 0 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 100px;
          background: linear-gradient(135deg, #00C853, #00A65A);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 166, 90, 0.25);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-signup-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 166, 90, 0.35);
        }
        
        .header-login-btn {
          height: 38px;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-main);
          background: transparent;
          border: 1px solid transparent;
          border-radius: 100px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-login-btn:hover {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.1);
        }
        
        .mobile-menu-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-text-main);
          transition: all 0.2s;
          cursor: pointer;
        }
        .mobile-menu-btn:hover {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.08);
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
          background: isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: isScrolled ? 'blur(32px) saturate(180%)' : 'blur(16px)',
          WebkitBackdropFilter: isScrolled ? 'blur(32px) saturate(180%)' : 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
          height: isScrolled ? 'var(--header-height-scrolled)' : 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* Mobile-Only Header Layout */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
            <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-menu-btn" aria-label="Open Menu" style={{ marginLeft: '-12px' }}>
              <Menu size={22} />
            </button>

            {/* Centered Logo */}
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} onClick={handleLogoClick} aria-label="Go to Homepage">
              <svg width="26" height="30" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 166, 90, 0.25))' }} aria-hidden="true">
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
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
              </svg>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.3px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
              </div>
            </button>

            {/* Right Action */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '-12px' }}>
              {onDownloadPDF ? (
                <button
                  onClick={onDownloadPDF}
                  style={{ background: 'var(--color-primary)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)', cursor: 'pointer' }}
                  aria-label="Download PDF"
                >
                  <Download size={18} />
                </button>
              ) : (
                <Link to="/login" className="mobile-menu-btn" style={{ textDecoration: 'none', color: 'var(--color-text-main)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop: Logo */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }} onClick={handleLogoClick} aria-label="Go to Homepage">
              <svg width="34" height="38" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 6px 12px rgba(0, 166, 90, 0.25))' }} aria-hidden="true">
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
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', marginLeft: '1px' }}>.net</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.3px', marginTop: '-4px' }}>Professional Generator</span>
              </div>
            </button>
          </div>

          {/* Desktop: Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
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
                <ChevronDown size={14} style={{ transform: showToolsMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', opacity: 0.7 }} />
              </button>

              <div className={`tools-dropdown ${showToolsMenu ? 'show' : ''}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Link to="/" className="hover-bg-tool" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', textDecoration: 'none' }}>
                    <div className="tool-icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: location.pathname === '/' ? '#00A65A' : 'rgba(0,166,90,0.1)', color: location.pathname === '/' ? 'white' : '#00A65A' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '14px' }}>Invoice Generator</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '2px' }}>Create professional invoices instantly</div>
                    </div>
                  </Link>
                  <Link to="/purchase-order-generator" className="hover-bg-tool" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', textDecoration: 'none' }}>
                    <div className="tool-icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: location.pathname === '/purchase-order-generator' ? '#00A65A' : 'rgba(0,166,90,0.1)', color: location.pathname === '/purchase-order-generator' ? 'white' : '#00A65A' }}>
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '14px' }}>Purchase Order</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '2px' }}>Generate official POs for vendors</div>
                    </div>
                  </Link>
                  <Link to="/quote-generator" className="hover-bg-tool" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', textDecoration: 'none' }}>
                    <div className="tool-icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: location.pathname === '/quote-generator' ? '#00A65A' : 'rgba(0,166,90,0.1)', color: location.pathname === '/quote-generator' ? 'white' : '#00A65A' }}>
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '14px' }}>Quote Generator</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '2px' }}>Send price quotes to secure clients</div>
                    </div>
                  </Link>
                  <Link to="/estimate-generator" className="hover-bg-tool" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', textDecoration: 'none' }}>
                    <div className="tool-icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: location.pathname === '/estimate-generator' ? '#00A65A' : 'rgba(0,166,90,0.1)', color: location.pathname === '/estimate-generator' ? 'white' : '#00A65A' }}>
                      <Calculator size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '14px' }}>Estimate Generator</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '2px' }}>Estimate project costs professionally</div>
                    </div>
                  </Link>
                </div>
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

          {/* Desktop: Right Actions */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

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
              <div style={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
              </div>
            </button>

            <div className="desktop-only" style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)', margin: '0 4px' }}></div>

            <Link to="/login" className="desktop-only header-login-btn">Log in</Link>
            <Link to="/signup" className="desktop-only header-signup-btn">Sign up</Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: '300px',
          background: 'rgba(255, 255, 255, 0.98)', zIndex: 2000,
          backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isMobileMenuOpen ? '4px 0 32px rgba(0,0,0,0.12)' : 'none',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="32" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 166, 90, 0.25))' }} aria-hidden="true">
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
              <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
              <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
              <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.95" />
            </svg>
            <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', transition: 'all 0.2s' }} aria-label="Close Menu">
            <X size={20} color="var(--color-text-main)" />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.8px', marginBottom: '8px' }}>Tools</div>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><FileText size={20} color="var(--color-primary)" /> Invoice Generator</Link>
          <Link to="/purchase-order-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><ShoppingCart size={20} color="var(--color-primary)" /> Purchase Order</Link>
          <Link to="/quote-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><FileCheck size={20} color="var(--color-primary)" /> Quote Generator</Link>
          <Link to="/estimate-generator" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><Calculator size={20} color="var(--color-primary)" /> Estimate Generator</Link>

          <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '16px 0' }}></div>

          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.8px', marginBottom: '8px' }}>Resources</div>
          <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><LayoutTemplate size={20} color="var(--color-text-secondary)" /> Templates</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link"><BookOpen size={20} color="var(--color-text-secondary)" /> Guides & Blog</Link>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.01)' }}>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="header-login-btn" style={{ width: '100%', background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>Log in</Link>
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="header-signup-btn" style={{ width: '100%' }}>Sign up</Link>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1999, animation: 'fadeIn 0.3s' }}
        />
      )}
    </>
  );
};
