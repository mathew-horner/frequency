import { useState, useEffect } from "react";
import { INITIAL_SETTINGS, Settings } from "../contexts/SettingsContext";

const SETTINGS_KEY = "FREQ_SETTINGS";

function getSettings(): Settings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return !!settings ? (JSON.parse(settings) as Settings) : INITIAL_SETTINGS;
}

export default function useSettings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storageSettings = getSettings();
    setSettings(storageSettings);
    setLoaded(true);
  }, []);

  function setSettingsWrapper(value: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
    setSettings(value);
  }

  return { settings, setSettings: setSettingsWrapper, loaded };
}
