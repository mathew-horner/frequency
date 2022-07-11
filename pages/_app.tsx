import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  Box,
  Button,
  ChakraProvider,
  extendTheme,
  Flex,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { withTRPC } from "@trpc/next";
import NiceModal from "@ebay/nice-modal-react";
import { AppRouter } from "./api/trpc/[trpc]";

const theme = extendTheme({
  colors: {
    primaryBlue: {
      100: "#e6f3fe",
      300: "#b0d8fe",
      500: "#3a9efd",
    },
    primaryOrange: {
      100: "#ffebcc",
      300: "#fcdb99",
      500: "#f7a400",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <NiceModal.Provider>
        <Flex justifyContent="center">
          <Box width="full" maxWidth="1000px">
            <Flex as="header" alignItems="center" p={6} pb={0} gap={2}>
              {/* Site Brand */}
              <Flex alignItems="center" gap={1} flexGrow={1}>
                <Image src="/logo-5.svg" height={50} width={50} />
                <Text as="h1" fontSize="3xl" fontWeight="bold">
                  frequency.io
                </Text>
              </Flex>

              {/* Sign Out */}
              <Button
                backgroundColor="transparent"
                border="1px"
                borderColor="primaryBlue.500"
                fontSize="lg"
                textColor="primaryBlue.500"
                _hover={{
                  backgroundColor: "primaryBlue.300",
                }}
                h={12}
              >
                Sign Out
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
