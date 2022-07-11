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
        <HabitCard
          habit={{
            id: 1,
            userId: "1",
            title: "Work on Side Project",
            icon: null,
          }}
          todayRequired={true}
        />
        {orderedHabits.map((habit) => (
          <HabitCard key={habit.title} habit={habit} todayRequired={false} />
        ))}
        <HabitCard
          habit={{
            id: 2,
            userId: "1",
            title: "Run",
            icon: null,
            today: {
              id: 1,
              habitId: 2,
              status: HabitStatus.Complete,
              date: new Date(),
            },
          }}
          todayRequired={true}
        />
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
