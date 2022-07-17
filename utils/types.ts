import { Habit, HabitDay } from "@prisma/client";

export type TodayHabit = Habit & {
  today?: HabitDay;
  dueIn: number;
  streak: number;
};
