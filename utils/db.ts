import { PrismaClient, Habit, HabitStatus } from "@prisma/client";
import { MILLIS_IN_DAY } from "./date";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

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

