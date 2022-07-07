import { Flex } from "@chakra-ui/react";
import { ComponentMeta } from "@storybook/react";

import Habit, { HabitStatus } from "../components/Habit";

export default {
  component: Habit,
} as ComponentMeta<typeof Habit>;

export const Pending = () => <Habit title="Workout" gain={100} lose={400} />;

export const Uncompleted = () => (
  <Habit
    title="Workout"
    gain={100}
    lose={400}
    status={HabitStatus.Uncompleted}
  />
);

export const Completed = () => (
  <Habit title="Workout" gain={100} lose={400} status={HabitStatus.Completed} />
);

export const Group = () => (
  <Flex flexDirection="column" gap={4}>
    <Habit title="Workout" gain={100} lose={400} />
    <Habit title="Workout" gain={100} lose={400} />
    <Habit
      title="Workout"
      gain={100}
      lose={400}
      status={HabitStatus.Completed}
    />
    <Habit title="Workout" gain={100} lose={400} />
    <Habit
      title="Workout"
      gain={100}
      lose={400}
      status={HabitStatus.Uncompleted}
    />
  </Flex>
);
