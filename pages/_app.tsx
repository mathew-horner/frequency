import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Button, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Flex as="header" alignItems="center" p={6} pb={0} gap={2}>
        {/* Site Brand */}
        <Flex alignItems="center" gap={1} flexGrow={1}>
          <Image src="/logo.svg" height={50} width={50} />
          <Text as="h1" fontSize="4xl" fontWeight="bold">
            1percent
          </Text>
        </Flex>

        {/* Controls */}
        <Flex fontWeight="bold" marginRight={6} fontSize="lg" gap={2}>
          <Text>300pts</Text>
          <Text fontWeight="medium" textColor="#61459c">
            (+23)
          </Text>
        </Flex>
        <Button
          backgroundColor="#61459c"
          textColor="white"
          fontSize="lg"
          w="146px"
        >
          Rewards
        </Button>
        <Button
          border="2px"
          backgroundColor="transparent"
          fontSize="lg"
          borderColor="#61459c"
          textColor="#61459c"
          w="146px"
        >
          Sign Out
        </Button>
      </Flex>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
