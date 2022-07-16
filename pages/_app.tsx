import "@fontsource/andika/400.css";
import "@fontsource/andika/700.css";

import React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import NiceModal from "@ebay/nice-modal-react";

import { AppRouter } from "./api/trpc/[trpc]";
import theme from "../utils/theme";
import Navbar from "../components/Navbar";
import useSettings from "../hooks/useSettings";
import SettingsContext from "../contexts/SettingsContext";

import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const settings = useSettings();

  if (!settings.loaded) return null;

  return (
    <SessionProvider session={session}>
      <SettingsContext.Provider value={settings}>
        <ChakraProvider theme={theme}>
          <NiceModal.Provider>
            <Flex justifyContent="center">
              <Box width="full" maxWidth="1000px">
                <Navbar/>
                <Component {...pageProps} />
              </Box>
            </Flex>
          </NiceModal.Provider>
        </ChakraProvider>
      </SettingsContext.Provider>
    </SessionProvider>
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
