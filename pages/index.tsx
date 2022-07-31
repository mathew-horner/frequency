import Link from "next/link";
import { Box, Flex, Text } from "@chakra-ui/react";

import Button from "../components/Button";

export default function LandingPage() {
  return (
    <Flex flexDir="column" h="100vh" minH="700px">
      <Box p={4}>
        {/* Site Brand */}
        <Link href="/">
          <Flex alignItems="center" gap={2} flexGrow={1} cursor="pointer">
            <img
              src="/frequency-logo.png"
              height={48}
              width={48}
              style={{ borderRadius: "8px" }}
            />
            <Text
              as="h1"
              fontSize="3xl"
              fontWeight="bold"
              display={{ base: "none", sm: "block" }}
            >
              frequency
            </Text>
          </Flex>
        </Link>
      </Box>

      <Flex
        flexDir="column"
        gap={8}
        p={6}
        backgroundColor="black"
        textColor="white"
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Text as="h1" fontSize="5xl" fontWeight="bold">
          A habit tracker that won't piss you off.
        </Text>
        <Text as="p" fontSize="xl" textColor="gray.300">
          Life is busy, and chaotic. Your habit tracker should reflect that.
          With our app, you simply set a desired frequency (1 per X days) for
          each habit, and we'll tell you what to do each day based on your
          activity.
        </Text>
        <Flex gap={4}>
          <Button type_="white" w={40} size="lg">
            Learn More
          </Button>
          <Link href="/app">
            <Button type_="white-outline" w={40} size="lg">
              Try Now
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
