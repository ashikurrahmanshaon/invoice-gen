import React, { useState } from 'react';
import { SEO } from '../components/seo/SEO';
import { trackEvent } from '../utils/analytics';
import { LandingLayout } from '../components/layout/LandingLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Star, ChevronRight, Briefcase, Coffee, Utensils, Clock, Building, Code, Lock, X, Eye, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Business', 'Freelance', 'Services', 'Creative'];

const TEMPLATES = [
  {
    id: 'standard',
    title: 'Standard Professional',
    description: 'A clean, minimalist design perfect for general business use, freelancers, and independent contractors.',
    icon: Briefcase,
    category: 'Business',
    popular: true,
    recentlyUsed: true,
    features: ['Minimalist layout', 'Auto-calculates totals', 'Tax & Discount ready'],
    previewColor: '#F8FAFC' 
  },
  {
    id: 'coffee-shop',
    title: 'Coffee Shop & Cafe',
    description: 'Designed specifically for cafes, bakeries, and coffee shops. Includes spaces for tips and fast table service billing.',
    icon: Coffee,
    category: 'Services',
    popular: false,
    recentlyUsed: false,
    features: ['Itemized food/drink list', 'Built-in tip section', 'Fast layout'],
    previewColor: '#FFF8E6' 
  },
  {
    id: 'restaurant',
    title: 'Restaurant & Catering',
    description: 'Ideal for catering events or large restaurant bills. Supports huge item lists and detailed tax breakdowns.',
    icon: Utensils,
    category: 'Services',
    popular: false,
    recentlyUsed: false,
    features: ['Large item capacity', 'Catering terms section', 'Multi-tax support'],
    previewColor: '#FEF2F2'
  },
  {
    id: 'hourly',
    title: 'Hourly Services',
    description: 'Perfect for consultants, mechanics, and anyone billing by the hour. Automatically calculates Rate x Hours.',
    icon: Clock,
    category: 'Freelance',
    popular: true,
    recentlyUsed: false,
    features: ['Hours & Rate columns', 'Time-tracking friendly', 'Service descriptions'],
    previewColor: '#F0FDF4'
  },
  {
    id: 'agency',
    title: 'Agency & Consulting',
    description: 'A premium layout for marketing agencies and high-end consultants. Ample space for project milestones.',
    icon: Building,
    category: 'Business',
    popular: false,
    recentlyUsed: false,
    features: ['Project milestones', 'Terms & Conditions block', 'Premium aesthetics'],
    previewColor: '#E6F0FF'
  },
  {
    id: 'software',
    title: 'Software Development',
    description: 'Tailored for software engineers and IT professionals. Includes sections for GitHub repo links and sprints.',
    icon: Code,
    category: 'Creative',
    popular: false,
    recentlyUsed: false,
    features: ['Sprint billing', 'Repo reference fields', 'Clean code aesthetic'],
    previewColor: '#F3F4F6'
  }
];

export const TemplateGalleryPage: React.FC = () => {
  const [activeId, setActiveId] = useState(TEMPLATES[0].id);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const activeTemplate = TEMPLATES.find(t => t.id === activeId) || TEMPLATES[0];

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('template_selected', { template_name: activeTemplate.title, category: activeTemplate.category });
    if (activeTemplate.id === 'standard') {
      navigate('/app');
    } else {
      setShowPremiumModal(true);
    }
  };

  return (
    <LandingLayout>
      <SEO 
        title="Free Invoice Templates | Download Professional Invoice Designs"
        description="Browse our gallery of free, professional invoice templates for freelancers, agencies, and small businesses. Download as PDF instantly."
        canonicalUrl="https://invoice-gen.net/templates"
      />
      
      <div className="workspace-layout">
        <style>{`
          .template-layout-container {
            display: flex;
            gap: 32px;
            align-items: flex-start;
          }
          .template-sidebar {
            width: 300px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .template-detail {
            flex: 1;
            position: sticky;
            top: 100px;
          }
          .template-tab {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            position: relative;
          }
          .template-tab:hover {
            background: var(--color-surface);
            border-color: var(--color-border);
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          }
          .template-tab.active {
            background: var(--color-surface);
            border-color: var(--color-primary);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          }
          .chip-btn {
            padding: 8px 18px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
            color: #64748B;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .chip-btn:hover {
            border-color: var(--color-primary);
            color: var(--color-primary);
          }
          .chip-btn.active {
            background: var(--color-primary-faint);
            color: var(--color-primary);
            border-color: var(--color-primary);
          }
          @media (max-width: 900px) {
            .template-layout-container {
              flex-direction: column;
            }
            .template-sidebar {
              width: 100%;
            }
            .template-detail {
              position: static;
            }
          }
        `}</style>

        <div className="workspace-main" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 0 24px' }}>
          
          {/* Header */}
          <div style={{ padding: '0 0 32px 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 900, background: 'linear-gradient(135deg, var(--color-text-title) 0%, #475569 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
              Professional Invoice Templates
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
              Choose a design tailored for your industry and generate clean PDF invoices in seconds.
            </p>
          </div>

          {/* Category Chips Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Master-Detail Layout */}
          <div className="template-layout-container">
            
            {/* Left Sidebar (Master) */}
            <div className="template-sidebar">
              {filteredTemplates.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
                  No templates in this category.
                </div>
              ) : (
                filteredTemplates.map((template) => {
                  const isActive = template.id === activeId;
                  const Icon = template.icon;
                  
                  return (
                    <button
                      key={template.id}
                      onClick={() => setActiveId(template.id)}
                      className={`template-tab ${isActive ? 'active' : ''}`}
                    >
                      <div style={{ 
                        width: '40px', height: '40px', 
                        borderRadius: '8px', 
                        background: isActive ? 'var(--color-primary-faint)' : '#F8FAFC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginRight: '12px',
                        color: isActive ? 'var(--color-primary)' : '#64748B',
                        transition: 'all 0.2s',
                        zIndex: 1
                      }}>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <div style={{ flex: 1, zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: isActive ? 700 : 600, color: isActive ? 'var(--color-text-title)' : 'var(--color-text-main)', fontSize: '14px' }}>
                            {template.title}
                          </span>
                          {template.popular && (
                            <span style={{ fontSize: '9px', background: '#FDE68A', color: '#92400E', padding: '2px 6px', borderRadius: '100px', fontWeight: 700, letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <Sparkles size={10} /> POPULAR
                            </span>
                          )}
                          {template.recentlyUsed && (
                            <span style={{ fontSize: '9px', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '100px', fontWeight: 700 }}>
                              RECENT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                          {template.category} • {template.features[0]}
                        </div>
                      </div>
                      <ChevronRight size={16} color={isActive ? 'var(--color-primary)' : '#CBD5E1'} style={{ transform: isActive ? 'translateX(4px)' : 'none', transition: 'transform 0.2s', zIndex: 1 }} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Panel (Detail) */}
            <div className="template-detail">
              <div className="hover-card" style={{ 
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 8px 24px -10px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0, letterSpacing: '-0.01em' }}>
                        {activeTemplate.title} Invoice
                      </h2>
                      {activeTemplate.popular && (
                        <span style={{ fontSize: '11px', background: '#FDE68A', color: '#92400E', padding: '3px 10px', borderRadius: '100px', fontWeight: 700 }}>
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '500px', lineHeight: '1.6', fontWeight: 400 }}>
                      {activeTemplate.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowLivePreviewModal(true)}
                      className="btn btn-ghost"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '14px', fontWeight: 600, borderRadius: '10px' }}
                    >
                      <Eye size={16} /> Live Preview
                    </button>
                    <button 
                      onClick={handleUseTemplate}
                      className="btn btn-primary"
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', 
                        padding: '10px 20px', fontSize: '14px', fontWeight: 600,
                        borderRadius: '10px', flexShrink: 0, border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Use This Template <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                  {activeTemplate.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-main)', fontSize: '13px', fontWeight: 500 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="var(--color-success)" strokeWidth={3} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Large Preview Box */}
                <div className="preview-container" style={{
                  width: '100%',
                  height: '280px',
                  backgroundColor: activeTemplate.previewColor,
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {/* Simulated Invoice Graphic */}
                  <div className="invoice-graphic" style={{ 
                    width: '60%', height: '85%', 
                    background: 'white', 
                    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)', 
                    borderRadius: '8px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <div style={{ width: '70px', height: '24px', background: 'var(--color-border)', borderRadius: '4px' }}></div>
                      <div style={{ width: '100px', height: '16px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ width: '220px', height: '48px', background: '#F8FAFC', borderRadius: '8px', marginBottom: '40px' }}></div>
                    <div style={{ flex: 1, borderTop: '2px solid #F1F5F9', paddingTop: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '35%', height: '16px', background: 'var(--color-border)', borderRadius: '4px' }}></div>
                        <div style={{ width: '20%', height: '16px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '50%', height: '16px', background: 'var(--color-border)', borderRadius: '4px' }}></div>
                        <div style={{ width: '20%', height: '16px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div style={{ 
                    position: 'absolute', bottom: '24px', right: '24px', 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(12px)',
                    padding: '12px 24px', 
                    borderRadius: '100px', 
                    boxShadow: '0 16px 36px -8px rgba(0,0,0,0.15)', 
                    display: 'flex', alignItems: 'center', gap: '10px', 
                    fontWeight: 700, fontSize: '14px', color: 'var(--color-text-title)',
                    zIndex: 2
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#FEF3C7' }}>
                      <Star size={14} fill="#D97706" color="#D97706" />
                    </div>
                    Optimized for {activeTemplate.title}
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
          <div style={{ height: '100px' }}></div>
        </div>

        {/* Live Preview Modal */}
        {showLivePreviewModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '680px',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <button 
                onClick={() => setShowLivePreviewModal(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={24} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                  Live Preview: {activeTemplate.title}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                  Category: {activeTemplate.category}
                </span>
              </div>

              {/* Sample Invoice Rendering */}
              <div style={{ background: activeTemplate.previewColor, padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div>
                      <strong style={{ fontSize: '18px', color: '#0F172A' }}>Acme Studio LLC</strong>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>123 Business St, New York</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>INVOICE</strong>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>#INV-2026-001</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ color: '#94A3B8', fontWeight: 600 }}>Billed To:</span>
                      <div style={{ color: '#0F172A', fontWeight: 600 }}>Apex Digital Inc.</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#94A3B8', fontWeight: 600 }}>Date:</span>
                      <div style={{ color: '#0F172A' }}>Jul 21, 2026</div>
                    </div>
                  </div>
                  <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                        <th style={{ textAlign: 'center', padding: '8px' }}>Qty</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Rate</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px', color: '#0F172A', fontWeight: 500 }}>{activeTemplate.title} Service</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>1</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>$1,500.00</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>$1,500.00</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                    Total Due: $1,500.00
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowLivePreviewModal(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 600 }}
                >
                  Close Preview
                </button>
                <button
                  onClick={handleUseTemplate}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 700 }}
                >
                  Use Template Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Paywall Modal */}
        {showPremiumModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '480px',
              padding: '40px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center'
            }}>
              <button 
                onClick={() => setShowPremiumModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={24} />
              </button>

              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                <Lock size={32} color="#EA580C" />
              </div>

              <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                Premium Feature
              </h3>
              <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px', lineHeight: '1.6' }}>
                Industry-specific templates like <strong>{activeTemplate.title}</strong> are premium features. Please log in or create a free account to unlock them.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link 
                  to="/login"
                  style={{ display: 'block', width: '100%', padding: '16px', background: 'var(--color-primary)', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/login"
                  style={{ display: 'block', width: '100%', padding: '16px', background: '#F1F5F9', color: '#0F172A', borderRadius: '12px', fontWeight: 600, fontSize: '16px', textDecoration: 'none' }}
                >
                  Log In to Existing Account
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </LandingLayout>
  );
};
