import React from "react";
import { z } from "zod";

const ViewModeSchema = z.enum(["Standard", "Compact"]);
type ViewMode = z.infer<typeof ViewModeSchema>;

export interface Settings {
  viewMode: ViewMode;
  hiddenHabitDueInThreshold?: number;
  hideUpgradePrompt: boolean;
  hideIntroCard: boolean;
}

export const SettingsSchema = z.object({
  viewMode: ViewModeSchema,
  hiddenHabitDueInThreshold: z.number().nullish(),
});

export const INITIAL_SETTINGS: Settings = {
  viewMode: "Standard",
  hideUpgradePrompt: false,
  hideIntroCard: false,
};

const SettingsContext = React.createContext({
  settings: INITIAL_SETTINGS,
  setSettings: (() => {}) as any,
});

export default SettingsContext;
