import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { Input } from '../../ui/Input';

export const BusinessProfileSection: React.FC = () => {
  const { settings, updateNestedSetting } = useSettings();
  const profile = settings.businessProfile;

  const handleChange = (field: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNestedSetting('businessProfile', { [field]: e.target.value });
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Business Profile</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Manage your global business details. These will be pre-filled on all new invoices.
        </p>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          General Information
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <Input label="Business Name" value={profile.name} onChange={handleChange('name')} placeholder="Acme Corp" />
          <Input label="Owner Name" value={profile.ownerName} onChange={handleChange('ownerName')} placeholder="John Doe" />
          <Input label="Email Address" type="email" value={profile.email} onChange={handleChange('email')} placeholder="billing@acme.com" />
          <Input label="Phone Number" value={profile.phone} onChange={handleChange('phone')} placeholder="+1 (555) 000-0000" />
          <Input label="Website" value={profile.website} onChange={handleChange('website')} placeholder="https://acme.com" />
        </div>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Address
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Street Address" value={profile.address} onChange={handleChange('address')} placeholder="123 Business Rd, Suite 100" />
          </div>
          <Input label="City" value={profile.city} onChange={handleChange('city')} placeholder="San Francisco" />
          <Input label="State / Province" value={profile.state} onChange={handleChange('state')} placeholder="CA" />
          <Input label="Postal Code" value={profile.postalCode} onChange={handleChange('postalCode')} placeholder="94105" />
          <Input label="Country" value={profile.country} onChange={handleChange('country')} placeholder="United States" />
        </div>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Legal & Tax
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <Input label="Tax ID / EIN" value={profile.taxId} onChange={handleChange('taxId')} placeholder="XX-XXXXXXX" />
          <Input label="VAT / GST Number" value={profile.vatGst} onChange={handleChange('vatGst')} placeholder="GB123456789" />
          <Input label="Company Registration Number" value={profile.companyRegistration} onChange={handleChange('companyRegistration')} placeholder="01234567" />
        </div>
      </div>
    </div>
  );
};
