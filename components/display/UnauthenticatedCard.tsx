import { Flex, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Button from "../Button";
import Card from "../Card";

/** Prompts the user to sign in / register. */
export default function UnauthenticatedCard() {
  return (
    <Card
      display="flex"
      flexDirection="column"
      gap={2}
      backgroundColor="black"
      textColor="white"
    >
      {/* Title */}
      <Text as="h2" fontSize="xl" fontWeight="bold">
        Welcome to frequency!
      </Text>

      {/* Prompt Text */}
      <Text>
        Building good habits is important. But, it is hard. Frequency is here to
        simplify the process and make sure you are achieving your goals!
      </Text>

      {/* Buttons */}
      <Flex justifyContent="center" gap={4} mt={2}>
        <Button type_="white" w={32}>
          Learn More
        </Button>
        <Button
          type_="white-outline"
          w={32}
          onClick={() => signIn()}
        >
          Get Started
        </Button>
      </Flex>
    </Card>
  );
}
