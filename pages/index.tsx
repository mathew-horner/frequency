import { Box, Flex } from "@chakra-ui/react";
import { HabitStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useContext, useMemo } from "react";
import NiceModal from "@ebay/nice-modal-react";

import { AddHabit } from "../components/AddHabit";
import CreateHabitModal from "../components/CreateHabitModal";
import HabitCard from "../components/HabitCard";
import { TodayHabit } from "../utils/types";
import { trpc } from "../utils/trpc";
import IntroCard from "../components/IntroCard";
import SettingsContext from "../contexts/SettingsContext";
import { getTodayTimestamp } from "../utils/date";

const Home: NextPage = () => {
  const { settings } = useContext(SettingsContext);
  const todayTimestamp = getTodayTimestamp();

  const habitList = trpc.useQuery([
    "habit.list",
    { dateTimestamp: todayTimestamp },
  ]);

  const habitSetStatus = trpc.useMutation("habit.setStatus");

  // It's a desirable UX for the "pending" habits to float to the top.
  const orderedHabits = useMemo(() => {
    const pending: TodayHabit[] = [];
    const nonPending: TodayHabit[] = [];

    // NOTE: Idk why I have to do `|| []` here, but I'm getting an undefined error on first render...
    (habitList.data || []).forEach((habit) => {
      if (habit.today?.status && habit.today.status !== HabitStatus.Pending) {
        nonPending.push(habit);
      } else {
        pending.push(habit);
      }
    });

    return pending.concat(nonPending);
  }, [habitList.data]);

  if (habitList.isLoading) return null;

  // Callback functions for updating the status of a habit.

  function onSetComplete(habit: TodayHabit) {
    habitSetStatus
      .mutateAsync({
        habitId: habit.id,
        dateTimestamp: todayTimestamp,
        status: HabitStatus.Complete,
      })
      .then(() => habitList.refetch());
  }

  function onSetIncomplete(habit: TodayHabit) {
    habitSetStatus
      .mutateAsync({
        habitId: habit.id,
        dateTimestamp: todayTimestamp,
        status: HabitStatus.Incomplete,
      })
      .then(() => habitList.refetch());
  }

  function onSetPending(habit: TodayHabit) {
    habitSetStatus
      .mutateAsync({
        habitId: habit.id,
        dateTimestamp: todayTimestamp,
        status: HabitStatus.Pending,
      })
      .then(() => habitList.refetch());
  }

  return (
    <Box as="main" p={6}>
      <Flex flexDirection="column" gap={4}>
        {orderedHabits.length === 0 ? (
          <IntroCard />
        ) : (
          <>
            {orderedHabits.map((habit) => (
              <HabitCard
                key={habit.title}
                habit={habit}
                compact={settings.viewMode === "Compact"}
                onSetComplete={() => onSetComplete(habit)}
                onSetIncomplete={() => onSetIncomplete(habit)}
                onSetPending={() => onSetPending(habit)}
              />
            ))}
          </>
        )}
        <AddHabit
          onClick={() =>
            NiceModal.show(CreateHabitModal).then(() => habitList.refetch())
          }
        />
      </Flex>
    </Box>
  );
};

export default Home;
