import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";

import Button from "./Button";

export default function Footer() {
  const router = useRouter();
  return (
    <Flex
      p={8}
      alignItems="center"
      flexDir="column"
      gap={6}
      borderTop="2px"
      borderTopColor="gray.100"
      w="100vw"
    >
      <Flex gap={8} flexDir={{ base: "column", sm: "row" }}>
        <Link href="/privacy">
          <Button type_="transparent" textColor="gray.600">
            Privacy
          </Button>
        </Link>
        <Button
          type_="transparent"
          textColor="gray.600"
          onClick={() => router.push("mailto:mathewhorner456@gmail.com")}
        >
          Contact
        </Button>
        <Button
          type_="transparent"
          textColor="gray.600"
          onClick={() => router.push("https://discord.gg/GcSSX7t2Nf")}
        >
          Discord
        </Button>
        <Button
          type_="transparent"
          textColor="gray.600"
          onClick={() => router.push("/blog")}
        >
          Blog
        </Button>
      </Flex>
      <Text fontSize="sm" textColor="gray.500">
        Copyright 2022 frequency
      </Text>
    </Flex>
  );
}
