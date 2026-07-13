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
      paddingBottom: isMobile ? '8px' : '24px',
      width: '100%',
      position: 'relative'
    }}>
      {/* Universal Background Line */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '14px' : '16px',
        left: '24px',
        right: '24px',
        height: '2px',
        background: 'var(--color-border)',
        zIndex: 1,
        borderRadius: '2px'
      }} />

      {/* Universal Active Line */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '14px' : '16px',
        left: '24px',
        right: '24px',
        height: '2px',
        background: 'transparent',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <div style={{
          height: '100%',
          background: 'var(--color-primary)',
          width: `${Math.max(0, (currentStage - 1) / (stages.length - 1)) * 100}%`,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>

      {stages.map((stage) => {
        const isActive = stage.num === currentStage;
        const isPast = stage.num < currentStage;
        
        // Define colors strictly by requirement
        // Completed: Blue circle, White check
        // Current: White background, Blue border
        // Future: White background, Gray border
        
        let bg = '#FFFFFF';
        let border = '2px solid var(--color-border)';

        if (isPast) {
          bg = 'var(--color-primary)';
          border = '2px solid var(--color-primary)';
        } else if (isActive) {
          bg = '#FFFFFF';
          border = '2px solid var(--color-primary)';
        }

        const circleSize = isMobile ? '28px' : '32px';

        return (
          <div 
            key={stage.num}
            onClick={() => onStageChange?.(stage.num)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: onStageChange ? 'pointer' : 'default',
              position: 'relative',
              zIndex: 3,
              background: 'transparent',
              width: '60px' // Ensure uniform spacing containers
            }}
          >
            {/* The Circle */}
            <div style={{
              width: circleSize,
              height: circleSize,
              borderRadius: '50%',
              background: bg,
              border: border,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: 'none' // Explicitly no shadows
            }}>
              {isPast ? (
                <Check size={isMobile ? 14 : 16} color="#FFFFFF" strokeWidth={3} />
              ) : (
                <span style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)' 
                }}>
                  {stage.num}
                </span>
              )}
            </div>
            
            {/* The Label */}
            <span style={{
              fontSize: '12px',
              fontWeight: isActive || isPast ? 600 : 500,
              color: isActive || isPast ? 'var(--color-text-main)' : 'var(--color-text-tertiary)',
              textAlign: 'center',
              transition: 'color 0.3s ease'
            }}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});

