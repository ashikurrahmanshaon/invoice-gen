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

  if (isMobile) {
    // Premium animated mobile step indicator
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
          {stages.map((stage) => {
            const isActive = stage.num === currentStage;
            const isPast = stage.num < currentStage;
            
            return (
              <React.Fragment key={stage.num}>
                <div 
                  onClick={() => onStageChange?.(stage.num)}
                  style={{
                    width: isActive ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: isActive ? 'var(--gradient-primary)' : (isPast ? 'var(--color-primary)' : '#E2E8F0'),
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isPast ? 0.6 : 1,
                    cursor: onStageChange ? 'pointer' : 'default',
                    boxShadow: isActive ? '0 2px 4px rgba(79, 70, 229, 0.3)' : 'none'
                  }} 
                />
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginLeft: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {stages[currentStage - 1].label}
        </div>
      </div>
    );
  }

  // Premium SaaS-like desktop step indicator
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Spread out to fill container
      gap: '8px',
      padding: '0 0 24px 0',
      width: '100%',
      position: 'relative'
    }}>
      {/* Background track line */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '24px',
        right: '24px',
        height: '2px',
        background: 'var(--color-border)',
        zIndex: 0,
        borderRadius: '1px'
      }} />
      
      {/* Active progress track */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '24px',
        height: '2px',
        background: 'var(--gradient-primary)',
        width: `calc(${(currentStage - 1) / (stages.length - 1) * 100}% - 48px)`,
        zIndex: 0,
        transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        borderRadius: '1px'
      }} />

      {stages.map((stage) => {
        const isActive = stage.num === currentStage;
        const isPast = stage.num < currentStage;

        let circleBg = 'var(--color-surface)';
        let circleBorder = '2px solid var(--color-border)';
        let circleColor = 'var(--color-text-tertiary)';
        let shadow = 'none';

        if (isActive) {
          circleBg = 'var(--color-surface)';
          circleBorder = '2px solid var(--color-primary)';
          circleColor = 'var(--color-primary)';
          shadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
        } else if (isPast) {
          circleBg = 'var(--gradient-primary)';
          circleBorder = '2px solid var(--color-primary)';
          circleColor = '#FFFFFF';
        }

        return (
          <div 
            key={stage.num}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', 
              gap: '8px', 
              cursor: onStageChange ? 'pointer' : 'default',
              opacity: (isActive || isPast) ? 1 : 0.6,
              transition: 'all 0.3s ease',
              zIndex: 1,
              width: '80px' // fixed width to center labels under circles
            }} 
            onClick={() => onStageChange?.(stage.num)}
          >
            <div 
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: circleBg,
                border: circleBorder,
                color: circleColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: shadow
              }}
            >
              {isPast ? <Check size={14} strokeWidth={3} /> : stage.num}
            </div>
            <span 
              style={{ 
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: (isActive || isPast) ? 'var(--color-text-main)' : 'var(--color-text-tertiary)',
                transition: 'color 0.2s ease',
                textAlign: 'center'
              }}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});

