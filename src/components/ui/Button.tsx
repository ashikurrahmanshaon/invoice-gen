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
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    let baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: 500,
      fontFamily: 'var(--font-family)',
      borderRadius: 'var(--radius-lg)',
      transition: 'all 0.15s ease',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      border: 'none',
      position: 'relative',
      overflow: 'hidden',
    };

    // Size variants
    if (size === 'sm') {
      baseStyle = { ...baseStyle, padding: '0 16px', fontSize: '14px', height: '40px', borderRadius: 'var(--radius-md)' };
    } else if (size === 'md') {
      baseStyle = { ...baseStyle, padding: '0 24px', fontSize: '16px', height: '52px' };
    } else if (size === 'lg') {
      baseStyle = { ...baseStyle, padding: '0 32px', fontSize: '18px', height: '60px' };
    }

    // Color variants
    if (variant === 'primary') {
      baseStyle = {
        ...baseStyle,
        background: isHovered && !disabled ? 'var(--color-primary-hover)' : 'var(--color-primary)',
        color: '#FFFFFF',
        transform: isActive && !disabled ? 'scale(0.98)' : 'none',
      };
    } else if (variant === 'secondary' || variant === 'outline') {
      baseStyle = {
        ...baseStyle,
        background: isHovered && !disabled ? 'var(--color-background)' : '#FFFFFF',
        color: 'var(--color-text-main)',
        border: '1px solid var(--color-border)',
        transform: isActive && !disabled ? 'scale(0.98)' : 'none',
      };
    } else if (variant === 'ghost') {
      baseStyle = {
        ...baseStyle,
        background: isHovered && !disabled ? 'rgba(37,99,235,0.05)' : 'transparent',
        color: 'var(--color-primary)',
        transform: isActive && !disabled ? 'scale(0.98)' : 'none',
      };
    } else if (variant === 'danger') {
      baseStyle = {
        ...baseStyle,
        background: isHovered && !disabled ? '#DC2626' : '#EF4444',
        color: '#FFFFFF',
        transform: isActive && !disabled ? 'scale(0.98)' : 'none',
      };
    }

    return (
      <button
        ref={ref}
        className={`premium-btn ${className}`}
        style={{ ...baseStyle, ...style }}
        disabled={disabled || isLoading}
        onMouseEnter={(e) => { setIsHovered(true); props.onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setIsHovered(false); setIsActive(false); props.onMouseLeave?.(e); }}
        onMouseDown={(e) => { setIsActive(true); props.onMouseDown?.(e); }}
        onMouseUp={(e) => { setIsActive(false); props.onMouseUp?.(e); }}
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
