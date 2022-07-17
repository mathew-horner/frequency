import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

import Card from "./Card";
import { TodayHabit } from "../utils/types";
import { HabitStatus } from "@prisma/client";

interface Props {
  habit: TodayHabit;

  /** Render the card in "compact" mode. */
  compact?: boolean;

  // Callbacks for setting the status of the habit for today.
  onSetComplete: () => void;
  onSetIncomplete: () => void;
  onSetPending: () => void;
}

enum WhenIsDueDisplay {
  Today,
  Tomorrow,
  MultipleDays,
}

export default function HabitCard({
  habit,
  compact,
  onSetComplete,
  onSetIncomplete,
  onSetPending,
}: Props) {
  const habitStatus = habit.today?.status || HabitStatus.Pending;
  const isPending = habitStatus === HabitStatus.Pending;

  /** Render an icon which represents the completion status of the habit for today */
  function renderCompletionIcon() {
    if (habitStatus === HabitStatus.Complete) {
      return <IoCheckmarkCircleOutline size={32} />;
    }
    if (habitStatus === HabitStatus.Incomplete) {
      return <IoCloseCircleOutline size={32} />;
    }
    return null;
  }

  // Functions for rendering the text indicator for the habit's due date.
  
  function whenIsDueDisplay(): WhenIsDueDisplay {
    if (habit.dueIn <= 0) return WhenIsDueDisplay.Today;
    if (habit.dueIn == 1) return WhenIsDueDisplay.Tomorrow;
    return WhenIsDueDisplay.MultipleDays;
  }

  function renderDueDateCompact() {
    if (!isPending) return null;
    
    switch (whenIsDueDisplay()) {
      case WhenIsDueDisplay.Today:
        return "(today)";
      case WhenIsDueDisplay.Tomorrow:
        return "(tomorrow)";
    }

    return `(${habit.dueIn} days)`;
  }

  function renderDueDateStandard() {
    if (!isPending) return null;

    switch (whenIsDueDisplay()) {
      case WhenIsDueDisplay.Today:
        return "due today";
      case WhenIsDueDisplay.Tomorrow:
        return "due tomorrow";
    }

    return `due in ${habit.dueIn} days`;
  }

  function getDueDateTextColor() {
    return habit.dueIn > 0 ? "gray.500" : "red.500";
  }

  // Render functions for the different rendering modes (compact & standard).

  function renderCompact() {
    return (
      <Card
        display="flex"
        alignItems="center"
        h={12}
        opacity={!isPending ? "0.5" : "1"}
        position="relative"
        overflow="hidden"
        p={0}
      >
        {/* Habit Title */}
        <Text
          as="h1"
          display="flex"
          alignItems="center"
          fontWeight="bold"
          flexGrow={1}
          p={4}
          w="calc(100% - 128px)"
          overflow="hidden"
        >
          <Flex
            gap={{ base: 0, sm: 2 }}
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            {/* TODO: For some reason the ellipsis is not working here... Oh well, at least we get the overflow to hide. */}
            <Text
              fontSize={{ base: "sm", sm: "lg" }}
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {habit.title}
            </Text>
            <Text fontSize="xs" textColor={getDueDateTextColor()}>
              {renderDueDateCompact()}
            </Text>
          </Flex>
        </Text>

        {/* Controls */}
        {isPending ? (
          <>
            {/* Mark Incomplete Button */}
            <Button h={16} w={16} p={0} onClick={() => onSetIncomplete()}>
              <IoCloseCircleOutline size={32} />
            </Button>

            {/* Mark Completed Button */}
            <Button
              backgroundColor="black"
              textColor="white"
              _hover={{
                backgroundColor: "gray.700",
              }}
              h={16}
              w={16}
              p={0}
              onClick={() => onSetComplete()}
            >
              <IoCheckmarkCircleOutline size={32} />
            </Button>
          </>
        ) : (
          <Button
            p={0}
            h={16}
            w={16}
            backgroundColor="transparent"
            onClick={() => onSetPending()}
          >
            {renderCompletionIcon()}
          </Button>
        )}
      </Card>
    );
  }

  function renderStandard() {
    return (
      <Card
        display="flex"
        alignItems="center"
        p={4}
        gap={4}
        h={24}
        opacity={!isPending ? "0.5" : "1"}
        position="relative"
        overflow="hidden"
      >
        {/* Habit Title */}
        <Text
          as="h1"
          display="flex"
          alignItems="center"
          fontSize="2xl"
          fontWeight="bold"
          flexGrow={1}
          gap={0.5}
          w="calc(100% - 128px - 32px)"
          overflow="hidden"
        >
          <Box>
            {/* TODO: For some reason the ellipsis is not working here... Oh well, at least we get the overflow to hide. */}
            <Text
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {habit.title}
            </Text>
            <Text fontSize="xs" textColor={getDueDateTextColor()}>
              {renderDueDateStandard()}
            </Text>
          </Box>
        </Text>

        {/* Controls */}
        {isPending ? (
          <>
            {/* Mark Incomplete Button */}
            <Button h={16} w={16} p={0} onClick={() => onSetIncomplete()}>
              <IoCloseCircleOutline size={32} />
            </Button>

            {/* Mark Completed Button */}
            <Button
              backgroundColor="black"
              textColor="white"
              _hover={{
                backgroundColor: "gray.700",
              }}
              h={16}
              w={16}
              p={0}
              onClick={() => onSetComplete()}
            >
              <IoCheckmarkCircleOutline size={32} />
            </Button>
          </>
        ) : (
          <Button
            p={0}
            h={16}
            w={16}
            backgroundColor="transparent"
            onClick={() => onSetPending()}
          >
            {renderCompletionIcon()}
          </Button>
        )}
      </Card>
    );
  }

  return compact ? renderCompact() : renderStandard();
}
