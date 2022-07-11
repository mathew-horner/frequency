import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { MdTaskAlt } from "react-icons/md";

import Card from "./Card";
import { TodayHabit } from "../utils/types";
import { HabitStatus } from "@prisma/client";

interface Props {
  habit: TodayHabit;
  todayRequired?: boolean;
}

export default function HabitCard({ habit, todayRequired }: Props) {
  const habitStatus = habit.today?.status || HabitStatus.Pending;
  const isPending = habitStatus === HabitStatus.Pending;

  const habitIcon = habit.icon || MdTaskAlt;
  const iconElement = React.createElement(habitIcon, {
    size: 32,
  });

  function renderCompletionIcon() {
    if (habitStatus === HabitStatus.Complete) {
      return <AiOutlineCheckCircle size={30} />;
    }
    if (habitStatus === HabitStatus.Incomplete) {
      return <AiOutlineCloseCircle size={30} />;
    }
    return null;
  }

  return (
    <Card
      display="flex"
      alignItems="stretch"
      p={0}
      opacity={!isPending ? "0.5" : "1"}
      h={16}
      position="relative"
      overflow="hidden"
    >
      {!todayRequired && (
        <Box
          position="absolute"
          backgroundColor="primaryBlue.100"
          opacity={0.5}
          w="full"
          h="full"
          zIndex={20}
          pointerEvents="none"
        />
      )}
      <Text
        as="h1"
        display="flex"
        alignItems="center"
        fontSize="xl"
        fontWeight="bold"
        flexGrow={1}
        px={4}
        gap={2}
      >
        {/* <Box color="primaryBlue.500">{iconElement}</Box> */}
        {habit.title}
      </Text>
      {isPending ? (
        <>
          {/* Mark Uncompleted Button */}
          <Button
            backgroundColor="primaryOrange.100"
            textColor="primaryOrange.500"
            _hover={{
              backgroundColor: "primaryOrange.300",
            }}
            borderRadius={0}
            height="auto"
            width={{ base: "75px", md: "150px" }}
          >
            <AiOutlineCloseCircle size={30} />
          </Button>

          {/* Mark Completed Button */}
          <Button
            backgroundColor="primaryBlue.100"
            textColor="primaryBlue.500"
            _hover={{
              backgroundColor: "primaryBlue.300",
            }}
            borderRadius={0}
            borderRightRadius="xl"
            height="auto"
            width={{ base: "75px", md: "150px" }}
          >
            <AiOutlineCheckCircle size={30} />
          </Button>
        </>
      ) : (
        // Show how many points the user got for this habit.
        <Flex alignItems="center" p={6}>
          {renderCompletionIcon()}
        </Flex>
      )}
    </Card>
  );
}
