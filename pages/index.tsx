import { Box, Flex } from "@chakra-ui/react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useMemo } from "react";
import { CgGym } from "react-icons/cg";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import { AddHabit } from "../components/AddHabit";
import Habit, { HabitStatus } from "../components/Habit";

interface Habit {
  title: string;
  gain: number;
  lose: number;
  status: HabitStatus;
}

interface Props {
  habits: Habit[];
}

const Home: NextPage<Props> = ({ habits }) => {
  // It's a desirable UX for the "pending" habits to float to the top.
  const orderedHabits = useMemo(() => {
    const pending: Habit[] = [];
    const nonPending: Habit[] = [];

    habits.forEach((habit) => {
      if (habit.status === HabitStatus.Pending) {
        pending.push(habit);
      } else {
        nonPending.push(habit);
      }
    });

    return pending.concat(nonPending);
  }, [habits]);

  return (
    <Box as="main" p={6}>
      <Flex flexDirection="column" gap={4}>
        {/* {orderedHabits.map((habit) => (
          <Habit key={habit.title} {...habit} />
        ))} */}
        <Habit title="Workout" gain={10} lose={40} icon={CgGym} />
        <Habit
          title="Work on Side Project"
          gain={20}
          lose={200}
          icon={RiComputerLine}
        />
        <Habit
          title="Chores"
          gain={25}
          lose={80}
          icon={MdOutlineLocalLaundryService}
        />
        <Habit title="Workout" gain={10} lose={40} icon={CgGym} />
        <Habit
          title="Work on Side Project"
          gain={20}
          lose={200}
          icon={RiComputerLine}
        />
        <Habit
          title="Chores"
          gain={25}
          lose={80}
          icon={MdOutlineLocalLaundryService}
        />
        <Habit
          title="Meditate"
          gain={30}
          lose={50}
          status={HabitStatus.Completed}
          icon={GiMeditation}
        />
        <Habit
          title="Meditate"
          gain={30}
          lose={50}
          status={HabitStatus.Completed}
          icon={GiMeditation}
        />
        <AddHabit onClick={() => {}} />
      </Flex>
    </Box>
  );
};

export async function getServerSideProps(_context: GetServerSidePropsContext) {
  return {
    props: {
      habits: [
        {
          title: "Workout",
          gain: 40,
          lose: 10,
          status: HabitStatus.Pending,
        },
        {
          title: "Work on Side Project",
          gain: 30,
          lose: 15,
          status: HabitStatus.Completed,
        },
        {
          title: "Meditate",
          gain: 10,
          lose: 7,
          status: HabitStatus.Uncompleted,
        },
        {
          title: "Do Chores",
          gain: 20,
          lose: 10,
          status: HabitStatus.Pending,
        },
      ],
    },
  };
}

export default Home;
