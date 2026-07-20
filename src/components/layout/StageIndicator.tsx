import React from 'react';
import { Building2, User, List, Eye, Check } from 'lucide-react';

interface StageIndicatorProps {
  currentStage: number;
  onStageChange?: (stage: number) => void;
  isMobile?: boolean;
}

export const StageIndicator = React.memo<StageIndicatorProps>(({ currentStage, onStageChange, isMobile = false }) => {
  const stages = [
    { num: 1, label: 'Business', subtitle: 'Your company', icon: Building2 },
    { num: 2, label: 'Client', subtitle: 'Bill to', icon: User },
    { num: 3, label: 'Items', subtitle: 'Add line items', icon: List },
    { num: 4, label: 'Review', subtitle: 'Review & send', icon: Eye }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: isMobile ? '12px' : '16px',
      width: '100%',
      position: 'relative'
    }}>
      <style>{`
        @keyframes jump-happy {
          0% { transform: scale(1) translateY(0); }
          40% { transform: scale(1.1) translateY(-3px); }
          60% { transform: scale(1.02) translateY(1px); }
          80% { transform: scale(1.08) translateY(-1px); }
          100% { transform: scale(1.05) translateY(0); }
        }
      `}</style>
      {/* Universal Background Line */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '16px' : '18px',
        left: '24px',
        right: '24px',
        height: '2.5px',
        background: '#E2E8F0', // Soft solid line instead of dashed
        borderRadius: '2px',
        zIndex: 1,
      }} />

      {/* Universal Active Line */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '16px' : '18px',
        left: '24px',
        right: '24px',
        height: '2.5px',
        background: 'transparent',
        borderRadius: '2px',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <div style={{
          height: '100%',
          background: 'var(--color-primary)',
          width: `${Math.min(100, (currentStage / (stages.length - 1)) * 100)}%`,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>

      {stages.map((stage) => {
        const isActive = stage.num === currentStage;
        const isCompleted = stage.num < currentStage;
        
        let bg = '#F8FAFC';
        let border = '2px solid #E2E8F0';
        let textColor = '#94A3B8';
        let shadow = '0 2px 4px rgba(0,0,0,0.02)';

        if (isActive) {
          bg = '#FFFFFF';
          border = '3px solid var(--color-primary)';
          textColor = 'var(--color-primary)';
          shadow = '0 0 0 6px rgba(0, 166, 90, 0.15), 0 8px 20px rgba(0, 166, 90, 0.3)';
        } else if (isCompleted) {
          bg = 'var(--color-primary)';
          border = '2px solid var(--color-primary)';
          textColor = '#FFFFFF';
          shadow = '0 4px 12px rgba(0, 166, 90, 0.2)';
        }

        const circleSize = isMobile ? '32px' : '40px';

        return (
          <div 
            key={stage.num}
            onClick={() => onStageChange?.(stage.num)}
            role="button"
            tabIndex={0}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Go to ${stage.label} step`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: onStageChange ? 'pointer' : 'default',
              position: 'relative',
              zIndex: 3,
              background: 'transparent',
              flex: 1,
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
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              flexShrink: 0,
              animation: isActive ? 'jump-happy 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : 'none',
              boxShadow: shadow
            }}>
              {isCompleted ? (
                <Check size={isMobile ? 14 : 16} color={textColor} strokeWidth={3} />
              ) : (
                <stage.icon size={isMobile ? 14 : 16} color={textColor} />
              )}
            </div>
            
            {/* The Label (Always display, but size adjusts for mobile) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <span style={{
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                lineHeight: '1.2'
              }}>
                {stage.label}
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
});

