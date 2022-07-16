import React from "react";
import { z } from "zod";

const ViewModeSchema = z.enum(["Standard", "Compact"]);
type ViewMode = z.infer<typeof ViewModeSchema>;

export interface Settings {
  viewMode: ViewMode;
  hideUpgradePrompt: boolean;
}

export const SettingsSchema = z.object({
  viewMode: ViewModeSchema,
  hideUpgradePrompt: z.boolean(),
});

export const INITIAL_SETTINGS: Settings = {
  viewMode: "Standard",
  hideUpgradePrompt: false,
};

const SettingsContext = React.createContext({
  settings: INITIAL_SETTINGS,
  setSettings: (() => {}) as any,
});

export default SettingsContext;
