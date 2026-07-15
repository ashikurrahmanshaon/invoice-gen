import React from 'react';
import { Lock, Globe, User, Zap, Shield } from 'lucide-react';

interface FormStepperProps {
  currentStep: number;
}

const steps = [
  { num: 1, label: 'Business' },
  { num: 2, label: 'Client' },
  { num: 3, label: 'Items' },
  { num: 4, label: 'Review' }
];

export const FormStepper: React.FC<FormStepperProps> = ({ currentStep }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
      
      {/* Stepper with connecting line */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '500px', margin: '32px 0 32px 0' }}>
        {/* Background line connecting first to last step */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', height: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }} />
        
        {steps.map((step) => {
          const isActive = step.num === currentStep;
          
          return (
            <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '64px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: 'var(--color-background)', // Match app background so line is cut
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ 
                  width: '34px', height: '34px', borderRadius: '50%', 
                  backgroundColor: '#fff', 
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '15px',
                  border: isActive ? '2px solid var(--color-primary)' : '2px solid var(--color-border)'
                }}>
                  {step.num}
                </div>
              </div>
              <span style={{ 
                position: 'absolute', top: '48px',
                fontSize: '15px', fontWeight: isActive ? 600 : 500, 
                color: isActive ? 'var(--color-text-title)' : 'var(--color-text-secondary)',
                whiteSpace: 'nowrap'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Badges Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
        <div className="badge-pill"><Lock size={14} /> Secure</div>
        <div className="badge-pill"><Globe size={14} /> Browser Based</div>
        <div className="badge-pill"><User size={14} /> No Signup</div>
        <div className="badge-pill"><Zap size={14} /> Instant PDF</div>
        <div className="badge-pill"><Shield size={14} /> Privacy</div>
      </div>
    </div>
  );
};
