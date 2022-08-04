import { Box, Flex } from "@chakra-ui/react";
import { HabitStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import {
  IoAddCircleOutline,
  IoArrowBackSharp,
  IoArrowForwardSharp,
} from "react-icons/io5";

import Button from "../components/Button";
import CreateHabitModal from "../components/modals/CreateHabitModal";
import EditHabitModal from "../components/modals/EditHabitModal";
import HabitCard from "../components/HabitCard";
import UnauthenticatedCard from "../components/display/UnauthenticatedCard";
import { useGlobalContext } from "../contexts/GlobalContext";
import AppLayout from "../layouts/app";
import { TrpcHabitListItem } from "../utils/types";
import { trpc } from "../utils/trpc";
import JustDate from "../utils/justDate";

/** Order the habit list for display. */
function orderHabits(habits: TrpcHabitListItem[]): TrpcHabitListItem[] {
  const pending: TrpcHabitListItem[] = [];
  const nonPending: TrpcHabitListItem[] = [];

  habits.forEach((habit) => {
    if (habit.todayStatus && habit.todayStatus !== HabitStatus.Pending) {
      nonPending.push(habit);
    } else {
      pending.push(habit);
    }
  });

  // Sort by due date, then alphabetically by title.
  pending.sort((a, b) => {
    // We want to sort habits that are overdue as if they were due today. So we clamp
    // dueIn to 0 when sorting.
    const aDueIn = Math.max(0, a.dueIn);
    const bDueIn = Math.max(0, b.dueIn);

    if (aDueIn === bDueIn) {
      return a.title > b.title ? 1 : -1;
    }
    return aDueIn > bDueIn ? 1 : -1;
  });

  // Just sort alphabetically by title.
  nonPending.sort((a, b) => (a.title > b.title ? 1 : -1));

  return pending.concat(nonPending);
}

const Home: NextPage = () => {
  // Auth state.
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Date state.

  const today = JustDate.today();

  // This should only have a value of either 0, or -1...
  // 0 meaning we are viewing today's habit list.
  // -1 meaning we are viewing yesterday's habit list.
  const [dateOffset, setDateOffset] = useState(0);

  today.addDays(dateOffset);

  // tRPC hooks.

  const habitList = trpc.useQuery(["habit.list", { date: today }], {
    enabled: isAuthenticated,
  });
  
  const habitSetStatus = trpc.useMutation("habit.setStatus");

  // Other hooks. Effects, memos, etc.
  const { settings } = useGlobalContext();

  const orderedHabits = useMemo(
    () => (habitList.data ? orderHabits(habitList.data) : []),
    [habitList.data]
  );
  
  const filteredHabits = useMemo(() => {
    const dueInThreshold = settings.hiddenHabitDueInThreshold;

    if (dueInThreshold == null) {
      return orderedHabits;
    }

    return orderedHabits.filter(
      (habit) => habit.dueIn <= dueInThreshold
    );
  }, [orderedHabits, settings]);

  // If the auth status of the user hasn't been determined, bail so we don't cause CLS.
  if (status === "loading") return null;

  // If the user's habit list hasn't loaded yet, we might mistakenly render content that should only
  // show when the user's habit list is actually empty. This will cause an undesirable CLS effect.
  if (isAuthenticated && habitList.isLoading) return null;

  /**
   * Helper function to render this component. Makes it easy for us to bail out early
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

  /**
   * Helper function for rendering the Habit List (just tacks the Add Habit Button on to
   * the end of the provided content).
   */
  function renderHabitList(node: React.ReactNode) {
    return render(
      <>
        {/* Controls */}
        <Flex justifyContent="space-between">{renderDateControl()}</Flex>

        {node}

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
  }

  function renderDateControl() {
    if (dateOffset !== 0 && dateOffset !== -1) {
      // TODO: Add email link.
      throw new Error(
        "Date offset was not equal to 0 or -1, please email me a bug report."
      );
    }

    // TODO: Don't use any here, use actual types.
    const buttonProps: any = {
      type_: "transparent",
      display: "flex",
      alignItems: "center",
      gap: 1,
    };

    const iconStyle: any = {
      position: "relative",
      top: "1px",
    };

    return dateOffset === 0 ? (
      <Button {...buttonProps} onClick={() => setDateOffset(-1)}>
        <IoArrowBackSharp style={iconStyle} />
        Yesterday
      </Button>
    ) : (
      <Button {...buttonProps} onClick={() => setDateOffset(0)}>
        Today
        <IoArrowForwardSharp style={iconStyle} />
      </Button>
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

  if (filteredHabits.length === 0) {
    return renderHabitList(null);

    // TODO: We should render this when we have an onboarding process.
    // return renderHabitList(tryRenderIntroCard());
  }
  
  return renderHabitList(
    <>
      {filteredHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          compact={settings.viewMode === "Compact"}
          onSetComplete={() => onSetComplete(habit)}
          onSetIncomplete={() => onSetIncomplete(habit)}
          onSetPending={() => onSetPending(habit)}
          onClick={() =>
            NiceModal.show(EditHabitModal, {
              habit,
            }).then(() => habitList.refetch())
          }
        />
      ))}
    </>
  );
};

(Home as any).getLayout = function getLayout(page: React.ReactNode) {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;
