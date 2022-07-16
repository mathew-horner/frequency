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

  function renderDueDateCompact() {
    switch (habit.dueIn) {
      case 0: return "(today)";
      case 1: return "(tomorrow)";
      default: return `(${habit.dueIn} days)`;
    }
  }

  function renderDueDateStandard() {
    switch (habit.dueIn) {
      case 0: return "due today";
      case 1: return "due tomorrow";
      default: return `due in ${habit.dueIn} days`;
    }
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
          fontSize="lg"
          fontWeight="bold"
          flexGrow={1}
          p={4}
        >
          <Flex gap={2} alignItems="center">
            {habit.title}
            <Text fontSize="xs" textColor="gray.500">
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
        >
          <Box>
            {habit.title}
            <Text fontSize="xs" textColor="gray.500">
              {renderDueDateStandard()}
            </Text>
          </Box>
        </Text>
        
        {/* Controls */}
        {isPending ? (
          <>
            {/* Mark Incomplete Button */}
            <Button h={16} w={16} p={0}>
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
            >
              <IoCheckmarkCircleOutline size={32} />
            </Button>
          </>
        ) : (
          <Flex alignItems="center" p={6}>
            {renderCompletionIcon()}
          </Flex>
        )}
      </Card>
    );
  }

  return compact ? renderCompact() : renderStandard();
}
