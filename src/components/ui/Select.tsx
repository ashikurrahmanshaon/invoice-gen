import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  searchStr?: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  error,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = searchable 
    ? options.filter(o => {
        const searchTarget = o.searchStr ? o.searchStr.toLowerCase() : o.label.toLowerCase();
        return searchTarget.includes(search.toLowerCase());
      })
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      const index = filteredOptions.findIndex(o => o.value === value);
      setHighlightedIndex(Math.max(0, index));
      if (searchable && searchInputRef.current) {
        // slight delay to allow rendering
        setTimeout(() => searchInputRef.current?.focus(), 10);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const highlightedEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(filteredOptions.length - 1, prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Dropdown width matches container, positioned below it
      setDropdownStyle({
        position: 'absolute',
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 9999
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isOpen]);

  return (
    <div className={`input-container ${className}`} ref={containerRef}>
      {label && <label className="input-label" onClick={() => setIsOpen(true)}>{label}</label>}
      
      <div 
        className={`input-wrapper ${error ? 'has-error' : ''} ${isOpen ? 'focused' : ''}`}
        style={{ 
          cursor: 'pointer', 
          outline: 'none',
          borderColor: isOpen ? 'var(--color-primary)' : undefined
        }}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="input-element" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            {selectedOption?.icon && <span style={{ flexShrink: 0 }}>{selectedOption.icon}</span>}
            <span style={{ 
              color: selectedOption ? 'var(--color-text-main)' : 'var(--color-text-tertiary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown size={20} color="var(--color-text-tertiary)" style={{ flexShrink: 0 }} />
        </div>
      </div>
      
      {error && <div className="input-error">{error}</div>}

      {isOpen && createPortal(
        <div style={dropdownStyle}>
          <div 
            className="card" 
            style={{ 
              padding: 0, 
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            {searchable && (
              <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
                <div className="input-wrapper" style={{ minHeight: '40px', height: '40px' }}>
                  <div className="input-icon left"><Search size={16} /></div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="input-element"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>
            )}
            
            <div 
              ref={listboxRef}
              style={{ overflowY: 'auto', flex: 1, padding: '4px' }}
            >
              {filteredOptions.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
                  No results found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <div
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        background: isHighlighted ? 'var(--color-background)' : 'transparent',
                        minHeight: '44px' // Large touch targets
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {option.icon && <span>{option.icon}</span>}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: isSelected ? 600 : 500,
                            color: 'var(--color-text-main)'
                          }}>
                            {option.label}
                          </span>
                          {option.description && (
                            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                              {option.description}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="var(--color-primary)" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
