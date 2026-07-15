import React, { createContext, useContext, useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';
const safeLocalStorage = {
  getItem: (k: string): string | null => isBrowser ? window.localStorage.getItem(k) : null,
  setItem: (k: string, v: string): void => { if (isBrowser) window.localStorage.setItem(k, v); },
  removeItem: (k: string): void => { if (isBrowser) window.localStorage.removeItem(k); }
};
import { getLanguageData } from '../utils/languages';
import { detectRegionFromBrowser, getRegionalSettings, fetchIPGeolocation } from '../utils/locale';
import i18next from 'i18next';
import { type Settings, defaultSettings } from '../types/settings';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  updateNestedSetting: <K extends keyof Settings>(
    category: K,
    updates: Partial<Settings[K]>
  ) => void;
  dir: 'ltr' | 'rtl';
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  updateNestedSetting: () => {},
  dir: 'ltr'
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = safeLocalStorage.getItem('invoice_gen_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }

    // Auto-detect defaults on first visit (Synchronous)
    const lang = typeof navigator !== 'undefined' && navigator.language ? navigator.language.split('-')[0] : 'en';
    const initialRegion = detectRegionFromBrowser() || 'US';
    const regional = getRegionalSettings(initialRegion);

    return {
      ...defaultSettings,
      localization: {
        ...defaultSettings.localization,
        language: lang,
        currency: regional.currency,
        paperSize: regional.paperSize
      },
      invoiceDefaults: {
        ...defaultSettings.invoiceDefaults,
        defaultTaxLabel: regional.taxLabel,
        defaultCurrency: regional.currency
      }
    };
  });

  // Async IP Fallback (Only runs once, if _hasCompletedFirstRun is false)
  useEffect(() => {
    if (settings._hasCompletedFirstRun) return;

    let active = true;

    const performAsyncDetection = async () => {
      let finalCountryCode = detectRegionFromBrowser();

      if (!finalCountryCode) {
        finalCountryCode = await fetchIPGeolocation();
      }

      if (!active) return;

      if (finalCountryCode) {
        const regional = getRegionalSettings(finalCountryCode);
        setSettings(prev => ({
          ...prev,
          localization: {
            ...prev.localization,
            currency: regional.currency,
            paperSize: regional.paperSize
          },
          invoiceDefaults: {
            ...prev.invoiceDefaults,
            defaultTaxLabel: regional.taxLabel,
            defaultCurrency: regional.currency
          },
          _hasCompletedFirstRun: true // Mark as completed so we never do this again
        }));
      } else {
        // Even if all failed, mark as completed
        setSettings(prev => ({ ...prev, _hasCompletedFirstRun: true }));
      }
    };

    performAsyncDetection();

    return () => {
      active = false;
    };
  }, [settings._hasCompletedFirstRun]);

  useEffect(() => {
    safeLocalStorage.setItem('invoice_gen_settings', JSON.stringify(settings));
    
    // Update i18next
    if (i18next.language !== settings.localization.language) {
      i18next.changeLanguage(settings.localization.language);
    }
    
    // Apply RTL/LTR
    const langData = getLanguageData(settings.localization.language);
    document.documentElement.dir = langData.dir;
    document.documentElement.lang = settings.localization.language;
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateNestedSetting = <K extends keyof Settings>(
    category: K,
    updates: Partial<Settings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        ...updates
      }
    }));
  };

  const dir = getLanguageData(settings.localization.language).dir;

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateNestedSetting, dir }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
