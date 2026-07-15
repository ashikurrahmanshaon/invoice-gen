import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { InvoiceData, LineItem } from '../../types/invoice';
import { ArrowLeft, ArrowRight, Download, Eye, Lock, Shield, Smartphone } from 'lucide-react';
import type { useClients } from '../../hooks/useClients';
import { StageIndicator } from '../layout/StageIndicator';

// Import Shared Unified Components
import { BusinessSection } from '../invoice/BusinessSection';
import { ClientSection } from '../invoice/ClientSection';
import { ItemsSection } from '../invoice/ItemsSection';
import { TotalsSection } from '../invoice/TotalsSection';

interface MobileWizardProps {
  currentStage: number;
  setStage: (stage: number) => void;
  data: InvoiceData;
  updateBusiness: (updates: Partial<InvoiceData['business']>) => void;
  updateClient: (updates: Partial<InvoiceData['client']>) => void;
  clientHook: ReturnType<typeof useClients>;
  selectedSavedClientId: string | null;
  setSelectedSavedClientId: (id: string | null) => void;
  updateDetails: (updates: Partial<InvoiceData['details']>) => void;
  updateOtherFields: (updates: Partial<Pick<InvoiceData, 'notes' | 'terms' | 'paymentInstructions' | 'signatureUrl'>>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  setDiscount: (value: number | string, type: 'percent' | 'flat') => void;
  setTaxRate: (rate: number | string) => void;
  setTaxLabel: (label: string) => void;
  setShipping: (amount: number | string) => void;
  setAmountPaid: (amount: number | string) => void;
  onDownloadPDF: () => void;
  onOpenFullPreview: () => void;
}

export const MobileWizard: React.FC<MobileWizardProps> = ({
  currentStage, setStage, data, updateBusiness, updateClient, clientHook, selectedSavedClientId, setSelectedSavedClientId, updateDetails,
  updateOtherFields, addItem, removeItem, updateItem,
  setDiscount, setTaxRate, setTaxLabel, setShipping, setAmountPaid, onDownloadPDF, onOpenFullPreview
}) => {
  const [mounted, setMounted] = useState(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        setIsBottomBarVisible(!entries[0].isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px" }
    );
    
    setTimeout(() => {
      const footer = document.getElementById('main-footer') || document.querySelector('footer');
      if (footer) {
        observer.observe(footer);
      }
    }, 500);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mobile-only mobile-step-container" style={{ width: '100%', minWidth: 0, paddingBottom: '240px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Unified Progress System */}
      <StageIndicator currentStage={currentStage} onStageChange={setStage} isMobile={true} />

      {/* STEP 1 — BUSINESS */}
      {currentStage === 1 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>
          <div className="mobile-card" style={{ padding: 'var(--space-4)' }}>
            <BusinessSection 
              data={data}
              updateBusiness={updateBusiness}
              updateDetails={updateDetails}
            />
          </div>
        </div>
      )}

      {/* STEP 2 — CLIENT */}
      {currentStage === 2 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>

          <div className="mobile-card" style={{ padding: 'var(--space-4)' }}>
            <ClientSection
              data={data}
              updateClient={updateClient}
              clientHook={clientHook}
              selectedSavedClientId={selectedSavedClientId}
              setSelectedSavedClientId={setSelectedSavedClientId}
            />
          </div>
        </div>
      )}

      {/* STEP 3 — ITEMS */}
      {currentStage === 3 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>

          <div className="mobile-card" style={{ padding: 'var(--space-4)' }}>
            <ItemsSection
              items={data.items}
              currency={data.details.currency}
              addItem={addItem}
              removeItem={removeItem}
              updateItem={updateItem}
            />
          </div>
        </div>
      )}

      {/* STEP 4 — TOTALS & EXTRAS */}
      {currentStage === 4 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>

          <div className="mobile-card" style={{ padding: 'var(--space-4)' }}>
            <TotalsSection
              data={data}
              updateOtherFields={updateOtherFields}
              setDiscount={setDiscount}
              setTaxRate={setTaxRate}
              setTaxLabel={setTaxLabel}
              setShipping={setShipping}
              setAmountPaid={setAmountPaid}
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      {mounted && createPortal(
        <div 
          className="mobile-only"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            padding: 'var(--space-4)',
            paddingBottom: 'calc(var(--space-4) + env(safe-area-inset-bottom))',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
            zIndex: 100,
            transform: isBottomBarVisible ? 'translateY(0)' : 'translateY(120%)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          {/* Navigation Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: currentStage > 1 ? '1fr 1fr' : '1fr', gap: '12px', width: '100%' }}>
            {currentStage > 1 && (
              <button 
                onClick={() => setStage(currentStage - 1)}
                className="btn"
                style={{ width: '100%', minHeight: '48px', height: '48px', maxHeight: '48px', boxSizing: 'border-box', padding: '0', margin: '0', borderRadius: '100px', background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14.5px', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            
            {currentStage < 4 ? (
              <button 
                onClick={() => setStage(currentStage + 1)}
                className="btn"
                style={{ width: '100%', minHeight: '48px', height: '48px', maxHeight: '48px', boxSizing: 'border-box', padding: '0', margin: '0', borderRadius: '100px', background: 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14.5px', fontWeight: 600, boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)' }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={onOpenFullPreview}
                className="btn"
                style={{ width: '100%', minHeight: '48px', height: '48px', maxHeight: '48px', boxSizing: 'border-box', padding: '0', margin: '0', borderRadius: '100px', background: 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)', color: 'white', border: 'none', fontSize: '14.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)' }}
              >
                <Eye size={18} />
                Preview Invoice
              </button>
            )}
          </div>

          {/* Download Button */}
          {currentStage === 4 && (
            <div style={{ width: '100%', marginTop: '8px' }}>
              <button 
                onClick={onDownloadPDF}
                className="btn"
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', 
                  color: 'white', 
                  minHeight: '48px', 
                  height: '48px',
                  maxHeight: '48px',
                  boxSizing: 'border-box',
                  padding: '0',
                  margin: '0',
                  borderRadius: '100px',
                  border: 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)'
                }}
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
