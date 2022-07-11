import { Button, Flex, Text } from "@chakra-ui/react";
import Card from "./Card";

export default function IntroCard() {
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
        It looks like you may be new here! Would you like a crash course on how
        to use this wonderful little habit tracker?
      </Text>
      <Flex justifyContent="center" gap={4} mt={2}>
        <Button backgroundColor="white" textColor="black" w={24}>
          Yes
        </Button>
        <Button
          border="1px"
          borderColor="white"
          backgroundColor="transparent"
          textColor="white"
          w={24}
        >
          No
        </Button>
      </Flex>
    </Card>
  );
}
