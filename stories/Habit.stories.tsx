import { Flex } from "@chakra-ui/react";
import { ComponentMeta } from "@storybook/react";
import { CgGym } from "react-icons/cg";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";

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
    <Habit title="Workout" gain={10} lose={40} icon={CgGym} />
    <Habit
      title="Work on Side Project"
      gain={20}
      lose={200}
      icon={RiComputerLine}
    />
    <Habit
      title="Meditate"
      gain={30}
      lose={50}
      status={HabitStatus.Completed}
      icon={GiMeditation}
    />
    <Habit
      title="Chores"
      gain={25}
      lose={80}
      icon={MdOutlineLocalLaundryService}
    />
  </Flex>
);
