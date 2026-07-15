import React from 'react';

interface StageIndicatorProps {
  currentStage: number;
  onStageChange?: (stage: number) => void;
  isMobile?: boolean;
}

export const StageIndicator = React.memo<StageIndicatorProps>(({ currentStage, onStageChange, isMobile = false }) => {
  const stages = [
    { num: 1, label: 'Business', subtitle: 'Your company' },
    { num: 2, label: 'Client', subtitle: 'Bill to' },
    { num: 3, label: 'Items', subtitle: 'Add line items' },
    { num: 4, label: 'Review', subtitle: 'Review & send' }
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
          background: 'var(--color-primary)',
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
        let textColor = '#64748B';

        if (isActive) {
          bg = '#2563EB'; // Primary Blue
          border = '1px solid #2563EB';
          textColor = '#FFFFFF';
        }

        const circleSize = isMobile ? '28px' : '36px';

        return (
          <div 
            key={stage.num}
            onClick={() => onStageChange?.(stage.num)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
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
              transition: 'all 0.3s ease',
              boxShadow: 'none',
              flexShrink: 0
            }}>
              <span style={{ 
                fontSize: isMobile ? '12px' : '14px', 
                fontWeight: 600,
                color: textColor 
              }}>
                {stage.num}
              </span>
            </div>
            
            {/* The Label */}
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: '#FFFFFF', padding: '0 4px' }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isActive ? '#2563EB' : '#334155',
                  lineHeight: '1.2'
                }}>
                  {stage.label}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#64748B',
                  lineHeight: '1.2'
                }}>
                  {stage.subtitle}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

