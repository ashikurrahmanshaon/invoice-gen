import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { Input } from '../../ui/Input';

export const PaymentMethodsSection: React.FC = () => {
  const { settings, updateNestedSetting } = useSettings();
  const pm = settings.paymentMethods;

  const toggleMethod = (method: keyof typeof pm) => () => {
    updateNestedSetting('paymentMethods', {
      [method]: { ...pm[method], enabled: !pm[method].enabled }
    });
  };

  const updateMethod = (method: keyof typeof pm, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNestedSetting('paymentMethods', {
      [method]: { ...pm[method], [field]: e.target.value }
    });
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Payment Methods</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Configure how you want to get paid. Enabled methods will automatically appear on your invoices.
        </p>
      </div>

      <div className="card flex-col gap-5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Bank Transfer</h4>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: '13px', margin: '4px 0 0' }}>Direct bank or wire transfer details.</p>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" id="bank-toggle" checked={pm.bankTransfer.enabled} onChange={toggleMethod('bankTransfer')} />
            <label htmlFor="bank-toggle" />
          </div>
        </div>
        
        {pm.bankTransfer.enabled && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Input label="Bank Name" value={pm.bankTransfer.bankName} onChange={updateMethod('bankTransfer', 'bankName')} placeholder="Chase Bank" />
            <Input label="Account Name" value={pm.bankTransfer.accountName} onChange={updateMethod('bankTransfer', 'accountName')} placeholder="Acme Corp" />
            <Input label="Account Number" value={pm.bankTransfer.accountNumber} onChange={updateMethod('bankTransfer', 'accountNumber')} placeholder="123456789" />
            <Input label="Routing Number" value={pm.bankTransfer.routingNumber} onChange={updateMethod('bankTransfer', 'routingNumber')} placeholder="021000021" />
            <Input label="SWIFT / BIC" value={pm.bankTransfer.swift} onChange={updateMethod('bankTransfer', 'swift')} placeholder="CHASUS33" />
            <Input label="IBAN" value={pm.bankTransfer.iban} onChange={updateMethod('bankTransfer', 'iban')} placeholder="US12CHAS0000123456789" />
          </div>
        )}
      </div>

      <div className="card flex-col gap-5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>PayPal</h4>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: '13px', margin: '4px 0 0' }}>Accept payments via PayPal.</p>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" id="paypal-toggle" checked={pm.paypal.enabled} onChange={toggleMethod('paypal')} />
            <label htmlFor="paypal-toggle" />
          </div>
        </div>
        
        {pm.paypal.enabled && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Input label="PayPal Email" value={pm.paypal.email} onChange={updateMethod('paypal', 'email')} placeholder="billing@acme.com" />
            <Input label="PayPal.Me Link" value={pm.paypal.link} onChange={updateMethod('paypal', 'link')} placeholder="paypal.me/acme" />
          </div>
        )}
      </div>

      <div className="card flex-col gap-5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Stripe / External Payment Link</h4>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: '13px', margin: '4px 0 0' }}>Add a generic payment link for credit cards.</p>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" id="stripe-toggle" checked={pm.stripe.enabled} onChange={toggleMethod('stripe')} />
            <label htmlFor="stripe-toggle" />
          </div>
        </div>
        
        {pm.stripe.enabled && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Payment Link URL" value={pm.stripe.link} onChange={updateMethod('stripe', 'link')} placeholder="https://buy.stripe.com/..." />
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-switch label {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--color-border);
          transition: .3s;
          border-radius: 24px;
        }
        .toggle-switch label:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .toggle-switch input:checked + label {
          background-color: var(--color-primary);
        }
        .toggle-switch input:focus + label {
          box-shadow: 0 0 1px var(--color-primary);
        }
        .toggle-switch input:checked + label:before {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
};
