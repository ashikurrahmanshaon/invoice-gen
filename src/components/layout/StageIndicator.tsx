import React from 'react';
import { Check } from 'lucide-react';

interface StageIndicatorProps {
  currentStage: number;
  onStageChange?: (stage: number) => void;
  isMobile?: boolean;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({ currentStage, onStageChange, isMobile = false }) => {
  const stages = [
    { num: 1, label: 'Business' },
    { num: 2, label: 'Client' },
    { num: 3, label: 'Items' },
    { num: 4, label: 'Review' }
  ];

  if (isMobile) {
    // Premium compact mobile step indicator
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {stages.map((stage, idx) => {
            const isActive = stage.num === currentStage;
            const isPast = stage.num < currentStage;
            const isLast = idx === stages.length - 1;
            
            return (
              <React.Fragment key={stage.num}>
                <div 
                  onClick={() => onStageChange?.(stage.num)}
                  style={{
                    width: isActive ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: isActive ? 'var(--color-primary)' : (isPast ? 'var(--color-primary)' : '#E4E7EC'),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isPast ? 0.5 : 1,
                    cursor: onStageChange ? 'pointer' : 'default'
                  }} 
                />
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginLeft: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {stages[currentStage - 1].label}
        </div>
      </div>
    );
  }

  // Premium Stripe-like desktop step indicator
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 0 24px 0',
      borderBottom: '1px solid var(--color-border)',
      width: '100%'
    }}>
      {stages.map((stage, idx) => {
        const isActive = stage.num === currentStage;
        const isPast = stage.num < currentStage;
        const isLast = idx === stages.length - 1;

        let circleBg = 'transparent';
        let circleBorder = '2px solid #E4E7EC';
        let circleColor = '#98A2B3';

        if (isActive) {
          circleBg = 'var(--color-primary)';
          circleBorder = '2px solid var(--color-primary)';
          circleColor = '#FFFFFF';
        } else if (isPast) {
          circleBg = 'transparent';
          circleBorder = '2px solid var(--color-primary)';
          circleColor = 'var(--color-primary)';
        }

        return (
          <React.Fragment key={stage.num}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: onStageChange ? 'pointer' : 'default',
                opacity: (isActive || isPast) ? 1 : 0.6
              }} 
              onClick={() => onStageChange?.(stage.num)}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: circleBg,
                  border: circleBorder,
                  color: circleColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {isPast ? <Check size={14} strokeWidth={3} /> : stage.num}
              </div>
              <span 
                style={{ 
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: (isActive || isPast) ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {stage.label}
              </span>
            </div>
            
            {!isLast && (
              <div style={{
                flex: 1,
                height: '2px',
                margin: '0 16px',
                background: isPast ? 'var(--color-primary)' : '#E4E7EC',
                borderRadius: '1px',
                transition: 'all 0.3s ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
