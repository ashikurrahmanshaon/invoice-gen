import React, { forwardRef, useEffect, useRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline, leftIcon, rightIcon, className = '', value, onChange, placeholder, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const ref = (forwardedRef || internalRef) as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
    
    const Component = multiline ? 'textarea' : 'input';

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
        {label && <label className="input-label">{label}</label>}
        <div className={`input-wrapper ${error ? 'has-error' : ''} ${multiline ? 'is-multiline' : ''}`}>
          {leftIcon && <div className="input-icon left">{leftIcon}</div>}
          
          <Component
            ref={ref as any}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input-element"
            {...props as any}
          />

          {rightIcon && <div className="input-icon right">{rightIcon}</div>}
        </div>
        {error && <div className="input-error">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
