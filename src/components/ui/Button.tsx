import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false, 
    className = '', 
    style, 
    disabled, 
    ...props 
  }, ref) => {
    
    // Determine classes based on props
    const baseClass = 'btn';
    
    // Map variants
    let variantClass = '';
    if (variant === 'primary') variantClass = 'btn-primary';
    else if (variant === 'secondary' || variant === 'outline') variantClass = 'btn-outline';
    else if (variant === 'ghost') variantClass = 'btn-ghost';
    else if (variant === 'danger') variantClass = 'btn-danger';

    // Map sizes
    let sizeClass = '';
    if (size === 'sm') sizeClass = 'btn-sm';
    else if (size === 'lg') sizeClass = 'btn-lg'; // Assumes .btn-lg is in globals.css

    const widthStyle = fullWidth ? { width: '100%' } : {};

    const combinedClassName = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClassName}
        style={{ ...widthStyle, ...style }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin" viewBox="0 0 24 24" width="20" height="20" style={{ animation: 'spin 1s linear infinite' }}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
