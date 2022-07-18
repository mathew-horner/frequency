import { Habit, HabitStatus } from "@prisma/client";
import { MILLIS_IN_DAY } from "./date";
import prisma from "./prisma";

/**
 * Queries the database to get how many completions have been made on time
 * in a row for the given habit.
 */
export async function getHabitStreak(
  habit: Habit,
  today: Date
): Promise<number> {
  const { frequency } = habit;
  let completions = await prisma.habitDay.findMany({
    where: { habitId: habit.id, status: HabitStatus.Complete },
    orderBy: { date: "desc" },
  });

  const maxDaysBetween = frequency * MILLIS_IN_DAY;

  let streak = 0;
  let tempDate = today;

  for (const completion of completions) {
    if (tempDate.getTime() - completion.date.getTime() > maxDaysBetween) {
      break;
    }
    tempDate = new Date(completion.date);
    streak += 1;
  }

  return streak;
}

