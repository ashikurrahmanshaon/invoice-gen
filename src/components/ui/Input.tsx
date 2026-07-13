import React, { useState, forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline, leftIcon, rightIcon, className = '', value, onChange, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Determine if the floating label should be active
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const isActive = isFocused || hasValue || !!placeholder;

    const Component = multiline ? 'textarea' : 'input';

    return (
      <div className={`premium-input-container ${className}`} style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
        <div 
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-surface)',
            border: `1px solid ${error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: error && isFocused 
              ? 'var(--shadow-focus-error)' 
              : isFocused ? 'var(--shadow-focus)' : 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)',
            minHeight: multiline ? '100px' : '48px',
          }}
        >
          {leftIcon && (
            <div style={{ paddingLeft: '12px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center' }}>
              {leftIcon}
            </div>
          )}
          
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: multiline ? '12px 12px 12px' : '0 12px' }}>
            {label && (
              <label
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: isActive ? (multiline ? '8px' : '6px') : '14px',
                  fontSize: isActive ? '11px' : '14.5px',
                  fontWeight: isActive ? 600 : 400,
                  color: error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  pointerEvents: 'none',
                  transition: 'all var(--transition-fast)',
                  transformOrigin: 'left top',
                  zIndex: 1,
                }}
              >
                {label}
              </label>
            )}
            <Component
              ref={ref as any}
              value={value}
              onChange={onChange}
              placeholder={isFocused ? placeholder : ''}
              onFocus={(e: any) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e: any) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                paddingTop: isActive && !multiline ? '16px' : '0',
                paddingBottom: isActive && !multiline ? '2px' : '0',
                marginTop: multiline && isActive ? '14px' : '0',
                fontSize: '14.5px',
                color: 'var(--color-text-main)',
                fontFamily: 'inherit',
                resize: multiline ? 'vertical' : 'none',
                height: multiline ? '100%' : '100%',
              }}
              {...props as any}
            />
          </div>

          {rightIcon && (
            <div style={{ paddingRight: '12px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center' }}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px', paddingLeft: '4px' }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
