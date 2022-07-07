import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { MdTaskAlt } from "react-icons/md";
import Card from "./Card";

export enum HabitStatus {
  /** The habit has not been marked by the user yet. */
  Pending,
  /** The user did not complete this habit today. */
  Uncompleted,
  /** The user completed this habit today. */
  Completed,
}

interface Props {
  title: string;
  lose: number;
  gain: number;
  status?: HabitStatus;
  icon?: IconType;
}

export default function Habit({ title, lose, gain, status, icon }: Props) {
  const habitStatus = status || HabitStatus.Pending;
  const isPending = habitStatus === HabitStatus.Pending;

  const habitIcon = icon || MdTaskAlt;
  const iconElement = React.createElement(habitIcon, {
    size: 32,
    color: "#3a9efd",
  });

  function renderPointNet() {
    if (habitStatus === HabitStatus.Completed) {
      return renderGainPoints();
    }
    if (habitStatus === HabitStatus.Uncompleted) {
      return renderLosePoints();
    }
    return null;
  }

  function renderLosePoints() {
    return (
      <Text fontSize="lg" fontWeight="bold" textColor="#f7a400">
        -{lose}
      </Text>
    );
  }

  function renderGainPoints() {
    return (
      <Text fontSize="lg" fontWeight="bold" textColor="#3a9efd">
        +{gain}
      </Text>
    );
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
        {iconElement}
        {title}
      </Text>
      {isPending ? (
        <>
          {/* Point Totals */}
          <Flex alignItems="center" marginRight={8} gap={3}>
            {renderLosePoints()}
            <Text fontSize="lg" fontWeight="bold" textColor="gray.300">
              /
            </Text>
            {renderGainPoints()}
          </Flex>

          {/* Mark Uncompleted Button */}
          <Button
            backgroundColor="#ffebcc"
            // border="2px"
            // borderRight="1px"
            // borderColor="#f7a400"
            textColor="#f7a400"
            borderRadius={0}
            height="auto"
            width="150px"
          >
            <AiOutlineCloseCircle size={30} />
          </Button>

          {/* Mark Completed Button */}
          <Button
            backgroundColor="#e6f3fe"
            // border="2px"
            // borderLeft="1px"
            // borderColor="#3a9efd"
            textColor="#3a9efd"
            borderRadius={0}
            borderRightRadius="xl"
            height="auto"
            width="150px"
          >
            <AiOutlineCheckCircle size={30} />
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
