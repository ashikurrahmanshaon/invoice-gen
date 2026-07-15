import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Star, LayoutTemplate, User, Code, Utensils, Activity, Scale, Building2, HardHat, Camera, Briefcase, GraduationCap, Sparkles, Megaphone, Paintbrush, Video, Layers, ChevronRight } from 'lucide-react';
import { INVOICE_TEMPLATES } from '../../config/templates';
import type { InvoiceTemplate, InvoiceData, LineItem } from '../../types/invoice';
import { InvoiceA4Preview } from '../invoice/InvoiceA4Preview';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: InvoiceTemplate, mode: 'style-only' | 'replace-content') => void;
  hasExistingData: boolean;
}

const IconMap: Record<string, React.ElementType> = {
  User, Code, Utensils, Activity, Scale, Building2, HardHat, Camera, Briefcase, GraduationCap, Sparkles, Megaphone, Paintbrush, Video, Layers
};

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({ isOpen, onClose, onSelect, hasExistingData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string | null>(null);
  
  const [hoveredTemplate, setHoveredTemplate] = useState<InvoiceTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [applyMode, setApplyMode] = useState<'style-only' | 'replace-content'>('style-only');

  useEffect(() => {
    const savedFavs = localStorage.getItem('invoice_gen_fav_templates');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedRecent = localStorage.getItem('invoice_gen_recent_template');
    if (savedRecent) setRecent(savedRecent);
  }, [isOpen]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('invoice_gen_fav_templates', JSON.stringify(newFavs));
  };

  const handleSelect = (template: InvoiceTemplate) => {
    if (hasExistingData) {
      setSelectedTemplate(template);
    } else {
      finalizeSelection(template, 'replace-content');
    }
  };

  const finalizeSelection = (template: InvoiceTemplate, mode: 'style-only' | 'replace-content') => {
    localStorage.setItem('invoice_gen_recent_template', template.id);
    onSelect(template, mode);
    setSelectedTemplate(null);
    onClose();
  };

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return INVOICE_TEMPLATES;
    const q = searchQuery.toLowerCase();
    return INVOICE_TEMPLATES.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.useCase.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const sortedTemplates = useMemo(() => {
    return [...filteredTemplates].sort((a, b) => {
      // Recent first
      if (a.id === recent) return -1;
      if (b.id === recent) return 1;
      // Then favorites
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [filteredTemplates, favorites, recent]);

  // Mock data for mini-preview
  const getMockData = (template: InvoiceTemplate): InvoiceData => ({
    business: { name: 'Your Business', email: 'hello@example.com', phone: '', website: '', logoUrl: null },
    client: { name: 'Client Name', email: 'client@example.com', phone: '' },
    details: { invoiceNumber: 'INV-001', issueDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], currency: 'USD', themeColor: template.themeColor },
    items: (template.content.items as LineItem[]).map((i, idx) => ({ ...i, id: `mock-${idx}` })),
    totals: { subtotal: 1000, taxRate: 0, taxAmount: 0, discountType: 'flat', discountValue: 0, discountRate: 0, discountAmount: 0, shipping: 0, amountPaid: 0, total: 1000, balanceDue: 1000 },
    notes: template.content.notes,
    terms: template.content.terms,
    paymentInstructions: template.content.paymentInstructions,
    signatureUrl: null
  });

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(8px)'
    }}>
      <div className="card animate-scale-up" style={{
        width: '95%', maxWidth: '1200px', height: '85vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', padding: 0,
        borderRadius: '24px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>
                Template Gallery
              </h2>
              <p style={{ color: '#64748B', margin: '4px 0 0 0', fontSize: '14px', fontWeight: 500 }}>Choose a professional layout tailored for your industry.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '10px', color: '#64748B', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
            <div style={{ padding: '32px 32px 16px 32px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  placeholder="Search industries, templates, or keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '16px 20px 16px 52px', 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    fontSize: '15px',
                    color: '#0F172A',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  }}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {sortedTemplates.map(template => {
                  const Icon = IconMap[template.icon] || LayoutTemplate;
                  const isFav = favorites.includes(template.id);
                  const isRecent = recent === template.id;
                  const isHovered = hoveredTemplate?.id === template.id;
                  
                  return (
                    <div 
                      key={template.id}
                      onMouseEnter={() => setHoveredTemplate(template)}
                      onMouseLeave={() => setHoveredTemplate(null)}
                      onClick={() => handleSelect(template)}
                      style={{ 
                        padding: '24px', 
                        cursor: 'pointer', 
                        border: '2px solid',
                        borderColor: isHovered ? template.themeColor : '#FFFFFF',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        display: 'flex', flexDirection: 'column', gap: '16px',
                        boxShadow: isHovered ? `0 12px 24px ${template.themeColor}20` : '0 4px 12px rgba(0,0,0,0.03)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '52px', height: '52px', 
                          borderRadius: '16px', 
                          background: `linear-gradient(135deg, ${template.themeColor}15 0%, ${template.themeColor}30 100%)`, 
                          color: template.themeColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `inset 0 0 0 1px ${template.themeColor}20`
                        }}>
                          <Icon size={26} />
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(e, template.id)}
                          style={{ 
                            padding: '8px', 
                            color: isFav ? '#F59E0B' : '#CBD5E1',
                            background: isFav ? '#FEF3C7' : 'transparent',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Star size={18} fill={isFav ? '#F59E0B' : 'none'} />
                        </button>
                      </div>
                      
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.3px' }}>
                          {template.name}
                          {isRecent && <span style={{ fontSize: '10px', backgroundColor: '#EEF4FF', color: '#3B82F6', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>RECENT</span>}
                        </h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>{template.description}</p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: template.themeColor, border: '2px solid #FFF', boxShadow: '0 0 0 1px #E2E8F0' }} />
                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Accent: {template.themeColor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Sidebar Preview (Dark Mode) */}
          <div style={{ width: '480px', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A', borderLeft: '1px solid #1E293B', position: 'relative' }}>
            <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live Preview
                </h3>
                {(hoveredTemplate || selectedTemplate) && (
                  <div style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {(hoveredTemplate || selectedTemplate)!.name}
                  </div>
                )}
              </div>
              
              <div style={{ 
                flex: 1, 
                backgroundColor: '#1E293B', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                padding: '24px',
                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.3)'
              }}>
                {(hoveredTemplate || selectedTemplate) ? (
                  <div style={{ 
                    pointerEvents: 'none', 
                    boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    <InvoiceA4Preview data={getMockData((selectedTemplate || hoveredTemplate)!)} scale={0.38} />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '50%' }}>
                      <LayoutTemplate size={48} style={{ opacity: 0.5 }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, lineHeight: 1.5 }}>Hover over any template card<br/>to see it in action.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Apply Modal Overlay */}
        {selectedTemplate && hasExistingData && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10
          }}>
            <div className="animate-scale-up" style={{ textAlign: 'center', maxWidth: '480px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 24px auto',
                backgroundColor: `${selectedTemplate.themeColor}15`, color: selectedTemplate.themeColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {React.createElement(IconMap[selectedTemplate.icon] || LayoutTemplate, { size: 32 })}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Apply {selectedTemplate.name} Template</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5, marginBottom: '32px' }}>
                Your invoice already has content. How would you like to apply this template?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button 
                  onClick={() => setApplyMode('style-only')}
                  style={{ 
                    padding: '20px', borderRadius: '12px', border: '2px solid',
                    borderColor: applyMode === 'style-only' ? 'var(--brand-color)' : 'var(--border-color)',
                    backgroundColor: applyMode === 'style-only' ? '#EEF4FF' : '#FFFFFF',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '16px', marginBottom: '4px' }}>Apply Styling Only</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Update the theme color to {selectedTemplate.themeColor}. Keep all my current notes, terms, and line items.</div>
                </button>
                
                <button 
                  onClick={() => setApplyMode('replace-content')}
                  style={{ 
                    padding: '20px', borderRadius: '12px', border: '2px solid',
                    borderColor: applyMode === 'replace-content' ? 'var(--brand-color)' : 'var(--border-color)',
                    backgroundColor: applyMode === 'replace-content' ? '#EEF4FF' : '#FFFFFF',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '16px', marginBottom: '4px' }}>Replace Content & Styling</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Update the theme color and replace my current notes, terms, and items with the template defaults.</div>
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedTemplate(null)} style={{ padding: '12px 24px' }}>
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => finalizeSelection(selectedTemplate, applyMode)}
                  style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Apply Template <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
