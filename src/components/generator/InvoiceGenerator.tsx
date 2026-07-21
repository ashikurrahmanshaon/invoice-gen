import { useState, Suspense, useEffect } from 'react';
import { Download, ArrowRight, ArrowLeft, ShieldCheck, RotateCcw, Eye, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { StageIndicator } from '../layout/StageIndicator';
import { BusinessSection } from '../invoice/BusinessSection';
import { InvoiceDetailsSection } from '../invoice/InvoiceDetailsSection';
import { ClientSection } from '../invoice/ClientSection';
import { ItemsSection } from '../invoice/ItemsSection';
import { TotalsSection } from '../invoice/TotalsSection';
import { MobileWizard } from '../mobile/MobileWizard';
import { HistoryDashboard } from '../history/HistoryDashboard';
import { useInvoice } from '../../hooks/useInvoice';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useClients } from '../../hooks/useClients';
import { useHistory } from '../../hooks/useHistory';
import { FullPreviewModal } from '../invoice/FullPreviewModal';
import { InvoiceA4Preview } from '../invoice/InvoiceA4Preview';
import { HelpGuideModal } from '../help/HelpGuideModal';
import { SettingsDashboard } from '../settings/SettingsDashboard';
import { Modal } from '../ui/Modal';
import { generateInvoicePDF, generateInvoiceImage } from '../../utils/pdfGenerator';
import { generateInvoiceNumber } from '../../utils/invoiceNumber';
import type { SavedInvoice, InvoiceData } from '../../types/invoice';
import { trackEvent, trackFunnelStep } from '../../utils/analytics';
import { useSettings } from '../../contexts/SettingsContext';

export function InvoiceGenerator() {
  const [currentStage, setCurrentStage] = useState(1);
  const [searchParams] = useSearchParams();

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
  // const [showNewInvoiceToast, setShowNewInvoiceToast] = useState(false);
  // const [showSaveToast, setShowSaveToast] = useState(false);
  // const [showDuplicateErrorToast, setShowDuplicateErrorToast] = useState(false);
  // const [showQuotaErrorToast, setShowQuotaErrorToast] = useState(false);
  
  const [activeView, setActiveView] = useState<'editor' | 'history' | 'settings'>('editor');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [resetHistoryAlso, setResetHistoryAlso] = useState(false);
  const [historyRecordToDelete, setHistoryRecordToDelete] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [hasDraftRecovery, setHasDraftRecovery] = useState(false);

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobileView(window.innerWidth <= 1024);
      const handleResize = () => {
        setIsMobileView(window.innerWidth <= 1024);
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl/Cmd+Enter → Preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          setIsPreviewOpen(true);
        }
        // Escape → Close modals
        if (e.key === 'Escape') {
          setIsPreviewOpen(false);
          setShowResetModal(false);
        }
        // Ctrl/Cmd+P → Download PDF (prevent browser print)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
          e.preventDefault();
          handleDownload();
        }
        // Ctrl/Cmd+ArrowRight → Next stage
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight' && currentStage < 4) {
          e.preventDefault();
          handleStageChange(currentStage + 1);
        }
        // Ctrl/Cmd+ArrowLeft → Previous stage
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft' && currentStage > 1) {
          e.preventDefault();
          handleStageChange(currentStage - 1);
        }
      };
      // Check for recovered draft
      try {
        const draftStr = localStorage.getItem('invoice_gen_draft');
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          if (draft?.business?.name || draft?.client?.name || (draft?.items && draft.items.length > 1)) {
            setHasDraftRecovery(true);
          }
        }
      } catch { /* ignore parse errors */ }
      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage]);

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
    moveItemUp,
    moveItemDown,
    removeItem, 
    setDiscount,
    setTaxRate,
    setTaxLabel,
    setShipping,
    setAmountPaid,
    // createNewInvoice,
    resetEverything,
    // loadedHistoryId,
    isDirty,
    // setOriginalSnapshotForCurrentData,
    loadInvoiceFromHistory
  } = useInvoice(settings);

  // Initialize from template URL param
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam && !isDirty) {
      updateDetails({ layoutId: templateParam });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isDirty]); // Using isDirty to only set on fresh load

  let itemNameLabel = 'Item name';
  let quantityLabel = 'Quantity';
  let rateLabel = 'Rate';

  if (data.details.layoutId === 'hourly') {
    itemNameLabel = 'Service';
    quantityLabel = 'Hours';
    rateLabel = 'Rate/Hr';
  } else if (data.details.layoutId === 'coffee-shop') {
    itemNameLabel = 'Order Item';
  } else if (data.details.layoutId === 'restaurant') {
    itemNameLabel = 'Menu Item';
  } else if (data.details.layoutId === 'software') {
    itemNameLabel = 'Task / Feature';
    quantityLabel = 'Sprint/Hrs';
  }

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
      await generateInvoicePDF(data);
      setShowSuccessAnim(true);
      setToastMessage({ text: 'Invoice PDF generated successfully!', type: 'success' });
      setTimeout(() => { setToastMessage(null); setShowSuccessAnim(false); }, 4000);
    } catch {
      setToastMessage({ text: 'An error occurred while generating PDF.', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      trackEvent('download_image', { source: 'homepage' });
      await generateInvoiceImage(data);
      setShowSuccessAnim(true);
      setToastMessage({ text: 'Invoice image generated successfully!', type: 'success' });
      setTimeout(() => { setToastMessage(null); setShowSuccessAnim(false); }, 4000);
    } catch {
      setToastMessage({ text: 'An error occurred while generating Image.', type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };
  const clientHook = useClients();
  const historyHook = useHistory();

  // Enable Auto-save
  const { cancelPendingSave, saveStatus } = useAutoSave(data);

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

  // const handleNewInvoice = () => {
  //   attemptAction(() => {
  //     createNewInvoice();
  //     setCurrentStage(1);
  //     setActiveView('editor');
  //     trackEvent('generate_invoice');
  //     
  //     // Show toast for 3 seconds
  //     // setShowNewInvoiceToast(true);
  //     // setTimeout(() => {
  //     //   setShowNewInvoiceToast(false);
  //     // }, 3000);
  //   });
  // };

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

  // const handleSave = () => {
  //   const result = historyHook.saveToHistory(data, 'Saved', loadedHistoryId);
  //   if (result.success && result.id) {
  //     setOriginalSnapshotForCurrentData(data, result.id);
  //     trackEvent('save_draft', { source: 'manual' });
  //     setShowSaveToast(true);
  //     setTimeout(() => setShowSaveToast(false), 3000);
  //   } else if (result.error === 'duplicate_number') {
  //     setShowDuplicateErrorToast(true);
  //     setTimeout(() => setShowDuplicateErrorToast(false), 3000);
  //   } else if (result.error === 'quota_exceeded') {
  //     setShowQuotaErrorToast(true);
  //     setTimeout(() => setShowQuotaErrorToast(false), 3000);
  //   }
  // };

  const { updateNestedSetting } = useSettings();

  const handleUpdateDetails = (updates: Partial<InvoiceData['details']>) => {
    if (updates.currency) {
      updateNestedSetting('localization', { currency: updates.currency });
    }
    updateDetails(updates);
  };

  // const handleSaveAsNew = () => {
  //   const result = historyHook.saveToHistory(
  //     {
  //       ...data,
  //       details: {
  //         ...data.details,
  //         invoiceNumber: generateInvoiceNumber(data.details.invoiceNumber) // Generate fresh number to avoid collision
  //       }
  //     }, 
  //     'Saved', 
  //     null
  //   );
  //   if (result.success && result.id) {
  //     const newData = {
  //       ...data,
  //       details: {
  //         ...data.details,
  //         invoiceNumber: generateInvoiceNumber(data.details.invoiceNumber)
  //       }
  //     };
  //     updateDetails({ invoiceNumber: newData.details.invoiceNumber });
  //     setOriginalSnapshotForCurrentData(newData, result.id);
  //     setShowSaveToast(true);
  //     setTimeout(() => setShowSaveToast(false), 3000);
  //   } else if (result.error === 'quota_exceeded') {
  //     setShowQuotaErrorToast(true);
  //     setTimeout(() => setShowQuotaErrorToast(false), 3000);
  //   }
  // };

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



  const loadDemoData = () => {
    const demoData = {
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
        invoiceNumber: 'INV-2026-042',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
        taxLabel: 'Tax',
        taxRate: '8.5',
        shipping: '',
        amountPaid: '',
        discountAmount: 0,
        taxAmount: 365.5,
        total: 4665.5,
        balanceDue: 4665.5
      },
      notes: 'Thank you for choosing Acme Design Studio. We appreciate your partnership!',
      terms: 'Payment is due within 14 days of invoice date. Late payments are subject to a 1.5% fee per month.',
      paymentInstructions: "Direct bank transfer routing details:\nBank: SVB Private\nRouting: 021000021\nAccount: 9988776655",
      signatureUrl: null
    };
    loadInvoiceFromHistory(null as any, demoData);
  };

  return (
    <div className="invoice-generator">
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toastMessage && (
          <div className="toast-enter" style={{ padding: '12px 20px', background: toastMessage.type === 'error' ? 'var(--color-error, #EF4444)' : '#00A65A', color: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }} role="alert">
            {toastMessage.type === 'success' && showSuccessAnim ? (
              <div className="success-ring" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={16} className="success-checkmark" />
              </div>
            ) : toastMessage.type === 'success' ? (
              <CheckCircle size={16} />
            ) : null}
            {toastMessage.text}
          </div>
        )}
      </div>

      <main className="container" id="generator" style={{ minWidth: 0 }}>

        
        {/* Draft Recovery Banner */}
        {activeView === 'editor' && hasDraftRecovery && (!data.business.name && !data.client.name && data.items.length <= 1) && (
          <div className="draft-recovery-banner animate-slide-up">
            <RefreshCw size={16} style={{ color: '#D97706', flexShrink: 0 }} />
            <span>A previously saved draft was recovered automatically.</span>
            <button onClick={() => setHasDraftRecovery(false)}>Dismiss</button>
          </div>
        )}

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
          <Suspense fallback={<div className="skeleton-card" style={{ maxWidth: '800px', margin: '0 auto' }}><div className="skeleton-row"><div className="skeleton skeleton-circle"></div><div style={{ flex: 1 }}><div className="skeleton skeleton-text medium" style={{ marginBottom: '8px' }}></div><div className="skeleton skeleton-text short"></div></div></div><div className="skeleton skeleton-block" style={{ marginBottom: '12px' }}></div><div className="skeleton skeleton-block" style={{ marginBottom: '12px' }}></div><div className="skeleton skeleton-block"></div></div>}>
            <SettingsDashboard />
          </Suspense>
        ) : activeView === 'editor' ? (
          <div className="workspace-layout">
            {isMobileView ? (
              <div style={{ width: '100%', minWidth: 0 }}>
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
                  removeItem={removeItem}
                  updateItem={updateItem}
                  setDiscount={setDiscount}
                  setTaxRate={setTaxRate}
                  setTaxLabel={setTaxLabel}
                  setShipping={setShipping}
                  setAmountPaid={setAmountPaid}
                  onDownloadPDF={handleDownload}
                  onDownloadImage={handleDownloadImage}
                  isGenerating={isGenerating}
                  onOpenFullPreview={() => { trackEvent('preview_invoice', { source: 'mobile' }); setIsPreviewOpen(true); }}
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
                      top: '64px',
                      zIndex: 20,
                      background: 'var(--color-surface)',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                      borderBottom: '1px solid var(--color-border)',
                      padding: '16px 32px 0'
                    }}>
                      <StageIndicator currentStage={currentStage} onStageChange={handleStageChange} isMobile={false} />
                    </div>
                    <div style={{ padding: '24px 32px' }}>


                      <div className="flex-col">
                        {currentStage === 1 && (
                            <div id="section-1">
                              <BusinessSection data={data} updateBusiness={updateBusiness} />
                              <InvoiceDetailsSection data={data} updateDetails={updateDetails} />
                            </div>
                        )}
                        
                        <Suspense fallback={null}>
                          {currentStage === 2 && (
                            <div id="section-2">
                              <ClientSection 
                                data={data} 
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
                                duplicateItem={duplicateItem}
                                moveItemUp={moveItemUp}
                                moveItemDown={moveItemDown}
                                updateItem={updateItem} 
                                itemNameLabel={itemNameLabel}
                                quantityLabel={quantityLabel}
                                rateLabel={rateLabel}
                              />
                            </div>
                          )}
                          
                          {currentStage === 4 && (
                            <div id="section-4" style={{ padding: '32px 0' }}>
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
                          )}
                        </Suspense>

                        {/* Navigation Buttons (Sticky Footer Band) */}
                        <div style={{ 
                          margin: '24px -32px -24px -32px', 
                          padding: '16px 32px', 
                          background: 'rgba(255, 255, 255, 0.92)', 
                          backdropFilter: 'blur(16px)',
                          borderTop: '1px solid var(--color-border)', 
                          borderBottomLeftRadius: '20px', 
                          borderBottomRightRadius: '20px',
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          position: 'sticky',
                          bottom: 0,
                          zIndex: 100
                        }}>
                          {/* Left: Draft Saved */}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: saveStatus === 'error_draft' ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <ShieldCheck size={16} /> {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error_draft' ? 'Save Failed' : 'Draft Saved'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginLeft: '22px' }}>
                              {saveStatus === 'saving' ? '' : 'just now'}
                            </span>
                          </div>

                          {/* Center: Reset */}
                          <button 
                            onClick={() => setShowResetModal(true)}
                            className="btn btn-ghost text-secondary hover-lift"
                            style={{ height: '40px', padding: '0 20px', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <RotateCcw size={14} /> Reset Form
                          </button>

                          {/* Right: Actions */}
                          <div style={{ display: 'flex', gap: '12px' }}>
                            {currentStage > 1 && (
                              <button 
                                className="btn hover-lift" 
                                onClick={() => handleStageChange(currentStage - 1)}
                                style={{ 
                                  height: '40px',
                                  padding: '0 20px',
                                  borderRadius: '100px',
                                  background: 'var(--color-surface)',
                                  border: '1.5px solid var(--color-border)',
                                  color: 'var(--color-text-main)',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <ArrowLeft size={16} /> Back
                              </button>
                            )}
                            
                            {currentStage < 4 ? (
                              <button 
                                className="btn hover-lift" 
                                onClick={() => handleStageChange(currentStage + 1)}
                                style={{ 
                                  height: '40px',
                                  padding: '0 28px',
                                  borderRadius: '100px',
                                  background: 'var(--color-primary)',
                                  color: 'white',
                                  border: 'none',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)'
                                }}
                              >
                                Continue <ArrowRight size={16} />
                              </button>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => setIsPreviewOpen(true)}
                                  className="btn hover-lift"
                                  style={{
                                    height: '48px', padding: '0 20px', background: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1.5px solid var(--color-border)', borderRadius: '100px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
                                  }}
                                  title="Preview (Ctrl+Enter)"
                                >
                                  <Eye size={18} /> Preview
                                </button>
                                <button 
                                  onClick={handleDownloadImage}
                                  disabled={isGenerating}
                                  className="btn hover-lift"
                                  style={{
                                    height: '48px', padding: '0 20px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', opacity: isGenerating ? 0.7 : 1
                                  }}
                                >
                                  <ImageIcon size={18} /> Image
                                </button>
                                <button 
                                  onClick={handleDownload}
                                  disabled={isGenerating}
                                  className="btn hover-lift"
                                  style={{
                                    height: '48px',
                                    padding: '0 24px',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderRadius: '100px',
                                    border: 'none',
                                    boxShadow: '0 4px 14px rgba(0, 166, 90, 0.25)',
                                    opacity: isGenerating ? 0.7 : 1,
                                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                                  }}
                                  title="Download PDF (Ctrl+P)"
                                >
                                  {isGenerating ? (
                                    <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
                                      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                    </div>
                                  ) : (
                                    <Download size={18} />
                                  )}
                                  {isGenerating ? 'Generating...' : 'PDF'}
                                </button>
                              </div>
                            )}
                          </div>
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
              <Suspense fallback={<div className="skeleton-card"><div className="skeleton-row"><div className="skeleton skeleton-circle"></div><div style={{ flex: 1 }}><div className="skeleton skeleton-text medium" style={{ marginBottom: '8px' }}></div><div className="skeleton skeleton-text short"></div></div></div><div className="skeleton skeleton-row"><div className="skeleton skeleton-circle"></div><div style={{ flex: 1 }}><div className="skeleton skeleton-text" style={{ marginBottom: '8px' }}></div><div className="skeleton skeleton-text short"></div></div></div></div>}>
              <HistoryDashboard 
                history={historyHook.history}
                onEdit={handleEditHistoryRecord}
                onDuplicate={handleDuplicateHistoryRecord}
                onDelete={(id) => setHistoryRecordToDelete(id)}
                onUpdateStatus={historyHook.updateStatus}
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

      <FullPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={data}
        onDownloadPDF={handleDownload}
        isGenerating={isGenerating}
      />

      {/* Hidden container for PDF generation (captures layout perfectly regardless of language/fonts) */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -9999, opacity: 0, pointerEvents: 'none' }}>
        <div id="pdf-render-container">
          <InvoiceA4Preview data={data} scale={1} />
        </div>
      </div>

    </div>
  );
}

