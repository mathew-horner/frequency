import { Flex, Text } from "@chakra-ui/react";
import Button from "../Button";
import Card from "../Card";

interface Props {
  /** Called when the user clicks on the "Yes" button. */
  onClickYes: () => void;

  /** Called when the user clicks on the "No" button. */
  onClickNo: () => void;
}

/** Prompts the user to begin the on-boarding experience. */
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
          type_="white"
          w={24}
          onClick={() => onClickYes()}
        >
          Yes
        </Button>
        <Button
          type_="white-outline"
          w={24}
          onClick={() => onClickNo()}
        >
          No
        </Button>
      </Flex>
    </Card>
  );
}
