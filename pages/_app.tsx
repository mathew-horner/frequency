import "@fontsource/andika/400.css";
import "@fontsource/andika/700.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Box, Flex } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";

import { AppRouter } from "./api/trpc/[trpc]";
import theme from "../utils/theme";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GlobalContext from "../contexts/GlobalContext";
import useSettings from "../hooks/useSettings";

import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const settings = useSettings();

  // Rendering before settings are loaded can result in CLS (mainly due to the compact view).
  if (!settings.loaded) return null;

  return (
    <>
      <Head>
        <title>frequency</title>
      </Head>
      <GlobalContext {...{ session, theme, settings }}>
        <Flex flexDir="column" alignItems="center" minH="100vh">
          <Box width="full" maxWidth="1000px" flexGrow={1}>
            <Navbar />
            <Component {...pageProps} />
          </Box>
          <footer>
            <Footer />
          </footer>
        </Flex>
      </GlobalContext>
    </>
  );
}

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
