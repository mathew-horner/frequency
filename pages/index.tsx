import { Box, Flex } from "@chakra-ui/react";
import { HabitStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useContext, useMemo } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { IoAddCircleOutline } from "react-icons/io5";

import Button from "../components/Button";
import CreateHabitModal from "../components/modals/CreateHabitModal";
import HabitCard from "../components/HabitCard";
import UnauthenticatedCard from "../components/display/UnauthenticatedCard";
import { trpc } from "../utils/trpc";
import IntroCard from "../components/display/IntroCard";
import SettingsContext from "../contexts/SettingsContext";
import { Day } from "../utils/date";
import { TrpcHabitList, TrpcHabitListItem } from "../utils/types";

// TODO: Should probably make it so that habits that have a `createdOn` > today don't show up.

/** Order the habit list for display. */
function orderHabits(habits: TrpcHabitList) {
  const pending: TrpcHabitList = [];
  const nonPending: TrpcHabitList = [];

  habits.forEach((habit) => {
    if (habit.todayStatus !== HabitStatus.Pending) {
      nonPending.push(habit);
    } else {
      pending.push(habit);
    }
  });

  // Sort by due date, then alphabetically by title.
  pending.sort((a, b) => {
    // TODO: There has to be a better way to sort like this.
    if (a.dueIn === b.dueIn) {
      return a.title > b.title ? 1 : -1;
    }
    return a.dueIn > b.dueIn ? 1 : -1;
  });

  // Just sort alphabetically by title.
  nonPending.sort((a, b) => (a.title > b.title ? 1 : -1));

  return pending.concat(nonPending);
}

const Home: NextPage = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { status } = useSession();
  const today = Day.today();

  const isAuthenticated = status === "authenticated";

  // tRPC hooks.

  const habitList = trpc.useQuery(
    ["habit.list", { date: today }],
    { enabled: isAuthenticated }
  );

  const habitSetStatus = trpc.useMutation("habit.setStatus");

  // Other hooks. Effects, memos, etc.

  const orderedHabits = useMemo(
    () => (habitList.data ? orderHabits(habitList.data) : []),
    [habitList.data]
  );

  // TODO: Get this working again...
  // const filteredHabits = useMemo(() => {
  //   const { hiddenHabitDueInThreshold } = settings;

  //   if (hiddenHabitDueInThreshold === undefined) {
  //     return orderedHabits;
  //   } else {
  //     return orderedHabits.filter(
  //       (habit) => habit.dueIn <= hiddenHabitDueInThreshold
  //     );
  //   }
  // }, [orderedHabits]);

  // If the auth status of the user hasn't been determined, bail so we don't cause CLS.
  if (status === "loading") return null;

  // If the user's habit list hasn't loaded yet, we might mistakenly render content that should only
  // show when the user's habit list is actually empty. This will cause an undesirable CLS effect.
  if (isAuthenticated && habitList.isLoading) return null;

  /**
   * Just a helper function to render this component. Makes it easy for us to bail out early
   * and just render the UnauthenticatedCard if the user is unauthenticated.
   */
  function render(node: React.ReactNode) {
    return (
      <Box as="main" p={6} px={{ base: 2, sm: 6 }}>
        <Flex flexDirection="column" gap={4}>
          {node}
        </Flex>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return render(<UnauthenticatedCard />);
  }

  // Callback functions for updating the status of a habit.

  async function onSetComplete(habit: TrpcHabitListItem) {
    return habitSetStatus
      .mutateAsync({
        habitId: habit.id,
        date: today,
        status: HabitStatus.Complete,
      })
      .then(() => habitList.refetch())
      .then(() => Promise.resolve());
  }

  async function onSetIncomplete(habit: TrpcHabitListItem) {
    return habitSetStatus
      .mutateAsync({
        habitId: habit.id,
        date: today,
        status: HabitStatus.Incomplete,
      })
      .then(() => habitList.refetch())
      .then(() => Promise.resolve());
  }

  async function onSetPending(habit: TrpcHabitListItem) {
    return habitSetStatus
      .mutateAsync({
        habitId: habit.id,
        date: today,
        status: HabitStatus.Pending,
      })
      .then(() => habitList.refetch())
      .then(() => Promise.resolve());
  }

  function hideIntroCard() {
    setSettings({
      ...settings,
      hideIntroCard: true,
    });
  }

  function tryRenderIntroCard() {
    return !settings.hideIntroCard ? (
      <IntroCard onClickYes={() => {}} onClickNo={hideIntroCard} />
    ) : null;
  }

  return render(
    <>
      {orderedHabits.length === 0 ? (
        <>{tryRenderIntroCard()}</>
      ) : (
        <>
          {orderedHabits.map((habit: any) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              compact={settings.viewMode === "Compact"}
              onSetComplete={() => onSetComplete(habit)}
              onSetIncomplete={() => onSetIncomplete(habit)}
              onSetPending={() => onSetPending(habit)}
            />
          ))}
        </>
      )}

      {/* Add Habit Button */}
      <Button
        type_="gray"
        h={12}
        onClick={() => {
          NiceModal.show(CreateHabitModal).then(() => habitList.refetch());
        }}
      >
        <IoAddCircleOutline size={32} />
      </Button>
    </>
  );
};

export default Home;
