import { Box, Flex } from "@chakra-ui/react";
import { HabitStatus } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useMemo } from "react";
import NiceModal from "@ebay/nice-modal-react";

import { AddHabit } from "../components/AddHabit";
import CreateHabitModal from "../components/CreateHabitModal";
import HabitCard from "../components/HabitCard";
import { prisma } from "../utils/db";
import { TodayHabit } from "../utils/types";

interface Props {
  habits: TodayHabit[];
}

const Home: NextPage<Props> = ({ habits }) => {
  // It's a desirable UX for the "pending" habits to float to the top.
  const orderedHabits = useMemo(() => {
    const pending: TodayHabit[] = [];
    const nonPending: TodayHabit[] = [];

    // NOTE: Idk why I have to do `|| []` here, but I'm getting an undefined error on first render...
    (habits || []).forEach((habit) => {
      if (habit.today?.status !== HabitStatus.Pending) {
        nonPending.push(habit);
      } else {
        pending.push(habit);
      }
    });

    return pending.concat(nonPending);
  }, [habits]);

  return (
    <Box as="main" p={6}>
      <Flex flexDirection="column" gap={4}>
        {orderedHabits.map((habit) => (
          <HabitCard key={habit.title} habit={habit} lose={10} gain={40} />
        ))}
        <AddHabit onClick={() => NiceModal.show(CreateHabitModal)} />
      </Flex>
    </Box>
  );
};

export async function getServerSideProps(_context: GetServerSidePropsContext) {
  const habits = await prisma.habit.findMany({ where: { userId: "1" } });
  return {
    props: {
      habits,
    },
  };
}

export default Home;
