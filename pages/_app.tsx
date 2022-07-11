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
import useSettings from "../hooks/useSettings";

function MyApp({ Component, pageProps }: AppProps) {
  const { loaded } = useSettings();

  if (!loaded) return null;

  return (
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
