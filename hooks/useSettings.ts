import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";

const ViewModeSchema = z.enum(["Standard", "Compact"]);
type ViewMode = z.infer<typeof ViewModeSchema>;

interface Settings {
  viewMode: ViewMode;
}

export const SettingsSchema = z.object({
  viewMode: ViewModeSchema,
});

const INITIAL_VALUES: Settings = {
  viewMode: "Standard",
};

function getSettings(): Settings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return !!settings ? (JSON.parse(settings) as Settings) : INITIAL_VALUES;
}

interface UseSettings {
  settings: Settings;
  setSettings: (value: Settings) => void;
  loaded: boolean;
}

const SETTINGS_KEY = "freq_settings";

export default function useSettings(): UseSettings {
  const [settings, setSettings] = useState(INITIAL_VALUES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setLoaded(true);
  }, []);

  const setSettingsWrapper = (value: Settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
    setSettings({ ...value });
  };

  return {
    settings,
    setSettings: setSettingsWrapper,
    loaded,
  };
}
