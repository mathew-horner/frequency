import "@fontsource/andika/400.css";
import "@fontsource/andika/700.css";

import "../styles/globals.css";

import type { AppProps } from "next/app";
import { Box, Button, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import NiceModal from "@ebay/nice-modal-react";
import {
  IoAnalyticsSharp,
  IoGiftSharp,
  IoLogOut,
  IoSettingsSharp,
} from "react-icons/io5";
import { TbWaveSawTool } from "react-icons/tb";
import { AppRouter } from "./api/trpc/[trpc]";
import theme from "../utils/theme";
import SettingsModal from "../components/SettingsModal";
import { useEffect, useState } from "react";
import { z } from "zod";
import React from "react";

const ViewModeSchema = z.enum(["Standard", "Compact"]);
type ViewMode = z.infer<typeof ViewModeSchema>;

interface Settings {
  viewMode: ViewMode;
}

export const SettingsSchema = z.object({
  viewMode: ViewModeSchema,
});

const INITIAL_SETTINGS: Settings = {
  viewMode: "Standard",
};

export const SettingsContext = React.createContext({
  settings: INITIAL_SETTINGS,
  setSettings: (() => {}) as any,
});

const SETTINGS_KEY = "FREQ_SETTINGS";

function getSettings(): Settings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return !!settings ? (JSON.parse(settings) as Settings) : INITIAL_SETTINGS;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const storageSettings = getSettings();
    setSettings(storageSettings);
    setSettingsLoaded(true);
  }, []);

  function setSettingsWrapper(value: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
    setSettings(value);
  }

  if (!settingsLoaded) return null;

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings: setSettingsWrapper }}
    >
      <ChakraProvider theme={theme}>
        <NiceModal.Provider>
          <Flex justifyContent="center">
            <Box width="full" maxWidth="1000px">
              <Flex as="header" alignItems="center" p={6} pb={0} gap={2}>
                {/* Site Brand */}
                <Flex alignItems="center" gap={2} flexGrow={1}>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="black"
                    textColor="white"
                    p={2}
                    borderRadius="lg"
                  >
                    <TbWaveSawTool size={32} />
                  </Flex>
                  <Text as="h1" fontSize="3xl" fontWeight="bold">
                    frequency
                  </Text>
                </Flex>

                {/* Controls */}
                <Button size="lg" h={12} w={12} p={0}>
                  <IoGiftSharp size={24} />
                </Button>
                <Button size="lg" h={12} w={12} p={0}>
                  <IoAnalyticsSharp size={24} />
                </Button>
                <Button
                  size="lg"
                  h={12}
                  w={12}
                  p={0}
                  onClick={() => NiceModal.show(SettingsModal)}
                >
                  <IoSettingsSharp size={24} />
                </Button>
                <Button size="lg" h={12} w={12} p={0}>
                  <IoLogOut size={24} />
                </Button>
              </Flex>
              <Component {...pageProps} />
            </Box>
          </Flex>
        </NiceModal.Provider>
      </ChakraProvider>
    </SettingsContext.Provider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
