import React, { useMemo } from 'react';
import { Select } from './Select';
import type { SelectOption } from './Select';
import { supportedLanguages } from '../../utils/languages';

interface LanguagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  value,
  onChange,
  label = 'Language',
  error,
  className
}) => {
  const options: SelectOption[] = useMemo(() => {
    return supportedLanguages.map(l => ({
      value: l.code,
      label: l.nativeName,
      description: l.name,
      searchStr: `${l.code} ${l.name} ${l.nativeName}`
    }));
  }, []);

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      searchable={true}
      placeholder="Search language..."
      error={error}
      className={className}
    />
  );
};
