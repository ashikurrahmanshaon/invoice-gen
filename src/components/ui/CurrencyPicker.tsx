import React, { useMemo } from 'react';
import { Select } from './Select';
import type { SelectOption } from './Select';
import { getAllCurrencies } from '../../utils/currencies';

interface CurrencyPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  value,
  onChange,
  label = 'Currency',
  error,
  className
}) => {
  const options: SelectOption[] = useMemo(() => {
    return getAllCurrencies().map(c => ({
      value: c.code,
      label: `${c.code} — ${c.name} (${c.symbol})`,
      triggerLabel: `${c.code} (${c.symbol})`,
      icon: c.countryCode ? (
        <>
          <img 
            src={`https://flagcdn.com/w20/${c.countryCode}.png`} 
            width="20" 
            alt={c.countryCode}
            style={{ borderRadius: '2px', objectFit: 'cover' }}
            onError={(e) => {
              // fallback to emoji if image fails
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline';
              }
            }}
          />
          <span style={{ fontSize: '18px', display: 'none' }}>{c.flag}</span>
        </>
      ) : (
        <span style={{ fontSize: '18px' }}>{c.flag}</span>
      ),
      searchStr: c.searchStr
    }));
  }, []);

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      searchable={true}
      placeholder="Search currency..."
      error={error}
      className={className}
    />
  );
};
