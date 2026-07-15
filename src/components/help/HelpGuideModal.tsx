import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: 'Add Your Business Details',
    description: 'Start by filling in your company information, uploading a logo, and setting the invoice number and dates in the top section.',
    highlightArea: 'business'
  },
  {
    title: 'Enter Client Information',
    description: 'Scroll down to the "Billed To" section and enter your client\'s details. You can even pick a saved client from the dropdown!',
    highlightArea: 'client'
  },
  {
    title: 'Add Invoice Items',
    description: 'Add line items for the services or products you provided. You can add as many as you need, and the totals will calculate automatically.',
    highlightArea: 'items'
  },
  {
    title: 'Preview and Share',
    description: 'Finally, click the green "Preview & Send" button at the bottom to see how your invoice looks. From there, you can download a PDF, JPG, or share via WhatsApp/Email.',
    highlightArea: 'preview'
  }
];

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const isBusiness = steps[currentStep].highlightArea === 'business';
  const isClient = steps[currentStep].highlightArea === 'client';
  const isItems = steps[currentStep].highlightArea === 'items';
  const isPreview = steps[currentStep].highlightArea === 'preview';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <div className="card animate-scale-up" style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '900px', 
        background: '#fff', 
        borderRadius: '24px', 
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: 0 }}>How to generate an invoice</h2>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px', flex: 1, flexDirection: 'row' }}>
          
          {/* Left Column: UI Mockup Wireframe (Realistic Mini Invoice) */}
          <div style={{ 
            flex: 1, 
            background: '#F8FAFC', 
            borderRadius: '16px', 
            border: '1px solid #E2E8F0', 
            padding: '24px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Browser Top Bar Mockup */}
            <div style={{ width: '100%', height: '28px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
              <div style={{ marginLeft: '12px', fontSize: '10px', color: '#64748B', fontWeight: 600, fontFamily: 'monospace' }}>invoice-gen.net / new</div>
            </div>

            {/* Business Section */}
            <div style={{ 
              position: 'relative',
              background: '#fff', 
              border: `2px solid ${isBusiness ? '#00A65A' : 'transparent'}`, 
              borderRadius: '8px', 
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
              boxShadow: isBusiness ? '0 0 0 4px rgba(0, 166, 90, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {isBusiness && <PulsingDot />}
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #00C853, #00A65A)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '20px' }}>
                  C
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Your Company Ltd.</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', lineHeight: '1.4' }}>123 Business Road<br/>Tech City, TC 10010</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '1px' }}>INVOICE</div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', lineHeight: '1.4' }}>#INV-2026-001<br/>Date: Today</div>
              </div>
            </div>

            {/* Client Section */}
            <div style={{ 
              position: 'relative',
              background: '#fff', 
              border: `2px solid ${isClient ? '#00A65A' : 'transparent'}`, 
              borderRadius: '8px', 
              padding: '16px',
              transition: 'all 0.3s ease',
              boxShadow: isClient ? '0 0 0 4px rgba(0, 166, 90, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {isClient && <PulsingDot />}
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Billed To</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>John Doe</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', lineHeight: '1.4' }}>john.doe@example.com<br/>456 Client Avenue, Suite 20</div>
            </div>

            {/* Items Section */}
            <div style={{ 
              position: 'relative',
              background: '#fff', 
              border: `2px solid ${isItems ? '#00A65A' : 'transparent'}`, 
              borderRadius: '8px', 
              padding: '16px',
              transition: 'all 0.3s ease',
              boxShadow: isItems ? '0 0 0 4px rgba(0, 166, 90, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {isItems && <PulsingDot />}
              
              {/* Header */}
              <div style={{ display: 'flex', fontSize: '10px', fontWeight: 600, color: '#94A3B8', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px', marginBottom: '8px', textTransform: 'uppercase' }}>
                <div style={{ flex: 2 }}>Description</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Qty</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
              </div>
              
              {/* Item 1 */}
              <div style={{ display: 'flex', fontSize: '11px', color: '#0F172A', marginBottom: '8px' }}>
                <div style={{ flex: 2, fontWeight: 500 }}>Web Design Services</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#64748B' }}>1</div>
                <div style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>$1,200.00</div>
              </div>
              
              {/* Item 2 */}
              <div style={{ display: 'flex', fontSize: '11px', color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 2, fontWeight: 500 }}>Hosting (1 Year)</div>
                <div style={{ flex: 1, textAlign: 'center', color: '#64748B' }}>1</div>
                <div style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>$150.00</div>
              </div>
              
              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px' }}>
                <div style={{ width: '60%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', marginBottom: '6px' }}>
                    <span>Subtotal</span>
                    <span>$1,350.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0F172A', fontSize: '14px', marginTop: '6px', paddingTop: '6px', borderTop: '2px solid #E2E8F0' }}>
                    <span>Total</span>
                    <span>$1,350.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '48px',
              background: isPreview ? 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)' : '#94A3B8',
              borderRadius: '99px',
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: isPreview ? '0 8px 24px rgba(0, 166, 90, 0.3)' : 'none',
              transform: isPreview ? 'scale(1.02)' : 'scale(1)'
            }}>
              {isPreview && <PulsingDot />}
              Preview & Send
            </div>

          </div>

          {/* Right Column: Instructions */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {steps.map((_, i) => (
                <div 
                  key={i}
                  style={{ 
                    height: '4px', 
                    flex: 1, 
                    borderRadius: '2px',
                    background: i <= currentStep ? '#00A65A' : '#E2E8F0',
                    transition: 'background 0.3s ease'
                  }} 
                />
              ))}
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
                {steps[currentStep].title}
              </h3>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6' }}>
                {steps[currentStep].description}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                style={{
                  padding: '12px 24px',
                  borderRadius: '99px',
                  border: '1px solid #E2E8F0',
                  background: 'transparent',
                  color: currentStep === 0 ? '#CBD5E1' : '#64748B',
                  fontWeight: 600,
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ChevronLeft size={18} /> Back
              </button>
              
              <button 
                onClick={currentStep === steps.length - 1 ? onClose : nextStep} 
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '99px',
                  border: 'none',
                  background: '#00A65A',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0, 166, 90, 0.25)'
                }}
              >
                {currentStep === steps.length - 1 ? (
                  <>Got it, let's start <CheckCircle2 size={18} /></>
                ) : (
                  <>Next Step <ChevronRight size={18} /></>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const PulsingDot = () => (
  <div style={{ position: 'absolute', top: '-10px', right: '-10px', zIndex: 10 }}>
    <div style={{
      width: '24px',
      height: '24px',
      background: '#00A65A',
      borderRadius: '50%',
      border: '4px solid white',
      boxShadow: '0 0 0 0 rgba(0, 166, 90, 0.7)',
      animation: 'pulse-ring 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)'
    }} />
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(0, 166, 90, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 166, 90, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 166, 90, 0); }
      }
    `}} />
  </div>
);
