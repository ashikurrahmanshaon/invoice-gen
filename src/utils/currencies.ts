import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import countryToCurrency from 'country-to-currency';

export interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  searchStr: string;
  countries: string[];
}

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Common flags for multi-national or specific currencies where auto-mapping might fail
const customFlags: Record<string, string> = {
  EUR: '🇪🇺',
  XCD: '🇦🇬',
  XOF: '🇸🇳',
  XAF: '🇨🇲',
  XPF: '🇵🇫',
  ANG: '🇨🇼',
  BTC: '₿',
};

// Map currency code back to a primary country code for flag generation (if needed)
const getPrimaryCountryCodeForCurrency = (currencyCode: string): string | null => {
  if (customFlags[currencyCode]) return null; // We already have a custom flag
  
  // Direct matching using country-to-currency reverse lookup
  const entries = Object.entries(countryToCurrency);
  // Find the first country that uses this currency
  const match = entries.find(([_, curr]) => curr === currencyCode);
  if (match) return match[0];

  // Fallback: use first 2 letters
  if (currencyCode.length === 3 && !currencyCode.startsWith('X')) {
    return currencyCode.substring(0, 2);
  }

  return null;
};

export const getAllCurrencies = (): CurrencyData[] => {
  const allCodes = cc.codes();
  const currencies: CurrencyData[] = [];

  for (const code of allCodes) {
    const data = cc.code(code);
    if (!data) continue;
    
    const symbol = getSymbolFromCurrency(code) || code;
    
    let flag = '🌎';
    if (customFlags[code]) {
      flag = customFlags[code];
    } else {
      const countryCode = getPrimaryCountryCodeForCurrency(code);
      if (countryCode) {
        try {
          flag = getFlagEmoji(countryCode);
        } catch (e) {
          // Fallback to globe
        }
      }
    }

    const countries = data.countries || [];

    currencies.push({
      code,
      symbol,
      name: data.currency,
      flag,
      countries,
      searchStr: `${code} ${data.currency} ${symbol} ${countries.join(' ')}`
    });
  }
  
  // Sort by popular first, then alphabetical
  const popular = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'BDT', 'CNY', 'CHF', 'SEK', 'NZD'];
  currencies.sort((a, b) => {
    const indexA = popular.indexOf(a.code);
    const indexB = popular.indexOf(b.code);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.code.localeCompare(b.code);
  });

  return currencies;
};
