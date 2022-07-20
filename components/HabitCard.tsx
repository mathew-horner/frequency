import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoFlame,
} from "react-icons/io5";
import { TailSpin } from "react-loader-spinner";

import Button from "./Button";
import Card from "./Card";
import { TodayHabit } from "../utils/types";
import { HabitStatus } from "@prisma/client";

const STREAK_THRESHOLD = 3;

interface Props {
  habit: TodayHabit;

  /** Render the card in "compact" mode. */
  compact?: boolean;

  // Callbacks for setting the status of the habit for today.
  onSetComplete: () => Promise<void>;
  onSetIncomplete: () => Promise<void>;
  onSetPending: () => Promise<void>;
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
  const [saving, setSaving] = useState(false);

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

  /**
   * Call the given callback function (onSetComplete and co.) and handle the saving
   * state of the card. */
  function saveWith(callback: () => Promise<void>) {
    setSaving(true);
    setTimeout(() => callback().then(() => setSaving(false)), 200);
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
    return habit.dueIn > 0 ? "gray.500" : "red.300";
  }

  // Misc. rendering functions.

  function renderStreak() {
    if (habit.streak < STREAK_THRESHOLD) return null;
    return (
      <Flex textColor="black" opacity={0.35} pr={4}>
        <IoFlame size={24} />
        <Text>{habit.streak}</Text>
      </Flex>
    );
  }

  function renderSpinner() {
    return (
      <Box pr={4}>
        <TailSpin color="#000" height={28} width={28} />
      </Box>
    );
  }

  function renderControlsCompact() {
    return (
      <>
        {isPending ? (
          <>
            {/* Streak */}
            <Box>{renderStreak()}</Box>

            {/* Mark Incomplete Button */}
            <Button
              type_="gray"
              h={16}
              w={16}
              minW={16}
              p={0}
              onClick={() => saveWith(onSetIncomplete)}
            >
              <IoCloseCircleOutline size={32} />
            </Button>

            {/* Mark Completed Button */}
            <Button
              type_="black"
              h={16}
              minW={16}
              w={16}
              p={0}
              onClick={() => saveWith(onSetComplete)}
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
            onClick={() => saveWith(onSetPending)}
          >
            {renderCompletionIcon()}
          </Button>
        )}
      </>
    );
  }

  function renderControlsStandard() {
    return (
      <>
        {isPending ? (
          <>
            {/* Streak */}
            <Box>{renderStreak()}</Box>

            {/* Mark Incomplete Button */}
            <Button
              type_="gray"
              h={16}
              w={16}
              minW={16}
              p={0}
              onClick={() => saveWith(onSetIncomplete)}
            >
              <IoCloseCircleOutline size={32} />
            </Button>

            {/* Mark Completed Button */}
            <Button
              type_="black"
              h={16}
              minW={16}
              w={16}
              p={0}
              onClick={() => saveWith(onSetComplete)}
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
            onClick={() => saveWith(onSetPending)}
          >
            {renderCompletionIcon()}
          </Button>
        )}
      </>
    );
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
        {!saving ? renderControlsCompact() : renderSpinner()}
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
            <Text whiteSpace="nowrap" textOverflow="ellipsis">
              {habit.title}
            </Text>
            <Text fontSize="xs" textColor={getDueDateTextColor()}>
              {renderDueDateStandard()}
            </Text>
          </Box>
        </Text>

        {/* Controls */}
        {!saving ? renderControlsStandard() : renderSpinner()}
      </Card>
    );
  }

  return compact ? renderCompact() : renderStandard();
}
