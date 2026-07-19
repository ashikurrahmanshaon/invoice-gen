import { useState, Suspense, useEffect } from 'react';
import { Eye, Download, ShieldCheck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { StageIndicator } from '../layout/StageIndicator';
import { BusinessSection } from '../invoice/BusinessSection';
import { QuoteDetailsSection } from './QuoteDetailsSection';
import { ClientSection } from '../invoice/ClientSection';
import { ItemsSection } from '../invoice/ItemsSection';
import { TotalsSection } from '../invoice/TotalsSection';
import { MobileWizard } from '../mobile/MobileWizard';
import { HistoryDashboard } from '../history/HistoryDashboard';
import { useQuote } from '../../hooks/useQuote';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useClients } from '../../hooks/useClients';
import { useHistory } from '../../hooks/useHistory';
import { FullPreviewModal } from '../invoice/FullPreviewModal';
import { HelpGuideModal } from '../help/HelpGuideModal';
import { QuoteA4Preview } from '../quote/QuoteA4Preview';
import { SettingsDashboard } from '../settings/SettingsDashboard';
import { Modal } from '../ui/Modal';
import { generateQuotePDF } from '../../utils/pdfGenerator';
import { generateQuoteNumber } from '../../utils/quoteNumber';
import type { QuoteData, SavedQuote } from '../../types/quote';
import type { InvoiceData } from '../../types/invoice';
import { trackEvent, trackFunnelStep } from '../../utils/analytics';
import { useSettings } from '../../contexts/SettingsContext';

export function QuoteGenerator() {
  const [currentStage, setCurrentStage] = useState(1);

  // Track funnel steps
  const handleStageChange = (stage: number) => {
    setCurrentStage(stage);
    const labels = ['Business', 'Client', 'Items', 'Review'];
    trackFunnelStep(stage, labels[stage - 1] || '');

    if (typeof window !== 'undefined') {
      if (!isMobileView) {
        setTimeout(() => {
          const el = document.getElementById(`section-${stage}`);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 180; // offset for sticky header + sticky stage indicator
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 0);
      } else {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
      }
    }
  };
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  const [activeView, setActiveView] = useState<'editor' | 'history' | 'settings'>('editor');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [resetHistoryAlso, setResetHistoryAlso] = useState(false);
  const [historyRecordToDelete, setHistoryRecordToDelete] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobileView(window.innerWidth <= 1024);
      const handleResize = () => {
        setIsMobileView(window.innerWidth <= 1024);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const { settings } = useSettings();

  const { 
    data, 
    selectedSavedClientId,
    setSelectedSavedClientId,
    updateBusiness, 
    updateClient, 
    updateDetails, 
    updateOtherFields,
    addItem, 
    updateItem, 
    removeItem, 
    setDiscount,
    setTaxRate,
    setTaxLabel,
    setShipping,
    setAmountPaid,
    resetEverything,
    isDirty,
    loadInvoiceFromHistory
  } = useQuote(settings);

  const handleDownload = async () => {
    if (data.items.length === 0) {
      setToastMessage({ text: 'Please add at least one invoice item.', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    const invalidQty = data.items.find(item => Number(item.quantity) <= 0);
    if (invalidQty) {
      setToastMessage({ text: 'Quantity must be greater than 0.', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    const invalidPrice = data.items.find(item => Number(item.rate) <= 0);
    if (invalidPrice) {
      setToastMessage({ text: 'Price must be greater than 0.', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    
    try {
      setIsGenerating(true);
      trackEvent('download_pdf', { source: 'homepage' });
      await generateQuotePDF(data as any);
      setToastMessage({ text: 'Invoice PDF generated successfully.', type: 'success' });
      setTimeout(() => setToastMessage(null), 4000);
    } catch (_err) {
      setToastMessage({ text: 'An error occurred while generating PDF.', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };
  const clientHook = useClients();
  const historyHook = useHistory();

  // Enable Auto-save
  const { cancelPendingSave } = useAutoSave(data);

  const executePendingAction = () => {
    if (pendingAction) pendingAction();
    setShowUnsavedModal(false);
    setPendingAction(null);
  };

  const cancelPendingAction = () => {
    setShowUnsavedModal(false);
    setPendingAction(null);
  };

  const attemptAction = (action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action);
      setShowUnsavedModal(true);
    } else {
      action();
    }
  };

  const handleResetConfirm = () => {
    cancelPendingSave();
    resetEverything();
    clientHook.setClients([]);
    if (resetHistoryAlso) {
      historyHook.refreshHistory(); 
    }
    setCurrentStage(1);
    setActiveView('editor');
    setShowResetModal(false);
  };

  const { updateNestedSetting } = useSettings();

  const handleUpdateDetails = (updates: Partial<InvoiceData['details']>) => {
    if (updates.currency) {
      updateNestedSetting('localization', { currency: updates.currency });
    }
    updateDetails(updates);
  };

  const handleEditHistoryRecord = (invoice: SavedQuote) => {
    attemptAction(() => {
      loadInvoiceFromHistory(invoice.id, invoice.data);
      setCurrentStage(1);
      setActiveView('editor');
    });
  };
  const handleDuplicateHistoryRecord = (invoice: SavedQuote) => {
    attemptAction(() => {
      const details = invoice?.data?.details || {};
      const duplicatedData = {
        ...invoice?.data,
        business: invoice?.data?.business,
        client: invoice?.data?.client,
        totals: {
          ...data.totals,
          shipping: data.totals.shipping || 0,
        },
        details: {
          ...details,
          quoteNumber: generateQuoteNumber(),
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
      };
      loadInvoiceFromHistory(null as any, duplicatedData as any); 
      setCurrentStage(1);
      setActiveView('editor');
    });
  };

  const loadDemoData = () => {
    const demoData: QuoteData = {
      business: {
        name: 'Acme Design Studio',
        email: 'hello@acmedesign.com',
        logoUrl: null,
        phone: '(415) 555-0198',
        website: 'acmedesign.com',
        taxId: 'US-99882211',
        address: "123 Creative Blvd\nSan Francisco, CA 94107",
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      client: {
        name: 'John Smith',
        email: 'john.smith@abccompany.com',
        address: "ABC Company\n456 Business Pkwy\nNew York, NY 10001",
        phone: '+1 (555) 014-9988',
        taxId: 'US-11223344'
      },
      details: {
        quoteNumber: 'PO-2026-042',
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'USD'
      },
      items: [
        {
          id: 'demo-item-1',
          name: 'Website Design',
          description: 'Homepage and core inner pages.',
          rate: '2500',
          quantity: '1'
        },
        {
          id: 'demo-item-2',
          name: 'Logo Design',
          description: 'Brand identity package.',
          rate: '1500',
          quantity: '1'
        },
        {
          id: 'demo-item-3',
          name: 'Hosting',
          description: '1 year premium hosting.',
          rate: '25',
          quantity: '12'
        }
      ],
      totals: {
        subtotal: 4300,
        discountRate: 0,
        discountType: 'percent' as const,
        discountValue: '0',
        discountAmount: 0,
        taxLabel: 'Tax',
        taxRate: '8.5',
        taxAmount: 365.5,
        total: 4665.5,
        shipping: 0
      },
      notes: 'Thank you for choosing Acme Design Studio. We appreciate your partnership!',
      terms: 'Payment is due within 14 days of invoice date. Late payments are subject to a 1.5% fee per month.',
      signatureUrl: null
    };
    loadInvoiceFromHistory('', demoData);
  };

  return (
    <div className="invoice-generator">
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toastMessage && (
          <div style={{ padding: '12px 16px', background: toastMessage.type === 'error' ? 'var(--color-error, #EF4444)' : '#00A65A', color: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }} role="alert">
            {toastMessage.type === 'success' && <span>✓</span>}
            {toastMessage.text}
          </div>
        )}
      </div>

      <main className="container" id="generator" style={{ minWidth: 0 }}>

        
        {activeView === 'editor' && (!data.business.name && !data.client.name && data.items.length === 0) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <button 
              className="btn hover-lift" 
              onClick={loadDemoData}
              style={{ background: 'transparent', color: '#3B82F6', border: '1px dashed #3B82F6', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              Load Sample Invoice
            </button>
          </div>
        )}
        {activeView === 'settings' ? (
          <Suspense fallback={<div className="loading-state">Loading settings...</div>}>
            <SettingsDashboard />
          </Suspense>
        ) : activeView === 'editor' ? (
          <div className="workspace-layout">
            {isMobileView ? (
              <div style={{ width: '100%', minWidth: 0 }}>
                <MobileWizard 
                  currentStage={currentStage}
                  setStage={handleStageChange}
                  data={{...data, business: data.business, client: data.client} as any}
                  updateBusiness={updateBusiness}
                  updateClient={updateClient}
                  clientHook={clientHook}
                  selectedSavedClientId={selectedSavedClientId}
                  setSelectedSavedClientId={setSelectedSavedClientId}
                  updateDetails={handleUpdateDetails as any}
                  updateOtherFields={updateOtherFields as any}
                  addItem={addItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                  setDiscount={setDiscount}
                  setTaxRate={setTaxRate}
                  setTaxLabel={setTaxLabel}
                  setShipping={setShipping}
                  setAmountPaid={setAmountPaid as any}
                  onDownloadPDF={handleDownload}
                  isGenerating={isGenerating}
                  onOpenFullPreview={() => { trackEvent('preview_invoice', { source: 'mobile' }); setIsPreviewOpen(true); }}
                  documentType="purchase_order"
                />
              </div>
            ) : (
              <>
                <div 
                  className="workspace-main" 
                  style={{ width: '100%' }}
                >
                  <div className="card" style={{ padding: '0' }}>
                    <div style={{
                      position: 'sticky',
                      top: '68px',
                      zIndex: 20,
                      background: 'var(--color-surface)',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                      borderBottom: '1px solid var(--color-border)',
                      padding: '24px 32px 0'
                    }}>
                      <StageIndicator currentStage={currentStage} onStageChange={handleStageChange} isMobile={false} />
                    </div>
                    <div style={{ padding: '24px 32px' }}>
                      <div className="flex-col">
                        {currentStage === 1 && (
                            <div id="section-1">
                              <BusinessSection data={{...data, business: data.business} as any} updateBusiness={updateBusiness} />
                              <QuoteDetailsSection
                                details={data.details}
                                onChange={handleUpdateDetails}
                              />
                            </div>
                        )}
                        
                        <Suspense fallback={null}>
                          {currentStage === 2 && (
                            <div id="section-2">
                              <ClientSection 
                                data={data as any} 
                                updateClient={updateClient} 
                                clientHook={clientHook}
                                selectedSavedClientId={selectedSavedClientId}
                                setSelectedSavedClientId={setSelectedSavedClientId}
                              />
                            </div>
                          )}
                          
                          {currentStage === 3 && (
                            <div id="section-3">
                              <ItemsSection 
                                items={data.items} 
                                currency={data.details.currency} 
                                addItem={addItem} 
                                removeItem={removeItem} 
                                updateItem={updateItem} 
                              />
                            </div>
                          )}
                          
                          {currentStage === 4 && (
                            <div id="section-4" style={{ padding: '32px 0' }}>
                              <TotalsSection 
                                data={data as any}
                                updateOtherFields={updateOtherFields as any}
                                setDiscount={setDiscount}
                                setTaxRate={setTaxRate}
                                setTaxLabel={setTaxLabel}
                                setShipping={setShipping}
                                setAmountPaid={setAmountPaid as any}
                              />
                            </div>
                          )}
                        </Suspense>

                        {/* Navigation Buttons (Sticky Footer Band) */}
                        <div style={{ 
                          margin: '32px -32px -24px -32px', 
                          padding: '24px 32px', 
                          background: 'var(--color-background)', 
                          borderTop: '1px solid var(--color-border)', 
                          borderBottomLeftRadius: '12px', 
                          borderBottomRightRadius: '12px',
                          display: 'flex', 
                          gap: '16px', 
                          justifyContent: currentStage > 1 ? 'space-between' : 'flex-end',
                          alignItems: 'center'
                        }}>
                          {currentStage > 1 && (
                            <button 
                              className="btn" 
                              onClick={() => handleStageChange(currentStage - 1)}
                              style={{ 
                                minWidth: '120px',
                                height: '48px',
                                borderRadius: '100px',
                                background: 'var(--color-surface)',
                                border: '1.5px solid var(--color-border)',
                                color: 'var(--color-text-main)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                              }}
                            >
                              <ArrowLeft size={16} />
                              Back
                            </button>
                          )}
                          {currentStage < 4 ? (
                            <button 
                              className="btn" 
                              onClick={() => handleStageChange(currentStage + 1)}
                              style={{ 
                                minWidth: '140px',
                                height: '48px',
                                borderRadius: '100px',
                                background: 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)'
                              }}
                            >
                              Continue
                              <ArrowRight size={16} />
                            </button>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => setIsPreviewOpen(true)}
                                style={{
                                  height: '48px',
                                  padding: '0 20px',
                                  background: 'var(--color-border-hover)',
                                  color: 'var(--color-text-title)',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: '8px',
                                  borderRadius: '100px',
                                  border: 'none',
                                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                              >
                                <Eye size={16} /> <span className="hide-on-mobile">Preview</span>
                              </button>
                              <button 
                                onClick={handleDownload}
                                disabled={isGenerating}
                                style={{
                                  height: '48px',
                                  padding: '0 20px',
                                  background: 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: '8px',
                                  borderRadius: '100px',
                                  border: 'none',
                                  boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)',
                                  opacity: isGenerating ? 0.7 : 1,
                                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {isGenerating ? (
                                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                ) : (
                                  <Download size={16} />
                                )}
                                <span className="hide-on-mobile">{isGenerating ? 'Generating...' : 'Download PDF'}</span>
                              </button>
                              <button 
                                onClick={loadDemoData}
                                className="btn btn-secondary"
                                style={{ height: '48px', padding: '0 20px', borderRadius: '100px', fontWeight: 600, fontSize: '14px' }}
                              >
                                Load Sample
                              </button>
                            </div>
                          )}
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}><ShieldCheck size={14}/> 100% Private</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}><Lock size={14}/> Secure</div>
                        </div>
                        </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ marginTop: '24px' }}>
            <Suspense fallback={<div className="loading-state">Loading history...</div>}>
              <HistoryDashboard 
                history={historyHook.history as any}
                onEdit={handleEditHistoryRecord as any}
                onDuplicate={handleDuplicateHistoryRecord as any}
                onDelete={(id) => setHistoryRecordToDelete(id)}
                onUpdateStatus={historyHook.updateStatus as any}
              />
            </Suspense>
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        {isPreviewOpen && (
          <FullPreviewModal 
            isOpen={isPreviewOpen} 
            data={data} 
            onClose={() => setIsPreviewOpen(false)} 
            onDownloadPDF={handleDownload}
            isGenerating={isGenerating}
          />
        )}
      </Suspense>

      <Modal 
        isOpen={showUnsavedModal}
        onClose={cancelPendingAction}
        title="Unsaved Changes"
        message="You have unsaved changes in your active draft. Continuing will discard these changes. Are you sure you want to proceed?"
        type="danger"
        confirmText="Discard changes"
        cancelText="Cancel"
        onConfirm={executePendingAction}
      />

      {showResetModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="card animate-scale-up" style={{ maxWidth: '400px', width: '90%', margin: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ef4444', marginBottom: '16px' }}>Reset Everything</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Are you sure you want to completely reset your active invoice draft, saved business profile, and all saved clients?
            </p>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="resetHistory" 
                checked={resetHistoryAlso} 
                onChange={(e) => setResetHistoryAlso(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="resetHistory" style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                Also delete all Past Invoices (History)
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowResetModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleResetConfirm}>Yes, reset all</button>
            </div>
          </div>
        </div>
      )}

      <Modal 
        isOpen={!!historyRecordToDelete}
        onClose={() => setHistoryRecordToDelete(null)}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice from your history? This action cannot be undone."
        type="danger"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (historyRecordToDelete) {
            historyHook.deleteFromHistory(historyRecordToDelete);
            setHistoryRecordToDelete(null);
          }
        }}
      />
      
      <HelpGuideModal 
        isOpen={isHelpGuideOpen}
        onClose={() => setIsHelpGuideOpen(false)}
      />

      {/* Hidden container for PDF generation (captures layout perfectly regardless of language/fonts) */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -9999, opacity: 0, pointerEvents: 'none' }}>
        <div id="pdf-render-container">
          <QuoteA4Preview data={data as any} scale={1} />
        </div>
      </div>

    </div>
  );

}
