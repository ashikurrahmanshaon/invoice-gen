import React from 'react';
import { Check } from 'lucide-react';

interface StageIndicatorProps {
  currentStage: number;
  onStageChange?: (stage: number) => void;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({ currentStage, onStageChange }) => {
  const stages = [
    { num: 1, label: 'Business' },
    { num: 2, label: 'Client' },
    { num: 3, label: 'Items' },
    { num: 4, label: 'Review' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      alignItems: 'center',
      padding: '12px 16px',
      background: 'white',
      borderBottom: '1px solid #EAECF0',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {stages.map((stage) => {
        const isActive = stage.num === currentStage;
        const isPast = stage.num < currentStage;
        
        let circleBg = '#FFFFFF';
        let circleBorder = '2px solid #D0D5DD';
        let circleColor = '#667085';

        if (isActive) {
          circleBg = '#155EEF';
          circleBorder = '2px solid #155EEF';
          circleColor = '#FFFFFF';
        } else if (isPast) {
          circleBg = '#ECFDF3';
          circleBorder = '2px solid #12B76A';
          circleColor = '#12B76A';
        }

        return (
          <div 
            key={stage.num} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '4px', 
              textAlign: 'center', 
              cursor: onStageChange ? 'pointer' : 'default' 
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
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              {isPast ? <Check size={14} strokeWidth={3} /> : stage.num}
            </div>
            
            <span 
              style={{ 
                fontSize: '11px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#155EEF' : (isPast ? '#12B76A' : '#98A2B3'),
                transition: 'all 0.2s ease'
              }}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
