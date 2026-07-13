import { useState, Suspense, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StageIndicator } from '../components/layout/StageIndicator';

import { BusinessSection } from '../components/invoice/BusinessSection';

import { ClientSection } from '../components/invoice/ClientSection';
import { ItemsSection } from '../components/invoice/ItemsSection';
import { TotalsSection } from '../components/invoice/TotalsSection';

import { PreviewSidebar } from '../components/invoice/PreviewSidebar';
import { MobileWizard } from '../components/mobile/MobileWizard';
// import { MobileWizard } from '../components/mobile/MobileWizard';
import { HistoryDashboard } from '../components/history/HistoryDashboard';

import { useInvoice } from '../hooks/useInvoice';
import { useAutoSave } from '../hooks/useAutoSave';
import { useClients } from '../hooks/useClients';
import { useHistory } from '../hooks/useHistory';

import { FullPreviewModal } from '../components/invoice/FullPreviewModal';
import { TemplateGalleryModal } from '../components/templates/TemplateGalleryModal';
import { SetupWizard } from '../components/wizard/SetupWizard';
import { SettingsDashboard } from '../components/settings/SettingsDashboard';
import { Modal } from '../components/ui/Modal';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { generateInvoiceNumber } from '../utils/invoiceNumber';
import type { SavedInvoice, InvoiceData, InvoiceTemplate } from '../types/invoice';
import { trackEvent, trackFunnelStep } from '../utils/analytics';
import { useSettings } from '../contexts/SettingsContext';





import { SEO } from '../components/seo/SEO';
import { INVOICE_TEMPLATES } from '../config/templates';

export default function HomePage() {
  const [currentStage, setCurrentStage] = useState(1);

  // Track funnel steps
  const handleStageChange = (stage: number) => {
    setCurrentStage(stage);
    const labels = ['Business', 'Client', 'Items', 'Review'];
    trackFunnelStep(stage, labels[stage - 1] || '');
  };
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNewInvoiceToast, setShowNewInvoiceToast] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showDuplicateErrorToast, setShowDuplicateErrorToast] = useState(false);
  const [showQuotaErrorToast, setShowQuotaErrorToast] = useState(false);
  
  const [activeView, setActiveView] = useState<'editor' | 'history' | 'settings'>('editor');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [resetHistoryAlso, setResetHistoryAlso] = useState(false);
  const [historyRecordToDelete, setHistoryRecordToDelete] = useState<string | null>(null);

  const [isMobileView, setIsMobileView] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobileView(window.innerWidth <= 768);
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
    duplicateItem, 
    removeItem, 
    setItems,
    setDiscount,
    setTaxRate,
    setTaxLabel,
    setShipping,
    setAmountPaid,
    createNewInvoice,
    resetEverything,
    loadedHistoryId,
    isDirty,
    setOriginalSnapshotForCurrentData,
    loadInvoiceFromHistory
  } = useInvoice(settings);

  const clientHook = useClients();
  const historyHook = useHistory();

  // Enable Auto-save
  const { saveStatus, cancelPendingSave } = useAutoSave(data);

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

  const handleNewInvoice = () => {
    attemptAction(() => {
      createNewInvoice();
      setCurrentStage(1);
      setActiveView('editor');
      trackEvent('generate_invoice');
      
      // Show toast for 3 seconds
      setShowNewInvoiceToast(true);
      setTimeout(() => {
        setShowNewInvoiceToast(false);
      }, 3000);
    });
  };

  const handleResetConfirm = () => {
    resetEverything(cancelPendingSave, resetHistoryAlso);
    clientHook.setClients([]);
    if (resetHistoryAlso) {
      // Clear history array from hook
      historyHook.refreshHistory(); // It will read the empty localStorage
    }
    setCurrentStage(1);
    setActiveView('editor');
    setShowResetModal(false);
  };

  const handleSave = () => {
    const result = historyHook.saveToHistory(data, 'Saved', loadedHistoryId);
    if (result.success && result.id) {
      setOriginalSnapshotForCurrentData(data, result.id);
      trackEvent('save_draft', { source: 'manual' });
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } else if (result.error === 'duplicate_number') {
      setShowDuplicateErrorToast(true);
      setTimeout(() => setShowDuplicateErrorToast(false), 3000);
    } else if (result.error === 'quota_exceeded') {
      setShowQuotaErrorToast(true);
      setTimeout(() => setShowQuotaErrorToast(false), 3000);
    }
  };

  const { updateNestedSetting } = useSettings();

  const handleUpdateDetails = (updates: Partial<InvoiceData['details']>) => {
    if (updates.currency) {
      updateNestedSetting('localization', { currency: updates.currency });
    }
    updateDetails(updates);
  };

  const handleSaveAsNew = () => {
    const result = historyHook.saveToHistory(
      {
        ...data,
        details: {
          ...data.details,
          invoiceNumber: generateInvoiceNumber(data.details.invoiceNumber) // Generate fresh number to avoid collision
        }
      }, 
      'Saved', 
      null
    );
    if (result.success && result.id) {
      // Update our current editor state to match the newly generated invoice number and history ID
      const newData = {
        ...data,
        details: {
          ...data.details,
          invoiceNumber: generateInvoiceNumber(data.details.invoiceNumber)
        }
      };
      // We must explicitly set this in the hook so the UI reflects the new number
      updateDetails({ invoiceNumber: newData.details.invoiceNumber });
      setOriginalSnapshotForCurrentData(newData, result.id);
      
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } else if (result.error === 'quota_exceeded') {
      setShowQuotaErrorToast(true);
      setTimeout(() => setShowQuotaErrorToast(false), 3000);
    }
  };

  const handleEditHistoryRecord = (invoice: SavedInvoice) => {
    attemptAction(() => {
      loadInvoiceFromHistory(invoice.id, invoice.data);
      setCurrentStage(1);
      setActiveView('editor');
    });
  };

  const handleDuplicateHistoryRecord = (invoice: SavedInvoice) => {
    attemptAction(() => {
      const details = invoice?.data?.details || {};
      const duplicatedData = {
        ...invoice?.data,
        details: {
          ...details,
          invoiceNumber: generateInvoiceNumber(details.invoiceNumber || ''),
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
      };
      loadInvoiceFromHistory(null as any, duplicatedData as any); // Pass null to detach from history
      setCurrentStage(1);
      setActiveView('editor');
    });
  };

  const handleTemplateSelect = (template: InvoiceTemplate, mode: 'style-only' | 'replace-content') => {
    updateDetails({ themeColor: template.themeColor });
    if (mode === 'replace-content') {
      updateOtherFields({
        notes: template.content.notes,
        terms: template.content.terms,
        paymentInstructions: template.content.paymentInstructions
      });
      // Optionally update items if they chose replace-content and the invoice is empty
      // Actually, if mode is replace-content, we replace items.
      const newItems = template.content.items.map((item, idx) => ({
        ...item,
        id: `template-item-${Date.now()}-${idx}`
      }));
      // updateOtherFields can update items because it takes Partial<Omit<InvoiceData, 'business' | 'client' | 'details'>>
      // which includes `items`. Let's just use updateOtherFields for all content updates!
      updateOtherFields({
        notes: template.content.notes,
        terms: template.content.terms,
        paymentInstructions: template.content.paymentInstructions
      });
      setItems(newItems);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nicheParam = params.get('niche');
      if (nicheParam) {
        // Map common niche params to template ids
        let templateId = nicheParam;
        if (templateId === 'freelance') templateId = 'freelancer';
        if (templateId === 'software') templateId = 'software-agency';
        if (templateId === 'contractor') templateId = 'construction';
        if (templateId === 'digital-marketing') templateId = 'marketing';
        if (templateId === 'graphic-designer') templateId = 'creator';
        
        const template = INVOICE_TEMPLATES.find(t => t.id === templateId || t.id.includes(templateId));
        if (template && data.items.length === 0) {
          handleTemplateSelect(template, 'replace-content');
          // Clear query params to prevent re-triggering
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
  }, [data.items.length]);

  const loadDemoData = () => {
    const demoData = {
      business: {
        name: 'DesignCraft Studio LLC',
        email: 'billing@designcraft.co',
        logoUrl: null,
        phone: '+1 (555) 019-2834',
        website: 'designcraft.co',
        taxId: 'US-99882211',
        address: '100 Pine Street',
        address1: '100 Pine Street',
        address2: 'Suite 2400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94111',
        country: 'United States'
      },
      client: {
        name: 'Acme Enterprises Inc.',
        email: 'procurement@acme.com',
        address: "500 Technology Way\nSuite 100\nSeattle, WA 98101",
        phone: '+1 (555) 014-9988',
        taxId: 'US-11223344'
      },
      details: {
        invoiceNumber: 'INV-2026-042',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'USD'
      },
      items: [
        {
          id: 'demo-item-1',
          name: 'Premium UI/UX Design System Retainer',
          description: 'Design, asset guidelines, and component specifications for Web & Mobile applications.',
          rate: '150',
          quantity: '40'
        },
        {
          id: 'demo-item-2',
          name: 'Front-End Component Auditing & Review',
          description: 'Code quality audit, accessibility compliance review, and performance optimizations.',
          rate: '125',
          quantity: '12'
        }
      ],
      totals: {
        subtotal: 7500,
        discountRate: 10,
        discountType: 'percent' as const,
        discountValue: '10',
        taxLabel: 'Tax',
        taxRate: '8.5',
        shipping: '',
        amountPaid: '2000',
        discountAmount: 750,
        taxAmount: 573.75,
        total: 7323.75,
        balanceDue: 5323.75
      },
      notes: 'Thank you for choosing DesignCraft Studio. We appreciate your partnership!',
      terms: 'Payment is due within 14 days of invoice date. Late payments are subject to a 1.5% fee per month.',
      paymentInstructions: "Direct bank transfer routing details:\nBank: SVB Private\nRouting: 021000021\nAccount: 9988776655",
      signatureUrl: null
    };
    loadInvoiceFromHistory(null as any, demoData);
  };

  if (!settings._hasCompletedFirstRun) {
    return (
      <Suspense fallback={null}>
        <SetupWizard onComplete={() => {}} />
      </Suspense>
    );
  }

  return (
    <>
      <SEO 
        title="Free Professional Invoice Generator | Invoice-Gen.net"
        description="Create professional PDF invoices instantly with Invoice-Gen.net. 100% free, secure, browser-based invoice creator with no signup required."
        canonicalUrl="https://invoice-gen.net/"
      />
      <Header 
        onNewInvoice={handleNewInvoice} 
        onChangeTemplate={() => setIsTemplateGalleryOpen(true)}
        onResetEverything={() => setShowResetModal(true)}
        onDownloadPDF={() => setIsPreviewOpen(true)} 
        saveStatus={saveStatus}
        showNewInvoiceToast={showNewInvoiceToast}
        activeView={activeView}
        onViewChange={setActiveView}
        onSave={handleSave}
        onSaveAsNew={handleSaveAsNew}
        hasLoadedHistory={loadedHistoryId !== null}
        onLoadDemo={loadDemoData}
        currentStage={currentStage}
        isMobileView={isMobileView}
      />
      
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {showSaveToast && (
          <div style={{ padding: '12px 16px', background: 'var(--success)', color: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            Invoice saved to history
          </div>
        )}
        {showDuplicateErrorToast && (
          <div style={{ padding: '12px 16px', background: 'var(--error)', color: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            Error: Invoice number already exists in history.
          </div>
        )}
        {showQuotaErrorToast && (
          <div style={{ padding: '12px 16px', background: 'var(--error)', color: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            Storage full. Cannot save to history.
          </div>
        )}
      </div>

      <main className="container" id="generator" style={{ minWidth: 0 }}>
        {activeView === 'settings' ? (
          <Suspense fallback={<div className="loading-state">Loading settings...</div>}>
            <SettingsDashboard />
          </Suspense>
        ) : activeView === 'editor' ? (
          <div className="workspace-layout">
            {isMobileView ? (
              /* Mobile Step-by-Step Flow */
              <div className="mobile-only" style={{ width: '100%', minWidth: 0 }}>
                <MobileWizard 
                  currentStage={currentStage}
                  setStage={handleStageChange}
                  data={data}
                  updateBusiness={updateBusiness}
                  updateClient={updateClient}
                  clientHook={clientHook}
                  selectedSavedClientId={selectedSavedClientId}
                  setSelectedSavedClientId={setSelectedSavedClientId}
                  updateDetails={handleUpdateDetails}
                  updateOtherFields={updateOtherFields}
                  addItem={addItem}
                  duplicateItem={duplicateItem}
                  removeItem={removeItem}
                  updateItem={updateItem}
                  setDiscount={setDiscount}
                  setTaxRate={setTaxRate}
                  setTaxLabel={setTaxLabel}
                  setShipping={setShipping}
                  setAmountPaid={setAmountPaid}
                  onDownloadPDF={() => { trackEvent('download_pdf', { source: 'mobile' }); generateInvoicePDF(data); }}
                  onOpenFullPreview={() => { trackEvent('preview_invoice', { source: 'mobile' }); setIsPreviewOpen(true); }}
                  onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
                />
              </div>
            ) : (
              <>
                {/* Main Desktop Workspace (Wizard) */}
                <div className="workspace-main">
                  <div className="card" style={{ padding: '0' }}>
                    <div style={{ padding: '24px 32px' }}>
                      <StageIndicator currentStage={currentStage} onStageChange={handleStageChange} isMobile={false} />
                      
                      <div className="flex-col" style={{ gap: '40px', marginTop: '32px' }}>
                        {currentStage === 1 && (
                          <BusinessSection data={data} updateBusiness={updateBusiness} updateDetails={updateDetails} onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)} />
                        )}
                        <Suspense fallback={null}>
                          {currentStage === 2 && (
                            <ClientSection 
                              data={data} 
                              updateClient={updateClient} 
                              clientHook={clientHook}
                              selectedSavedClientId={selectedSavedClientId}
                              setSelectedSavedClientId={setSelectedSavedClientId}
                            />
                          )}
                          {currentStage === 3 && (
                            <ItemsSection 
                              items={data.items} 
                              currency={data.details.currency} 
                              addItem={addItem} 
                              duplicateItem={duplicateItem} 
                              removeItem={removeItem} 
                              updateItem={updateItem} 
                            />
                          )}
                          {currentStage === 4 && (
                            <TotalsSection 
                              data={data}
                              updateOtherFields={updateOtherFields}
                              setDiscount={setDiscount}
                              setTaxRate={setTaxRate}
                              setTaxLabel={setTaxLabel}
                              setShipping={setShipping}
                              setAmountPaid={setAmountPaid}
                            />
                          )}
                        </Suspense>
                      </div>
                    </div>

                    {/* Desktop Bottom Action Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px 40px',
                      borderTop: '1px solid var(--color-border)',
                      background: '#F9FAFB',
                      borderBottomLeftRadius: 'var(--radius-xl)',
                      borderBottomRightRadius: 'var(--radius-xl)'
                    }}>
                      <div>
                        {currentStage > 1 && (
                          <button className="btn btn-outline" onClick={() => setCurrentStage(s => Math.max(1, s - 1))} style={{ padding: '0 24px', height: '44px', fontWeight: 600 }}>
                            Back
                          </button>
                        )}
                      </div>
                      <div>
                        {currentStage < 4 ? (
                          <button className="btn btn-primary" onClick={() => setCurrentStage(s => Math.min(4, s + 1))} style={{ padding: '0 32px', height: '44px', fontWeight: 600 }}>
                            Continue
                          </button>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setIsPreviewOpen(true)} style={{ padding: '0 32px', height: '44px', fontWeight: 600 }}>
                              Review Full Invoice
                            </button>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                              🔒 100% secure & local sandbox
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Utility Sidebar (Desktop) */}
                <Suspense fallback={null}>
                  <PreviewSidebar data={data} onOpenFullPreview={() => setIsPreviewOpen(true)} />
                </Suspense>
              </>
            )}
          </div>
        ) : (
          <div style={{ marginTop: '24px' }}>
            <Suspense fallback={<div className="loading-state">Loading history...</div>}>
              <HistoryDashboard 
                history={historyHook.history}
                onEdit={handleEditHistoryRecord}
                onDuplicate={handleDuplicateHistoryRecord}
                onDelete={(id) => setHistoryRecordToDelete(id)}
                onUpdateStatus={historyHook.updateStatus}
                onNewInvoice={handleNewInvoice}
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
            onDownloadPDF={() => generateInvoicePDF(data)}
          />
        )}
        {isTemplateGalleryOpen && (
          <TemplateGalleryModal
            isOpen={isTemplateGalleryOpen}
            onClose={() => setIsTemplateGalleryOpen(false)}
            onSelect={handleTemplateSelect}
            hasExistingData={data.items.length > 0 && (data.items[0].name !== '' || Number(data.items[0].rate) > 0)}
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
      <Footer />
    </>
  );
}

