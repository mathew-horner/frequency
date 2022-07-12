import { Button, Flex, List, ListItem, Text } from "@chakra-ui/react";

export default function UpgradePrompt() {
  return (
    <Flex
      flexDirection="column"
      gap={2}
      p={4}
      borderRadius="lg"
      backgroundColor="black"
      textColor="white"
    >
      <Text as="h2" fontSize="xl" fontWeight="bold">
        10 days left in trial.
      </Text>
      <Text fontSize="sm" textColor="gray.300">
        You are currently using the trial version of <b>frequency</b>. You have
        some time left before your trial expires, but you are missing out on
        several features that are provided in <b>frequency pro</b>:
      </Text>
      <List fontSize="sm" textColor="gray.300">
        <ListItem>- Analytics</ListItem>
        <ListItem>- Rewards</ListItem>
      </List>
      <Button
        border="1px"
        borderColor="white"
        backgroundColor="transparent"
        alignSelf="flex-end"
      >
        Upgrade Now
      </Button>
    </Flex>
  );
}
