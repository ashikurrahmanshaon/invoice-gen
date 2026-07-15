import React from 'react';
import { Building2, User, List, Eye, ChevronRight } from 'lucide-react';

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
      paddingBottom: isMobile ? '8px' : '24px',
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
        top: isMobile ? '14px' : '16px',
        left: '24px',
        right: '24px',
        height: '1px',
        background: '#E2E8F0',
        zIndex: 1,
      }} />

      {/* Universal Active Line */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '14px' : '16px',
        left: '24px',
        right: '24px',
        height: '1px',
        background: 'transparent',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <div style={{
          height: '100%',
          background: '#00A65A',
          width: `${Math.max(0, (currentStage - 1) / (stages.length - 1)) * 100}%`,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>

      {stages.map((stage) => {
        const isActive = stage.num === currentStage;
        
        // Define colors strictly by requirement
        // Completed: Blue circle, White check
        // Current: White background, Blue border
        // Future: White background, Gray border
        
        let bg = '#FFFFFF';
        let border = '1px solid #E2E8F0';
        let textColor = '#94A3B8';

        if (isActive) {
          bg = '#00A65A';
          border = '1px solid #00A65A';
          textColor = '#FFFFFF';
        }

        const circleSize = isMobile ? '28px' : '32px';

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
              alignItems: 'center',
              gap: '10px',
              cursor: onStageChange ? 'pointer' : 'default',
              position: 'relative',
              zIndex: 3,
              background: 'transparent',
              flex: 1,
              justifyContent: 'center'
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
              animation: isActive ? 'jump-happy 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : 'none',
              boxShadow: isActive ? '0 4px 12px rgba(0, 166, 90, 0.35)' : 'none'
            }}>
              <stage.icon size={isMobile ? 14 : 16} color={textColor} />
            </div>
            
            {/* The Label */}
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: '#FFFFFF', padding: '0 4px' }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isActive ? '#00A65A' : '#334155',
                  lineHeight: '1.2'
                }}>
                  {stage.label}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#94A3B8',
                  lineHeight: '1.2'
                }}>
                  {stage.subtitle}
                </span>
              </div>
            )}

            {/* Next Arrow for Active Stage */}
            {isActive && stage.num < stages.length && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onStageChange?.(stage.num + 1);
                }}
                role="button"
                tabIndex={0}
                aria-label="Next Step"
                style={{
                  marginLeft: '6px',
                  background: '#E8F8F0',
                  border: '1px solid #00A65A',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#00A65A',
                  boxShadow: '0 2px 6px rgba(0,166,90,0.15)',
                  transition: 'all 0.2s',
                  zIndex: 4
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#00A65A';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#E8F8F0';
                  e.currentTarget.style.color = '#00A65A';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Next Step"
              >
                <ChevronRight size={14} strokeWidth={3} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

