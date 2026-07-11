import { useState } from 'react';
import type { SavedInvoice, InvoiceStatus } from '../../types/invoice';
import { Search, MoreVertical, Edit, Copy, Trash2, CheckCircle, FileText, Send, XCircle } from 'lucide-react';

interface HistoryDashboardProps {
  history: SavedInvoice[];
  onEdit: (invoice: SavedInvoice) => void;
  onDuplicate: (invoice: SavedInvoice) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: InvoiceStatus) => void;
}

export function HistoryDashboard({
  history,
  onEdit,
  onDuplicate,
  onDelete,
  onUpdateStatus
}: HistoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredHistory = history.filter(inv => {
    const matchesSearch = 
      inv.data.details.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.data.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.data.client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'Draft': return '#6b7280';
      case 'Saved': return '#3b82f6';
      case 'Sent': return '#8b5cf6';
      case 'Paid': return '#10b981';
      case 'Void': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'Draft': return <FileText size={14} />;
      case 'Saved': return <FileText size={14} />;
      case 'Sent': return <Send size={14} />;
      case 'Paid': return <CheckCircle size={14} />;
      case 'Void': return <XCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>Past Invoices</h2>
        <div className="flex-row" style={{ gap: '12px' }}>
          <div className="client-search-wrapper" style={{ minWidth: '250px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '140px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Saved">Saved</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Void">Void</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 24px', 
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed var(--color-border)',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--color-background)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <FileText size={40} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px', marginTop: 0 }}>No invoices found</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', maxWidth: '320px', margin: '0 auto' }}>
              Create your first invoice to see it appear here. Keep track of what you've sent and what's been paid.
            </p>
          </div>
        </div>
      ) : (
        <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredHistory.map(inv => (
            <div key={inv.id} className="history-row flex-between" style={{ 
              padding: '16px', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              backgroundColor: 'var(--surface-50)'
            }}>
              <div className="flex-row" style={{ gap: '24px', flex: 1 }}>
                <div style={{ width: '120px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontWeight: 500, color: 'var(--text)' }}>{inv.data.details.issueDate}</div>
                </div>
                <div style={{ width: '140px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Invoice</div>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{inv.data.details.invoiceNumber}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Client</div>
                  <div style={{ fontWeight: 500, color: 'var(--text)' }}>{inv.data.client.name || 'Unnamed Client'}</div>
                </div>
                <div style={{ width: '120px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {formatCurrency(inv.data.totals.total, inv.data.details.currency)}
                  </div>
                </div>
                <div style={{ width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: `${getStatusColor(inv.status)}20`,
                    color: getStatusColor(inv.status)
                  }}>
                    {getStatusIcon(inv.status)}
                    {inv.status}
                  </div>
                </div>
              </div>
              
              <div style={{ marginLeft: '24px', position: 'relative' }}>
                <button 
                  className="btn-icon" 
                  onClick={() => setOpenDropdownId(openDropdownId === inv.id ? null : inv.id)}
                  aria-label="Actions"
                >
                  <MoreVertical size={20} />
                </button>
                
                {openDropdownId === inv.id && (
                  <>
                    <div 
                      style={{ position: 'fixed', inset: 0, zIndex: 10 }} 
                      onClick={() => setOpenDropdownId(null)}
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: '100%', 
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        zIndex: 20,
                        minWidth: '160px',
                        padding: '4px'
                      }}
                    >
                      <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text)' }} onClick={() => { onEdit(inv); setOpenDropdownId(null); }}>
                        <Edit size={16} /> Edit
                      </button>
                      <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text)' }} onClick={() => { onDuplicate(inv); setOpenDropdownId(null); }}>
                        <Copy size={16} /> Duplicate
                      </button>
                      
                      <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
                      
                      {inv.status !== 'Saved' && (
                        <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text)' }} onClick={() => { onUpdateStatus(inv.id, 'Saved'); setOpenDropdownId(null); }}>
                          <FileText size={16} /> Mark as Saved
                        </button>
                      )}
                      {inv.status !== 'Sent' && (
                        <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text)' }} onClick={() => { onUpdateStatus(inv.id, 'Sent'); setOpenDropdownId(null); }}>
                          <Send size={16} /> Mark as Sent
                        </button>
                      )}
                      {inv.status !== 'Paid' && (
                        <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text)' }} onClick={() => { onUpdateStatus(inv.id, 'Paid'); setOpenDropdownId(null); }}>
                          <CheckCircle size={16} /> Mark as Paid
                        </button>
                      )}
                      {inv.status !== 'Void' && (
                        <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text)' }} onClick={() => { onUpdateStatus(inv.id, 'Void'); setOpenDropdownId(null); }}>
                          <XCircle size={16} /> Mark as Void
                        </button>
                      )}

                      <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
                      
                      <button className="dropdown-item flex-row" style={{ gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--error)' }} onClick={() => { onDelete(inv.id); setOpenDropdownId(null); }}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        .dropdown-item:hover {
          background-color: var(--surface-100) !important;
        }
      `}</style>
    </div>
  );
}
