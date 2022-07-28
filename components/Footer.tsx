import { Flex, Text } from "@chakra-ui/react";
import Button from "./Button";

export default function Footer() {
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
        <Button type_="transparent" textColor="gray.600">
          Terms
        </Button>
        <Button type_="transparent" textColor="gray.600">
          Privacy
        </Button>
        <Button type_="transparent" textColor="gray.600">
          Contact
        </Button>
        <Button type_="transparent" textColor="gray.600">
          Discord
        </Button>
        <Button type_="transparent" textColor="gray.600">
          Blog
        </Button>
      </Flex>
      <Text fontSize="sm" textColor="gray.500">
        Copyright 2022 frequency
      </Text>
    </Flex>
  );
}
