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
      backgroundColor: 'rgba(16, 24, 40, 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(4px)'
    }}>
      <div className="card animate-scale-up" style={{
        width: '95%', maxWidth: '1000px', height: '85vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', padding: 0
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutTemplate size={24} className="text-brand" />
              Template Gallery
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Choose a professional layout tailored for your industry.</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', backgroundColor: '#F8FAFC' }}>
            <div style={{ padding: '24px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Search industries, templates, or keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '44px', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {sortedTemplates.map(template => {
                  const Icon = IconMap[template.icon] || LayoutTemplate;
                  const isFav = favorites.includes(template.id);
                  const isRecent = recent === template.id;
                  
                  return (
                    <div 
                      key={template.id}
                      className="card hover-lift"
                      onMouseEnter={() => setHoveredTemplate(template)}
                      onClick={() => handleSelect(template)}
                      style={{ 
                        padding: '16px', 
                        cursor: 'pointer', 
                        border: '1px solid',
                        borderColor: 'var(--border-color)',
                        display: 'flex', flexDirection: 'column', gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '40px', height: '40px', 
                          borderRadius: '8px', 
                          backgroundColor: `${template.themeColor}15`, 
                          color: template.themeColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon size={20} />
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(e, template.id)}
                          className="btn btn-ghost" 
                          style={{ padding: '4px', color: isFav ? '#F59E0B' : '#CBD5E1' }}
                        >
                          <Star size={18} fill={isFav ? '#F59E0B' : 'none'} />
                        </button>
                      </div>
                      
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {template.name}
                          {isRecent && <span style={{ fontSize: '10px', backgroundColor: '#EEF4FF', color: '#155EEF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>RECENT</span>}
                        </h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{template.description}</p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: template.themeColor }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Accent Color</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Sidebar Preview */}
          <div style={{ width: '380px', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Preview
              </h3>
              <div style={{ flex: 1, backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                {(hoveredTemplate || selectedTemplate) ? (
                  <div style={{ pointerEvents: 'none', transform: 'scale(0.35)', transformOrigin: 'top center' }}>
                    <InvoiceA4Preview data={getMockData((selectedTemplate || hoveredTemplate)!)} scale={1} />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <LayoutTemplate size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>Hover over a template<br/>to see a preview.</p>
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
