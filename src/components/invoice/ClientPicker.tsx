import React, { useState, useRef, useEffect } from 'react';
import type { SavedClient } from '../../types/invoice';

interface ClientPickerProps {
  clients: SavedClient[];
  onSelect: (client: SavedClient) => void;
  onDeleteRequest: (client: SavedClient) => void;
}

export const ClientPicker: React.FC<ClientPickerProps> = ({ clients, onSelect, onDeleteRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredClients.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredClients.length) {
        handleSelect(filteredClients[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (client: SavedClient) => {
    onSelect(client);
    setIsOpen(false);
    setSearch('');
    setActiveIndex(-1);
  };

  return (
    <div className="client-picker-container" ref={containerRef} style={{ position: 'relative', marginBottom: '16px' }}>
      <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Saved Clients</label>
      <div 
        className="client-picker-input-wrapper" 
        style={{ position: 'relative' }}
      >
        <input
          type="text"
          placeholder={clients.length === 0 ? "No saved clients yet" : "Search saved clients..."}
          value={search}
          disabled={clients.length === 0}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (clients.length > 0) {
              setIsOpen(true);
              setActiveIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
          style={{ 
            width: '100%', 
            paddingRight: '30px', 
            cursor: clients.length === 0 ? 'not-allowed' : 'text'
          }}
        />
        <svg 
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && clients.length > 0 && (
        <div 
          className="client-picker-dropdown" 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 100,
            maxHeight: '240px',
            overflowY: 'auto'
          }}
        >
          {filteredClients.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              No clients match "{search}"
            </div>
          ) : (
            filteredClients.map((client, index) => (
              <div 
                key={client.id}
                className={`client-picker-item ${index === activeIndex ? 'active' : ''}`}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--color-border-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: index === activeIndex ? '#f9fafb' : 'transparent'
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(client)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {client.name || 'Unnamed Client'}
                  </span>
                  {client.email && (
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {client.email}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ padding: '4px', height: 'auto', color: 'var(--color-text-tertiary)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRequest(client);
                  }}
                  title="Delete saved client"
                  aria-label="Delete saved client"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
