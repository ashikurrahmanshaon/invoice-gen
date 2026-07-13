import React, { useState } from 'react';
import { ShieldCheck, Download, Upload, Trash2 } from 'lucide-react';

export const DataBackupSection: React.FC = () => {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const data = {
        settings: localStorage.getItem('invoice_gen_settings'),
        history: localStorage.getItem('invoice_gen_history'),
        clients: localStorage.getItem('invoice_gen_clients')
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-gen-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings) localStorage.setItem('invoice_gen_settings', data.settings);
        if (data.history) localStorage.setItem('invoice_gen_history', data.history);
        if (data.clients) localStorage.setItem('invoice_gen_clients', data.clients);
        
        setImportStatus('Backup restored successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch {
        setImportStatus('Error: Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Data & Backup</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Manage your local data. Everything is stored directly in your browser.
        </p>
      </div>

      <div style={{ backgroundColor: '#ECFDF5', padding: '16px', borderRadius: '12px', border: '1px solid #A7F3D0', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ color: '#059669', marginTop: '2px' }}><ShieldCheck size={20} /></div>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#065F46' }}>100% Local & Secure</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#047857', lineHeight: 1.5 }}>
            No accounts required. All your invoices, client data, and settings remain completely on your device. We never send your financial data to external servers. Because of this, please use the export tool below to backup your data safely.
          </p>
        </div>
      </div>

      <div className="card flex-col gap-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Export Backup</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 }}>
              Download a complete JSON snapshot of your history, clients, and settings.
            </p>
          </div>
          <button className="btn btn-outline" onClick={handleExport} style={{ flexShrink: 0 }}>
            <Download size={16} /> Export JSON
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Restore Backup</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 }}>
              Upload a previously exported JSON backup to restore your workspace.
            </p>
            {importStatus && (
              <p style={{ fontSize: '12px', color: importStatus.includes('Error') ? 'var(--error)' : 'var(--success)', marginTop: '8px', fontWeight: 500 }}>
                {importStatus}
              </p>
            )}
          </div>
          <label className="btn btn-outline hover-lift" style={{ cursor: 'pointer', flexShrink: 0 }}>
            <Upload size={16} /> Import JSON
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px', color: 'var(--error)' }}>Danger Zone</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 }}>
              Permanently delete all invoices, settings, and clients from this browser. This cannot be undone.
            </p>
          </div>
          {!isResetConfirmOpen ? (
            <button className="btn btn-danger" onClick={() => setIsResetConfirmOpen(true)} style={{ flexShrink: 0, backgroundColor: '#FEF2F2', color: 'var(--error)', border: '1px solid #FECACA' }}>
              <Trash2 size={16} /> Reset Everything
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button className="btn btn-ghost" onClick={() => setIsResetConfirmOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReset}>Confirm Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
