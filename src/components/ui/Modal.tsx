import React from 'react';
import { X, Info, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'danger';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  onConfirm, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  type = 'info' 
}) => {
  const previousFocus = React.useRef<HTMLElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      // Focus first element
      setTimeout(() => {
        const focusable = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable?.[0] as HTMLElement;
        if (first) first.focus();
      }, 10);
    } else if (previousFocus.current) {
      previousFocus.current.focus();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === document.body) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(16, 24, 40, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div ref={modalRef} className="card animate-scale-up" role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{
        width: '90%',
        maxWidth: '400px',
        margin: 'auto',
        padding: 'var(--space-6)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          className="btn btn-ghost"
          style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', padding: 'var(--space-1)' }}
        >
          <X size={20} className="text-secondary" />
        </button>
        
        <div className="flex items-start gap-4">
          <div style={{
            background: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(21, 94, 239, 0.1)',
            padding: 'var(--space-2)',
            borderRadius: '50%',
            flexShrink: 0
          }}>
            {isDanger ? (
              <AlertTriangle size={24} color="#ef4444" />
            ) : (
              <Info size={24} className="text-primary" />
            )}
          </div>
          <div style={{ width: '100%' }}>
            <h3 id="modal-title" className="font-bold text-lg" style={{ marginBottom: 'var(--space-2)' }}>{title}</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
              {message}
            </p>
            {onConfirm ? (
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', width: '100%' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
                  {cancelText}
                </button>
                <button 
                  className="btn" 
                  style={{ 
                    flex: 1, 
                    backgroundColor: isDanger ? 'var(--color-danger)' : 'var(--color-primary)', 
                    color: '#FFFFFF', 
                    border: 'none' 
                  }} 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  {confirmText}
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
                Understood
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
