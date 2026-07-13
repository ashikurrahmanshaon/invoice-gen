import React, { useState } from 'react';
import { Building2, PaintBucket, Globe, FileText, CreditCard, Monitor, HardDrive } from 'lucide-react';
import { BusinessProfileSection } from './sections/BusinessProfileSection';
import { BrandKitSection } from './sections/BrandKitSection';
import { LocalizationSection } from './sections/LocalizationSection';
import { InvoiceDefaultsSection } from './sections/InvoiceDefaultsSection';
import { PaymentMethodsSection } from './sections/PaymentMethodsSection';
import { AppearanceSection } from './sections/AppearanceSection';
import { DataBackupSection } from './sections/DataBackupSection';

export const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: Building2 },
    { id: 'brand', label: 'Brand Kit', icon: PaintBucket },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'defaults', label: 'Invoice Defaults', icon: FileText },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'data', label: 'Data & Backup', icon: HardDrive }
  ];

  return (
    <div style={{ display: 'flex', gap: 'var(--space-8)', minHeight: 'calc(100vh - 140px)', padding: 'var(--space-6) 0' }} className="settings-layout">
      {/* Sidebar */}
      <aside style={{ flex: '0 0 240px' }} className="settings-sidebar">
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 'var(--space-6)', paddingLeft: 'var(--space-3)' }}>
          Workspace Settings
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: '10px var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === tab.id ? 'var(--color-primary-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              className="hover-bg"
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '800px' }}>
        {activeTab === 'business' && <BusinessProfileSection />}
        {activeTab === 'brand' && <BrandKitSection />}
        {activeTab === 'localization' && <LocalizationSection />}
        {activeTab === 'defaults' && <InvoiceDefaultsSection />}
        {activeTab === 'payment' && <PaymentMethodsSection />}
        {activeTab === 'appearance' && <AppearanceSection />}
        {activeTab === 'data' && <DataBackupSection />}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .settings-layout {
            flex-direction: column;
            gap: 24px;
            padding: 16px 0;
          }
          .settings-sidebar {
            flex: none;
            width: 100%;
          }
          .settings-sidebar nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
          }
          .settings-sidebar nav button {
            white-space: nowrap;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </div>
  );
};
