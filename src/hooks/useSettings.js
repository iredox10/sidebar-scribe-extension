import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState({ 
    defaultFolder: '', 
    theme: 'light',
    showMetadataOnAppend: true  // Show metadata by default when appending selections
  });

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsResult = await chrome.storage.local.get(['settings']);
        if (settingsResult.settings) {
          setSettings(settingsResult.settings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await chrome.storage.local.set({ settings });
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };

    saveSettings();
  }, [settings]);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, theme: newTheme });
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return {
    settings,
    toggleTheme,
    updateSettings
  };
};
