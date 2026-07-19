import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Sentry } from '../config/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary — catches unhandled React rendering errors.
 * Reports to Sentry and shows a user-friendly recovery UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report to Sentry with component stack
    Sentry.withScope(scope => {
      scope.setTag('boundary', 'global');
      scope.setExtra('componentStack', errorInfo.componentStack);
      Sentry.captureException(error);
    });

    // Also log to console for development
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRecover = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: '40px 24px', fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center', maxWidth: '520px', margin: '0 auto'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px', fontSize: '28px'
          }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', marginBottom: '28px' }}>
            An unexpected error occurred. Your draft data is safely stored in your browser 
            and will be restored when you reload.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleRecover}
              style={{
                padding: '10px 24px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
                background: 'white', color: '#334155', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 24px', borderRadius: '8px', border: 'none',
                background: '#00A65A', color: 'white', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Reload Page
            </button>
          </div>
          {this.state.error && import.meta.env.DEV && (
            <pre style={{
              marginTop: '32px', padding: '16px', background: '#F8FAFC', borderRadius: '8px',
              fontSize: '12px', color: '#94A3B8', textAlign: 'left', maxWidth: '100%',
              overflow: 'auto', border: '1px solid #E2E8F0'
            }}>
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
