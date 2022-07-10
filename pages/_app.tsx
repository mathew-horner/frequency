import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, Button, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { withTRPC } from "@trpc/next";
import NiceModal from "@ebay/nice-modal-react";
import { AppRouter } from "./api/trpc/[trpc]";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <NiceModal.Provider>
        <Flex justifyContent="center">
          <Box width="full" maxWidth="1000px">
            <Flex as="header" alignItems="center" p={6} pb={0} gap={2}>
              {/* Site Brand */}
              <Flex alignItems="center" gap={1} flexGrow={1}>
                <Image src="/logo-5.svg" height={50} width={50} />
                <Text as="h1" fontSize="4xl" fontWeight="bold">
                  1percent
                </Text>
              </Flex>

              {/* Controls */}
              <Flex fontWeight="bold" marginRight={6} fontSize="lg" gap={2}>
                <Text>300pts</Text>
                <Text fontWeight="medium" textColor="#3a9efd">
                  (+23)
                </Text>
              </Flex>
              <Button
                backgroundColor="#e6f3fe"
                fontSize="lg"
                textColor="#3a9efd"
                w="146px"
                h={12}
              >
                Rewards
              </Button>
              <Button
                backgroundColor="transparent"
                border="1px"
                borderColor="#3a9efd"
                fontSize="lg"
                textColor="#3a9efd"
                w="146px"
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
