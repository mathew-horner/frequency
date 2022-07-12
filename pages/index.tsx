import { Box, Flex } from "@chakra-ui/react";
import { HabitStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useContext, useMemo, useReducer } from "react";
import NiceModal from "@ebay/nice-modal-react";

import { AddHabit } from "../components/AddHabit";
import CreateHabitModal from "../components/CreateHabitModal";
import HabitCard from "../components/HabitCard";
import { TodayHabit } from "../utils/types";
import { trpc } from "../utils/trpc";
import IntroCard from "../components/IntroCard";
import { SettingsContext } from "./_app";

const Home: NextPage = () => {
  const { settings } = useContext(SettingsContext);
  const habitList = trpc.useQuery(["habit.list"]);

  // It's a desirable UX for the "pending" habits to float to the top.
  const orderedHabits = useMemo(() => {
    const pending: TodayHabit[] = [];
    const nonPending: TodayHabit[] = [];

    // NOTE: Idk why I have to do `|| []` here, but I'm getting an undefined error on first render...
    (habitList.data || []).forEach((habit) => {
      if (habit.today?.status !== HabitStatus.Pending) {
        nonPending.push(habit);
      } else {
        pending.push(habit);
      }
    });

    return pending.concat(nonPending);
  }, [habitList.data]);

  if (habitList.isLoading) return null;

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
