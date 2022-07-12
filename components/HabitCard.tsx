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
  compact?: boolean;
  onSetComplete: () => void;
  onSetIncomplete: () => void;
}

export default function HabitCard({
  habit,
  compact,
  onSetComplete,
  onSetIncomplete,
}: Props) {
  const habitStatus = habit.today?.status || HabitStatus.Pending;
  const isPending = habitStatus === HabitStatus.Pending;

  function renderCompletionIcon() {
    if (habitStatus === HabitStatus.Complete) {
      return <IoCheckmarkCircleOutline size={30} />;
    }
    if (habitStatus === HabitStatus.Incomplete) {
      return <IoCloseCircleOutline size={30} />;
    }
    return null;
  }

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
              (today)
            </Text>
          </Flex>
        </Text>
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
          <Flex alignItems="center" p={6}>
            {renderCompletionIcon()}
          </Flex>
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
              due today
            </Text>
          </Box>
        </Text>
        {/* TODO: Streaks */}
        {/* <Flex alignItems="center" marginRight={4} textColor="gray.500">
        <IoFlameSharp size={24} />
        <Text>6</Text>
      </Flex> */}
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
