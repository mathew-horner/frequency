import React from "react";
import { z } from "zod";

const ViewModeSchema = z.enum(["Standard", "Compact"]);
type ViewMode = z.infer<typeof ViewModeSchema>;

export interface Settings {
  viewMode: ViewMode;
}

export const SettingsSchema = z.object({
  viewMode: ViewModeSchema,
});

export const INITIAL_SETTINGS: Settings = {
  viewMode: "Standard",
};

const SettingsContext = React.createContext({
  settings: INITIAL_SETTINGS,
  setSettings: (() => {}) as any,
});

export default SettingsContext;
