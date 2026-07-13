import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLanguageData } from '../utils/languages';
import { detectRegionFromBrowser, getRegionalSettings, fetchIPGeolocation } from '../utils/locale';
import i18next from 'i18next';

export interface Settings {
  language: string;
  currency: string;
  dateFormat: string;
  numberFormat: string;
  timezone: string;
  paperSize: 'A4' | 'Letter' | 'Legal';
  taxLabel: string;
  theme: 'light' | 'dark' | 'system';
  _hasCompletedFirstRun?: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  dir: 'ltr' | 'rtl';
}

const defaultSettings: Settings = {
  language: 'en',
  currency: 'USD',
  dateFormat: 'locale',
  numberFormat: 'locale',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  paperSize: 'A4',
  taxLabel: 'Tax',
  theme: 'system',
  _hasCompletedFirstRun: false
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  dir: 'ltr'
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('invoice_gen_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      // Ignore
    }

    // Auto-detect defaults on first visit (Synchronous)
    const lang = navigator.language.split('-')[0];
    const initialRegion = detectRegionFromBrowser() || 'US';
    const regional = getRegionalSettings(initialRegion);

    return {
      ...defaultSettings,
      language: lang,
      currency: regional.currency,
      paperSize: regional.paperSize,
      taxLabel: regional.taxLabel
    };
  });

  // Async IP Fallback (Only runs once, if _hasCompletedFirstRun is false)
  useEffect(() => {
    if (settings._hasCompletedFirstRun) return;

    let active = true;

    const performAsyncDetection = async () => {
      // Only do IP fallback if browser failed to give us a definitive region from Intl or timezone.
      // Actually, let's always try IP on first run if we want the absolute best accuracy, 
      // but user asked to use IP ONLY as fallback if region cannot be determined.
      // Since detectRegionFromBrowser uses Timezone which covers 99% of cases, 
      // we only fetch IP if detectRegionFromBrowser returned null.
      let finalCountryCode = detectRegionFromBrowser();

      if (!finalCountryCode) {
        finalCountryCode = await fetchIPGeolocation();
      }

      if (!active) return;

      if (finalCountryCode) {
        const regional = getRegionalSettings(finalCountryCode);
        setSettings(prev => ({
          ...prev,
          currency: regional.currency,
          paperSize: regional.paperSize,
          taxLabel: regional.taxLabel,
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
    localStorage.setItem('invoice_gen_settings', JSON.stringify(settings));
    
    // Update i18next
    if (i18next.language !== settings.language) {
      i18next.changeLanguage(settings.language);
    }
    
    // Apply RTL/LTR
    const langData = getLanguageData(settings.language);
    document.documentElement.dir = langData.dir;
    document.documentElement.lang = settings.language;
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const dir = getLanguageData(settings.language).dir;

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, dir }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
