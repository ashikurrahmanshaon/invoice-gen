import React, { forwardRef, useEffect, useRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline, leftIcon, rightIcon, className = '', value, onChange, placeholder, id, 'aria-label': ariaLabel, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const ref = (forwardedRef || internalRef) as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
    
    const Component = multiline ? 'textarea' : 'input';
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    useEffect(() => {
      if (multiline && ref.current) {
        const el = ref.current as HTMLTextAreaElement;
        el.style.height = '44px';
        const scrollHeight = el.scrollHeight;
        el.style.height = Math.min(scrollHeight, 180) + 'px';
      }
    }, [value, multiline, ref]);

    return (
      <div className={`input-container ${className}`}>
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}
        <div className={`input-wrapper ${error ? 'has-error' : ''} ${multiline ? 'is-multiline' : ''}`}>
          {leftIcon && <div className="input-icon left">{leftIcon}</div>}
          
          <Component
            id={inputId}
            ref={ref as any}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input-element"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-label={!label ? (ariaLabel || placeholder) : undefined}
            {...props as any}
          />

          {rightIcon && <div className="input-icon right">{rightIcon}</div>}
        </div>
        {error && (
          <div id={errorId} className="input-error" role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={14} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
