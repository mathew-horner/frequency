import "@fontsource/andika/400.css";
import "@fontsource/andika/700.css";

import React from "react";
import type { AppProps } from "next/app";

import { Box, Flex } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";

import { AppRouter } from "./api/trpc/[trpc]";
import theme from "../utils/theme";
import Navbar from "../components/Navbar";
import GlobalContext from "../contexts/GlobalContext";
import useSettings from "../hooks/useSettings";

import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const settings = useSettings();

  if (!settings.loaded) return null;

  return (
    <GlobalContext session={session} settings={settings} theme={theme}>
      <Flex justifyContent="center">
        <Box width="full" maxWidth="1000px">
          <Navbar />
          <Component {...pageProps} />
        </Box>
      </Flex>
    </GlobalContext>
  );
}

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
