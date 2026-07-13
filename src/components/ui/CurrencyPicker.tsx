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
      icon: <span style={{ fontSize: '18px' }}>{c.flag}</span>,
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
