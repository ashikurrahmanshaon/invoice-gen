import countryToCurrency from 'country-to-currency';
import { getTimezone } from 'countries-and-timezones';

export interface RegionalSettings {
  countryCode: string; // e.g. US, BD, GB
  currency: string;
  paperSize: 'A4' | 'Letter' | 'Legal';
  taxLabel: string;
}

const getPaperSize = (countryCode: string): 'A4' | 'Letter' | 'Legal' => {
  // Letter is standard in US, Canada, Mexico, Philippines, Chile, etc.
  const letterCountries = ['US', 'CA', 'MX', 'PH', 'CL', 'CO', 'CR', 'DO', 'SV', 'GT', 'HN', 'NI', 'PA', 'VE'];
  if (letterCountries.includes(countryCode)) return 'Letter';
  return 'A4';
};

const getTaxLabel = (countryCode: string): string => {
  if (countryCode === 'US') return 'Sales Tax';
  // GST Countries: AU, NZ, CA, IN, SG, MY
  if (['AU', 'NZ', 'CA', 'IN', 'SG', 'MY'].includes(countryCode)) return 'GST';
  // Europe uses VAT
  if (['GB', 'IE', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'SE', 'DK', 'FI', 'NO', 'AT', 'CH'].includes(countryCode)) return 'VAT';
  // Middle east uses VAT
  if (['AE', 'SA', 'BH', 'OM'].includes(countryCode)) return 'VAT';
  // Default fallback
  return 'Tax';
};

export const detectRegionFromBrowser = (): string | null => {
  // Priority 1: Intl.Locale region (if supported and accurate)
  try {
    if (Intl.Locale) {
      const loc = new Intl.Locale(navigator.language);
      if (loc.region) return loc.region; // e.g. "US" from "en-US"
    }
  } catch (e) {}

  // Priority 2: Simple language split fallback
  const parts = navigator.language.split('-');
  if (parts.length > 1) {
    const region = parts[1].toUpperCase();
    if (region.length === 2) return region;
  }

  // Priority 3: Browser timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const tzInfo = getTimezone(tz);
      if (tzInfo && tzInfo.countries && tzInfo.countries.length > 0) {
        // Return primary country for this timezone
        return tzInfo.countries[0];
      }
    }
  } catch (e) {}

  return null;
};

export const getRegionalSettings = (countryCode: string): RegionalSettings => {
  const currency = countryToCurrency[countryCode as keyof typeof countryToCurrency] || 'USD';
  return {
    countryCode,
    currency,
    paperSize: getPaperSize(countryCode),
    taxLabel: getTaxLabel(countryCode)
  };
};

export const fetchIPGeolocation = async (): Promise<string | null> => {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data && data.success && data.country_code) {
      return data.country_code;
    }
  } catch (e) {
    console.warn('IP Geolocation failed:', e);
  }
  return null;
};
