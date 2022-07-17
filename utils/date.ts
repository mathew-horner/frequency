import { Habit } from "@prisma/client";

const MILLIS_IN_DAY = (1000 * 60 * 60 * 24);

export function getTodayTimestamp(): number {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.getTime();
}

interface CalculateDueInParams {
  habit: Habit;
  today: Date;
  
  /** The last date that the habit was marked as Complete. */
  lastCompleteDate?: Date;
}

/**
 * Calculates how many days until a habit is (or, since it was) due.
 *
 * This is based upon the last date that the habit was marked completed, if available.
 * If the habit is new (has had no completions yet), we base the due date off the creation
 * date of the habit itself.
 */
export function calculateDueIn({
  habit,
  today,
  lastCompleteDate,
}: CalculateDueInParams): number {
  lastCompleteDate =
    lastCompleteDate ||
    (() => {
      const { createdOn } = habit;
      createdOn.setDate(createdOn.getDate() - 1);
      return createdOn;
    })();

  const dueDate = new Date();
  dueDate.setDate(lastCompleteDate.getDate() + habit.frequency);

  const dueIn = Math.floor(
    (dueDate.getTime() - today.getTime()) / MILLIS_IN_DAY
  );

  return dueIn;
}
