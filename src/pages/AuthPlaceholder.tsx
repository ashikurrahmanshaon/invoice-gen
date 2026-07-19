
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from 'react-router-dom';

export const AuthPlaceholder = ({ type }: { type: 'login' | 'signup' }) => {
  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text-title)' }}>
          {type === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', maxWidth: '400px', marginBottom: '32px' }}>
          Authentication is not yet implemented. This is a placeholder page for the {type} flow.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 24px' }}>Return Home</Link>
      </div>
    </AppLayout>
  );
};
