import React from 'react';
import { Check } from 'lucide-react';

interface StageIndicatorProps {
  currentStage: number;
  onStageChange?: (stage: number) => void;
  isMobile?: boolean;
}

export const StageIndicator = React.memo<StageIndicatorProps>(({ currentStage, onStageChange, isMobile = false }) => {
  const stages = [
    { num: 1, label: 'Business' },
    { num: 2, label: 'Client' },
    { num: 3, label: 'Items' },
    { num: 4, label: 'Review' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: isMobile ? '16px' : '24px',
      width: '100%',
      position: 'relative'
    }}>
      {stages.map((stage, index) => {
        const isActive = stage.num === currentStage;
        const isPast = stage.num < currentStage;
        
        let bg = '#FFFFFF';
        let border = '1px solid var(--color-border)';
        let color = 'var(--color-text-secondary)';
        let iconColor = 'var(--color-text-tertiary)';

        if (isPast) {
          bg = 'var(--color-primary)';
          border = '1px solid var(--color-primary)';
          color = '#FFFFFF';
          iconColor = '#FFFFFF';
        } else if (isActive) {
          bg = '#FFFFFF';
          border = '1px solid var(--color-primary)';
          color = 'var(--color-text-main)';
        }

        return (
          <React.Fragment key={stage.num}>
            <div
              onClick={() => onStageChange?.(stage.num)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '8px 12px' : '10px 16px',
                borderRadius: '8px',
                background: bg,
                border: border,
                cursor: onStageChange ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 2,
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {isPast ? (
                <Check size={16} color={iconColor} strokeWidth={3} />
              ) : (
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)' 
                }}>
                  {stage.num}
                </span>
              )}
              {!isMobile && (
                <span style={{
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: color
                }}>
                  {stage.label}
                </span>
              )}
            </div>
            
            {/* Connector Line */}
            {index < stages.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                margin: '0 8px',
                background: 'var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '2px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  background: 'var(--color-primary)',
                  transform: stage.num < currentStage ? 'translateX(0)' : 'translateX(-100%)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

