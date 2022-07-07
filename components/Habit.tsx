import { Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
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
}

export default function Habit({ title, lose, gain, status }: Props) {
  const habitStatus = status || HabitStatus.Pending;
  const isPending = habitStatus === HabitStatus.Pending;

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
      <Text fontSize="lg" fontWeight="bold" textColor="#ff7917">
        -{lose}
      </Text>
    );
  }

  function renderGainPoints() {
    return (
      <Text fontSize="lg" fontWeight="bold" textColor="#61459c">
        +{gain}
      </Text>
    );
  }

  return (
    <Card
      display="flex"
      alignItems="stretch"
      p={0}
      overflow="hidden"
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
      >
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
            backgroundColor="#ff7917"
            textColor="white"
            borderRadius={0}
            height="auto"
            width="150px"
          >
            <AiOutlineCloseCircle size={30} />
          </Button>

          {/* Mark Completed Button */}
          <Button
            backgroundColor="#61459c"
            textColor="white"
            borderRadius={0}
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
