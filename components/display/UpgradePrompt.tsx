import { Flex, List, ListItem, Text } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import Button from "../Button";

interface Props {
  /** Called when the user clicks the close button on the prompt. */
  onHidePrompt: () => void;
}

/** Prompts the user to upgrade to a paid account. */
export default function UpgradePrompt({ onHidePrompt }: Props) {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      gap={2}
      p={4}
      borderRadius="lg"
      backgroundColor="black"
      textColor="white"
    >
      {/* Hide Prompt Button */}
      <Button
        type_="black"
        position="absolute"
        top={0}
        right={0}
        p={0}
        onClick={() => onHidePrompt()}
      >
        <IoClose size={20} />
      </Button>

      {/* Title */}
      <Text as="h2" fontSize="xl" fontWeight="bold">
        10 days left in trial.
      </Text>

      {/* Trial Explanation */}
      <Text fontSize="sm" textColor="gray.300">
        You are currently using the trial version of <b>frequency</b>. You have
        some time left before your trial expires, but you are missing out on
        several features that are provided in <b>frequency pro</b>:
      </Text>

      {/* Pro Features */}
      <List fontSize="sm" textColor="gray.300">
        <ListItem>- Analytics</ListItem>
        <ListItem>- Rewards</ListItem>
      </List>

      {/* Upgrade Button */}
      <Button
        type_="white-outline"
        alignSelf="flex-end"
      >
        Upgrade Now
      </Button>
    </Flex>
  );
}
