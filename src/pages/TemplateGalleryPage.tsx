import React, { useState } from 'react';
import { SEO } from '../components/seo/SEO';
import { LandingLayout } from '../components/layout/LandingLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Star, ChevronRight, Briefcase, Coffee, Utensils, Clock, Building, Code, Lock, X } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'standard',
    title: 'Standard Professional',
    description: 'A clean, minimalist design perfect for general business use, freelancers, and independent contractors.',
    icon: Briefcase,
    popular: true,
    features: ['Minimalist layout', 'Auto-calculates totals', 'Tax & Discount ready'],
    previewColor: '#F8FAFC' 
  },
  {
    id: 'coffee-shop',
    title: 'Coffee Shop & Cafe',
    description: 'Designed specifically for cafes, bakeries, and coffee shops. Includes spaces for tips and fast table service billing.',
    icon: Coffee,
    popular: false,
    features: ['Itemized food/drink list', 'Built-in tip section', 'Fast layout'],
    previewColor: '#FFF8E6' 
  },
  {
    id: 'restaurant',
    title: 'Restaurant & Catering',
    description: 'Ideal for catering events or large restaurant bills. Supports huge item lists and detailed tax breakdowns.',
    icon: Utensils,
    popular: false,
    features: ['Large item capacity', 'Catering terms section', 'Multi-tax support'],
    previewColor: '#FEF2F2'
  },
  {
    id: 'hourly',
    title: 'Hourly Services',
    description: 'Perfect for consultants, mechanics, and anyone billing by the hour. Automatically calculates Rate x Hours.',
    icon: Clock,
    popular: true,
    features: ['Hours & Rate columns', 'Time-tracking friendly', 'Service descriptions'],
    previewColor: '#F0FDF4'
  },
  {
    id: 'agency',
    title: 'Agency & Consulting',
    description: 'A premium layout for marketing agencies and high-end consultants. Ample space for project milestones.',
    icon: Building,
    popular: false,
    features: ['Project milestones', 'Terms & Conditions block', 'Premium aesthetics'],
    previewColor: '#E6F0FF'
  },
  {
    id: 'software',
    title: 'Software Development',
    description: 'Tailored for software engineers and IT professionals. Includes sections for GitHub repo links and sprints.',
    icon: Code,
    popular: false,
    features: ['Sprint billing', 'Repo reference fields', 'Clean code aesthetic'],
    previewColor: '#F3F4F6'
  }
];

export const TemplateGalleryPage: React.FC = () => {
  const [activeId, setActiveId] = useState(TEMPLATES[0].id);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();
  
  const activeTemplate = TEMPLATES.find(t => t.id === activeId) || TEMPLATES[0];

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
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
            width: 340px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .template-detail {
            flex: 1;
            position: sticky;
            top: 100px;
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

        <div className="workspace-main" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 0 24px' }}>
          
          {/* Header */}
          <div style={{ padding: '40px 0 48px 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-text-title)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Professional Invoice Templates
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--color-text-main)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              Choose a template optimized for your industry. Customize it instantly, add your branding, and download it as a PDF for free.
            </p>
          </div>

          {/* Master-Detail Layout */}
          <div className="template-layout-container">
            
            {/* Left Sidebar (Master) */}
            <div className="template-sidebar">
              {TEMPLATES.map((template) => {
                const isActive = template.id === activeId;
                const Icon = template.icon;
                
                return (
                  <button
                    key={template.id}
                    onClick={() => setActiveId(template.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: isActive ? 'var(--color-primary-faint)' : 'var(--color-surface)',
                      border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      boxShadow: isActive ? '0 4px 12px rgba(0, 166, 90, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ 
                      width: '48px', height: '48px', 
                      borderRadius: '12px', 
                      background: isActive ? 'var(--color-primary)' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginRight: '16px',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      transition: 'all 0.2s'
                    }}>
                      <Icon size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: isActive ? 700 : 600, color: isActive ? 'var(--color-primary)' : 'var(--color-text-title)', fontSize: '16px' }}>
                          {template.title}
                        </span>
                        {template.popular && (
                          <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#D97706', padding: '3px 8px', borderRadius: '100px', fontWeight: 700, letterSpacing: '0.5px' }}>
                            HOT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {template.features[0]} • {template.features[1]}
                      </div>
                    </div>
                    <ChevronRight size={20} color={isActive ? 'var(--color-primary)' : '#CBD5E1'} style={{ transform: isActive ? 'translateX(4px)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                );
              })}
            </div>

            {/* Right Panel (Detail) */}
            <div className="template-detail">
              <div style={{ 
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 40px -20px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 400px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-title)', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
                      {activeTemplate.title} Invoice
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '500px', lineHeight: '1.6' }}>
                      {activeTemplate.description}
                    </p>
                  </div>
                  <button 
                    onClick={handleUseTemplate}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '16px', borderRadius: '12px', flexShrink: 0, border: 'none', cursor: 'pointer' }}
                  >
                    Use This Template <ChevronRight size={18} />
                  </button>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
                  {activeTemplate.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontSize: '15px', fontWeight: 600 }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} color="var(--color-success)" strokeWidth={3} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Large Preview Box */}
                <div style={{
                  width: '100%',
                  height: '600px',
                  background: activeTemplate.previewColor,
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Simulated Invoice Graphic */}
                  <div style={{ 
                    width: '65%', height: '85%', 
                    background: 'white', 
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)', 
                    borderRadius: '8px',
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px' }}>
                      <div style={{ width: '100px', height: '40px', background: '#E2E8F0', borderRadius: '6px' }}></div>
                      <div style={{ width: '140px', height: '24px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ width: '240px', height: '60px', background: '#F8FAFC', borderRadius: '6px', marginBottom: '48px' }}></div>
                    <div style={{ flex: 1, borderTop: '2px solid #F1F5F9', paddingTop: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '40%', height: '20px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                        <div style={{ width: '20%', height: '20px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '60%', height: '20px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                        <div style={{ width: '20%', height: '20px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '50%', height: '20px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                        <div style={{ width: '20%', height: '20px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '2px solid #F1F5F9', paddingTop: '24px' }}>
                       <div style={{ width: '180px', height: '32px', background: '#E2E8F0', borderRadius: '6px' }}></div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div style={{ position: 'absolute', bottom: '32px', right: '32px', background: 'white', padding: '14px 24px', borderRadius: '100px', boxShadow: '0 12px 30px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '15px', color: 'var(--color-text-title)' }}>
                    <Star size={18} fill="#F59E0B" color="#F59E0B" /> Optimized for {activeTemplate.title}
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
          <div style={{ height: '100px' }}></div>
        </div>

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
