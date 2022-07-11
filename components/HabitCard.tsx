import React, { useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { MdTaskAlt } from "react-icons/md";

import Card from "./Card";
import { TodayHabit } from "../utils/types";
import { HabitStatus } from "@prisma/client";

interface Props {
  lose: number;
  gain: number;
  habit: TodayHabit;
}

export default function HabitCard({ lose, gain, habit }: Props) {
  const uncompleteButtonIcon = <AiOutlineCloseCircle size={30} />;
  const completeButtonIcon = <AiOutlineCheckCircle size={30} />;

  const [uncompleteButtonElement, setUncompleteButtonElement] =
    useState(uncompleteButtonIcon);

  const [completeButtonElement, setCompleteButtonElement] =
    useState(completeButtonIcon);

  const habitStatus = habit.today?.status || HabitStatus.Pending;
  const isPending = habitStatus === HabitStatus.Pending;

  const habitIcon = habit.icon || MdTaskAlt;
  const iconElement = React.createElement(habitIcon, {
    size: 32,
  });

  function renderPointNet() {
    if (habitStatus === HabitStatus.Complete) {
      return renderGainPoints();
    }
    if (habitStatus === HabitStatus.Incomplete) {
      return renderLosePoints();
    }
    return null;
  }

  function renderLosePoints() {
    return (
      <Text fontSize="lg" fontWeight="bold" textColor="primaryOrange.500">
        -{lose}
      </Text>
    );
  }

  function renderGainPoints() {
    return (
      <Text fontSize="lg" fontWeight="bold" textColor="primaryBlue.500">
        +{gain}
      </Text>
    );
  }

  function onHoverUncomplete() {
    setUncompleteButtonElement(renderLosePoints());
  }

  function onHoverComplete() {
    setCompleteButtonElement(renderGainPoints());
  }

  function onUnHoverUncomplete() {
    setUncompleteButtonElement(uncompleteButtonIcon);
  }

  function onUnHoverComplete() {
    setCompleteButtonElement(completeButtonIcon);
  }

  return (
    <Card
      display="flex"
      alignItems="stretch"
      p={0}
      // overflow="hidden"
      opacity={!isPending ? "0.5" : "1"}
      h={16}
    >
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
        <Box color="primaryBlue.500">{iconElement}</Box>
        {habit.title}
      </Text>
      {isPending ? (
        <>
          {/* Point Totals */}
          {/* <Flex alignItems="center" marginRight={8} gap={3}>
            {renderLosePoints()}
            <Text fontSize="lg" fontWeight="bold" textColor="gray.300">
              /
            </Text>
            {renderGainPoints()}
          </Flex> */}

          {/* Mark Uncompleted Button */}
          <Button
            backgroundColor="primaryOrange.100"
            textColor="primaryOrange.500"
            _hover={{
              backgroundColor: "primaryOrange.300",
            }}
            borderRadius={0}
            height="auto"
            width="150px"
            onMouseEnter={() => onHoverUncomplete()}
            onMouseLeave={() => onUnHoverUncomplete()}
          >
            {uncompleteButtonElement}
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
            width="150px"
            onMouseEnter={() => onHoverComplete()}
            onMouseLeave={() => onUnHoverComplete()}
          >
            {completeButtonElement}
          </Button>
        </>
      ) : (
        // Show how many points the user got for this habit.
        <Flex alignItems="center" p={6}>
          {renderPointNet()}
        </Flex>
      )}
    </Card>
  );
}
