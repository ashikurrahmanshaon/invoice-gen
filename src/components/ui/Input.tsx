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
    
    const Component = multiline ? 'textarea' : 'input';

    return (
      <div className={`premium-input-container ${className}`} style={{ width: '100%', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {label && (
          <label
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
            }}
          >
            {label}
          </label>
        )}
        <div 
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-surface)',
            border: `1px solid ${error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--color-border-hover)'}`,
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
            minHeight: multiline ? '100px' : '52px',
          }}
        >
          {leftIcon && (
            <div style={{ paddingLeft: '16px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center' }}>
              {leftIcon}
            </div>
          )}
          
          <Component
            ref={ref as any}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
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
              padding: multiline ? '16px' : '0 16px',
              fontSize: '16px',
              color: 'var(--color-text-main)',
              fontFamily: 'inherit',
              resize: multiline ? 'vertical' : 'none',
              height: multiline ? '100%' : '100%',
            }}
            {...props as any}
          />

          {rightIcon && (
            <div style={{ paddingRight: '16px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center' }}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div style={{ color: 'var(--color-error)', fontSize: '13px' }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
