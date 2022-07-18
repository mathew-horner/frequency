import { useState, useEffect } from "react";
import { INITIAL_SETTINGS, Settings } from "../contexts/SettingsContext";

const SETTINGS_KEY = "FREQ_SETTINGS";

function getSettingsOrDefault(): Settings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return !!settings ? (JSON.parse(settings) as Settings) : INITIAL_SETTINGS;
}

export default function useSettings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // This signal is useful so we can prevent rendering before settings are loaded.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storageSettings = getSettingsOrDefault();
    setSettings(storageSettings);
    setLoaded(true);
  }, []);
  
  /** Drive-by writes to localStorage and also updates the settings state. */
  function setSettingsWrapper(value: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
    setSettings(value);
  }

  return { settings, setSettings: setSettingsWrapper, loaded };
}
