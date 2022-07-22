import { Habit, HabitStatus } from "@prisma/client";
import { inferProcedureOutput } from "@trpc/server";

import { AppRouter } from "../pages/api/trpc/[trpc]";

export type DbHabitListResult = Habit & {
  todayStatus: HabitStatus;
  lastCompleteDate: Date | null;
};

export type TrpcHabitList = inferProcedureOutput<
  AppRouter["_def"]["queries"]["habit.list"]
>;

export type TrpcHabitListItem = TrpcHabitList[number];
