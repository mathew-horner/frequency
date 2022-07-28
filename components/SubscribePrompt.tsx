import { Flex, Text } from "@chakra-ui/react";
import Button from "./Button";

export default function SubscribePrompt() {
  return (
    <Flex
      zIndex={1000}
      flexDirection="column"
      gap={4}
      borderRadius="lg"
      backgroundColor="black"
      textColor="white"
      p={4}
    >
      {/* Title */}
      <Text as="h2" fontSize="xl" fontWeight="bold">
        Subscription Required
      </Text>

      {/* Body */}
      <Text textColor="gray.300">
        You do not have an active subscription and your account is no longer
        eligible for a trial version! Please subscribe to continue using
        {' '}<b>frequency</b>.
      </Text>

      {/* Subscribe Button */}
      <Button type_="white-outline" alignSelf="flex-end">
        Subscribe
      </Button>
    </Flex>
  );
}
