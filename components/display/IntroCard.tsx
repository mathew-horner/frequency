import { Button, Flex, Text } from "@chakra-ui/react";
import Card from "../Card";

interface Props {
  onClickYes: () => void;
  onClickNo: () => void;
}

export default function IntroCard({ onClickYes, onClickNo }: Props) {
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
        It looks like you may be new here! Would you like a crash course on how
        to use this wonderful little habit tracker?
      </Text>

      {/* Buttons */}
      <Flex justifyContent="center" gap={4} mt={2}>
        <Button
          backgroundColor="white"
          textColor="black"
          w={24}
          onClick={() => onClickYes()}
        >
          Yes
        </Button>
        <Button
          border="1px"
          borderColor="white"
          backgroundColor="transparent"
          textColor="white"
          w={24}
          onClick={() => onClickNo()}
        >
          No
        </Button>
      </Flex>
    </Card>
  );
}
