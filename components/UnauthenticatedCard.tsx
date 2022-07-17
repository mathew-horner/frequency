import { Button, Flex, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Card from "./Card";

export default function UnauthenticatedCard() {
  return (
    <Card
      display="flex"
      flexDirection="column"
      gap={2}
      backgroundColor="black"
      textColor="white"
    >
      <Text as="h2" fontSize="xl" fontWeight="bold">
        Welcome to frequency!
      </Text>
      <Text>
        Building good habits is important. But, it is hard. Frequency is here to
        simplify the process and make sure you are achieving your goals!
      </Text>
      <Flex justifyContent="center" gap={4} mt={2}>
        <Button backgroundColor="white" textColor="black" w={32}>
          Learn More
        </Button>
        <Button
          border="1px"
          borderColor="white"
          backgroundColor="transparent"
          textColor="white"
          w={32}
          onClick={() => signIn()}
        >
          Get Started
        </Button>
      </Flex>
    </Card>
  );
}
